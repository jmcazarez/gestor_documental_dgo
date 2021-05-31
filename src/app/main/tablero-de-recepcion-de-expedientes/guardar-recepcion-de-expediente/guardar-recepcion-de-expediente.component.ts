import { Component, OnInit, Inject, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import Swal from 'sweetalert2';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TableroDeRecepcionDeExpedientesComponent } from '../tablero-de-recepcion-de-expedientes.component';
import { MatDialog } from '@angular/material/dialog';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { DatePipe } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { RecepcionDeExpedientesModels } from 'models/recepcion-de-expedientes.models';
import { RecepcionDeExpedientesService } from 'services/recepcion-de-expedientes.services';
import { LegislaturaService } from 'services/legislaturas.service';
import { EmpleadosDelCongresoService } from 'services/empleados-del-congreso.service';

export interface Estado {
    id: string;
    descripcion: string;
}

@Component({
    selector: 'app-guardar-recepcion-de-expediente',
    templateUrl: './guardar-recepcion-de-expediente.component.html',
    styleUrls: ['./guardar-recepcion-de-expediente.component.scss'],
    providers: [DatePipe]
})
export class GuardarRecepcionDeExpedienteComponent implements OnInit {

    form: FormGroup;
    idExpediente: string;
    selectedLegislatura: any;
    arrLegislaturas: any[] = [];
    selectedEmisor: any;
    arrEmisores: any[] = [];
    selectedReceptor: any;
    arrReceptores: any[] = [];
    fileName: string;
    cambioFecha: boolean;
    date = new Date(2020, 1, 1);
    maxDate = new Date();
    cambioDocumento = false;
    selectedEstado: any;
    estados: Estado[] = [];
    constructor(
        private spinner: NgxSpinnerService,
        private datePipe: DatePipe,
        private formBuilder: FormBuilder,
        private dialogRef: MatDialogRef<TableroDeRecepcionDeExpedientesComponent>,
        public dialog: MatDialog,
        private recepcionService: RecepcionDeExpedientesService,
        private empleados: EmpleadosDelCongresoService,
        private legislaturasService: LegislaturaService,
        @Inject(MAT_DIALOG_DATA) public recepcion: RecepcionDeExpedientesModels
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

        // Validamos si es un documento nuevo
        if (this.recepcion.id) {
            console.log(this.recepcion);
            this.idExpediente = this.recepcion.idExpediente;
            this.selectedLegislatura = this.recepcion.legislatura.id;
            this.selectedEmisor = this.recepcion.emisor[0].id;
            this.selectedReceptor = this.recepcion.receptor[0].id;
            this.recepcion.fechaRecepcion = this.recepcion.fechaRecepcion + 'T16:00:00.000Z';
            this.selectedEstado = this.recepcion.estatus;

        } else {
            // Seteamos la fecha de carga con la fecha actual
            this.selectedEstado = 'pendiente'
            this.recepcion.estatus = 'pendiente';
            this.selectedLegislatura = '';
            this.selectedEmisor = '';
            this.selectedReceptor = '';
        }

        // Form reativo
        this.form = this.formBuilder.group({

            idExpediente: [{ value: this.recepcion.idExpediente, disabled: true }, Validators.required],
            legislatura: [{ value: this.recepcion.legislatura, disabled: false }, Validators.required],
            fechaRecepcion: [{ value: this.recepcion.fechaRecepcion, disabled: false }, Validators.required],
            emisor: [{ value: this.recepcion.emisor, disabled: false }, Validators.required],
            receptor: [{ value: this.recepcion.receptor, disabled: false }, Validators.required],
            estatus: [{ value: this.estados, disabled: false }, Validators.required],
            notas: [{ value: this.recepcion.notas, disabled: false }, [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],

        });
    }

    async guardar(): Promise<void> {
        this.spinner.show();
        // Asignamos valores a objeto
        this.recepcion.idExpediente = this.form.get('idExpediente').value;
        this.recepcion.legislatura = this.selectedLegislatura;
        this.recepcion.emisor = [this.selectedEmisor];
        this.recepcion.receptor = [this.selectedReceptor];
        this.recepcion.fechaRecepcion = this.form.get('fechaRecepcion').value;
        this.recepcion.estatus = this.selectedEstado;
        this.recepcion.notas = this.form.get('notas').value

        if (this.recepcion.id) {

            // Actualizamos la recepcion de actas
            this.recepcionService.actualizarRecepcionExpediente(this.recepcion).subscribe((resp: any) => {
                if (resp) {
                    Swal.fire('Éxito', 'Recepción de expediente actualizada correctamente.', 'success');
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
            this.recepcionService.guardarRecepcionExpediente(this.recepcion).subscribe((resp: any) => {
                if (resp) {
                    this.spinner.hide();
                    Swal.fire('Éxito', 'Recepción de expediente guardada correctamente.', 'success');
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

    async obtenerEmpleados(): Promise<void> {
        // Obtenemos empleados
        this.spinner.show();
        await this.empleados.obtenerEmpleados().subscribe((resp: any) => {
            console.log(resp);
            this.arrEmisores = resp;
            this.arrReceptores = this.arrEmisores;
            this.spinner.hide();
        }, err => {
            Swal.fire('Error', 'Ocurrió un error obtener los empleados.' + err, 'error');
            this.spinner.hide();
        });
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
}
