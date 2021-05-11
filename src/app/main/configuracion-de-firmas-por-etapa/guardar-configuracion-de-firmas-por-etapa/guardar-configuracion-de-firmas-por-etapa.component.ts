import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import Swal from 'sweetalert2';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ConfiguracionFirmasPorEtapaComponent } from '../configuracion-de-firmas-por-etapa.component';
import { MatDialog } from '@angular/material/dialog';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { DatePipe } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { FirmasPorEtapaModel } from 'models/configuracion-de-firmas-por-etapa.models';
import { FirmasPorEtapaService } from 'services/configuracion-de-firmas-por-etapa.service';
import { PuestosService } from 'services/puestos.service';
import { EmpleadosDelCongresoService } from 'services/empleados-del-congreso.service';

@Component({
    selector: 'guardar-configuracion-de-firmas-por-etapa',
    templateUrl: './guardar-configuracion-de-firmas-por-etapa.component.html',
    styleUrls: ['./guardar-configuracion-de-firmas-por-etapa.component.scss'],
    providers: [DatePipe]
})
export class GuardarConfiguracionFirmasPorEtapaComponent implements OnInit {

    form: FormGroup;
    selectTipo: any;
    selectParticipante: string;
    arrTipo: any[] = [];
    fileName: string;
    arrParticipantes = [];
    arrEmpleados = [];
    arrParticipantesTemporal = [];
    loadingIndicator: boolean;
    reorderable: boolean;
    ocultarTipo: true;
    descripcionPuesto = '';
    constructor(
        private spinner: NgxSpinnerService,
        private formBuilder: FormBuilder,
        private dialogRef: MatDialogRef<ConfiguracionFirmasPorEtapaComponent>,
        private firmasPorEtapaService: FirmasPorEtapaService,
        public dialog: MatDialog,
        private empleadosService: EmpleadosDelCongresoService,
        @Inject(MAT_DIALOG_DATA) public firmasPorEtapa: FirmasPorEtapaModel
    ) { }

    async ngOnInit(): Promise<void> {
        let puesto: any;
        this.ocultarTipo = true;
     
        this.fileName = '';


        // Validamos si es un documento nuevo
        if (this.firmasPorEtapa.id) {
            this.selectTipo = this.firmasPorEtapa.etapa.id;

            if (this.firmasPorEtapa.participantes) {
                for (const participante of this.firmasPorEtapa.participantes) {

                    puesto = this.firmasPorEtapa.arrPuestos.find(puesto => puesto.id === participante.puesto);
                    
                    this.arrParticipantes.push({
                        id: participante.id,
                        nombre: participante.nombre,
                        puesto: puesto.descripcion,
                    });
                }
                this.arrParticipantesTemporal = this.arrParticipantes;
            }
        } else {
            // Seteamos la fecha de carga con la fecha actual

        }
        console.log(this.firmasPorEtapa);
        // Form reativo
        this.form = this.formBuilder.group({
            id: [{ value: this.firmasPorEtapa.id, disabled: true }],
            tipo: [{ value: this.firmasPorEtapa.etapa, disabled: true }, Validators.required],
            tipoText: [{ value: this.firmasPorEtapa.etapa.descripcion, disabled: true }, Validators.required],
            participantes: [{ value: this.firmasPorEtapa.participantes, disabled: false }],
        });

        this.form.get('participantes').valueChanges.subscribe(val => {

            if (val) {


                const filtro = this.arrEmpleados.find(meta => meta.id == val);
                if (filtro) {
                    this.descripcionPuesto = filtro.puesto.descripcion;
                } else {
                    this.descripcionPuesto = '';
                }
            }
        });

           await this.obtenerEmpleados();
           await this.obtenerTiposEtapas();

    }

