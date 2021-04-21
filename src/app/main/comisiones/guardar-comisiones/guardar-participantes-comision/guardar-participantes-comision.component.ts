import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ComisionesModel } from 'models/comisiones.models';
import { UsuariosService } from 'services/usuarios.service';
import { PuestosService } from 'services/puestos.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { ComisionesComponent } from '../../comisiones.component';
import { LegislaturaService } from 'services/legislaturas.service';
import { DetalleComisionModels } from 'models/detalle-participante-comision';
import { PartidosPoliticosService } from 'services/partidos-politicos.service';
import { GuardarComisionesComponent } from '../guardar-comisiones.component';
import { DiputadosService } from 'services/diputados.service';

@Component({
  selector: 'app-guardar-participantes-comision',
  templateUrl: './guardar-participantes-comision.component.html',
  styleUrls: ['./guardar-participantes-comision.component.scss']
})

export class GuardarParticipantesComisionComponent implements OnInit {
    
    loadingIndicator: boolean;
    reorderable: boolean;

    form: FormGroup;
    arrLegislatura: any = [];
    arrDiputados: any = [];
    selectedLegislatura: any;
    selectedPresidente: any;
    selectedVicePresidente: any;
    selectedVocals: any[] = [];
    selectedPuestos: any;
    resultado: any;
    comision: any = [];

    constructor(
        private formBuilder: FormBuilder,
        private dialogRef: MatDialogRef<GuardarComisionesComponent>,
        private spinner: NgxSpinnerService,
        private legislaturaService: LegislaturaService,
        private partidosService: PartidosPoliticosService,
        private diputadosService: DiputadosService,
        @Inject(MAT_DIALOG_DATA) public participantes: any,
    ) { }

    async ngOnInit(): Promise<void> {
        // Form reactivo

        await this.obtenerLegislatura();
        let i = 0;
        console.log('participantes');
        console.log(this.participantes);
        if (this.participantes.detalle_participantes_comisions) {
            this.resultado = this.participantes.detalle_participantes_comisions[0];
            //Seteamos valor del select presidente
            if(this.resultado.legislatura){
                this.selectedLegislatura = this.resultado.legislatura;
            }
            if (this.resultado.presidente) {
                this.selectedPresidente = this.resultado.presidente[0];
            }
            //Seteamos valor del select vicePresidente
            if (this.resultado.vicepresidente) {
                this.selectedVicePresidente = this.resultado.vicepresidente[0];
            }
        }else{
            this.participantes.presidente = '';
            this.participantes.vicepresidente = '';
            this.participantes.vocals = '';
        }

        if (this.participantes.id === undefined) {
            this.participantes.activo = true;
        }
        await this.obtenerDiputados();

        this.form = this.formBuilder.group({
            legislaturas: [{ value: this.arrLegislatura }, [Validators.required]],
            presidente: [{ value: this.arrDiputados }, [Validators.required]],
            vicepresidente: [{ value: this.arrDiputados }, [Validators.required]],
            vocals: this.formBuilder.array([]),
            vocalsg: this.formBuilder.array([]),
            estatus: this.participantes.activo
        });
        //iniciar con 3 vocals 
        if(!this.participantes.detalle_participantes_comisions){
            this.addVocalsg();
            this.addVocalsg();
            this.addVocalsg();
        }
        //Mostramos los select dinamicos dependiendo del largo del array de vocales
        if(this.resultado.vocals){
            while(i<=this.resultado.vocals.length-1){
                this.addVocals();
                i++
            }
        }
    }
    //vocals actualizar
    get vocals() {
      return this.form.get('vocals') as FormArray;
    }

    //Añadir select vocals adicional actualizar
    addVocals() {
        const vocalsFormGroup = this.formBuilder.group({ id: ['', [Validators.required]]});
        this.vocals.push(vocalsFormGroup);
    }

    //Remover select vocals adicional, removemos por indice. actualizar
    removeVocals(indice: number){
        this.vocals.removeAt(indice);
    }
    //vocals guardado
    get vocalsg() {
        return this.form.get('vocalsg') as FormArray;
      }

    //Añadir select vocals adicional guardado
    addVocalsg() {
        const vocalsgFormGroup = this.formBuilder.group({ id: ['', [Validators.required]]});
        this.vocalsg.push(vocalsgFormGroup);
    }
  
