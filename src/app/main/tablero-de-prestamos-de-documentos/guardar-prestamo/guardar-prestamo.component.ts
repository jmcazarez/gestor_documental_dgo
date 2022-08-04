
import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import Swal from 'sweetalert2';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TableroDePrestamosDeDocumentosComponent } from '../tablero-de-prestamos-de-documentos.component';
import { MatDialog } from '@angular/material/dialog';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { DatePipe } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { PrestamoDeDocumentosModels } from 'models/prestamo-de-documentos.models';
import { PrestamosDeDocumentosService } from 'services/prestamo-de-documentos.service';
import { LegislaturaService } from 'services/legislaturas.service';
import { EmpleadosDelCongresoService } from 'services/empleados-del-congreso.service';
import { AmazingTimePickerService } from 'amazing-time-picker';
import * as moment from 'moment';
import { TipoExpedientesService } from 'services/tipo-expedientes.service';

export interface Estado {
    id: string;
    descripcion: string;
}

@Component({
    selector: 'app-guardar-prestamo',
    templateUrl: './guardar-prestamo.component.html',
    styleUrls: ['./guardar-prestamo.component.scss'],
    providers: [DatePipe]
})

export class GuardarPrestamoComponent implements OnInit {

    form: FormGroup;
    cambioFecha: boolean;
    date = new Date();
    fechaCreacion: any;
    maxDate = new Date();
    cambioDocumento = false;
    selectPrestamo: any;
    selectExpediente: any;
    selectEstado: any;
    selectDanio: any;
    tipoPrestamo: Estado[] = [];

    estatusPrestamo: Estado[] = [];
    tipoDanio: Estado[] = [];
    tipoExpediente: any[] = [];
    constructor(
        private spinner: NgxSpinnerService,
        private datePipe: DatePipe,
        private tipoExpedientesService: TipoExpedientesService,
        private formBuilder: FormBuilder,
        private dialogRef: MatDialogRef<TableroDePrestamosDeDocumentosComponent>,
        public dialog: MatDialog,
        private prestamosService: PrestamosDeDocumentosService,
        //private empleados: EmpleadosDelCongresoService,
        //private legislaturasService: LegislaturaService,
        private atp: AmazingTimePickerService,
        @Inject(MAT_DIALOG_DATA) public prestamo: PrestamoDeDocumentosModels
    ) { }

