import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import Swal from 'sweetalert2';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TableroDeLibroDeActasComponent } from '../tablero-de-libro-de-actas.component';
import { MatDialog } from '@angular/material/dialog';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { DatePipe } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { LegislaturaService } from 'services/legislaturas.service';
import { EmpleadosDelCongresoService } from 'services/empleados-del-congreso.service';
import { LibroDeActasModel } from 'models/libro-de-actas.models';
import { LibroDeActasService } from 'services/libro-de-actas.service';
import { RecepcionDeActasService } from 'services/recepcion-de-actas.service';

export interface Estado {
    id: string;
    descripcion: string;
}


@Component({
    selector: 'guardar-libro-de-actas',
    templateUrl: './guardar-libro-de-actas.component.html',
    styleUrls: ['./guardar-libro-de-actas.component.scss'],
    providers: [DatePipe]
})
export class GuardarlibroDeActasComponent implements OnInit {

    form: FormGroup;
    selectLegislatura: any;
    arrLegislaturas: any[] = [];
    recepcionDeActas = [];
    recepcionDeActasTemporal = [];
    fileName: string;
    cambioFecha: boolean;
    date = new Date(2020, 1, 1);
    fechaCreacion: any;
    maxDate = new Date();
    cambioDocumento = false;
    loadingIndicator: boolean;
    reorderable: boolean;
    constructor(
        private spinner: NgxSpinnerService,
        private datePipe: DatePipe,
        private formBuilder: FormBuilder,
        private recepcionDeActasService: RecepcionDeActasService,
        private dialogRef: MatDialogRef<TableroDeLibroDeActasComponent>,
        public dialog: MatDialog,
        private libroService: LibroDeActasService,
        private legislaturasService: LegislaturaService,
        @Inject(MAT_DIALOG_DATA) public libro: LibroDeActasModel
    ) { }