    async guardar(): Promise<void> {
        this.spinner.show();
        let participantes = [];
        // Guardamos Iniciativa

        // Asignamos valores a objeto
        this.firmasPorEtapa.etapa = this.selectTipo;

        this.arrParticipantes.forEach((row) => {
            participantes.push(row.id);
        });
        this.firmasPorEtapa.participantes = participantes;

        if (this.firmasPorEtapa.id) {

            // Actualizamos el ente
            this.firmasPorEtapaService.actualizarFirmasPorEtapa(this.firmasPorEtapa).subscribe((resp: any) => {
                if (resp) {
                    Swal.fire('Éxito', 'Configuración actualizada correctamente.', 'success');
                    this.firmasPorEtapa = resp.data;
                    this.spinner.hide();
                    this.cerrar(this.firmasPorEtapa);
                } else {
                    this.spinner.hide();
                    Swal.fire('Error', 'Ocurrió un error al guardar. ' + resp.error.data, 'error');
                }
            }, err => {
                this.spinner.hide();
                Swal.fire('Error', 'Ocurrió un error al guardar.' + err.error.data, 'error');
            });

        } else {
            // Guardamos el ente
            this.firmasPorEtapaService.guardarFirmasPorEtapa(this.firmasPorEtapa).subscribe((resp: any) => {
                if (resp) {
                    this.spinner.hide();
                    Swal.fire('Éxito', 'Configuración guardada correctamente.', 'success');
                    this.cerrar(this.firmasPorEtapa);
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


    async obtenerTiposEtapas(): Promise<void> {
        // Obtenemos Distritos
        this.spinner.show();
        await this.firmasPorEtapaService.obtenerEtapas().subscribe((resp: any) => {

            this.arrTipo = resp;
            
            this.spinner.hide();
        }, err => {
            Swal.fire('Error', 'Ocurrió un error obtener las etapas.' + err, 'error');
            this.spinner.hide();
        });
    }


    filterDatatable(value): void {
        // Filtramos tabla
        if (value.target.value === '') {
            this.arrParticipantes = this.arrParticipantesTemporal;
        } else {
            const val = value.target.value.toLowerCase();
            const temp = this.arrParticipantes.filter((d) => d.puesto.toLowerCase().indexOf(val) !== -1 || !val ||
                d.nombre.toLowerCase().indexOf(val) !== - 1 );

            this.arrParticipantes = temp;
        }
    }

    async obtenerEmpleados(): Promise<void> {
        // Obtenemos empleados
        this.spinner.show();
        await this.empleadosService.obtenerEmpleados().subscribe((resp: any) => {

            this.arrEmpleados = resp;
            
            this.spinner.hide();
        }, err => {
            Swal.fire('Error', 'Ocurrió un error obtener los puestos.' + err, 'error');
            this.spinner.hide();
        });
    }

    eliminarParticipante(row): void {

        Swal.fire({
            title: '¿Está seguro que desea eliminar este participante de la configuración? hasta que no guarde no se reflejara el cambio.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Si',
            cancelButtonText: 'No'
        }).then((result) => {
            if (result.value) {
                this.arrParticipantes = this.arrParticipantes.filter((std: { id: string; }) => std.id !== row.id);
           
                this.arrParticipantesTemporal = this.arrParticipantes;
            }
        });

    }

    agregarParticipante(): void {
        if (this.selectParticipante.length > 0) {
            const filtro = this.arrEmpleados.find(meta => meta.id == this.selectParticipante);

            if (filtro) {

                const exist = this.arrParticipantes.find(meta => meta.id == filtro.id)

                if (exist) {
                    Swal.fire('Error', 'El participante ya se encuentra en la configuración.', 'error');
                } else {
                    this.arrParticipantes.push({
                        id: filtro.id,
                        nombre: filtro.nombre,
                        puesto: filtro.puesto.descripcion,
                    });

                }
                this.arrParticipantes = [...this.arrParticipantes];
                this.selectParticipante = '';
                this.descripcionPuesto = '';
            }
        }

    }
}
