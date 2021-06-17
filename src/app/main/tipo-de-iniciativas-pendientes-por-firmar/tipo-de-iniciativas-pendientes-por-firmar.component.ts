import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TipoExpedientesModel } from 'models/tipo-expedientes.models';
import { MenuService } from 'services/menu.service';
import { TipoExpedientesService } from 'services/tipo-expedientes.service';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
import { AutorizarService } from 'services/autorizar.service';
import { UsuarioLoginService } from 'services/usuario-login.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { element } from 'protractor';
import { UploadFileService } from 'services/upload.service';
import { resolve } from 'dns';
@Component({
    selector: 'app-tipo-de-iniciativas-pendientes-por-firmar',
    templateUrl: './tipo-de-iniciativas-pendientes-por-firmar.component.html',
    styleUrls: ['./tipo-de-iniciativas-pendientes-por-firmar.component.scss']
})
export class IniciativasPendientesPorFirmarComponent implements OnInit {
    loadingIndicator: boolean;
    reorderable: boolean;
    cargando: boolean;
    documentosPendientes: any;
    documentosPendientesTemp: any;
    public formGroup: FormGroup;
    form: FormGroup;
    optAgregar: boolean;
    optConsultar: boolean;
    optEditar: boolean;
    optEliminar: boolean;
    searchText: string;
    usuario: any;
    certificadoB64: any;
    llaveB64: any;
    constructor(
        private spinner: NgxSpinnerService,
        private formBuilder: FormBuilder,
        public dialog: MatDialog,
        private uploadService: UploadFileService,
        private usuarioLoginService: UsuarioLoginService,
        private autorizarService: AutorizarService
    ) { }

    async ngOnInit(): Promise<void> {
        this.documentosPendientes = [];
        this.documentosPendientesTemp = [];
        this.form = this.formBuilder.group({
            cSubirCertificado: new FormControl('', [Validators.required]),
            cSubirLlave: new FormControl('', [Validators.required]),
            cPassword: new FormControl('', [Validators.required]),

        });
        this.usuario = await this.usuarioLoginService.obtenerUsuario();
        await this.obtenerAutorizacionPorLegislatura();
    }


    async obtenerAutorizacionPorLegislatura(): Promise<[]> {

        return new Promise((resolve) => {
            {
                this.spinner.show();
                this.autorizarService.obtenerAutorizacionesPorEmpleado(this.usuario[0].data.empleado.id).subscribe(
                    (resp: any) => {
                        this.spinner.hide();
                        this.documentosPendientes = resp.filter(
                            (d) => d["estatusAutorizacion"] <= 2 && d["autorizacionesPendientes"] >= 1 && d["idDetalleAutorizacion"] !== ''
                            // (d) => d["estatusAutorizacion"] <= 2
                        )
                        this.documentosPendientesTemp = this.documentosPendientes
                        resolve(resp.filter(
                            (d) => d["estatusAutorizacion"] <= 2 && d["autorizacionesPendientes"] >= 1
                            // (d) => d["estatusAutorizacion"] <= 2
                        ));
                    },
                    (err) => {
                        this.spinner.hide();
                        Swal.fire(
                            "Error",
                            "Ocurrió un error al obtener las autorizaciones por legislatura." +
                            err,
                            "error"
                        );
                        resolve(err);
                    }
                );
            }
        });
    }



    filterDatatable(value): void {
        this.documentosPendientes = this.documentosPendientesTemp;
        // Filtramos tabla
        if (value.target.value === '') {
            this.documentosPendientes = this.documentosPendientesTemp;
        } else {
            const val = value.target.value.toLowerCase();
            const temp = this.documentosPendientes.filter((d) => d.cNombreDocumento.toLowerCase().indexOf(val) !== -1 || !val);
            this.documentosPendientes = temp;
        }


    }

