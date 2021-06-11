import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {
    MatDialog,
    MatDialogRef,
    MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { DocumentosModel } from "models/documento.models";
import { DocumentosService } from "services/documentos.service";
import { UsuariosService } from "services/usuarios.service";
import Swal from "sweetalert2";
import { TableroDeDocumentosComponent } from "../tablero-de-documentos.component";
import { DatePipe } from "@angular/common";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { MatChipInputEvent } from "@angular/material/chips";
import { MenuService } from "services/menu.service";
import { TipoExpedientesService } from "services/tipo-expedientes.service";
import { TrazabilidadService } from "services/trazabilidad.service";
import { HistorialDeVersionamientoComponent } from "./historial-de-versionamiento/historial-de-versionamiento.component";
import { LinkPublicoComponent } from "./link-publico/link-publico.component";
import { LegislaturaService } from "services/legislaturas.service";
import { IniciativasService } from "services/iniciativas.service";
import * as moment from "moment";
import { NgxSpinnerService } from "ngx-spinner";
import { AutorizarService } from "services/autorizar.service";
import { ParametrosService } from "services/parametros.service";
import { FirmasPorEtapaService } from "services/configuracion-de-firmas-por-etapa.service";
export interface Metacatalogos {
    name: string;
}
@Component({
    selector: "app-clasficacion-de-documentos",
    templateUrl: "./clasficacion-de-documentos.component.html",
    styleUrls: ["./clasficacion-de-documentos.component.scss"],
    providers: [DatePipe],
})
export class ClasficacionDeDocumentosComponent implements OnInit {
    pdfSrc: any;
    form: FormGroup;
    selectedEntes: any;
    selectedSecretaria: any;
    selectedDireccion: any;
    selectedDepartamento: any;
    selectedInformacion: any;
    selectedLegislaturas: any;
    arrEntes: any[];
    arrSecretarias: [];
    arrDirecciones: any[];
    arrDireccionesFilter: any[];
    arrDepartamentos: any[];
    arrDepartamentosFilter: any[];
    arrEntesFilter: any[];
    arrInformacion: any[];
    arrMetacatalogos: any[];
    arrExpediente: any[];
    arrLegislaturas: any[];
    selectedExpediente: "";
    visible = true;
    selectable = true;
    removable = true;
    addOnBlur = true;
    trazabilidad = false;
    ocultarPreview = false;
    disabledGuardar = false;
    disableFolioExpediente = false;
    entroVersionamiento = false;
    estatusIniciativa = "";
    version: any;
    fechaCreacionView: string;
    fechaCargaView: string;
    descriptionTipoDocumento: 'Acta';
    autorizacionPendiente: boolean;
    turnarDocumento: boolean;
    readonly separatorKeysCodes: number[] = [ENTER, COMMA];
    meta: Metacatalogos[] = [];

    // ---------- Tabla de Prueba - Trazabilidad
    hoy = [];
    ayer = [];
    semanaActual = [];
    semanaPasada = [];
    semanaAntepasada = [];
    mesPasado = [];
    masAntiguo = [];
    loadingIndicator = true;
    reorderable = true;
    documentoSinClasificar = false;
    columns = [
        { name: "Fecha" },
        { name: "Hora" },
        { name: "Usuario" },
        { name: "Movimiento" },
    ];

    constructor(
        private dialogRef: MatDialogRef<TableroDeDocumentosComponent>,
        private formBuilder: FormBuilder,
        private spinner: NgxSpinnerService,
        private documentoService: DocumentosService,
        private datePipe: DatePipe,
        private menuService: MenuService,
        private legislaturaService: LegislaturaService,
        private trazabilidadService: TrazabilidadService,
        private autorizarService: AutorizarService,
        private tipoExpedientesService: TipoExpedientesService,
        public dialog: MatDialog,
        private iniciativaService: IniciativasService,
        private usuariosService: UsuariosService,
        private parametros: ParametrosService,
        private firmas: FirmasPorEtapaService,
        @Inject(MAT_DIALOG_DATA) public documento,
        @Inject(MAT_DIALOG_DATA) public nuevo
    ) {
        // ---------- Tabla de Prueba - Trazabilidad
    }

    async ngOnInit(): Promise<void> {
        this.autorizacionPendiente = false;
        this.turnarDocumento = false;
        this.spinner.show();
        let autorizaciones: any;
        this.documento.usuario = this.menuService.usuario;
        this.version = this.documento.version;
        let cFolioExpediente = "";
        let cLegislatura = "";
        this.arrMetacatalogos = [];
        let folioExpedienteRequerido = [];
        await this.obtenerLegislaturas();
        await this.obtenerTiposExpedientes();

        console.log(this.documento);

        if (!this.documento.iniciativas) {
            if (this.documento.tipo_de_documento.id) {
                this.trazabilidad = false;
                this.arrMetacatalogos = this.menuService.tipoDocumentos.find(
                    (tipoDocumento) =>
                        tipoDocumento.id === this.documento.tipo_de_documento.id
                ).metacatalogos;

                if (this.documento.ente !== undefined) {
                    this.obtenerDocumento(
                        this.documento.id,
                        this.documento.usuario
                    );
                } else {
                }
            } else {
                this.trazabilidad = true;
                this.arrMetacatalogos = this.menuService.tipoDocumentos.find(
                    (tipoDocumento) =>
                        tipoDocumento.id === this.documento.tipo_de_documento
                ).metacatalogos;

                if (!this.documento.tipo_de_documento.id) {
                    this.documento.tipo_de_documento = this.menuService.tipoDocumentos.find(
                        (tipoDocumento) =>
                            tipoDocumento.id ===
                            this.documento.tipo_de_documento
                    );
                }
            }
        } else {

            autorizaciones = await this.obtenerAutorizacionPorDocumento();
            // Bloqueamos el boton de autorizar si tiene autorizaciones pendientes por realizar.
            autorizaciones.forEach(element => {
                console.log(element);
                if (element.estatusAutorizacion === 1 || element.estatusAutorizacion === 2) {
                    this.autorizacionPendiente = true;
                    this.turnarDocumento = true;
                } else if (element.estatusAutorizacion === 3) {
                    this.autorizacionPendiente = true;
                    this.turnarDocumento = false;
                }

            });
            this.estatusIniciativa = this.documento.estatus;
            this.arrMetacatalogos = this.documento.metacatalogos;
            this.documento.disabled = true;
        }
        // words2 = [{ value: 'word1' }, { value: 'word2' }, { value: 'word3' }, { value: '' }];

        this.arrSecretarias = [];
        this.selectedEntes = "";
        this.selectedSecretaria = "";
        this.selectedDireccion = "";
        this.selectedDepartamento = "";
        this.selectedInformacion = "";
        this.selectedLegislaturas = "";

        this.arrInformacion = this.menuService.tipoInformacion;

        this.documento.version = parseFloat(this.documento.version).toFixed(1);

        if (
            !this.documento.legislatura &&
            !this.documento.expediente &&
            !this.documento.folioExpediente
        ) {
            for (const i in this.arrMetacatalogos) {
                this.arrMetacatalogos[i].text = "";
                // this.documentoSinClasificar = true;
            }
        }
        if (!this.documento.iniciativas) {
            if (this.documento.metacatalogos) {
                // this.arrMetacatalogos = this.documento.metacatalogos;
                // tslint:disable-next-line: forin
                for (const i in this.arrMetacatalogos) {
                    this.arrMetacatalogos[i].text = "";
                    const filtro = this.documento.metacatalogos.find(
                        (meta) =>
                            meta.cDescripcionMetacatalogo ===
                            this.arrMetacatalogos[i].cDescripcionMetacatalogo
                    );
                    if (filtro) {
                        this.arrMetacatalogos[i].text = filtro.text;
                    }
                }
            } else {
                // tslint:disable-next-line: forin
            }
        }

        // Seteamos valores
        if (this.documento.ente) {
            this.selectedEntes = this.documento.ente.id;
        }
        // Seteamos valores
        if (this.documento.secretaria) {
            this.selectedSecretaria = this.documento.secretaria.id;
        }
        // Seteamos valores
        if (this.documento.departamento) {
            this.selectedDepartamento = this.documento.departamento.id;
        }
        // Seteamos valores
        if (this.documento.tipo_de_expediente) {
            this.selectedExpediente = this.documento.tipo_de_expediente.id;
        }

        // Seteamos valores
        if (this.documento.direccione) {
            this.selectedDireccion = this.documento.direccione.id;
        }
        // Seteamos valores
        if (this.documento.visibilidade) {
            this.selectedInformacion = this.documento.visibilidade.id;
        }

        // Seteamos valores
        if (this.documento.legislatura) {
            this.selectedLegislaturas = this.documento.legislatura.id;
            cLegislatura = this.documento.legislatura.id;
        }

        if (this.documento.folioExpediente == "") {
            this.selectedLegislaturas = this.documento.legislatura.id;
        } else {
            cFolioExpediente = this.documento.folioExpediente;
        }

        if (this.documento.formulario || this.documento.disabled) {
            this.disableFolioExpediente = true;
        }

        if (this.documento.tipo_de_documento) {
            this.descriptionTipoDocumento = this.documento.tipo_de_documento.cDescripcionTipoDocumento;
            if (this.documento.tipo_de_documento.cDescripcionTipoDocumento !== 'Acta') {
                folioExpedienteRequerido = [Validators.required];
            }

        }



        this.form = this.formBuilder.group({
            // entes: [{ value: this.documento.ente, disabled: this.documento.disabled }],
            // secretarias: [{ value: this.documento.secretaria, disabled: this.documento.disabled }, [Validators.required]],
            legislatura: [
                {
                    value: this.documento.legislatura,
                    disabled: this.documento.disabled,
                },
                [Validators.required],
            ],
            expediente: [
                {
                    value: this.documento.tipo_de_expediente,
                    disabled: this.documento.disabled,
                },
                [Validators.required],
            ],
            // direcciones: [{ value: this.documento.direccione, disabled: this.documento.disabled }, [Validators.required]],
            // departamentos: [{ value: this.documento.departamento, disabled: this.documento.disabled }, [Validators.required]],
            folioExpediente: [
                {
                    value: this.documento.folioExpediente,
                    disabled: this.disableFolioExpediente,
                },
                folioExpedienteRequerido,
            ],
            informacion: [{ value: this.documento.visibilidade.cDescripcionVisibilidad, disabled: this.documento.disabled }, [Validators.required]]
            //   imagen        : [this.usuario.cPassword,[Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
        });

        // Obtenemos las entes
        // await this.obtenerEntes();

        this.documento.fechaCarga = this.documento.fechaCarga.replace(
            "T16:00:00.000Z",
            ""
        );
        this.documento.fechaCreacion = this.documento.fechaCreacion.replace(
            "T16:00:00.000Z",
            ""
        );

        this.fechaCreacionView = this.datePipe.transform(
            this.documento.fechaCreacion,
            "dd/MM/yyyy"
        );
        this.fechaCargaView = this.datePipe.transform(
            this.documento.fechaCarga,
            "dd/MM/yyyy"
        );

        /*  // Si el valor cambia filtramos el resultado
          this.form.get('secretarias').valueChanges.subscribe(val => {
  
              if (val.length > 0) {
                  if (this.documento.disabled !== true) {
                      this.form.controls['direcciones'].enable();
                  }
                  if (this.arrDireccionesFilter) {
                      this.arrDirecciones = this.arrDireccionesFilter.filter(item => item['secretariaId'] === val);
                  }
                  this.selectedDepartamento = '';
              }
          });
  
          // Si el valor cambia filtramos el resultado
          this.form.get('direcciones').valueChanges.subscribe(val => {
  
              if (val.length > 0) {
                  if (this.documento.disabled !== true) {
                      this.form.controls['departamentos'].enable();
                  }
  
                  if (this.arrDepartamentosFilter) {
                      this.arrDepartamentos = this.arrDepartamentosFilter.filter(item => item['direccionId'] === val);
                  }
              }
          });
   */
        // Si el valor cambia filtramos el resultado
        this.form.get("legislatura").valueChanges.subscribe((val) => {
            if (val) {
                if (val.length > 0) {
                    if (this.arrLegislaturas) {
                        if (cLegislatura == val) {
                            this.form.controls["folioExpediente"].setValue(
                                cFolioExpediente
                            );
                        } else {

                            if (
                                this.documento.formulario ||
                                this.documento.disabled
                            ) {
                                let arrFolioExpediente = this.arrLegislaturas.filter(
                                    (item) => item["id"] === val
                                );

                                this.form.controls["folioExpediente"].setValue(
                                    arrFolioExpediente[0].cLegislatura +
                                    "-" +
                                    Number(
                                        arrFolioExpediente[0].documentos + 1
                                    )
                                );
                            }
                        }
                    }
                }
            }
        });

        // Si el usuario trae id entonces vamos a editar por lo que ponemos enabled los select
        /*  if (this.documento.id && this.documento.id.length > 0) {
  
              if (this.selectedSecretaria.length > 0 && this.documento.disabled !== true) {
  
                  this.form.controls['direcciones'].enable();
              }
  
              if (this.selectedDepartamento.length > 0 && this.documento.disabled !== true) {
                  this.form.controls['departamentos'].enable();
              }
          }
          */
        if (this.documento.disabled === true) {
            await this.descargarDocumentoClasificacion();
        } else {
            await this.descargarDocumento();
        }
        this.spinner.hide();
    }

    obtenerTiposExpedientes(): void {
        // Obtenemos los documentos
        this.tipoExpedientesService.obtenerTipoExpedientes().subscribe(
            (resp: any) => {
                this.arrExpediente = resp;

                if (this.arrExpediente) {

                    if (this.documento.tipo_de_documento.cDescripcionTipoDocumento.toLowerCase()) {
                        this.arrExpediente = this.arrExpediente.filter((d) => d.descripcionTiposDocumentos.toLowerCase().indexOf(this.documento.tipo_de_documento.cDescripcionTipoDocumento.toLowerCase()) !== -1);
                    }
                }

            },
            (err) => {
                Swal.fire(
                    "Error",
                    "Ocurrió un error obtener los tipos de expedientes." + err,
                    "error"
                );
            }
        );
    }

    cerrar(retult: boolean): void {
        this.form.reset();
        this.dialogRef.close(retult);
    }
    cerrarIniciativa(retult: string): void {
        this.form.reset();
        this.dialogRef.close(retult);
    }

    async obtenerDocumento(
        idDocumento: string,
        usuario: string
    ): Promise<void> {
        // Obtenemos los documentos
        this.documentoService.obtenerDocumento(idDocumento, usuario).subscribe(
            (resp: any) => { },
            (err) => {
                Swal.fire(
                    "Error",
                    "Ocurrió un error obtener el documento." + err,
                    "error"
                );
            }
        );
    }

    async descargarDocumento(): Promise<string> {
        return new Promise(async (resolve) => {
            {
                // Descargamos el documento
                await this.documentoService
                    .dowloadDocument(
                        this.documento.documento.hash +
                        this.documento.documento.ext,
                        this.documento.id,
                        this.menuService.usuario,
                        this.documento.cNombreDocumento
                    )
                    .subscribe(
                        (resp: any) => {
                            const source =
                                "data:application/octet-stream;base64," +
                                resp.data;
                            this.pdfSrc = source;
                            resolve("1");
                        },
                        (err) => {
                            if (err.error.data) {
                                Swal.fire(
                                    "Error",
                                    "Ocurrió un error al descargar el documento." +
                                    err.error.data,
                                    "error"
                                );
                                resolve("0");
                            }
                        }
                    );
            }
        });
    }

    async descargarDocumentoClasificacion(): Promise<string> {
        return new Promise(async (resolve) => {
            {
                // Descargamos el documento
                await this.documentoService
                    .dowloadDocumentClasificacion(
                        this.documento.documento.hash +
                        this.documento.documento.ext,
                        this.documento.id,
                        this.menuService.usuario,
                        this.documento.cNombreDocumento
                    )
                    .subscribe(
                        (resp: any) => {
                            const source =
                                "data:application/octet-stream;base64," +
                                resp.data;
                            this.pdfSrc = source;
                            resolve("1");
                        },
                        (err) => {
                            if (err.error.data) {
                                Swal.fire(
                                    "Error",
                                    "Ocurrió un error al descargar el documento." +
                                    err.error.data,
                                    "error"
                                );
                                resolve("0");
                            }
                        }
                    );
            }
        });
    }
    convertFile(buf: any): string {
        // Convertimos el resultado en binstring
        const binstr = Array.prototype.map
            .call(buf, (ch: number) => String.fromCharCode(ch))
            .join("");
        return btoa(binstr);
    }

    async obtenerSecretarias(): Promise<void> {
        // Obtenemos secretarias

        await this.usuariosService.obtenerSecretarias().subscribe(
            (resp: any) => {
                this.arrSecretarias = resp;
            },
            (err) => {
                Swal.fire(
                    "Error",
                    "Ocurrió un error obtener las secretarias." + err,
                    "error"
                );
            }
        );
    }
    async obtenerLegislaturas(): Promise<void> {
        // Obtenemos secretarias

        await this.legislaturaService.obtenerLegislatura().subscribe(
            (resp: any) => {

                this.arrLegislaturas = resp;
            },
            (err) => {
                Swal.fire(
                    "Error",
                    "Ocurrió un error obtener las legislaturas." + err,
                    "error"
                );
            }
        );
    }
    async obtenerDirecciones(): Promise<void> {
        // Obtenemos direcciones
        await this.usuariosService.obtenerDirecciones().subscribe(
            (resp: any) => {
                this.arrDirecciones = resp;
                this.arrDireccionesFilter = resp;

                // Si tenemos informacion ya guardada filtramos
                if (this.selectedSecretaria) {
                    this.arrDirecciones = this.arrDireccionesFilter.filter(
                        (item) =>
                            item["secretariaId"] === this.selectedSecretaria
                    );
                }
            },
            (err) => {
                Swal.fire(
                    "Error",
                    "Ocurrió un error obtener las direcciones." + err,
                    "error"
                );
            }
        );
    }

    async obtenerDepartamentos(): Promise<void> {
        // Obtenemos departamentos
        this.usuariosService.obtenerDepartamentos().subscribe(
            (resp: any) => {
                this.arrDepartamentos = resp;
                this.arrDepartamentosFilter = resp;
                // Si tenemos informacion ya guardada filtramos
                if (this.selectedDireccion) {
                    this.arrDepartamentos = this.arrDepartamentosFilter.filter(
                        (item) => item["direccionId"] === this.selectedDireccion
                    );
                }
            },
            (err) => {
                Swal.fire(
                    "Error",
                    "Ocurrió un error obtener el documento." + err,
                    "error"
                );
            }
        );
    }
    async obtenerInformacion(): Promise<void> {
        // Obtenemos departamentos
        this.usuariosService.obtenerEntes().subscribe(
            (resp: any) => {
                this.arrEntes = resp;
                this.arrDepartamentosFilter = resp.data;
            },
            (err) => {
                Swal.fire(
                    "Error",
                    "Ocurrió un error obtener el ente." + err,
                    "error"
                );
            }
        );
    }
    async obtenerEntes(): Promise<void> {
        // Obtenemos los
        this.usuariosService.obtenerEntes().subscribe(
            (resp: any) => {
                this.arrEntes = resp;
                this.arrDepartamentosFilter = resp.data;
            },
            (err) => {
                Swal.fire(
                    "Error",
                    "Ocurrió un error obtener el ente." + err,
                    "error"
                );
            }
        );
    }

    async guardar(): Promise<void> {
        // Asignamos valores a objeto
        // this.documento.ente = this.selectedEntes;
        // this.documento.secretaria = this.selectedSecretaria;
        // this.documento.direccione = this.selectedDireccion;
        // this.documento.departamento = this.selectedDepartamento;
        // this.documento.visibilidade = this.selectedInformacion;
        this.spinner.show();
        this.documento.legislatura = this.selectedLegislaturas;
        this.documento.folioExpediente = this.form.get("folioExpediente").value;
        if (this.entroVersionamiento) {
            this.documento.tipo_de_documento = this.documento.tipo_de_documento.id;
        }

        if (!this.disabledGuardar && !this.entroVersionamiento) {
            this.documento.fechaCarga =
                this.documento.fechaCarga + "T16:00:00.000Z";
            this.documento.fechaCreacion =
                this.documento.fechaCreacion + "T16:00:00.000Z";
        }

        if (this.documento.trazabilidads.lenght === 0) {
            delete this.documento["trazabilidads"];
        }
        if (this.selectedExpediente === "") {
            delete this.documento["tipo_de_expediente"];
        } else {
            this.documento.tipo_de_expediente = this.selectedExpediente;
        }

        if (this.documento.id) {
            if (this.documento.disabled) {
                this.spinner.hide();
                this.cerrar(true);
            } else {
                this.documento.metacatalogos = this.arrMetacatalogos;
                this.documento.version = (
                    Math.round((Number(this.documento.version) + 0.1) * 100) /
                    100
                ).toFixed(2);
                // Actualizamos documento
                this.documentoService
                    .actualizarDocumentos(this.documento)
                    .subscribe(
                        (resp: any) => {
                            if (resp) {
                                this.version = resp.version;
                                Swal.fire(
                                    "Éxito",
                                    "Clasificación guardada correctamente.",
                                    "success"
                                );
                                this.spinner.hide();
                                this.cerrar(true);
                            } else {
                                this.spinner.hide();
                                Swal.fire(
                                    "Error",
                                    "Ocurrió un error al guardar. " +
                                    resp.error.data,
                                    "error"
                                );
                            }
                        },
                        (err) => {
                            this.spinner.hide();
                            console.log(err);
                            this.cerrar(false);
                            Swal.fire(
                                "Error",
                                "Ocurrió un error al guardar." + err.error.data,
                                "error"
                            );
                        }
                    );
            }
        }
    }

    descargar(): void {
        // Descargamos el documento
        this.documentoService
            .dowloadDocument(
                this.documento.documento.hash + this.documento.documento.ext,
                this.documento.id,
                this.menuService.usuario,
                this.documento.cNombreDocumento
            )
            .subscribe(
                (resp: any) => {
                    const linkSource =
                        "data:application/octet-stream;base64," + resp.data;
                    const downloadLink = document.createElement("a");
                    const fileName =
                        this.documento.documento.hash +
                        this.documento.documento.ext;

                    downloadLink.href = linkSource;
                    downloadLink.download = fileName;
                    downloadLink.click();
                },
                (err) => {
                    Swal.fire(
                        "Error",
                        "Ocurrió un error obtener al descargar el documento." +
                        err,
                        "error"
                    );
                }
            );
    }

    eliminar(): void {
        // Eliminamos documento
        Swal.fire({
            title: "¿Está seguro que desea eliminar este documento?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Si",
            cancelButtonText: "No",
        }).then((result) => {
            if (result.value) {
                this.documento.usuario = this.menuService.usuario;

                // realizamos delete
                this.documentoService
                    .borrarDocumentos(this.documento)
                    .subscribe(
                        (resp: any) => {
                            Swal.fire(
                                "Eliminado",
                                "El documento ha sido eliminado.",
                                "success"
                            );
                            this.cerrar(true);
                        },
                        (err) => {
                            this.cerrar(false);
                            Swal.fire(
                                "Error",
                                "Ocurrió un error al eliminar el documento." +
                                err,
                                "error"
                            );
                        }
                    );
            }
        });
    }

    add(event: MatChipInputEvent): void {
        const input = event.input;
        const value = event.value;

        // Add our fruit
        if ((value || "").trim()) {
            this.meta.push({ name: value.trim() });
        }

        // Reset the input value
        if (input) {
            input.value = "";
        }
    }

    remove(cat: Metacatalogos): void {
        const index = this.meta.indexOf(cat);

        if (index >= 0) {
            this.meta.splice(index, 1);
        }
    }

    obtenerTrazabilidad(): void {
        this.loadingIndicator = true;
        this.trazabilidadService
            .obtenerTrazabilidad(this.documento.id)
            .subscribe(
                (resp: any) => {
                    this.hoy = resp.hoy;
                    this.ayer = resp.ayer;
                    this.semanaActual = resp.semanaActual;
                    this.semanaPasada = resp.semanaPasada;
                    this.semanaAntepasada = resp.semanaAntepasada;
                    this.mesPasado = resp.mesPasado;
                    this.masAntiguo = resp.masAntiguo;
                    this.loadingIndicator = false;
                },
                (err) => { }
            );
        this.ocultarPreview = true;
    }

    historialVersionamiento(): void {
        // documento.disabled = true;
        // Abrimos modal de guardar perfil
        const dialogRef = this.dialog.open(HistorialDeVersionamientoComponent, {
            width: "50%",
            height: "80%",
            disableClose: true,
            data: this.documento,
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                if (result !== "") {
                    this.entroVersionamiento = true;
                    if (result.version === "Actual") {
                        this.disabledGuardar = false;
                    } else {
                        this.disabledGuardar = true;
                    }

                    this.documento.cNombreDocumento =
                        result.listado.versionado_de_documentos[
                            "0"
                        ].cNombreDocumento;
                    this.documento.bActivo =
                        result.listado.versionado_de_documentos["0"].bActivo;
                    this.documento.fechaCarga =
                        result.listado.versionado_de_documentos["0"].fechaCarga;
                    this.documento.fechaCreacion =
                        result.listado.versionado_de_documentos[
                            "0"
                        ].fechaCreacion;
                    this.documento.idDocumento =
                        result.listado.versionado_de_documentos[
                            "0"
                        ].idDocumento;
                    this.documento.paginas =
                        result.listado.versionado_de_documentos["0"].paginas;
                    this.documento.version =
                        result.listado.versionado_de_documentos["0"].version;

                    if (
                        result.listado.versionado_de_documentos["0"].documento[
                        "0"
                        ]
                    ) {
                        this.documento.documento =
                            result.listado.versionado_de_documentos[
                                "0"
                            ].documento["0"];
                        this.descargarDocumento();
                    }

                    if (
                        result.listado.versionado_de_documentos["0"]
                            .tipo_de_documento
                    ) {
                        // tslint:disable-next-line: max-line-length
                        this.documento.tipo_de_documento = this.menuService.tipoDocumentos.find(
                            (tipoDocumento) =>
                                tipoDocumento.id ===
                                result.listado.versionado_de_documentos["0"]
                                    .tipo_de_documento
                        );
                    }

                    if (result.listado.versionado_de_documentos["0"].ente) {
                        this.documento.ente =
                            result.listado.versionado_de_documentos["0"].ente;
                        this.selectedEntes =
                            result.listado.versionado_de_documentos["0"].ente;
                        this.form.controls["entes"].setValue(
                            result.listado.versionado_de_documentos["0"].ente
                        );
                    } else {
                        this.selectedEntes = "";
                    }

                    if (
                        result.listado.versionado_de_documentos["0"]
                            .tipo_de_expediente
                    ) {
                        this.documento.tipo_de_expediente =
                            result.listado.versionado_de_documentos[
                                "0"
                            ].tipo_de_expediente;
                        this.selectedExpediente = this.documento.tipo_de_expediente;
                    } else {
                        this.selectedExpediente = "";
                    }

                    if (
                        result.listado.versionado_de_documentos["0"]
                            .folioExpediente
                    ) {
                        this.documento.folioExpediente =
                            result.listado.versionado_de_documentos[
                                "0"
                            ].folioExpediente;
                        this.form.controls["folioExpediente"].setValue(
                            this.documento.folioExpediente
                        );
                    } else {
                        this.documento.folioExpediente = "";
                        this.form.controls["folioExpediente"].setValue("");
                    }

                    if (
                        result.listado.versionado_de_documentos["0"]
                            .visibilidade
                    ) {
                        this.documento.visibilidade =
                            result.listado.versionado_de_documentos[
                                "0"
                            ].visibilidade;

                        this.selectedInformacion = this.documento.visibilidade;
                    } else {
                        this.selectedInformacion = "";
                    }

                    if (
                        result.listado.versionado_de_documentos["0"]
                            .metacatalogos
                    ) {
                        this.documento.metacatalogos =
                            result.listado.versionado_de_documentos[
                                "0"
                            ].metacatalogos;
                        this.arrMetacatalogos = this.documento.metacatalogos;
                    } else {
                        this.documento.metacatalogos = [];
                        this.arrMetacatalogos = [];
                    }

                    if (result.opcion === "restaurar") {
                        this.documento.version = this.version;

                        if (this.selectedEntes === "") {
                            delete this.documento["ente"];
                        }
                        if (this.selectedInformacion === "") {
                            delete this.documento["visibilidade"];
                        }
                        if (this.selectedExpediente === "") {
                            delete this.documento["tipo_de_expediente"];
                        }

                        this.documento.documento = this.documento.documento.id;
                        this.documento.tipo_de_documento = this.documento.tipo_de_documento.id;
                        // this.documento.version = Number(parseFloat(result.listado.documento.version).toFixed(1)) + .1;

                        this.guardar();
                    }
                }
            }
        });
    }

    linkPublico() {
        const dialogRef = this.dialog.open(LinkPublicoComponent, {
            width: "50%",
            height: "80%",
            disableClose: true,
            data: this.documento,
        });
    }

    async turnarIniciativa(): Promise<void> {
        const fecha = new Date(); // Fecha actual
        let mes: any = fecha.getMonth() + 1; // obteniendo mes
        let dia: any = fecha.getDate(); // obteniendo dia

        const ano = fecha.getFullYear(); // obteniendo año

        if (dia < 10) {
            dia = "0" + dia; // agrega cero si el menor de 10
        }
        if (mes < 10) {
            mes = "0" + mes; // agrega cero si el menor de 10
        }
        const fechaActual = ano + "-" + mes + "-" + dia;

        let iniciativa = this.documento.iniciativa;

        iniciativa.estatus = this.estatusIniciativa;
        iniciativa.fechaCreacion = fechaActual + "T16:00:00.000Z";
        this.iniciativaService
            .actualizarIniciativa({
                id: iniciativa.id,
                fechaCreacion: iniciativa.fechaCreacion,
                estatus: iniciativa.estatus,
            })
            .subscribe(
                (resp: any) => {
                    if (resp) {
                        this.version = resp.version;
                        Swal.fire(
                            "Éxito",
                            "Iniciativa turnada correctamente.",
                            "success"
                        );
                        this.cerrarIniciativa("0");
                    } else {
                        Swal.fire(
                            "Error",
                            "Ocurrió un error al guardar. " + resp.error.data,
                            "error"
                        );
                    }
                },
                (err) => {
                    console.log(err);
                    this.cerrarIniciativa("1");
                    Swal.fire(
                        "Error",
                        "Ocurrió un error al guardar." + err.error.data,
                        "error"
                    );
                }
            );
    }
    async autorizar(): Promise<void> {
        this.spinner.show()
        let fileBase64 = this.pdfSrc;
        let parametros = [];
        let firmantes = [];
        let autorizacion = {};
        let detalleAutorizacion = [];
        let firmasPorEtapas: any[];
        if (this.documento.cNombreDocumento.includes('SSP 01')) {
            parametros = await this.obtenerParametros("SSP-001-Firmas");
            firmasPorEtapas = await this.obtenerFirma(
                parametros[0]["cValor"]
            );
        } else if (this.documento.cNombreDocumento.includes('SSP 04')) {
            parametros = await this.obtenerParametros("SSP-004-Firmas");
            firmasPorEtapas = await this.obtenerFirma(
                parametros[0]["cValor"]
            );
            firmantes = firmasPorEtapas[0].participantes;
        } else if (this.documento.cNombreDocumento.includes('CIEL 08')) {
            parametros = await this.obtenerParametros("CIEL-008-Firmas");
            firmasPorEtapas = await this.obtenerFirma(
                parametros[0]["cValor"]
            );
        } else if (this.documento.cNombreDocumento.includes('SSP 05')) {
            parametros = await this.obtenerParametros("SSP-005-Firmas");
            firmasPorEtapas = await this.obtenerFirma(
                parametros[0]["cValor"]
            );
        } else if (this.documento.cNombreDocumento.includes('SSP 08')) {
            parametros = await this.obtenerParametros("SSP-008-Firmas");
            firmasPorEtapas = await this.obtenerFirma(
                parametros[0]["cValor"]
            );
        }

        firmantes.forEach(element => {
            detalleAutorizacion.push({ empleado: element.id })

        });


        let fileName = this.documento.cNombreDocumento + '.pdf';


        this.autorizarService.autorizarDocumentoPaso1(fileName, firmantes.length, fileBase64.replace('data:application/pdf;base64,', '')).subscribe(
            async (resp: any) => {
                let processID = resp.body.multiSignedMessage_InitResponse.processID;

                autorizacion = {
                    documento: this.documento.id,
                    estatusIniciativa: this.documento.iniciativa.estatus,
                    estatusAutorizacion: 1,
                    idProcesoApi: processID,
                    detalle_autorizacion_iniciativas: detalleAutorizacion
                }
                this.autorizarService.autorizarRegistro(autorizacion).subscribe(
                    async (resp: any) => {
                        this.autorizacionPendiente = true;
                        this.turnarDocumento = true;
                        Swal.fire(
                            "Éxito",
                            "Documento en proceso de firma.",
                            "success"
                        );
                        this.spinner.hide()
                    },
                    (err) => {
                        this.spinner.hide()
                        Swal.fire(
                            "Error",
                            "Ocurrió un error al firmar el documento. Paso 1. " + err,
                            "error"
                        );
                    }
                );

            },
            (err) => {
                this.spinner.hide()
                Swal.fire(
                    "Error",
                    "Ocurrió un error al firmar el documento. Paso 1. " + err,
                    "error"
                );
            }
        );


    }
    async obtenerParametros(parametro: string): Promise < [] > {

        return new Promise((resolve) => {
            {
                this.parametros.obtenerParametros(parametro).subscribe(
                    (resp: any) => {
                        resolve(resp);

                    },
                    (err) => {
                        Swal.fire(
                            "Error",
                            "Ocurrió un error al obtener los parametros." + err,
                            "error"
                        );
                        resolve(err);
                    }
                );
            }
        });
    }

    async obtenerFirma(id: string): Promise < [] > {
        return new Promise((resolve) => {
            {
                this.firmas.obtenerFirmaPorEtapa(id).subscribe(
                    (resp: any) => {
                        resolve(resp);
                    },
                    (err) => {
                        Swal.fire(
                            "Error",
                            "Ocurrió un error al obtener las firmas por etapas." +
                            err,
                            "error"
                        );
                        resolve(err);
                    }
                );
            }
        });
    }

    async obtenerAutorizacionPorDocumento(): Promise < [] > {
        return new Promise((resolve) => {
            {
                this.autorizarService.obtenerAutorizacionesPorIdDocumento(this.documento.id).subscribe(
                    (resp: any) => {
                        resolve(resp);
                    },
                    (err) => {
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
  }