    async ngOnInit(): Promise<void> {



        await this.obtenerTiposLegislaturas();
        await this.obtenerRecepcionesDeActas();

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

        // Form reativo
        this.form = this.formBuilder.group({

            legislatura: [{ value: this.libro.legislatura, disabled: false }, Validators.required],
            fechaDeInicio: [{ value: this.libro.fechaDeInicio, disabled: false }, Validators.required],
            fechaDeFin: [{ value: this.libro.fechaDeFin, disabled: false }, Validators.required],

        });

        this.form.get('legislatura').valueChanges.subscribe(val => {
            if (val.length > 0) {
                this.recepcionDeActas = this.recepcionDeActasTemporal;
                let legislatura = this.form.get('legislatura').value;
                let fecIni = this.datePipe.transform(this.form.get('fechaDeInicio').value, 'dd-MM-yyyy');
                let fecFin = this.datePipe.transform(this.form.get('fechaDeFin').value, 'dd-MM-yyyy');

                if (fecIni !== null && fecFin !== null && legislatura.length > 0) {
                    this.recepcionDeActas = this.recepcionDeActas.filter((d) => {
                        return d.fechaCreacionText >= fecIni &&
                            d.fechaCreacionText <= fecFin && d.idLegislatura == legislatura;
                    });
                } else {
                    this.recepcionDeActas = this.recepcionDeActas.filter((d) => {
                        return d.idLegislatura == legislatura;
                    });
                }
            }
        });

        this.form.get('fechaDeInicio').valueChanges.subscribe(val => {
            if (val) {
                console.log('cambio inicio');
                if (val.getTime() > 0) {
                    this.recepcionDeActas = this.recepcionDeActasTemporal;
                    let legislatura = this.form.get('legislatura').value;
                    let fecIni = this.datePipe.transform(this.form.get('fechaDeInicio').value, 'dd-MM-yyyy');
                    let fecFin = this.datePipe.transform(this.form.get('fechaDeFin').value, 'dd-MM-yyyy');


                    if (fecIni !== null && fecFin !== null) {

                        if (fecIni > fecFin) {
                            Swal.fire('Error', 'La fecha de inicio no puede ser mayor a la fecha fin. ', 'error');
                            this.form.controls['fechaDeInicio'].setValue('');

                        } else {
                            console.log(legislatura.length);
                            if (legislatura.length > 0) {
                                console.log('filtro legis');
                                this.recepcionDeActas = this.recepcionDeActas.filter((d) => {
                                    return d.fechaCreacionText >= fecIni &&
                                        d.fechaCreacionText <= fecFin && d.idLegislatura == legislatura;
                                });
                            } else {
                                console.log('filtro fechas');
                                this.recepcionDeActas = this.recepcionDeActas.filter((d) => {
                                    return d.fechaCreacionText >= fecIni &&
                                        d.fechaCreacionText <= fecFin;
                                });
                            }
                        }
                    } else if (fecIni !== null && fecFin === null) {
                        if (legislatura.length > 0) {
                            console.log('filtro legis');
                            this.recepcionDeActas = this.recepcionDeActas.filter((d) => {
                                return d.fechaCreacionText >= fecIni && d.idLegislatura == legislatura;
                            });
                        } else {
                            console.log('filtro fechas');
                            this.recepcionDeActas = this.recepcionDeActas.filter((d) => {
                                return d.fechaCreacionText >= fecIni
                            });
                        }
                    }

                }
            }
        });

        this.form.get('fechaDeFin').valueChanges.subscribe(val => {
            if (val) {
                console.log('cambio fin');
                if (val.getTime() > 0) {
                    this.recepcionDeActas = this.recepcionDeActasTemporal;
                    let legislatura = this.form.get('legislatura').value;
                    let fecIni = this.datePipe.transform(this.form.get('fechaDeInicio').value, 'dd-MM-yyyy');
                    let fecFin = this.datePipe.transform(this.form.get('fechaDeFin').value, 'dd-MM-yyyy');
                    if (fecIni > fecFin) {
                        Swal.fire('Error', 'La fecha de inicio no puede ser mayor a la fecha fin. ', 'error');
                        this.form.controls['fechaDeFin'].setValue('');
                    } else {
                        if (legislatura.length > 0) {

                            this.recepcionDeActas = this.recepcionDeActas.filter((d) => {
                                return d.fechaCreacionText >= fecIni &&
                                    d.fechaCreacionText <= fecFin && d.idLegislatura == legislatura;
                            });
                        } else {

                            this.recepcionDeActas = this.recepcionDeActas.filter((d) => {
                                return d.fechaCreacionText >= fecIni &&
                                    d.fechaCreacionText <= fecFin;
                            });
                        }
                    }

                }
            }
        });
        if (this.libro.id) {
            this.libro.fechaDeInicio = this.datePipe.transform(this.libro.fechaDeInicio, 'dd-MM-yyyy'),
                this.libro.fechaDeInicio = this.datePipe.transform(this.libro.fechaDeFin, 'dd-MM-yyyy'),
                this.selectLegislatura = this.libro.legislatura.id;


        } else {
            // Seteamos la fecha de carga con la fecha actual

            //this.libro.fechaDeInicio = ano + '-' + mes + '-' + dia;
            //this.libro.fechaDeFin = ano + '-' + mes + '-' + dia;         
            this.selectLegislatura = '';

        }

    }