    //Remover select vocals adicional, removemos por indice. guardado
    removeVocalsg(indice: number){
        this.vocalsg.removeAt(indice);
    }

    async obtenerLegislatura(): Promise<void> {
        // Obtenemos empleados
        this.spinner.show();
        await this.legislaturaService.obtenerLegislatura().subscribe((resp: any) => {

            this.arrLegislatura = resp;
            console.log(this.arrLegislatura);
            this.spinner.hide();
        }, err => {
            Swal.fire('Error', 'Ocurrió un error obtener los puestos.' + err, 'error');
            this.spinner.hide();
        });
    }

    async obtenerDiputados(): Promise<void> {
      // Obtenemos empleados
      this.spinner.show();
      await this.diputadosService.obtenerDiputados().subscribe((resp: any) => {
         
          this.arrDiputados = resp;
          this.spinner.hide();
      }, err => {
          Swal.fire('Error', 'Ocurrió un error obtener los diputados.' + err, 'error');
          this.spinner.hide();
      });
  }

  async onSelect(id: any): Promise<void>{
          // Obtenemos empleados
          this.spinner.show();
          await this.diputadosService.obtenerDiputados().subscribe((resp: any) => {
           
              this.arrDiputados = resp;
              this.arrDiputados = this.arrDiputados.filter(meta => meta.legislatura.id == id);
              this.spinner.hide();
          }, err => {
              Swal.fire('Error', 'Ocurrió un error obtener los diputados.' + err, 'error');
              this.spinner.hide();
          });
  }

  guardar(): void {
    let repetido: boolean;
    repetido = false;
    this.comision = [];
        if (this.selectedPresidente)

        this.comision.push({
            cargo: 'Presidente',
            idParticipante: this.selectedPresidente,
            participante: this.arrDiputados.find(meta => meta.id == this.selectedPresidente).nombre,
            partido: this.arrDiputados.find(meta => meta.id == this.selectedPresidente).partidos_politico.cNomenclatura,
            idLegislatura: this.selectedLegislatura,
            legislatura: this.arrLegislatura.find(meta => meta.id == this.selectedLegislatura).cLegislatura
        });

        this.comision.push({
            cargo: 'Vice presidente',
            idParticipante: this.selectedVicePresidente,
            participante: this.arrDiputados.find(meta => meta.id == this.selectedVicePresidente).nombre,
            partido: this.arrDiputados.find(meta => meta.id == this.selectedVicePresidente).partidos_politico.cNomenclatura,
            idLegislatura: this.selectedLegislatura,
            legislatura: this.arrLegislatura.find(meta => meta.id == this.selectedLegislatura).cLegislatura
        });

        this.vocals.controls.forEach(element =>{

        this.comision.push({
                cargo: 'Vocal',
                idParticipante: element.value,
                participante: this.arrDiputados.find(meta => meta.id == element.value.id).nombre,
                partido: this.arrDiputados.find(meta => meta.id == element.value.id).partidos_politico.cNomenclatura,
                idLegislatura: this.selectedLegislatura,
                legislatura: this.arrLegislatura.find(meta => meta.id == this.selectedLegislatura).cLegislatura
            });
        });

        this.vocalsg.controls.forEach(element =>{
            
            this.comision.push({
                cargo: 'Vocal',
                idParticipante: element.value,
                participante: this.arrDiputados.find(meta => meta.id == element.value.id).nombre,
                partido: this.arrDiputados.find(meta => meta.id == element.value.id).partidos_politico.cNomenclatura,
                idLegislatura: this.selectedLegislatura,
                legislatura: this.arrLegislatura.find(meta => meta.id == this.selectedLegislatura).cLegislatura
            });
        });
      
        for (let i = 0; i < this.comision.length; i++) {
            if (this.comision[i + 1]) {
                if (this.comision[i + 1].idParticipante === this.comision[i].idParticipante) {
                    repetido = true;
                    Swal.fire('Error', 'Existen participantes repetidos, esto no es correcto, favor de modificarlos.', 'error');
                }
            }
        }
        if (repetido === false) {
            this.cerrar(this.comision);
        }
    }

    pruebaFormArray(){
        console.log(this.form.value);
    }

    cerrar(ent): void {
        if (ent) {
            this.dialogRef.close(ent);
        } else {
            this.dialogRef.close();
        }
    }
}