    firmarDocumentos(): void {
        let documentos: any[] = [];
        let filePKCSBase64 = '';

        (<HTMLInputElement>document.getElementById("certificado")).value = this.certificadoB64;
        (<HTMLInputElement>document.getElementById("llave")).value = this.llaveB64;
        (<HTMLInputElement>document.getElementById("password")).value = this.form.get("cPassword").value;
        (<HTMLInputElement>document.getElementById("hashToSign")).value = '';
        try {
            this.spinner.show();
            if (this.documentosPendientes.filter(element => element.Agregar).length === 0) {
                Swal.fire(
                    "Error",
                    "Es necesario seleccionar al menos un documento.",
                    "error"
                );
                this.spinner.hide();
            } else {
                documentos = this.documentosPendientes.filter(element => element.Agregar);
                documentos.forEach(element => {
                    this.autorizarService.autorizarDocumentoPaso2(Number(element.idProcesoApi), this.certificadoB64).subscribe(
                        async (resp: any) => {
                            if (resp.hashBase64) {
                                (<HTMLInputElement>document.getElementById("hashToSign")).value = resp.hashBase64;
                                let btnSing: HTMLElement = document.getElementById("btnSing");
                                btnSing.click();
                                setTimeout(() => {
                                    filePKCSBase64 = (<HTMLInputElement>document.getElementById("signature")).value;
                                    this.autorizarService.autorizarDocumentoPaso3(filePKCSBase64, element.documento.cNombreDocumento, Number(element.idProcesoApi), '111111111111111111111').subscribe(
                                        async (resp: any) => {
                                            if (resp.body.multiSignedMessage_UpdateResponse) {

                                                if (element.estatusAutorizacion === 1) {
                                                    this.autorizarService.atualizarAutorizacionEncabezado({ id: element.id, estatusAutorizacion: 2 }).subscribe(
                                                        async (resp: any) => {
                                                            console.log('actualizo estatus 2');
                                                        },
                                                        (err) => {
                                                            this.spinner.hide();
                                                            Swal.fire(
                                                                "Error",
                                                                "Ocurrió un error al actualizar el encabezado de la autirizacion. Paso 3.2 " + err,
                                                                "error"
                                                            );
                                                        }
                                                    );
                                                }
                                                this.autorizarService.atualizarAutorizacionDetalle({ id: element.idDetalleAutorizacion, firmado: true }).subscribe(
                                                    async (resp: any) => {
                                                        this.autorizarService.obtenerDetalleAutorizacionPorId(element.id).subscribe(
                                                            async (resp: any) => {
                                                                let firmasPendientes = resp.data.filter(item => item['firmado'] === false).length;
                                                                if (firmasPendientes === 0) {
                                                                    this.autorizarService.atualizarAutorizacionEncabezado({ id: element.id, estatusAutorizacion: 3 }).subscribe(
                                                                        async (resp: any) => {
                                                                            console.log('actualizo estatus 3');
                                                                        }
                                                                        ,
                                                                        (err) => {
                                                                            this.spinner.hide();
                                                                            Swal.fire(
                                                                                "Error",
                                                                                "Ocurrió un error al actualizar el encabezado de la autirizacion. Paso 3.2 " + err,
                                                                                "error"
                                                                            );
                                                                        }
                                                                    );

                                                                    this.autorizarService.autorizarDocumentoPaso4(Number(element.idProcesoApi)).subscribe(
                                                                        async (resp: any) => {
                                                                            let idDocumento = await this.upload(resp.body.multiSignedMessage_FinalResponse[0].data, element.documento.cNombreDocumento + '.pdf');
                                                                            if (idDocumento) {
                                                                                this.autorizarService.actualizaPfdDocumento({ id: element.documento.id, documento: idDocumento }).subscribe(async (resp: any) => {
                                                                                    await this.obtenerAutorizacionPorLegislatura();
                                                                                    this.spinner.hide();
                                                                                    Swal.fire(
                                                                                        "Éxito",
                                                                                        "Documento firmado correctamente.",
                                                                                        "success"
                                                                                    );
                                                                                },
                                                                                    (err) => {
                                                                                        this.spinner.hide();
                                                                                        Swal.fire(
                                                                                            "Error",
                                                                                            "Ocurrió un error al finalizar actualizar el documento. Paso 4.2 " + err,
                                                                                            "error"
                                                                                        );
                                                                                    });

                                                                            } else {
                                                                                this.spinner.hide();
                                                                                Swal.fire(
                                                                                    "Error",
                                                                                    "Ocurrió un error subir el documento. Paso 4.1 ",
                                                                                    "error"
                                                                                );
                                                                            }

                                                                        },
                                                                        (err) => {
                                                                            this.spinner.hide();
                                                                            Swal.fire(
                                                                                "Error",
                                                                                "Ocurrió un error al finalizar el firmado del documento. Paso 4.0 " + err,
                                                                                "error"
                                                                            );
                                                                        });

                                                                } else {
                                                                    await this.obtenerAutorizacionPorLegislatura();
                                                                    Swal.fire(
                                                                        "Éxito",
                                                                        "Documento firmado correctamente, faltan por firmar " + firmasPendientes + " integrantes.",
                                                                        "success"
                                                                    );
                                                                    this.spinner.hide();
                                                                }
                                                            });
                                                    },
                                                    (err) => {
                                                        this.spinner.hide();
                                                        Swal.fire(
                                                            "Error",
                                                            "Ocurrió un error al actualizar el detalle de la autirizacion. Paso 3.3 " + err,
                                                            "error"
                                                        );
                                                    }
                                                );
                                            } else {
                                                this.spinner.hide();
                                                Swal.fire(
                                                    "Error",
                                                    "Ocurrió un al actualizar la respuesta. Paso 3.1 ",
                                                    "error"
                                                );
                                            }
                                        },
                                        (err) => {
                                            this.spinner.hide();
                                            Swal.fire(
                                                "Error",
                                                "Ocurrió un error al firmar el documento. Paso 3.0 " + err,
                                                "error"
                                            );
                                        }
                                    );

                                }, 1000);


                            } else {
                                this.spinner.hide();
                                Swal.fire(
                                    "Error",
                                    "Ocurrió un error al generar el hash. Paso 2.1 ",
                                    "error"
                                );

                            }
                        },
                        (err) => {
                            this.spinner.hide();
                            Swal.fire(
                                "Error",
                                "Ocurrió un error al firmar el documento. Paso 2.0 " + err,
                                "error"
                            );
                        }
                    );

                });
            }
        } catch (err) {
            this.spinner.hide();
            Swal.fire(
                "Error",
                "Ocurrió un error al firmar el documento. Paso 1.0 " + err,
                "error"
            );

        }
    }



