import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import Swal from 'sweetalert2';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TableroDeRecepcionDeActasComponent } from '../tablero-de-recepcion-de-actas.component';

import { MatDialog } from '@angular/material/dialog';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { DatePipe } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { RecepcionDeActasModel } from 'models/recepcion-de-actas.models';
import { RecepcionDeActasService } from 'services/recepcion-de-actas.service';
import { LegislaturaService } from 'services/legislaturas.service';
import { EmpleadosDelCongresoService } from 'services/empleados-del-congreso.service';

export interface Estado {
    id: string;
    descripcion: string;
}


@Component({
    selector: 'guardar-recepcion-de-actas',
    templateUrl: './guardar-recepcion-de-actas.component.html',
    styleUrls: ['./guardar-recepcion-de-actas.component.scss'],
    providers: [DatePipe]
})
export class GuardarRecepcionDeActasComponent implements OnInit {

    form: FormGroup;
    selectLegislatura: any;
    arrLegislaturas: any[] = [];
    selectEmisor: any;
    arrEmisores: any[] = [];
    selectReceptor: any;
    arrReceptores: any[] = [];
    fileName: string;
    cambioFecha: boolean;
    date = new Date(2020, 1, 1);
    fechaCreacion: any;
    maxDate = new Date();
    cambioDocumento = false;
    selectEstado: any;
    estados: Estado[] = [];
    constructor(
        private spinner: NgxSpinnerService,
        private datePipe: DatePipe,
        private formBuilder: FormBuilder,
        private dialogRef: MatDialogRef<TableroDeRecepcionDeActasComponent>,
        public dialog: MatDialog,
        private recepcionService: RecepcionDeActasService,
        private empleados: EmpleadosDelCongresoService,
        private legislaturasService: LegislaturaService,
        @Inject(MAT_DIALOG_DATA) public recepcion: RecepcionDeActasModel
    ) { }

    async ngOnInit(): Promise<void> {

        this.estados.push({
            id: '001',
            descripcion: 'pendiente'
        });
        this.estados.push({
            id: '002',
            descripcion: 'incompleto'
        });
        this.estados.push({
            id: '003',
            descripcion: 'completo'
        });

        await this.obtenerTiposLegislaturas();
        await this.obtenerEmpleados();

        this.fileName = '';
        const fecha = new Date(); // Fecha actual
        let mes: any = fecha.getMonth() + 1; // obteniendo mes
        let dia: any = fecha.getDate(); // obteniendo dia
        let hora: any = fecha.getHours() + ':' + fecha.getMinutes();
        dia = dia + 1;
        const ano = fecha.getFullYear(); // obteniendo año
        const fechaActual = ano + '-' + mes + '-' + dia;
        if (dia < 10) {
            dia = '0' + dia; // agrega cero si el menor de 10
        }
        if (mes < 10) {
            mes = '0' + mes; // agrega cero si el menor de 10
        }


        // Validamos si es un documento nuevo
        if (this.recepcion.id) {
            console.log(this.recepcion);
            this.selectLegislatura = this.recepcion.legislatura.id;
            this.selectEmisor = this.recepcion.emisor[0].id;
            this.selectReceptor = this.recepcion.receptor[0].id;
            this.recepcion.fechaCreacion =  this.datePipe.transform(this.recepcion.fechaCreacion, 'yyyy-MM-dd') + 'T16:00:00.000Z';
            this.recepcion.fechaRecepcion = this.recepcion.fechaRecepcion + 'T16:00:00.000Z';
            this.selectEstado = this.recepcion.estatus;
           
        } else {
            console.log(fechaActual);
            // Seteamos la fecha de carga con la fecha actual
            this.selectEstado = 'pendiente'
            this.recepcion.estatus = 'pendiente';
           // this.recepcion.fechaRecepcion = this.recepcion.fechaRecepcion;
            this.recepcion.fechaCreacion = ano + '-' + mes + '-' + dia;
            this.recepcion.hora = hora;
            this.selectLegislatura = '';
            this.selectEmisor = '';
            this.selectReceptor = '';
        }

   
        // Form reativo
        this.form = this.formBuilder.group({
            cId: [{ value: this.recepcion.id, disabled: true }],
            legislatura: [{ value: this.recepcion.legislatura, disabled: false }, Validators.required],
            fechaCreacion: [{ value: this.recepcion.fechaCreacion, disabled: true }, Validators.required],
            hora: [{ value: this.recepcion.hora, disabled: true }, Validators.required],
            fechaRecepcion: [{ value: this.recepcion.fechaRecepcion, disabled: false }, Validators.required],
            emisor: [{ value: this.recepcion.emisor, disabled: false }, Validators.required],
            receptor: [{ value: this.recepcion.receptor, disabled: false }, Validators.required],
            estatus: [{ value: this.estados, disabled: false }, Validators.required],
            notas: [{ value: this.recepcion.notas, disabled: false }, [ Validators.maxLength(500)]],

        });



    }

    async guardar(): Promise<void> {
        this.spinner.show();

        // Asignamos valores a objeto
        this.recepcion.legislatura = this.selectLegislatura;
        this.recepcion.emisor = [this.selectEmisor];
        this.recepcion.receptor = [this.selectReceptor];
        this.recepcion.fechaRecepcion = this.form.get('fechaRecepcion').value;
        this.recepcion.estatus = this.selectEstado;
        this.recepcion.notas = this.form.get('notas').value

        if (this.recepcion.id) {

            // Actualizamos la recepcion de actas
            this.recepcionService.actualizarRecepcionDeActa(this.recepcion).subscribe((resp: any) => {
                if (resp) {
                    Swal.fire('Éxito', 'Recepción de acta actualizada correctamente.', 'success');
                    this.recepcion = resp.data;
                    this.spinner.hide();
                    this.cerrar(this.recepcion);
                } else {
                    this.spinner.hide();
                    Swal.fire('Error', 'Ocurrió un error al guardar. ' + resp.error.data, 'error');
                }
            }, err => {
                this.spinner.hide();
                Swal.fire('Error', 'Ocurrió un error al guardar.' + err.error.data, 'error');
            });

        } else {
            // Guardamos el recepcion de actas
            this.recepcionService.guardarRecepcionDeActa(this.recepcion).subscribe((resp: any) => {
                if (resp) {
                    this.spinner.hide();
                    Swal.fire('Éxito', 'Recepción de acta guardada correctamente.', 'success');
                    this.cerrar(this.recepcion);
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

    cerrar(doc: any): void {
        if (doc) {
            this.dialogRef.close(doc);
        } else {
            this.dialogRef.close();
        }
    }

    async obtenerTiposLegislaturas(): Promise<void> {
        // Obtenemos legislaturas
        this.spinner.show();
        await this.legislaturasService.obtenerLegislatura().subscribe((resp: any) => {
            
            this.arrLegislaturas = resp;
            this.spinner.hide();
        }, err => {
            Swal.fire('Error', 'Ocurrió un error obtener las legislaturas.' + err, 'error');
            this.spinner.hide();
        });
    }

    async obtenerEmpleados(): Promise<void> {
        // Obtenemos empleados
        this.spinner.show();
        await this.empleados.obtenerEmpleados().subscribe((resp: any) => {

            this.arrEmisores = resp;
            this.arrReceptores = resp;
            this.spinner.hide();
        }, err => {
            Swal.fire('Error', 'Ocurrió un error obtener los empleados.' + err, 'error');
            this.spinner.hide();
        });
    }


    change(): void {
        this.cambioDocumento = true;
    }



}
