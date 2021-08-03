import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SesionesModel } from 'models/sesion.models';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActasSesionsService } from 'services/actas-sesions.service';
import { AmazingTimePickerService } from 'amazing-time-picker';
import { IniciativasService } from 'services/iniciativas.service';
import { LegislaturaService } from 'services/legislaturas.service';
import Swal from 'sweetalert2';
import { SesionesComponent } from '../sesiones.component';
import { DocumentosModel } from 'models/documento.models';
import { ParametrosService } from 'services/parametros.service';
import { GuardarDocumentosComponent } from 'app/main/tablero-de-documentos/guardar-documentos/guardar-documentos.component';
import { ClasficacionDeDocumentosComponent } from 'app/main/tablero-de-documentos/clasficacion-de-documentos/clasficacion-de-documentos.component';
import { DocumentosService } from 'services/documentos.service';
import { RecepcionDeActasService } from 'services/recepcion-de-actas.service';
import { RecepcionDeActasModel } from 'models/recepcion-de-actas.models';

export interface Estado {
    id: string;
    descripcion: string;
}
@Component({
    selector: 'app-guardar-sesiones',
    templateUrl: './guardar-sesiones.component.html',
    styleUrls: ['./guardar-sesiones.component.scss']
})
export class GuardarSesionesComponent implements OnInit {
    @ViewChild('imagenEditar', { static: false }) imagenEditar;

    form: FormGroup;
    arrTipo: any[] = [];
    tipoSesion: Estado[] = [];
    selectedComision: any;
    selectedLegislatura: any;
    selectedSesion: any;
    legislatura: any[] = [];
    documentos: DocumentosModel = new DocumentosModel();
    fileOrdenDelDia = '';
    fileListaDeAsistencia = '';
    fileActaDeSesion = '';
    recepcion: RecepcionDeActasModel = new RecepcionDeActasModel();
    constructor(
        private spinner: NgxSpinnerService,
        private parametros: ParametrosService,
        private formBuilder: FormBuilder,
        private legislaturaService: LegislaturaService,
        private dialogRef: MatDialogRef<SesionesComponent>,
        public dialog: MatDialog,
        private documentoService: DocumentosService,
        private actasSesionsService: ActasSesionsService,
        private iniciativaService: IniciativasService,
        private atp: AmazingTimePickerService,
        private recepcionDeActasService: RecepcionDeActasService,
        @Inject(MAT_DIALOG_DATA) public sesion: SesionesModel
    ) { }

    async ngOnInit(): Promise<void> {
        this.spinner.show();
        // Form reactivo
        if (this.sesion.ordenDelDia !== undefined) {
            this.fileOrdenDelDia = this.sesion.ordenDelDia.cNombreDocumento;
        } else {
            this.fileOrdenDelDia = "";
        }

        if (this.sesion.listaDeAsistencia !== undefined) {
            this.fileListaDeAsistencia = this.sesion.listaDeAsistencia.cNombreDocumento;
        } else {
            this.fileListaDeAsistencia = "";
        }

        if (this.sesion.actasSesion !== undefined) {
            this.fileActaDeSesion = this.sesion.actasSesion.cNombreDocumento;
        } else {
            this.fileActaDeSesion = "";
        }

        this.tipoSesion = [];
        this.tipoSesion.push({
            id: '001',
            descripcion: 'Ordinaria'
        });
        this.tipoSesion.push({
            id: '002',
            descripcion: 'Extraordinaria'
        });
        this.tipoSesion.push({
            id: '003',
            descripcion: 'Especial'
        });
        this.tipoSesion.push({
            id: '004',
            descripcion: 'Informativas'
        });
        this.tipoSesion.push({
            id: '005',
            descripcion: 'Asambleas legislativas'
        });

        if (this.sesion.id) {
            this.sesion.fechaSesion =
                moment(this.sesion.fechaSesion).format('YYYY-MM-DD') + "T16:00:00.000Z";
            this.sesion.horaSesion =
                moment(this.sesion.horaSesion, 'h:mm').format('HH:mm');
            if (this.sesion.legislatura) {
                this.selectedLegislatura = this.sesion.legislatura.id;
            } else {
                this.selectedLegislatura = '';
            }
            this.selectedSesion = this.sesion.tipoSesion;
        } else {
            //this.sesion.fechaSesion = moment().format('YYYY-MM-DD');
            //this.sesion.horaSesion = moment('24/12/2019 00:10:00', "DD MM YYYY hh:mm:ss").format('HH:mm');
        }

        this.form = this.formBuilder.group({
            id: [{ value: this.sesion.id, disabled: true }],
            legislatura: [{ value: this.sesion.legislatura }, [Validators.required]],
            tipoSesion: [{ value: this.tipoSesion }, [Validators.required]],
            fechaSesion: [{ value: this.sesion.fechaSesion, disabled: false }, [Validators.required]],
            horaSesion: [{ value: this.sesion.horaSesion, disabled: false }, [Validators.required]],
        });


        await this.obtenerLegislatura();
        await this.obtenerTiposIniciativas();

        this.spinner.hide();
    }