    async ngOnInit(): Promise<void> {
        let validacion = [];

        this.tipoPrestamo.push({
            id: '001',
            descripcion: 'Consulta interna'
        });
        this.tipoPrestamo.push({
            id: '002',
            descripcion: 'Consulta Externa'
        });


        const fecha = new Date(); // Fecha actual

        let mes: any = fecha.getMonth() + 1; // obteniendo mes
        let dia: any = fecha.getDate(); // obteniendo dia
        let minutos: any = fecha.getMinutes();
        if (minutos < 10) {
            minutos = '0' + minutos; // agrega cero si el menor de 10
        }
        let hora: any = fecha.getHours();
        if (hora < 10) {
            hora = '0' + hora; // agrega cero si el menor de 10
        }
        let horaMinuto: any = hora + ':' + minutos;
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
        if (this.prestamo.id) {
            //llamamos la libreria moment.js y le pasamos la fecha de solicitud y devolución, sumamos un dia y le agregamos el formato.
            //let fechaSolicitud = moment(this.prestamo.dFechaSolicitud).add(1, 'day').format('YYYY-MM-DD');
            //let fechaDevolucion = moment(this.prestamo.dFechaDevolucion).format('YYYY-MM-DD');
            //let fechaDocEntregado = moment(this.prestamo.dFechaDocEntregado).format('YYYY-MM-DD');
            //console.log(fechaDocEntregado);

            this.selectPrestamo = this.prestamo.cTipoPrestamo;
            if (this.prestamo.tipo_de_expediente) {
                if (this.prestamo.tipo_de_expediente.id) {
                    this.selectExpediente = this.prestamo.tipo_de_expediente.id;
                }
            }
            if (this.prestamo.cEstatus === 'Pendiente') {
                this.prestamo.cEstatus = '';
            }
            this.selectEstado = this.prestamo.cEstatus;
            this.selectDanio = this.prestamo.cTipoDanio;
            if (this.selectEstado != 'Completo') {
                validacion = [Validators.required]
            } else {
                validacion = [];
            }
            //fechas en formato iso para que las fechas en el material picker no queden con un dia atras.
            this.prestamo.dFechaSolicitud = this.prestamo.dFechaSolicitud + 'T16:00:00.000Z';
            this.prestamo.dFechaDevolucion = this.prestamo.dFechaDevolucion + 'T16:00:00.000Z';
            if (this.prestamo.dFechaDocEntregado) {
                this.prestamo.dFechaDocEntregado = this.prestamo.dFechaDocEntregado + 'T16:00:00.000Z';
            }
            if (this.prestamo.tHoraDocEntregado === "Invalid date") {
                this.prestamo.tHoraDocEntregado = null;
            }

            this.estatusPrestamo.push({
                id: '001',
                descripcion: 'Completo'
            });
            this.estatusPrestamo.push({
                id: '002',
                descripcion: 'Incompleto'
            });

            this.tipoDanio.push({
                id: '002',
                descripcion: 'Perdida de documentos'
            });
            this.tipoDanio.push({
                id: '002',
                descripcion: 'Deterioro de documentos'
            });
            /*   this.tipoDanio.push({
                   id: '002',
                   descripcion: 'No aplica'
               });
               */
        } else {
            this.prestamo.cDetallePrestamo = '';
            // Seteamos la fecha de carga con la fecha actual
            //this.recepcion.fechaRecepcion = this.recepcion.fechaRecepcion;
            this.selectEstado = 'Pendiente';
            this.prestamo.dFechaSolicitud = ano + '-' + mes + '-' + dia;

            this.prestamo.tHoraSolicitud = horaMinuto;

            this.estatusPrestamo.push({
                id: '001',
                descripcion: 'Pendiente'
            });
            this.estatusPrestamo.push({
                id: '002',
                descripcion: 'Completo'
            });
            this.estatusPrestamo.push({
                id: '002',
                descripcion: 'Incompleto'
            });
        }
        // Form reativo
        if (this.prestamo.id) {
           
            this.form = this.formBuilder.group({
                cId: [{ value: this.prestamo.id, disabled: true }, [Validators.minLength(3), Validators.maxLength(100)]],
                cSolicitante: [{ value: this.prestamo.cSolicitante, disabled: true }, [Validators.minLength(3), Validators.maxLength(100)]],
                tipoExpediente: [{ value: this.prestamo.cTipoExpediente, disabled: true }, Validators.required],
                dFechaSolicitud: [{ value: this.prestamo.dFechaSolicitud, disabled: true }, Validators.required],
                tHoraSolicitud: [{ value: this.prestamo.tHoraSolicitud, disabled: true }, Validators.required],
                cTipoPrestamo: [{ value: this.prestamo.cTipoPrestamo, disabled: true }, Validators.required],
                cIdExpediente: [{ value: this.prestamo.cIdExpediente, disabled: true }, [Validators.minLength(3), Validators.maxLength(50)]],
                dFechaDevolucion: [{ value: this.prestamo.dFechaDevolucion, disabled: true }, Validators.required],
                tHoraDevolucion: [{ value: this.prestamo.tHoraDevolucion, disabled: true }, Validators.required],
                dFechaDocEntregado: [{ value: this.prestamo.dFechaDocEntregado, disabled: false }, Validators.required],
                tHoraDocEntregado: [{ value: this.prestamo.tHoraDocEntregado, disabled: false }, Validators.required],
                cEstatus: [{ value: this.prestamo.cEstatus, disabled: false }, Validators.required],
                cTipoDanio: [{ value: this.prestamo.cTipoDanio, disabled: false }, validacion],
                cNotas: [this.prestamo.cNotas, [Validators.maxLength(500)]],
                cDetallePrestamo: [this.prestamo.cDetallePrestamo, [Validators.maxLength(500)]]
            });
            
            this.selectExpediente = this.prestamo.cTipoExpediente;
        } else {
            this.form = this.formBuilder.group({
                cSolicitante: [this.prestamo.cSolicitante, [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
                tipoExpediente: [{ value: this.prestamo.cTipoExpediente, disabled: false }, Validators.required],
                dFechaSolicitud: [{ value: this.prestamo.dFechaSolicitud, disabled: true }, Validators.required],
                tHoraSolicitud: [{ value: this.prestamo.tHoraSolicitud, disabled: true }, Validators.required],
                cTipoPrestamo: [{ value: this.prestamo.cTipoPrestamo, disabled: false }, Validators.required],
                cIdExpediente: [this.prestamo.cIdExpediente, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
                dFechaDevolucion: [{ value: this.prestamo.dFechaDevolucion, disabled: false }, Validators.required],
                tHoraDevolucion: [{ value: this.prestamo.tHoraDevolucion, disabled: false }, Validators.required],
                cEstatus: [{ value: this.prestamo.cEstatus, disabled: true }, Validators.required],
                cDetallePrestamo: [this.prestamo.cDetallePrestamo, [Validators.maxLength(500)]]
            });
        }


        this.form.get('cEstatus').valueChanges.subscribe(val => {

            if (val === 'Incompleto') {
                validacion = [Validators.required]

                this.form.controls["cTipoDanio"].setValidators([Validators.required]);
                this.form.get('cTipoDanio').updateValueAndValidity();
            } else {
                validacion = [];
                this.selectDanio = '';
                this.form.get('cTipoDanio').clearValidators();
                this.form.get('cTipoDanio').updateValueAndValidity();
            }


        });

        await this.obtenerTiposExpedientes();
    }

    async guardar(): Promise<void> {
        this.spinner.show();
       
        // Asignamos valores a objeto
        if (this.prestamo.id) {

            this.prestamo.cSolicitante = this.form.get('cSolicitante').value;
            this.prestamo.cTipoPrestamo = this.form.get('cTipoPrestamo').value;
            const dFechaSolicitud = this.form.get('dFechaSolicitud').value;
            const dFechaDevolucion = this.form.get('dFechaDevolucion').value;
            const dFechaDocEntregado = this.form.get('dFechaDocEntregado').value;
            const horaSolicitud = this.form.get('tHoraSolicitud').value;
            const horaDevolucion = this.form.get('tHoraDevolucion').value;
            const horaDocEntregado = this.form.get('tHoraDocEntregado').value;
            this.prestamo.tipo_de_expediente = this.selectExpediente;
            this.prestamo.cIdExpediente = this.form.get('cIdExpediente').value;
            this.prestamo.dFechaDevolucion = this.form.get('dFechaDevolucion').value;
            this.prestamo.cEstatus = this.form.get('cEstatus').value;
            this.prestamo.cTipoExpediente = this.selectExpediente;
            this.prestamo.cDetallePrestamo = this.form.get('cDetallePrestamo').value;
            if (this.prestamo.cEstatus == 'Completo') {

                this.prestamo.cTipoDanio = '';
            } else {

                this.prestamo.cTipoDanio = this.form.get('cTipoDanio').value;
            }
            this.prestamo.cNotas = this.form.get('cNotas').value;
            //console.log('hora dev '+horaDevolucion);

            const fechaSolicitud = moment(dFechaSolicitud).format('YYYY-MM-DD');
            const fechaDevolucion = moment(dFechaDevolucion).format('YYYY-MM-DD');
            const fechaDocEntregado = moment(dFechaDocEntregado).format('YYYY-MM-DD');

            this.prestamo.dFechaSolicitud = fechaSolicitud;
            this.prestamo.dFechaDevolucion = fechaDevolucion;
            this.prestamo.dFechaDocEntregado = fechaDocEntregado;
            this.prestamo.tHoraSolicitud = horaSolicitud + ':00.000';
            this.prestamo.tHoraDevolucion = horaDevolucion + ':00.000';
            this.prestamo.tHoraDocEntregado = horaDocEntregado + ':00.000';


        } else {
            this.prestamo.cSolicitante = this.form.get('cSolicitante').value;
            this.prestamo.cTipoPrestamo = this.form.get('cTipoPrestamo').value;
            const dFechaSolicitud = this.form.get('dFechaSolicitud').value;
            const dFechaDevolucion = this.form.get('dFechaDevolucion').value;
            const horaSolicitud = this.form.get('tHoraSolicitud').value;
            const horaDevolucion = this.form.get('tHoraDevolucion').value;
            this.prestamo.tipo_de_expediente = this.selectExpediente;
            this.prestamo.cIdExpediente = this.form.get('cIdExpediente').value;
            this.prestamo.dFechaDevolucion = this.form.get('dFechaDevolucion').value;
            this.prestamo.cEstatus = this.form.get('cEstatus').value;
            this.prestamo.cTipoExpediente = this.selectExpediente;
            this.prestamo.cDetallePrestamo = this.form.get('cDetallePrestamo').value;

            const fechaSolicitud = moment(dFechaSolicitud).subtract(1, 'day').format('YYYY-MM-DD');
            const fechaDevolucion = moment(dFechaDevolucion).format('YYYY-MM-DD');

            this.prestamo.dFechaSolicitud = fechaSolicitud;
            this.prestamo.dFechaDevolucion = fechaDevolucion;
            this.prestamo.tHoraSolicitud = horaSolicitud + ':00.000';
            this.prestamo.tHoraDevolucion = horaDevolucion + ':00.000';


        }
        if (this.prestamo.id) {
           
            // Actualizamos la recepcion de actas
            this.prestamosService.actualizarPrestamosDeDocumentos(this.prestamo).subscribe((resp: any) => {
                if (resp) {
                    Swal.fire('Éxito', 'Préstamo de documentos actualizado correctamente.', 'success');
                    this.prestamo = resp.data;
                    this.spinner.hide();
                    this.cerrar(this.prestamo);
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
            this.prestamosService.guardarPrestamosDeDocumentos(this.prestamo).subscribe((resp: any) => {
                if (resp) {
                    this.spinner.hide();
                    Swal.fire('Éxito', 'Préstamo de documentos guardado correctamente.', 'success');
                    this.cerrar(this.prestamo);
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

    open() {
        const amazingTimePicker = this.atp.open();
        amazingTimePicker.afterClose().subscribe(time => {

        })
    }

    change(): void {
        this.cambioDocumento = true;
    }


    async obtenerTiposExpedientes(): Promise<void> {
        // Obtenemos tipos de expedientes
        this.spinner.show();
        await this.tipoExpedientesService.obtenerTipoExpedientes().subscribe(
            (resp: any) => {
                this.tipoExpediente = resp;
                this.spinner.hide();
            },
            (err) => {
                Swal.fire(
                    "Error",
                    "Ocurrió un error obtener los tipos de expedientes." + err,
                    "error"
                );
                this.spinner.hide();
            }
        );
    }
}