    async guardar(): Promise<void> {


        this.spinner.show();
        let libros = [];
        // Asignamos valores a objeto
        this.libro.legislatura = this.selectLegislatura;
        this.libro.fechaDeInicio = this.form.get('fechaDeInicio').value;
        this.libro.fechaDeFin = this.form.get('fechaDeFin').value;

        this.recepcionDeActas.forEach((row) => {
            if (row.selected) {
                libros.push(row.id);
            }

        });

        if (libros.length === 0) {
            this.spinner.hide();
            Swal.fire('Error', 'Es necesario capturar al menos una acta para guardar el libro de actas.', 'error');
        } else {
            this.libro.recepcion_de_actas_de_sesions = libros;

            if (this.libro.id) {

                // Actualizamos el libro de actas
                this.libroService.actualizarLibroDeActas(this.libro).subscribe((resp: any) => {
                    if (resp) {
                        Swal.fire('Éxito', 'Libro de actas actualizado correctamente.', 'success');
                        this.libro = resp.data;
                        this.spinner.hide();
                        this.cerrar(this.libro);
                    } else {
                        this.spinner.hide();
                        Swal.fire('Error', 'Ocurrió un error al guardar. ' + resp.error.data, 'error');
                    }
                }, err => {
                    this.spinner.hide();
                    Swal.fire('Error', 'Ocurrió un error al guardar.' + err.error.data, 'error');
                });

            } else {
                // Guardamos el libro de actas
                this.libroService.guardarLibroDeActas(this.libro).subscribe((resp: any) => {
                    if (resp) {
                        this.spinner.hide();
                        Swal.fire('Éxito', 'Libro de actas guardado correctamente.', 'success');
                        this.cerrar(this.libro);
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

    async obtenerRecepcionesDeActas(): Promise<void> {
        this.spinner.show();

        const actasTemp: any[] = [];

        // Obtenemos los iniciativas
        this.recepcionDeActasService.obtenerRecepcionesDeActas().subscribe((resp: any) => {

            // Buscamos permisos

            // Si tiene permisos para consultar

            if (resp) {

                for (const ini of resp) {
                    if (this.libro.id) {
                        if (ini.libro_de_actas_de_sesions.length == 0) {
                            let idLegislatura = '';
                            if (ini.legislatura) {
                                idLegislatura = ini.legislatura.id;
                            }
                            actasTemp.push({
                                id: ini.id,
                                fechaCreacion: ini.fechaCreacion,
                                fechaCreacionDate: new Date(ini.fechaCreacion),
                                fechaCreacionText: this.datePipe.transform(ini.fechaCreacion, 'dd-MM-yyyy'),
                                fechaRecepcion: ini.fechaRecepcion,
                                legislatura: ini.legislatura,
                                emisor: ini.emisor,
                                receptor: ini.receptor,
                                estatus: ini.estatus,
                                hora: ini.hora,
                                notas: ini.notas,
                                selected: false,
                                idLegislatura
                            });
                        } else {
                            let idLegislatura = '';
                            if (ini.legislatura) {
                                idLegislatura = ini.legislatura.id;
                            }
                            ini.libro_de_actas_de_sesions.forEach((row) => {
                                if (row.id === this.libro.id) {
                                    actasTemp.push({
                                        id: ini.id,
                                        fechaCreacion: ini.fechaCreacion,
                                        fechaCreacionDate: new Date(ini.fechaCreacion),
                                        fechaCreacionText: this.datePipe.transform(ini.fechaCreacion, 'dd-MM-yyyy'),
                                        fechaRecepcion: ini.fechaRecepcion,
                                        legislatura: ini.legislatura,
                                        emisor: ini.emisor,
                                        receptor: ini.receptor,
                                        estatus: ini.estatus,
                                        hora: ini.hora,
                                        notas: ini.notas,
                                        selected: true,
                                        idLegislatura
                                    });
                                }

                            });

                        }
                    } else {

                        if (ini.libro_de_actas_de_sesions.length == 0) {
                            let idLegislatura = '';
                            if (ini.legislatura) {
                                idLegislatura = ini.legislatura.id;
                            }
                            actasTemp.push({
                                id: ini.id,
                                fechaCreacion: ini.fechaCreacion,
                                fechaCreacionDate: new Date(ini.fechaCreacion),
                                fechaCreacionText: this.datePipe.transform(ini.fechaCreacion, 'dd-MM-yyyy'),
                                fechaRecepcion: ini.fechaRecepcion,
                                legislatura: ini.legislatura,
                                emisor: ini.emisor,
                                receptor: ini.receptor,
                                estatus: ini.estatus,
                                hora: ini.hora,
                                notas: ini.notas,
                                selected: false,
                                idLegislatura
                            });
                        }
                    }
                }

                this.recepcionDeActas = actasTemp;
                this.recepcionDeActasTemporal = actasTemp;
                if (this.libro.id) {
                    this.filtrarTabla();
                }
            }

            this.spinner.hide();
        }, err => {

            this.spinner.hide();
        });
    }

    filtrarTabla(): void {
        this.recepcionDeActas = this.recepcionDeActasTemporal;
        let legislatura = this.form.get('legislatura').value;
        let fecIni = this.datePipe.transform(this.form.get('fechaDeInicio').value, 'dd-MM-yyyy');
        let fecFin = this.datePipe.transform(this.form.get('fechaDeFin').value, 'dd-MM-yyyy');

        if (fecIni !== null && fecFin !== null) {

            if (legislatura.length > 0) {

                this.recepcionDeActas = this.recepcionDeActas.filter((d) => {
                    return d.fechaCreacionText >= fecIni &&
                        d.fechaCreacionText <= fecFin && d.idLegislatura == legislatura;
                });
            } else {

                this.recepcionDeActas = this.recepcionDeActas.filter((d) => {
                    return d.fechaCreacionText >= fecIni &&
                        d.fechaCreacionText <= fecFin;
                });
            }

        }
    }
}