    async guardar(): Promise<void> {
        this.spinner.show();

        let legislatura;
        let tipoSesion;
        let fechaSesion;
        let hora;
        let horaSesion;

        // Guardamos dependencia
        this.sesion.legislatura = this.selectedLegislatura;
        this.sesion.tipoSesion = this.form.get('tipoSesion').value;;
        this.sesion.fechaSesion = moment(this.form.get('fechaSesion').value).format('YYYY-MM-DD');
        hora = this.form.get('horaSesion').value;
        this.sesion.horaSesion = hora + ':00.000';

        if (this.sesion.ordenDelDia) {
            this.sesion.ordenDelDia = this.sesion.ordenDelDia.id
        }
        if (this.sesion.listaDeAsistencia) {
            this.sesion.listaDeAsistencia = this.sesion.listaDeAsistencia.id
        }
        if (this.sesion.actasSesion) {
            this.sesion.actasSesion = this.sesion.actasSesion.id
        }


        // Asignamos valores a objeto
        if (this.sesion.id) {
            this.actasSesionsService.actualizarActasSesions(this.sesion).subscribe((resp: any) => {
                if (resp) {
                    this.sesion = resp.data


                    if (this.sesion.recepcion_de_actas_de_sesion) {
                        Swal.fire('Éxito', 'Sesión actualizada correctamente.', 'success');
                        this.cerrar(this.sesion);

                    } else {

                        this.recepcion.legislatura = this.selectedLegislatura;
                        this.recepcion.acta_sesion = this.sesion.id;
                        this.recepcion.emisor = [];
                        this.recepcion.receptor = [];
                        this.recepcion.fechaRecepcion = moment().format('YYYY-MM-DD');
                        this.recepcion.estatus = 'Pendiente';
                        this.recepcion.notas = '';
                        this.recepcionDeActasService.guardarRecepcionDeActa(this.recepcion).subscribe((resp: any) => {

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


                } else {
                    this.spinner.hide();
                    Swal.fire('Error', 'Ocurrió un error al guardar. ' + resp.error.data, 'error');
                }
            }, err => {
                console.log(err);
                this.spinner.hide();
                Swal.fire('Error', 'Ocurrió un error al guardar.' + err.error.data, 'error');
            });
        } else {
            this.actasSesionsService.guardarActasSesions(this.sesion).subscribe((resp: any) => {
                if (resp) {
                    this.sesion = resp.data
                    Swal.fire('Éxito', 'Sesión guardada correctamente.', 'success');

                    if (this.sesion.actasSesion && this.sesion.listaDeAsistencia && this.sesion.ordenDelDia) {

                        this.recepcion.legislatura = this.selectedLegislatura;
                        this.recepcion.acta_sesion = this.sesion.id;
                        this.recepcion.emisor = [];
                        this.recepcion.receptor = [];
                        this.recepcion.fechaRecepcion = moment().format('YYYY-MM-DD');
                        this.recepcion.estatus = 'Pendiente';
                        this.recepcion.notas = '';

                        // Guardamos el recepcion de actas
                        this.recepcionDeActasService.guardarRecepcionDeActa(this.recepcion).subscribe((resp: any) => {
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

                    this.cerrar(this.sesion);
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

    async obtenerTiposIniciativas(): Promise<void> {
        return new Promise(async (resolve) => {
            {
                // Obtenemos tipos

                await this.iniciativaService.obtenerTiposIniciativas().subscribe(
                    (resp: any) => {
                        this.arrTipo = resp;

                        resolve(resp);
                    },
                    (err) => {
                        Swal.fire(
                            "Error",
                            "Ocurrió un error obtener los tipos de iniciativas." + err,
                            "error"
                        );

                    }
                );
            }
        });
    }

    async obtenerLegislatura(): Promise<void> {
        return new Promise((resolve) => {
            {
                this.legislaturaService.obtenerLegislatura().subscribe(
                    (resp: any) => {
                        for (const legislatura of resp) {
                            if (legislatura.bActual && legislatura.bActivo) {
                                this.legislatura.push(legislatura);
                            }
                        }
                        resolve(resp);

                        //seleccionamos legislatura por default
                        this.selectedLegislatura = this.legislatura[0].id;
                    },
                    (err) => {
                        Swal.fire(
                            "Error",
                            "Ocurrió un error al obtener las legislatura." +
                            err,
                            "error"
                        );
                        resolve(err);
                    }
                );
            }
        });
    }

    cerrar(ent): void {
        if (ent) {
            this.dialogRef.close(ent);
        } else {
            this.dialogRef.close();
        }
    }

    open() {
        const amazingTimePicker = this.atp.open();
        amazingTimePicker.afterClose().subscribe(time => {

        })
    }

    async cargaClasificacionDocumento(tipo: string): Promise<void> {

        //Creamos nuevo modelo de documentos y asignamos parametros
        this.documentos = new DocumentosModel();
        let legislaturaFolio: any;
        this.documentos.bActivo = true;
        let parametrosSSP001 = await this.obtenerParametros("SSP-001");
        /* Parametros administrados */
        let tipoDocumento = parametrosSSP001.filter(
            (d) =>
                d["cParametroAdministrado"] === "SSP-001-Tipo-de-Documento"
        );
        let tipoExpediente = parametrosSSP001.filter(
            (d) =>
                d["cParametroAdministrado"] === "SSP-001-Tipo-de-Expediente"
        );
        let tipoInformacion = parametrosSSP001.filter(
            (d) =>
                d["cParametroAdministrado"] === "SSP-001-Tipo-de-Informacion"
        );

        this.documentos.tipo_de_documento = tipoDocumento[0]["cValor"];
        this.documentos.tipo_de_expediente = tipoExpediente[0]["cValor"];
        this.documentos.visibilidade = tipoInformacion[0]["cValor"];
        this.documentos.formulario = 'Tablero de sesiones';
        this.documentos.legislatura = this.selectedLegislatura;
        if (this.sesion.iniciativas) {
            this.documentos.folioExpediente = this.sesion.iniciativas[0].folioExpediente
        } else {
            this.documentos.folioExpediente = 0;

        }


        const dialogRef = this.dialog.open(GuardarDocumentosComponent, {
            width: '60%',
            height: '80%',
            disableClose: true,
            data: this.documentos,
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                if (result.documento) {
                    this.clasificarDocAnex(result, tipo);
                }
            }
        });
    }

    async clasificarDocAnex(result: any, tipo: string): Promise<void> {
        this.spinner.show();
        let descripcion: string;
        let hora;
        hora = this.form.get('horaSesion').value;
        this.documentos.bActivo = true;

        this.documentos = result;
        if (tipo === '1') {
            descripcion = 'Orden del día';
        } else if (tipo === '2') {
            descripcion = 'Lista de asistencia';
        } else {
            descripcion = 'Acta de sesión';
        }

        this.documentos.metacatalogos = [
            {
                cDescripcionMetacatalogo: "Tipo de sesión",
                bOligatorio: true,
                cTipoMetacatalogo: "Texto",
                text: this.selectedSesion,
            }, {
                cDescripcionMetacatalogo: "Fecha de sesión",
                bOligatorio: true,
                cTipoMetacatalogo: "Texto",
                text: moment(this.documentos.fechaCarga.replace('T16:00:00.000Z', '')).format('DD/MM/YYYY'),
            },
            {
                cDescripcionMetacatalogo: "Hora de sesión",
                bOligatorio: true,
                cTipoMetacatalogo: "Texto",
                text: hora,
            },
            {
                cDescripcionMetacatalogo: "Documento",
                bOligatorio: true,
                cTipoMetacatalogo: "Texto",
                text: descripcion,
            },
        ];
        if (this.sesion.id) {
            if (tipo === '1') {
                this.documentos.ordenDelDia = this.sesion.id;
                this.fileOrdenDelDia = this.documentos.cNombreDocumento;
            } else if (tipo === '2') {
                this.documentos.listaDeAsistencia = this.sesion.id;
                this.fileListaDeAsistencia = this.documentos.cNombreDocumento;
            } else {
                this.documentos.actasSesion = this.sesion.id;
                this.fileActaDeSesion = this.documentos.cNombreDocumento;
            }

        }
        this.documentoService
            .actualizarDocumentosSinVersion(this.documentos)
            .subscribe(
                (resp: any) => {
                    if (resp.data) {
                        this.documentos = resp.data;
                        let documentoId: string = this.documentos.id;
                        this.documentos.iniciativas = true;
                        // this.documentos.fechaCreacion = moment(this.documentos.fechaCreacion).format('DD/MM/YYYY') + 'T16:00:00.000Z';
                        // this.documentos.fechaCarga = moment(this.documentos.fechaCarga).format('DD/MM/YYYY') + 'T16:00:00.000Z';

                        //this.documentosTemp.fechaCreacion = fechaActual;
                        //this.documentosTemp.fechaCarga = fechaActual;

                        this.spinner.hide();

                        const dialogRef = this.dialog.open(
                            ClasficacionDeDocumentosComponent,
                            {
                                width: "100%",
                                height: "90%",
                                disableClose: true,
                                data: this.documentos,
                            }
                        );

                        // tslint:disable-next-line: no-shadowed-variable
                        dialogRef.afterClosed().subscribe((result) => {
                            if (tipo === '1') {
                                this.sesion.ordenDelDia = this.documentos;
                                this.fileOrdenDelDia = this.documentos.cNombreDocumento;
                            } else if (tipo === '2') {
                                this.sesion.listaDeAsistencia = this.documentos;
                                this.fileListaDeAsistencia = this.documentos.cNombreDocumento;
                            } else {
                                this.sesion.actasSesion = this.documentos;
                                this.fileActaDeSesion = this.documentos.cNombreDocumento;
                            }
                            if (result == "0") {
                                this.cerrar("");
                            }
                        });
                    } else {
                        this.spinner.hide();
                        Swal.fire(
                            "Error",
                            "Ocurrió un error al guardar. " + resp.error.data,
                            "error"
                        );
                    }
                },
                (err) => {
                    this.spinner.hide();
                    console.log(err);
                    Swal.fire(
                        "Error",
                        "Ocurrió un error al guardar." + err.error.data,
                        "error"
                    );
                }
            );
    }

    async editarDocumento(documento: DocumentosModel, tipo: string): Promise<void> {

        if (!this.sesion.id) {

            documento.fechaCreacion = moment(documento.fechaCreacion).format('YYYY-MM-DD');
        } else {
            documento.fechaCreacion = documento.fechaCreacion.replace('T16:00:00.000Z', '');
        }

        let parametrosSSP001 = await this.obtenerParametros("SSP-001");
        documento.legislatura = this.selectedLegislatura;
        let tipoDocumento = parametrosSSP001.filter(
            (d) =>
                d["cParametroAdministrado"] === "SSP-001-Tipo-de-Documento"
        );
        let tipoExpediente = parametrosSSP001.filter(
            (d) =>
                d["cParametroAdministrado"] === "SSP-001-Tipo-de-Expediente"
        );
        let tipoInformacion = parametrosSSP001.filter(
            (d) =>
                d["cParametroAdministrado"] ===
                "SSP-001-Tipo-de-Informacion"
        );
        documento.tipo_de_documento = tipoDocumento[0]["cValor"];
        //documento.tipo_de_documento = '5f839b713ccdf563ac6ba096';
        documento.tipo_de_expediente = tipoExpediente[0]["cValor"];
        documento.visibilidade = tipoInformacion[0]["cValor"];
        documento.disabled = false;
        if (tipo === '1') {
            documento.ordenDelDia = this.sesion.id;
            // this.fileOrdenDelDia = this.documentos.cNombreDocumento;
        } else if (tipo === '2') {
            documento.listaDeAsistencia = this.sesion.id;
            // this.fileListaDeAsistencia = this.documentos.cNombreDocumento;
        } else {
            documento.actasSesion = this.sesion.id;
            // this.fileActaDeSesion = this.documentos.cNombreDocumento;
        }

        // Abrimos modal de guardar perfil
        const dialogRef = this.dialog.open(GuardarDocumentosComponent, {
            width: '60%',
            height: '80%',
            disableClose: true,
            data: documento,
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                if (tipo === '1') {
                    // documento.ordenDelDia = this.sesion.id;
                    this.fileOrdenDelDia = this.documentos.cNombreDocumento;
                } else if (tipo === '2') {
                    // documento.listaDeAsistencia = this.sesion.id;
                    this.fileListaDeAsistencia = this.documentos.cNombreDocumento;
                } else {
                    //documento.actasSesion = this.sesion.id;
                    this.fileActaDeSesion = this.documentos.cNombreDocumento;
                }
                if (result.documento) {
                    this.clasificarDocAnex(result, tipo);
                }
            }
        });
    }

    async obtenerParametros(parametro: string): Promise<[]> {
        return new Promise((resolve) => {
            {
                this.parametros.obtenerParametros(parametro).subscribe(
                    (resp: any) => {
                        resolve(resp);
                    },
                    (err) => {
                        Swal.fire(
                            "Error",
                            "Ocurrió un error al obtener los parametros." +
                            err,
                            "error"
                        );
                        resolve(err);
                    }
                );
            }
        });
    }

}
