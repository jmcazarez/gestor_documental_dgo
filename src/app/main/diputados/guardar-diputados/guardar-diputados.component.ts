import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DiputadosModel } from 'models/diputados.models';
import { DiputadosService } from 'services/diputados.service';
import Swal from 'sweetalert2';
import { DiputadosComponent } from '../diputados.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { PartidosPoliticosService } from 'services/partidos-politicos.service';
import { LegislaturaService } from 'services/legislaturas.service';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { DistritosService } from 'services/distritos.service';
@Component({
    selector: 'app-guardar-diputados',
    templateUrl: './guardar-diputados.component.html',
    styleUrls: ['./guardar-diputados.component.scss']
})
export class GuardarDiputadosComponent implements OnInit {
    form: FormGroup;

    selectedDistrito: any;
    arrDistritos: [];

    selectedPartido: any;
    arrPartidos: [];

    selectedLegislatura: any;
    arrLegislaturas: [];
    constructor(
        private formBuilder: FormBuilder,
        private spinner: NgxSpinnerService,
        private distritosService: DistritosService,
        private partidoPoliticoService: PartidosPoliticosService,
        private legislaturasService: LegislaturaService,
        private dialogRef: MatDialogRef<DiputadosComponent>,
        private diputadosService: DiputadosService,
        @Inject(MAT_DIALOG_DATA) public diputado: DiputadosModel
    ) { }

    ngOnInit(): void {
   
        this.obtenerDistritos();
        this.obtenerPartidos();
        this.obtenerLegislaturas();

        if (this.diputado.activo === undefined) {
            this.diputado.activo = true;
        }

        if (this.diputado.distrito) {
            this.selectedDistrito = this.diputado.distrito.id;
        }

        if (this.diputado.partidos_politico) {
            this.selectedPartido = this.diputado.partidos_politico.id;
        }

        if (this.diputado.legislatura) {
            this.selectedLegislatura = this.diputado.legislatura.id;
        }


        // Form reactivo      
        this.form = this.formBuilder.group({
            nombre: [this.diputado.nombre, [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
            distrito: [{ value: this.diputado.distrito, disabled: false }, [Validators.required]],
            partido: [{ value: this.diputado.partidos_politico, disabled: false }, [Validators.required]],
            legislatura: [{ value: this.diputado.legislatura, disabled: false }, [Validators.required]],
            email: [this.diputado.email, [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
            telefono: [this.diputado.telefono, [RxwebValidators.mask({ mask: '(999)-999 9999' }), Validators.required]],
            estatus: this.diputado.activo,
        });
        
    }

    async guardar(): Promise<void> {

        this.spinner.show();
        // Asignamos valores a objeto
        this.diputado.activo = this.form.get('estatus').value;
        this.diputado.nombre = this.form.get('nombre').value;
        this.diputado.distrito = this.selectedDistrito;
        this.diputado.partidos_politico = this.selectedPartido;
        this.diputado.legislatura = this.selectedLegislatura;
        this.diputado.telefono = this.form.get('telefono').value;
        this.diputado.email = this.form.get('email').value;
        //this.diputado.cNomenclatura = this.form.get('nomenclatura').value;

        if (this.diputado.id) {

            // Actualizamos el partido politico
            this.diputadosService.actualizarDiputados(this.diputado).subscribe((resp: any) => {
                if (resp) {
                    this.spinner.hide();
                    Swal.fire('Éxito', 'Diputado actualizado correctamente.', 'success');
                    this.diputado = resp.data;

                    this.cerrar(this.diputado);
                } else {
                    this.spinner.hide();
                    Swal.fire('Error', 'Ocurrió un error al guardar. ' + resp.error.data, 'error');
                }
            }, err => {
                this.spinner.hide();
                Swal.fire('Error', 'Ocurrió un error al guardar.' + err.error.data, 'error');
            });

        } else {
            // Guardamos el partido politico
            this.diputadosService.guardarDiputados(this.diputado).subscribe((resp: any) => {
                if (resp) {
                    this.spinner.hide();
                    Swal.fire('Éxito', 'Diputado guardado correctamente.', 'success');
                    this.cerrar(this.diputado);
                } else {
                    this.spinner.hide();
                    Swal.fire('Error', 'Ocurrió un error al guardar. ' + resp.error.data, 'error');
                }
            }, err => {
                this.spinner.hide();
                Swal.fire('Error', 'Ocurrió un error al guardar.' + err.error.data, 'error');
            });
        }
    }

    async obtenerDistritos(): Promise<void> {
        // Obtenemos Distritos
        this.spinner.show();
        await this.distritosService.obtenerDistritos().subscribe((resp: any) => {
           /*.filter(
                (item) => item["activo"] === true
            ) */;
            this.arrDistritos = resp;
            this.spinner.hide();
        }, err => {
            Swal.fire('Error', 'Ocurrió un error obtener los distritos.' + err, 'error');
            this.spinner.hide();
        });
    }

    async obtenerPartidos(): Promise<void> {
        // Obtenemos Partidos Politicos
        this.spinner.show();
        await this.partidoPoliticoService.obtenerPartidoPolitico().subscribe((resp: any) => {
            this.arrPartidos = resp.filter(
                (item) => item["bActivo"] === true
            );
            this.spinner.hide();
        }, err => {
            Swal.fire('Error', 'Ocurrió un error obtener los partidos politicos.' + err, 'error');
            this.spinner.hide();
        });
    }

    async obtenerLegislaturas(): Promise<void> {
        // Obtenemos Legislaturas
        this.spinner.show();
        await this.legislaturasService.obtenerLegislatura().subscribe((resp: any) => {
            this.arrLegislaturas = resp.filter(
                (item) => item["bActivo"] === true
            );
            this.spinner.hide();
        }, err => {
            Swal.fire('Error', 'Ocurrió un error obtener las legislaturas.' + err, 'error');
            this.spinner.hide();
        });
    }


    cerrar(ent): void {
        if (ent) {
            this.dialogRef.close(ent);
        } else {
            this.dialogRef.close();
        }
    }


}
