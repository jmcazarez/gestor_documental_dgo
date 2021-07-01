import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
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
    primeraVez = 0;

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
            console.log(this.resultado);
            if (this.resultado) {
                if (this.resultado.legislatura) {
                    this.selectedLegislatura = this.resultado.legislatura;
                }
                if (this.resultado.presidente) {
                    this.selectedPresidente = this.resultado.presidente[0];
                }
                //Seteamos valor del select vicePresidente
                if (this.resultado.vicepresidente) {
                    this.selectedVicePresidente = this.resultado.vicepresidente[0];
                }
            } else {
                this.resultado = {
                    activo: true,
                    presidente: "",
                    vicepresidente: "",
                    vocals: "",
                };

                console.log(this.resultado);
            }
        } else {
            this.participantes.presidente = '';
            this.participantes.vicepresidente = '';
            this.participantes.vocals = '';
        }

        if (this.participantes.id === undefined) {
            this.participantes.activo = true;
        }
        //await this.obtenerDiputados();

        this.form = this.formBuilder.group({
            legislaturas: [{ value: this.arrLegislatura }, [Validators.required]],
            presidente: [{ value: this.arrDiputados }, [Validators.required]],
            vicepresidente: [{ value: this.arrDiputados }, [Validators.required]],
            vocals: this.formBuilder.array([]),
            vocalsg: this.formBuilder.array([]),
            estatus: this.participantes.activo
        });
        //iniciar con 3 vocals 
        console.log(this.participantes.detalle_participantes_comisions);
        if (!this.participantes.detalle_participantes_comisions) {
            console.log('entro');
            this.addVocalsg();
            this.addVocalsg();
            this.addVocalsg();
        }else{
            console.log(this.participantes.detalle_participantes_comisions);
            
            
            if(this.participantes.detalle_participantes_comisions.length === 0){
                console.log('entro');
                this.addVocalsg();
                this.addVocalsg();
                this.addVocalsg(); 
            }
        }
        //Mostramos los select dinamicos dependiendo del largo del array de vocales
        if (this.resultado) {
            if (this.resultado.vocals !== undefined) {
                while (i <= this.resultado.vocals.length - 1) {
                    this.addVocalsIni();
                    i++
                }
            }
        }
    }
    //vocals actualizar
    get vocals() {
        return this.form.get('vocals') as FormArray;
    }

    //Añadir select vocals adicional actualizar
    addVocals() {
        const vocalsFormGroup = this.formBuilder.group({ id: ['', [Validators.required]] });
        this.vocals.push(vocalsFormGroup);
        this.resultado.vocals.push('');
        console.log(this.vocals);
    }

    //Añadir select vocals adicional actualizar
    addVocalsIni() {
        const vocalsFormGroup = this.formBuilder.group({ id: ['', [Validators.required]] });
        this.vocals.push(vocalsFormGroup);
        console.log(this.vocals);
    }

    //Remover select vocals adicional, removemos por indice. actualizar
    removeVocals(i: number) {
        console.log(this.resultado.vocals);
        this.vocals.removeAt(i);
        this.resultado.vocals.splice(i, 1);
    }
    //vocals guardado
    get vocalsg() {
        return this.form.get('vocalsg') as FormArray;
    }

    //Añadir select vocals adicional guardado
    addVocalsg() {
        const vocalsgFormGroup = this.formBuilder.group({ id: ['', [Validators.required]] });
        this.vocalsg.push(vocalsgFormGroup);
        console.log(this.vocalsg,'entro');
    }

    //Remover select vocals adicional, removemos por indice. guardado
    removeVocalsg(i: number) {
        console.log(i);
        this.vocalsg.removeAt(i);
    }

    async obtenerLegislatura(): Promise<void> {
        // Obtenemos empleados
        this.spinner.show();
        await this.legislaturaService.obtenerLegislatura().subscribe((resp: any) => {

            this.arrLegislatura = resp;
            //this.selectedLegislatura = this.arrLegislatura[0].id;
            //console.log(this.arrLegislatura);
            this.spinner.hide();
        }, err => {
            Swal.fire('Error', 'Ocurrió un error obtener las legislaturas.' + err, 'error');
            this.spinner.hide();
        });
    }

    async obtenerDiputados(): Promise<void> {
        // Obtenemos empleados
        this.spinner.show();
        await this.diputadosService.obtenerDiputados().subscribe((resp: any) => {
            for (const diputados of resp) {
                if (diputados.legislatura) {
                    this.arrDiputados.push(diputados);
                } else {

                }
            }
            //this.arrDiputados = resp;
            this.arrDiputados = this.arrDiputados.filter(meta => meta.legislatura.id == this.selectedLegislatura);
            this.spinner.hide();
        }, err => {
            Swal.fire('Error', 'Ocurrió un error obtener los diputados.' + err, 'error');
            this.spinner.hide();
        });
    }

    async onSelect(id: any): Promise<void> {
        // Obtenemos empleados
        this.spinner.show();
        await this.diputadosService.obtenerDiputados().subscribe((resp: any) => {
            console.log(this.arrDiputados);
            for (const diputados of resp) {
                if (diputados.legislatura) {
                    this.arrDiputados.push(diputados);
                } else {

                }
            }
            //this.arrDiputados = resp;
            this.arrDiputados = this.arrDiputados.filter(meta => meta.legislatura.id == this.selectedLegislatura);

            if (this.arrDiputados.length == 0 && this.primeraVez == 1) {
                Swal.fire('Error', 'No se encontraron diputados en la legislatura seleccionada.', 'error');
            }
            this.primeraVez = 1;
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

        this.vocals.controls.forEach(element => {

            this.comision.push({
                cargo: 'Vocal',
                idParticipante: element.value,
                participante: this.arrDiputados.find(meta => meta.id == element.value.id).nombre,
                partido: this.arrDiputados.find(meta => meta.id == element.value.id).partidos_politico.cNomenclatura,
                idLegislatura: this.selectedLegislatura,
                legislatura: this.arrLegislatura.find(meta => meta.id == this.selectedLegislatura).cLegislatura
            });
        });

        this.vocalsg.controls.forEach(element => {

            this.comision.push({
                cargo: 'Vocal',
                idParticipante: element.value,
                participante: this.arrDiputados.find(meta => meta.id == element.value.id).nombre,
                partido: this.arrDiputados.find(meta => meta.id == element.value.id).partidos_politico.cNomenclatura,
                idLegislatura: this.selectedLegislatura,
                legislatura: this.arrLegislatura.find(meta => meta.id == this.selectedLegislatura).cLegislatura
            });
        });

        /*for (let i = 0; i < this.comision.length; i++) {
            if (this.comision[i + 1]) {
                if (this.comision[i + 1].idParticipante === this.comision[i].idParticipante) {
                    repetido = true;
                    Swal.fire('Error', 'Existen participantes repetidos, esto no es correcto, favor de modificarlos.', 'error');
                }

                if(this.comision[i + 1].cargo == 'Vocal'){
                    if(this.comision[i + 1].idParticipante.hasOwnProperty('id')){
                        console.log('existe Id');
                        if (this.comision[i + 1].idParticipante.id === this.comision[i].idParticipante) {
                            repetido = true;
                            Swal.fire('Error', 'Existen participantes repetidos, esto no es correcto, favor de modificarlos.', 'error');
                        }
                    }
                }

                if(this.comision[i + 1].cargo == 'Vocal'){
                    if(this.comision[i].cargo == 'Vocal'){
                        if(this.comision[i + 1].idParticipante.id === this.comision[i].idParticipante.id){
                            console.log('cargo vocal');
                            repetido = true;
                            Swal.fire('Error', 'Existen participantes repetidos, esto no es correcto, favor de modificarlos.', 'error');
                        }
                    }
                }
            }
        }*/

        let idDiputados = []
        let idCompare = '';

        for (let i = 0; i < this.comision.length; i++) {
            if (this.comision[i].idParticipante.hasOwnProperty('id')) {
                idDiputados.push({ "id": this.comision[i].idParticipante.id });
            } else {
                idDiputados.push({ "id": this.comision[i].idParticipante });
            }
        }

        idDiputados.forEach(element => {
            if (idCompare === '') {
                idCompare = element.id;
            } else {
                idCompare = idCompare + ',' + element.id;
            }
        });

        let separatedId = idCompare.split(",");
        let normalizedInputArray = separatedId.map(el => el.toLowerCase());
        let idValue = [];
        let idEqual = [];

        //console.log(separatedAutors);

        normalizedInputArray.forEach(value => {
            idValue.push({ "diputado": value, "valor": normalizedInputArray.filter(el => el === value).length });
        });

        idValue.forEach(dip => {
            if (dip.valor > 1) {
                repetido = true;
                Swal.fire('Error', 'Ocurrió un error al guardar. No debe haber duplicidad en los participantes.', 'error');
            }
        });

        console.log(this.comision);
        console.log(idDiputados);
        console.log(idValue);
        console.log(idEqual);

        if (repetido === false) {
            this.cerrar(this.comision);
        }
    }

    pruebaFormArray() {
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