    async cambioCertificado(event): Promise<void> {
        const file = event.target.files[0];
        this.certificadoB64 = await this.convertirFileBase64(file);
    }
    async cambioLlave(event): Promise<void> {
        const file = event.target.files[0];
        this.llaveB64 = await this.convertirFileBase64(file);

    }

    convertirFileBase64(file: any): Promise<string> {
        return new Promise(async (resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = () => {

                resolve(reader.result.toString().replace('data:application/x-x509-ca-cert;base64,', '').replace('data:application/octet-stream;base64,', ''));

            };
        })
    }

    async upload(fileBase64: any, fileName: string): Promise<string> {
        // Subimos documento
        // const resp = await this.uploadService.uploadFile(this.files[0].data);
        return new Promise(async (resolve) => {
            const resp = await this.uploadService.subirArchivo({ name: fileName }, fileBase64);

            if (resp.error) {
                Swal.fire('Error', 'Ocurrió un error al subir el documento. ' + resp.error.error, 'error');
                resolve('');
            } else {
                // La peticion nos retorna el id del documento y lo seteamos al usuario
                if (resp.data) {
                    resolve(resp.data[0].id);
                } else {
                    Swal.fire('Error', 'Ocurrió un error al subir el documento. ', 'error');
                    resolve('');
                }
            }
        });
    }

}