import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { DocumentosService } from "services/documentos.service";
import { MenuService } from "services/menu.service";
import { Router } from "@angular/router";
import { DatePipe } from "@angular/common";
import { DomSanitizer } from "@angular/platform-browser";
import Swal from "sweetalert2";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { UsuariosService } from "services/usuarios.service";
import { TipoExpedientesService } from "services/tipo-expedientes.service";
import { UploadFileService } from "services/upload.service";
import { ExportService } from "services/export.service";
import * as XLSX from "xlsx";
import { HistorialCargaService } from "services/historial-carga.service";
import { HistorialCargaEncabezadoModel } from "models/historial-carga-encabezado.models";
import { NgxSpinnerService } from "ngx-spinner";
import { UsuarioLoginService } from "services/usuario-login.service";
import { LegislaturaService } from "services/legislaturas.service";

@Component({
    selector: "app-tablero-de-carga-masiva",
    templateUrl: "./tablero-de-carga-masiva.component.html",
    styleUrls: ["./tablero-de-carga-masiva.component.scss"],
    providers: [DatePipe],
})
export class TableroDeCargaMasivaComponent implements OnInit {
    @ViewChild("fileInput", { static: false }) fileInput: ElementRef;
    @ViewChild("excelInput", { static: false }) excelInput: ElementRef;
    @ViewChild("paginasInput", { static: false }) paginasInput: ElementRef;
    cambioFile: boolean;
    paginasEditar: boolean;
    documentoBusqueda: "";
    vigenteBusqueda = "";
    fileUrl: any;
    loadingIndicator: boolean;
    reorderable: boolean;
    cargando: boolean;
    documentos = [];
    documentosTemporal = [];
    optAgregar: boolean;
    optConsultar: boolean;
    optEditar: boolean;
    optEliminar: boolean;
    fileBase64: any;
    isLinear = false;
    firstFormGroup: FormGroup;
    secondFormGroup: FormGroup;
    arrInformacion = [];
    selectedInformacion = "";
    maxDate = new Date();
    fechaCreacion = "";
    fechaCarga = "";
    fechaModificacion = "";
    arrTipoDocumentos = [];
    arrExpediente = [];
    selectTipoDocumento: "";
    selectedEntes: "";
    selectedExpediente: "";
    selectedFolioExpediente: "";
    selectedHistorial: "";
    selectedDescarga: false;
    arrEntes: [];
    arrLegislaturas: [];
    arrHistorialCarga: any[];
    arrMetacatalogos: any;
    url: string;
    files = [];
    fileName: string;
    validarGuardado: boolean;
    historialEncabezado: HistorialCargaEncabezadoModel;
    base64: any;
    usuario: any;
    constructor(
        private _formBuilder: FormBuilder,
        private datePipe: DatePipe,
        private usuariosService: UsuariosService,
        private spinner: NgxSpinnerService,
        private router: Router,
        public dialog: MatDialog,
        private documentoService: DocumentosService,
        private menuService: MenuService,
        private tipoExpedientesService: TipoExpedientesService,
        private uploadService: UploadFileService,
        private exportExcel: ExportService,
        private historialCarga: HistorialCargaService,
        private usuarioLoginService: UsuarioLoginService,
        private legislaturaService: LegislaturaService,
        private sanitizer: DomSanitizer
    ) {
        this.url = "tablero-de-carga-masiva";
        // this.url = this.router.routerState.snapshot.url.replace('/', '').replace('%C3%BA', 'ú');
        // Obtenemos documentos
        // this.obtenerDocumentos();
    }

    async ngOnInit(): Promise<void> {
        this.usuario = await this.usuarioLoginService.obtenerUsuario();

        this.selectedHistorial = "";
        this.obtenerLegislaturas();
        this.obtenerEntes();
        this.obtenerTiposExpedientes();
        this.obtenerHistorialCarga();
        for (const documentosAgregar of this.menuService.tipoDocumentos) {
            // Si tiene permisos de agregar estos documentos los guardamos en una array
            if (documentosAgregar.Consultar) {
                this.arrTipoDocumentos.push({
                    id: documentosAgregar.id,
                    cDescripcionTipoDocumento:
                        documentosAgregar.cDescripcionTipoDocumento,
                    metacatalogos: documentosAgregar.metacatalogos,
                });
            }
        }
        this.arrInformacion = this.menuService.tipoInformacion;

        // Formulario reactivo
        this.firstFormGroup = this._formBuilder.group({
            selected: false,
            firstCtrl: [""],
            documento: [""],
            vigente: [""],
            informacion: [""],
            fechaCreacion: [""],
            fechaCarga: [""],
            fechaModificacion: [""],
            tipoDocumentos: [""],
            entes: [""],
            legislatura: [""],
            expediente: [""],
            folioExpediente: [""],
            historial: [""],
        });
        this.secondFormGroup = this._formBuilder.group({
            secondCtrl: ["", Validators.required],
            documento: ["", Validators.required],
            selectedDescarga: false,
            selected: false,
        });

        this.firstFormGroup
            .get("tipoDocumentos")
            .valueChanges.subscribe((val) => {
                this.arrMetacatalogos = [];
                if (val) {
                    const tempMetacatalogos = this.arrTipoDocumentos.filter(
                        (d) =>
                            d.id.toLowerCase().indexOf(val.toLowerCase()) !==
                                -1 || !val
                    );
                    if (tempMetacatalogos[0].metacatalogos) {
                        this.arrMetacatalogos =
                            tempMetacatalogos[0].metacatalogos;
                        for (const i in this.arrMetacatalogos) {
                            this.arrMetacatalogos[i].text = "";
                        }
                    }
                    // tslint:disable-next-line: forin
                }
            });

        this.firstFormGroup.get("historial").valueChanges.subscribe((val) => {
            this.documentos = [];
            let tempHistorial: any;
            const fecha = new Date(); // Fecha actual
            const mes: any = fecha.getMonth() + 1; // obteniendo mes
            const dia: any = fecha.getDate(); // obteniendo dia
            // dia = dia + 1;
            const ano = fecha.getFullYear(); // obteniendo año
            const fechaActual = mes + "-" + dia + "-" + ano;

            if (val) {
                tempHistorial = this.arrHistorialCarga.filter(
                    (d) =>
                        d.id.toLowerCase().indexOf(val.toLowerCase()) !== -1 ||
                        !val
                );

                if (tempHistorial[0]) {
                    if (tempHistorial[0].historial_carga_detalles) {
                        tempHistorial[0].historial_carga_detalles.forEach(
                            (element) => {
                                if (
                                    element.documento &&
                                    element.bCargado === false
                                ) {
                                    this.documentos.push({
                                        documento: element.documento.id,
                                        cNombreDocumento:
                                            element.documento.name,
                                        fechaCarga: fechaActual,
                                        version: "1",
                                        valido: false,
                                        errorText: "",
                                        idEncabezado: tempHistorial[0].id,
                                        idDetalle:
                                            tempHistorial[0]
                                                .historial_carga_detalles[0].id,
                                    });

                                    this.documentosTemporal.push({
                                        Documento: element.documento.id,
                                        "Nombre del documento":
                                            element.documento.name,
                                        Legislatura: "",
                                        "Tipo de documento": "",
                                        Páginas: "",
                                        "Fecha de creación": "",
                                        "Tipo de expediente": "",
                                        "Folio de expediente": "",
                                        Estatus: "",
                                        Meta_1: "",
                                        Meta_2: "",
                                        Meta_3: "",
                                        Meta_4: "",
                                        Meta_5: "",
                                        Meta_6: "",
                                    });

                                    this.documentos = [...this.documentos];
                                    this.documentosTemporal = [
                                        ...this.documentosTemporal,
                                    ];
                                }
                            }
                        );
                    }
                }
            }
        });
    }

    obtenerTiposExpedientes(): void {
        this.loadingIndicator = true;

        // Obtenemos los documentos
        this.tipoExpedientesService.obtenerTipoExpedientes().subscribe(
            (resp: any) => {
                // Buscamos permisos
                // tslint:disable-next-line: max-line-length
                const opciones = this.menuService.opcionesPerfil.find(
                    (opcion: { cUrl: string }) => opcion.cUrl === this.url
                );
                this.optAgregar = opciones.Agregar;
                this.optEditar = opciones.Editar;
                this.optConsultar = opciones.Consultar;
                this.optEliminar = opciones.Eliminar;
                // Si tiene permisos para consultar
                if (this.optAgregar) {
                    this.arrExpediente = resp;
                }
                this.loadingIndicator = false;
            },
            (err) => {
                this.loadingIndicator = false;

                Swal.fire(
                    "Error",
                    "Ocurrió un error al obtener los tipos de expedientes.",
                    "error"
                );
            }
        );
    }

    obtenerDocumentos(): void {
        this.spinner.show();
        const documentosTemp: any[] = [];
        let idDocumento: any;
        this.loadingIndicator = true;
        let meta = "";
        let visibilidad = "";
        let idEnte = "";
        let idExpediente = "";
        let cDescripcionTipoExpediente = "";
        let info: any;
        let filtroReporte = "";
        let temp = [];
        const fechaIniCreacion =
            this.datePipe.transform(this.fechaCreacion, "yyyy-MM-dd") +
            "T00:00:00.000Z";
        const fechaFinCreacion =
            this.datePipe.transform(this.fechaCreacion, "yyyy-MM-dd") +
            "T24:00:00.000Z";
        const fechaIniCarga =
            this.datePipe.transform(this.fechaCarga, "yyyy-MM-dd") +
            "T00:00:00.000Z";
        const fechaFinCarga =
            this.datePipe.transform(this.fechaCarga, "yyyy-MM-dd") +
            "T24:00:00.000Z";
        const fechaIniModificacion =
            this.datePipe.transform(this.fechaModificacion, "yyyy-MM-dd") +
            "T00:00:00.000Z";
        const fechaFinModificacion =
            this.datePipe.transform(this.fechaModificacion, "yyyy-MM-dd") +
            "T24:00:00.000Z";

        // Obtenemos los documentos
        if (this.vigenteBusqueda !== undefined && this.vigenteBusqueda !== "") {
            filtroReporte = "bActivo=" + this.vigenteBusqueda + "&";
        }
        if (
            this.selectedInformacion !== undefined &&
            this.selectedInformacion !== ""
        ) {
            if (filtroReporte === "") {
                filtroReporte =
                    "visibilidade.cDescripcionVisibilidad=" +
                    this.selectedInformacion;
            } else {
                filtroReporte =
                    filtroReporte +
                    "&visibilidade.cDescripcionVisibilidad=" +
                    this.selectedInformacion;
            }
        }

        if (
            this.documentoBusqueda !== undefined &&
            this.documentoBusqueda !== ""
        ) {
            if (filtroReporte === "") {
                filtroReporte = "cNombreDocumento=" + this.documentoBusqueda;
            } else {
                filtroReporte =
                    filtroReporte +
                    "&cNombreDocumento=" +
                    this.documentoBusqueda;
            }
        }

        if (this.fechaCreacion !== undefined && this.fechaCreacion !== "") {
            if (filtroReporte === "") {
                filtroReporte =
                    "fechaCreacion_gte=" +
                    fechaIniCreacion +
                    "&fechaCreacion_lte=" +
                    fechaFinCreacion;
            } else {
                filtroReporte =
                    filtroReporte +
                    "&fechaCreacion_gte=" +
                    fechaIniCreacion +
                    "&fechaCreacion_lte=" +
                    fechaFinCreacion;
            }
        }

        if (this.fechaCarga !== undefined && this.fechaCarga !== "") {
            if (filtroReporte === "") {
                filtroReporte =
                    "fechaCarga_gte=" +
                    fechaIniCarga +
                    "&fechaCarga_lte=" +
                    fechaFinCarga;
            } else {
                filtroReporte =
                    filtroReporte +
                    "&fechaCarga_gte=" +
                    fechaIniCarga +
                    "&fechaCarga_lte=" +
                    fechaIniCarga;
            }
        }

        if (
            this.fechaModificacion !== undefined &&
            this.fechaModificacion !== ""
        ) {
            if (filtroReporte === "") {
                filtroReporte =
                    "updatedAt_gte=" +
                    fechaIniModificacion +
                    "&updatedAt_lte=" +
                    fechaFinModificacion;
            } else {
                filtroReporte =
                    filtroReporte +
                    "&updatedAt_gte=" +
                    fechaIniModificacion +
                    "&updatedAt_lte=" +
                    fechaFinModificacion;
            }
        }

        if (
            this.selectTipoDocumento !== undefined &&
            this.selectTipoDocumento !== ""
        ) {
            if (filtroReporte === "") {
                filtroReporte =
                    "tipo_de_documento.id=" + this.selectTipoDocumento;
            } else {
                filtroReporte =
                    filtroReporte +
                    "&tipo_de_documento.id=" +
                    this.selectTipoDocumento;
            }
        }
        /*
                if (this.selectedEntes !== undefined && this.selectedEntes !== '') {
                    if (filtroReporte === '') {
                        filtroReporte = 'ente.id=' + this.selectedEntes;
                    } else {
                        filtroReporte = filtroReporte + '&ente.id=' + this.selectedEntes;
                    }
                }
        */
        if (
            this.selectedExpediente !== undefined &&
            this.selectedExpediente !== ""
        ) {
            if (filtroReporte === "") {
                filtroReporte =
                    "tipo_de_expediente.id=" + this.selectedExpediente;
            } else {
                filtroReporte =
                    filtroReporte +
                    "&tipo_de_expediente.id=" +
                    this.selectedExpediente;
            }
        }

        if (
            this.selectedFolioExpediente !== undefined &&
            this.selectedFolioExpediente !== ""
        ) {
            if (filtroReporte === "") {
                filtroReporte =
                    "folioExpediente=" + this.selectedFolioExpediente;
            } else {
                filtroReporte =
                    filtroReporte +
                    "&folioExpediente=" +
                    this.selectedFolioExpediente;
            }
        }
        this.documentoService.obtenerDocumentoReporte(filtroReporte).subscribe(
            (resp: any) => {
                // Buscamos permisos
                const opciones = this.menuService.opcionesPerfil.find(
                    (opcion: { cUrl: string }) =>
                        opcion.cUrl ===
                        this.router.routerState.snapshot.url.replace("/", "")
                );
                this.optAgregar = opciones.Agregar;
                this.optEditar = opciones.Editar;
                this.optConsultar = opciones.Consultar;
                this.optEliminar = opciones.Eliminar;

                // Si tiene permisos para consultar
                if (this.optConsultar) {
                    for (const documento of resp.data) {
                        idDocumento = "";
                        // Validamos permisos
                        if (documento.tipo_de_documento) {
                            const encontro = this.menuService.tipoDocumentos.find(
                                (tipo: { id: string }) =>
                                    tipo.id === documento.tipo_de_documento.id
                            );

                            if (documento.visibilidade) {
                                info = this.menuService.tipoInformacion.find(
                                    (tipo: { id: string }) =>
                                        tipo.id === documento.visibilidade.id
                                );
                            }
                            if (encontro) {
                                if (
                                    documento.tipo_de_documento.bActivo &&
                                    encontro.Consultar &&
                                    info
                                ) {
                                    if (documento.documento) {
                                        idDocumento =
                                            documento.documento.hash +
                                            documento.documento.ext;
                                    }
                                    if (documento.metacatalogos) {
                                        meta = "";
                                        if (documento.metacatalogos) {
                                            for (const x of documento.metacatalogos) {
                                                if (meta === "") {
                                                    if (
                                                        x.cTipoMetacatalogo ===
                                                        "Fecha"
                                                    ) {
                                                        if (x.text) {
                                                            meta =
                                                                meta +
                                                                x.cDescripcionMetacatalogo +
                                                                ": " +
                                                                this.datePipe.transform(
                                                                    x.text,
                                                                    "yyyy-MM-dd"
                                                                );
                                                        }
                                                    } else {
                                                        if (x.text) {
                                                            meta =
                                                                meta +
                                                                x.cDescripcionMetacatalogo +
                                                                ": " +
                                                                x.text;
                                                        }
                                                    }
                                                } else {
                                                    if (
                                                        x.cTipoMetacatalogo ===
                                                        "Fecha"
                                                    ) {
                                                        if (x.text) {
                                                            meta =
                                                                meta +
                                                                " , " +
                                                                x.cDescripcionMetacatalogo +
                                                                ": " +
                                                                this.datePipe.transform(
                                                                    x.text,
                                                                    "yyyy-MM-dd"
                                                                );
                                                        }
                                                    } else if (
                                                        x.cTipoMetacatalogo ===
                                                        "Sí o no"
                                                    ) {
                                                        if (x.text) {
                                                            meta =
                                                                meta +
                                                                " , " +
                                                                x.cDescripcionMetacatalogo +
                                                                ": Sí";
                                                        } else {
                                                            meta =
                                                                meta +
                                                                " , " +
                                                                x.cDescripcionMetacatalogo +
                                                                ": No";
                                                        }
                                                    } else {
                                                        if (x.text) {
                                                            meta =
                                                                meta +
                                                                " , " +
                                                                x.cDescripcionMetacatalogo +
                                                                ": " +
                                                                x.text;
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }

                                    if (documento.visibilidade) {
                                        visibilidad =
                                            documento.visibilidade
                                                .cDescripcionVisibilidad;
                                    }
                                    idEnte = "";
                                    if (documento.ente) {
                                        idEnte = documento.ente.id;
                                    }
                                    idExpediente = "";
                                    if (documento.tipo_de_expediente) {
                                        idExpediente =
                                            documento.tipo_de_expediente.id;
                                        cDescripcionTipoExpediente =
                                            documento.tipo_de_expediente
                                                .cDescripcionTipoExpediente;
                                    }

                                    // tslint:disable-next-line: no-unused-expression
                                    // Seteamos valores y permisos
                                    if (documento.documento) {
                                        documentosTemp.push({
                                            selected: false,
                                            id: documento.id,
                                            cNombreDocumento:
                                                documento.cNombreDocumento,
                                            tipoDocumento:
                                                documento.tipo_de_documento
                                                    .cDescripcionTipoDocumento,
                                            tipo_de_documento:
                                                documento.tipo_de_documento.id,
                                            fechaCarga: this.datePipe.transform(
                                                documento.fechaCarga,
                                                "MM-dd-yyyy"
                                            ),
                                            fechaCreacion: this.datePipe.transform(
                                                documento.fechaCreacion,
                                                "MM-dd-yyyy"
                                            ),
                                            paginas: documento.paginas,
                                            bActivo: documento.bActivo,
                                            fechaModificacion: this.datePipe.transform(
                                                documento.updatedAt,
                                                "MM-dd-yyyy"
                                            ),
                                            Agregar: encontro.Agregar,
                                            Eliminar: encontro.Eliminar,
                                            Editar: encontro.Editar,
                                            Consultar: encontro.Consultar,
                                            idDocumento: idDocumento,
                                            version: parseFloat(
                                                documento.version
                                            ).toFixed(1),
                                            documento: documento.documento,
                                            ente: documento.ente,
                                            folioExpediente:
                                                documento.folioExpediente,
                                            clasificacion: meta,
                                            metacatalogos:
                                                documento.metacatalogos,
                                            informacion: visibilidad,
                                            visibilidade:
                                                documento.visibilidade,
                                            idEnte,
                                            tipo_de_expediente:
                                                documento.tipo_de_expediente,
                                            descripcionExpediente: cDescripcionTipoExpediente,
                                            idExpediente,
                                        });
                                    }
                                    meta = "";
                                }
                            }
                        }
                    }

                    if (
                        this.selectTipoDocumento !== "" &&
                        this.selectTipoDocumento !== undefined &&
                        this.selectTipoDocumento !== null
                    ) {
                        temp = documentosTemp.filter(
                            (d) =>
                                d.tipo_de_documento
                                    .toLowerCase()
                                    .indexOf(
                                        this.selectTipoDocumento.toLowerCase()
                                    ) !== -1 || !this.selectTipoDocumento
                        );
                        this.documentos = temp;
                        for (const i of this.arrMetacatalogos) {
                            if (i["cTipoMetacatalogo"] === "Fecha") {
                                let fecha: string;
                                fecha = this.datePipe.transform(
                                    i["text"],
                                    "yyyy-MM-dd"
                                );
                                if (fecha) {
                                    temp = this.documentos.filter(
                                        (d) =>
                                            d.clasificacion.indexOf(
                                                i["cDescripcionMetacatalogo"] +
                                                    ": " +
                                                    fecha
                                            ) !== -1 || !fecha
                                    );
                                    this.documentos = temp;
                                }
                            } else if (i["cTipoMetacatalogo"] === "Sí o no") {
                                // fecha = this.datePipe.transform(i['text'], 'yyyy-MM-dd');
                                if (i["text"]) {
                                    temp = this.documentos.filter(
                                        (d) =>
                                            d.clasificacion.indexOf(
                                                i["cDescripcionMetacatalogo"] +
                                                    ": " +
                                                    i["text"]
                                            ) !== -1 || !i["text"]
                                    );
                                    this.documentos = temp;
                                }
                            } else {
                                if (i["text"]) {
                                    temp = this.documentos.filter(
                                        (d) =>
                                            d.clasificacion.indexOf(
                                                i["cDescripcionMetacatalogo"] +
                                                    ": " +
                                                    i["text"]
                                            ) !== -1 || !i["text"]
                                    );
                                    this.documentos = temp;
                                }
                            }
                        }
                        this.documentos = temp;
                        this.documentosTemporal = this.documentos;
                    } else {
                        this.documentos = documentosTemp;
                        this.documentosTemporal = this.documentos;
                    }
                }
                this.loadingIndicator = false;
                this.spinner.hide();
            },
            (err) => {
                this.loadingIndicator = false;
                this.spinner.hide();
                Swal.fire(
                    "Error",
                    "Ocurrió un error obtener los documentos." + err,
                    "error"
                );
            }
        );
    }

    descargarDocumento(row: any): void {
        // Descargamos el documento
        this.documentoService
            .dowloadDocument(
                row.idDocumento,
                row.id,
                this.menuService.usuario,
                row.cNombreDocumento
            )
            .subscribe(
                (resp: any) => {
                    const linkSource =
                        "data:application/octet-stream;base64," + resp.data;
                    const downloadLink = document.createElement("a");
                    const fileName = row.idDocumento;

                    downloadLink.href = linkSource;
                    downloadLink.download = fileName;
                    downloadLink.click();
                },
                (err) => {
                    this.loadingIndicator = false;
                    Swal.fire(
                        "Error",
                        "Ocurrió un error al descargar el documento." + err,
                        "error"
                    );
                }
            );
    }

    descargarDocumentos(): void {
        this.documentos.forEach((element) => {
            this.spinner.show();
            if (element.selected && String(element.idDocumento).length > 0) {
                this.documentoService
                    .dowloadDocument(
                        element.idDocumento,
                        element.id,
                        this.menuService.usuario,
                        element.cNombreDocumento
                    )
                    .subscribe(
                        (resp: any) => {
                            const linkSource =
                                "data:application/octet-stream;base64," +
                                resp.data;
                            const downloadLink = document.createElement("a");
                            const fileName = element.idDocumento;

                            downloadLink.href = linkSource;
                            downloadLink.download = fileName;
                            downloadLink.click();
                            this.spinner.hide();
                        },
                        (err) => {
                            this.loadingIndicator = false;
                            this.spinner.hide();
                            Swal.fire(
                                "Error",
                                "Ocurrió un error al descargar documento." +
                                    err.error,
                                "error"
                            );
                        }
                    );
            } else {
                this.spinner.hide();
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

    async obtenerEntes(): Promise<void> {
        // Obtenemos los entes
        this.usuariosService.obtenerEntes().subscribe(
            (resp: any) => {
                this.arrEntes = resp;
            },
            (err) => {
                Swal.fire(
                    "Error",
                    "Ocurrió un error al obtener los entes." + err,
                    "error"
                );
            }
        );
    }

    async obtenerHistorialCarga(): Promise<void> {
        this.spinner.show();
        // Obtenemos el historial de carga

        this.historialCarga
            .obtenerHistorialCarga(this.usuario[0].data.id)
            .subscribe(
                (resp: any) => {
                    this.arrHistorialCarga = resp;
                    this.spinner.hide();
                },
                (err) => {
                    this.spinner.hide();
                    Swal.fire(
                        "Error",
                        "Ocurrió un error al  obtener el historial de cargas." +
                            err.error,
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

    filter(): void {
        this.obtenerDocumentos();
    }
    filterDatatable(): void {
        let temp = [];
        // Filtramos tabla
        if (this.documentosTemporal) {
            this.documentos = this.documentosTemporal;
        }
        if (
            this.documentoBusqueda !== "" &&
            this.documentoBusqueda !== undefined
        ) {
            temp = this.documentos.filter(
                (d) =>
                    d.cNombreDocumento
                        .toLowerCase()
                        .indexOf(this.documentoBusqueda.toLowerCase()) !== -1 ||
                    !this.documentoBusqueda
            );
            this.documentos = temp;
        }

        if (this.vigenteBusqueda !== "" && this.vigenteBusqueda !== undefined) {
            if (this.vigenteBusqueda === "false") {
                temp = this.documentos.filter((d) => d.bActivo === false);
            } else {
                temp = this.documentos.filter((d) => d.bActivo === true);
            }
            this.documentos = temp;
        }

        if (
            this.selectedInformacion !== "" &&
            this.selectedInformacion !== undefined
        ) {
            temp = this.documentos.filter(
                (d) =>
                    d.informacion
                        .toLowerCase()
                        .indexOf(this.selectedInformacion.toLowerCase()) !==
                        -1 || !this.selectedInformacion
            );
            this.documentos = temp;
        }

        if (
            this.fechaCreacion !== "" &&
            this.fechaCreacion !== undefined &&
            this.fechaCreacion !== null
        ) {
            let fecha: string;
            fecha = this.datePipe.transform(this.fechaCreacion, "MM-dd-yyyy");
            temp = this.documentos.filter((d) => d.fechaCreacion === fecha);
            this.documentos = temp;
        }

        if (
            this.fechaCarga !== "" &&
            this.fechaCarga !== undefined &&
            this.fechaCarga !== null
        ) {
            let fecha: string;
            fecha = this.datePipe.transform(this.fechaCarga, "MM-dd-yyyy");
            temp = this.documentos.filter((d) => d.fechaCarga === fecha);
            this.documentos = temp;
        }

        if (
            this.fechaModificacion !== "" &&
            this.fechaModificacion !== undefined &&
            this.fechaModificacion !== null
        ) {
            let fecha: string;
            fecha = this.datePipe.transform(
                this.fechaModificacion,
                "MM-dd-yyyy"
            );
            temp = this.documentos.filter((d) => d.fechaModificacion === fecha);
            this.documentos = temp;
        }

        if (
            this.selectTipoDocumento !== "" &&
            this.selectTipoDocumento !== undefined &&
            this.selectTipoDocumento !== null
        ) {
            temp = this.documentos.filter(
                (d) =>
                    d.tipo_de_documento
                        .toLowerCase()
                        .indexOf(this.selectTipoDocumento.toLowerCase()) !==
                        -1 || !this.selectTipoDocumento
            );
            this.documentos = temp;
            for (const i of this.arrMetacatalogos) {
                if (i["cTipoMetacatalogo"] === "Fecha") {
                    let fecha: string;
                    fecha = this.datePipe.transform(i["text"], "yyyy-MM-dd");
                    if (fecha) {
                        temp = this.documentos.filter(
                            (d) =>
                                d.clasificacion.indexOf(
                                    i["cDescripcionMetacatalogo"] + ": " + fecha
                                ) !== -1 || !fecha
                        );
                        this.documentos = temp;
                    }
                } else if (i["cTipoMetacatalogo"] === "Sí o no") {
                    // fecha = this.datePipe.transform(i['text'], 'yyyy-MM-dd');
                    if (i["text"]) {
                        temp = this.documentos.filter(
                            (d) =>
                                d.clasificacion.indexOf(
                                    i["cDescripcionMetacatalogo"] +
                                        ": " +
                                        i["text"]
                                ) !== -1 || !i["text"]
                        );
                        this.documentos = temp;
                    }
                } else {
                    if (i["text"]) {
                        temp = this.documentos.filter(
                            (d) =>
                                d.clasificacion.indexOf(
                                    i["cDescripcionMetacatalogo"] +
                                        ": " +
                                        i["text"]
                                ) !== -1 || !i["text"]
                        );
                        this.documentos = temp;
                    }
                }
            }
            this.documentos = temp;
        }
        /*
                if (this.selectedEntes !== '' && this.selectedEntes !== undefined && this.selectedEntes !== null) {
                    temp = this.documentos.filter((d) => d.idEnte.toLowerCase().indexOf(this.selectedEntes.toLowerCase()) !== -1 || !this.selectedEntes);
                    this.documentos = temp;
                }
        */
        if (
            this.selectedExpediente !== "" &&
            this.selectedExpediente !== undefined &&
            this.selectedExpediente !== null
        ) {
            temp = this.documentos.filter(
                (d) => d.idExpediente === this.selectedExpediente
            );
            this.documentos = temp;
        }

        if (
            this.selectedFolioExpediente !== "" &&
            this.selectedFolioExpediente !== undefined &&
            this.selectedFolioExpediente !== null
        ) {
            temp = this.documentos.filter(
                (d) =>
                    d.folioExpediente !== undefined &&
                    d.folioExpediente !== null &&
                    d.folioExpediente !== ""
            );
            temp = temp.filter(
                (d) =>
                    d.folioExpediente.toString() ===
                    this.selectedFolioExpediente
            );
            this.documentos = temp;
        }
    }

    add(): void {
        let historial: HistorialCargaEncabezadoModel;
        const fecha = new Date(); // Fecha actual
        const mes: any = fecha.getMonth() + 1; // obteniendo mes
        const dia: any = fecha.getDate(); // obteniendo dia
        // dia = dia + 1;
        const ano = fecha.getFullYear(); // obteniendo año
        const fechaActual = mes + "-" + dia + "-" + ano;

        this.loadingIndicator = true;
        // Agregamos elemento file
        let base64Result: string;
        this.files = [];
        const fileInput = this.fileInput.nativeElement;

        // const paginasInput = this.paginasInput.nativeElement;
        fileInput.onchange = async () => {
            this.spinner.show();
            if (this.selectedHistorial === "") {
                this.historialCarga
                    .guardarHistorial({ cUsuario: this.menuService.usuario })
                    .subscribe(
                        (resp: any) => {
                            this.selectedHistorial = resp.data.id;
                            this.obtenerHistorialCarga();
                            this.selectedHistorial = resp.data.id;
                        },
                        (err) => {
                            this.spinner.hide();
                            Swal.fire(
                                "Error",
                                "Ocurrió un error al guardar el historial de cargas." +
                                    err.error.error,
                                "error"
                            );
                        }
                    );
            }
            // tslint:disable-next-line: prefer-for-of
            for (let index = 0; index < fileInput.files.length; index++) {
                const file = fileInput.files[index];
                this.base64 = await this.readAsDataURL(file);
                if (this.base64.data) {
                    const resultado = await this.uploadService.subirArchivo(
                        file,
                        this.base64.data
                    );

                    if (resultado.error) {
                        this.spinner.hide();
                        Swal.fire(
                            "Error",
                            resultado.error.error + " archivo: " + file.name,
                            "error"
                        );
                    } else {
                        // Obtenemos el historial de carga

                        const hCarga = await this.historialCarga.guardarHistorialDetalle(
                            {
                                documento: resultado.data[0].id,
                                historial_carga_encabezados: [
                                    this.selectedHistorial,
                                ],
                            }
                        );
                        if (hCarga.error) {
                            this.spinner.hide();
                            Swal.fire("Error", hCarga.error.error, "error");
                        } else {
                            this.documentos.push({
                                documento: resultado.data[0].id,
                                cNombreDocumento: file.name,
                                fechaCarga: fechaActual,
                                version: "1",
                                valido: false,
                                errorText: "",
                                idEncabezado: this.selectedHistorial,
                                idDetalle: hCarga.data.id,
                            });
                        }

                        this.documentosTemporal.push({
                            Documento: resultado.data[0].id,
                            "Nombre del documento": file.name,
                            Legislatura: "",
                            "Tipo de documento": "",
                            Páginas: "",
                            "Fecha de creación": "",
                            "Tipo de expediente": "",
                            "Folio de expediente": "",
                            Estatus: "",
                            Meta_1: "",
                            Meta_2: "",
                            Meta_3: "",
                            Meta_4: "",
                            Meta_5: "",
                            Meta_6: "",
                        });
                        this.obtenerHistorialCarga();
                        this.documentos = [...this.documentos];
                        this.documentosTemporal = [...this.documentosTemporal];
                    }
                    this.fileName = file.name;
                    this.files.push({
                        data: file,
                        inProgress: false,
                        progress: 0,
                    });

                    const reader = new FileReader();
                    reader.readAsBinaryString(file);
                    reader.onloadend = () => {
                        // Obtenemos el # de paginas del documento
                        base64Result = reader.result.toString();
                        base64Result = base64Result
                            .slice(
                                base64Result.search("/Count"),
                                base64Result.search("/Count") + 10
                            )
                            .replace("/Count ", "");
                        this.paginasEditar = false;
                        // paginasInput.value = this.getNumbersInString(base64Result);
                    };

                    this.cambioFile = true;
                }
            }
            this.loadingIndicator = false;
            this.spinner.hide();
            fileInput.value = "";
        };
        fileInput.click();
    }

    subirExcel(): void {
        const excelInput = this.excelInput.nativeElement;

        excelInput.click();
    }
    descargarFormatoExcel(): void {
        this.exportExcel.exportAsExcelFile(
            this.documentosTemporal,
            "formatoDeCarga"
        );
    }
    // tslint:disable-next-line: variable-name
    getNumbersInString(string: string): string {
        const tmp = string.split("");
        // tslint:disable-next-line: only-arrow-functions
        const map = tmp.map((current) => {
            // tslint:disable-next-line: radix
            if (!isNaN(parseInt(current))) {
                return current;
            }
        });

        // tslint:disable-next-line: only-arrow-functions
        // tslint:disable-next-line: triple-equals
        const numbers = map.filter((value) => value != undefined);

        return numbers.join("");
    }

    onFileChange(ev): void {
        let workBook = null;
        let jsonData = null;
        const reader = new FileReader();
        const file = ev.target.files[0];
        const excelInput = this.excelInput.nativeElement;
        reader.onload = (event) => {
            const data = reader.result;
            this.validarGuardado = true;

            workBook = XLSX.read(data, { type: "binary" });
            jsonData = workBook.SheetNames.reduce((initial, name) => {
                const sheet = workBook.Sheets[name];
                initial[name] = XLSX.utils.sheet_to_json(sheet);
                return initial;
            }, {});
            jsonData["Hoja1"].forEach((row) => {
                const dataRow = [];
                let textError = "";
                this.arrMetacatalogos = [];
                if (row.Documento) {
                    const x = this.documentos.findIndex(
                        (doc) => doc.documento === row.Documento
                    );
                    try {
                        if (x >= 0) {
                            this.documentos[x].valido = false;
                            if (
                                row["Nombre del documento"] &&
                                row["Nombre del documento"].length > 0
                            ) {
                                this.documentos[x].cNombreDocumento =
                                    row["Nombre del documento"];
                            } else {
                                this.documentos[x].valido = false;
                                if (textError.length > 0) {
                                    textError =
                                        "El nombre del documento es obligatorio";
                                } else {
                                    textError =
                                        textError +
                                        ", el nombre del documento es obligatorio";
                                }
                            }

                            if (
                                row["Legislatura"] &&
                                row["Legislatura"].length > 0
                            ) {
                                const encontro = this.arrLegislaturas.find(
                                    (legislatura: { cLegislatura: string }) =>
                                        legislatura.cLegislatura ===
                                        row["Legislatura"]
                                );
                                if (encontro) {
                                    this.documentos[x].idLegislatura =
                                        encontro["id"];
                                    this.documentos[x].legislatura =
                                        encontro["id"];
                                } else {
                                    this.documentos[x].valido = false;
                                    if (textError.length > 0) {
                                        textError =
                                            "La legislatura es obligatoria";
                                    } else {
                                        textError =
                                            textError +
                                            ", la legislatura es obligatoria";
                                    }
                                }
                            } else {
                                this.documentos[x].valido = false;
                                if (textError.length > 0) {
                                    textError = "La legislatura es obligatoria";
                                } else {
                                    textError =
                                        textError +
                                        ", la legislatura es obligatoria";
                                }
                            }

                            if (
                                row["Tipo de documento"] &&
                                row["Tipo de documento"].length > 0
                            ) {
                                const encontro = this.menuService.tipoDocumentos.find(
                                    (tipo: {
                                        cDescripcionTipoDocumento: string;
                                    }) =>
                                        tipo.cDescripcionTipoDocumento.trim() ===
                                        row["Tipo de documento"]
                                );

                                if (encontro) {
                                    if (encontro.Agregar === "undefined") {
                                        this.documentos[x].valido = false;
                                        if (textError.length > 0) {
                                            textError =
                                                "El tipo de documento es obligatorio";
                                        } else {
                                            textError =
                                                textError +
                                                ", el tipo de documento es obligatorio";
                                        }
                                    } else {
                                        this.documentos[x].tipoDocumento =
                                            encontro.cDescripcionTipoDocumento;
                                        this.documentos[x].tipo_de_documento =
                                            encontro.id;
                                        this.arrMetacatalogos = this.menuService.tipoDocumentos.find(
                                            (tipoDocumento) =>
                                                tipoDocumento.id === encontro.id
                                        ).metacatalogos;

                                        if (this.arrMetacatalogos[0]) {
                                            if (
                                                this.arrMetacatalogos[0]
                                                    .bOligatorio
                                            ) {
                                                if (
                                                    row["Meta_1"] ===
                                                        undefined ||
                                                    row["Meta_1"].length === 0
                                                ) {
                                                    if (textError.length > 0) {
                                                        textError =
                                                            "El Meta_1(" +
                                                            this
                                                                .arrMetacatalogos[0]
                                                                .cDescripcionMetacatalogo +
                                                            ") es obligatorio";
                                                    } else {
                                                        textError =
                                                            textError +
                                                            ", el Meta_1(" +
                                                            this
                                                                .arrMetacatalogos[0]
                                                                .cDescripcionMetacatalogo +
                                                            ") es obligatorio";
                                                    }
                                                }
                                            }
                                        } else if (this.arrMetacatalogos[1]) {
                                            if (
                                                this.arrMetacatalogos[1]
                                                    .bOligatorio
                                            ) {
                                                if (
                                                    row["Meta_2"] ===
                                                        undefined ||
                                                    row["Meta_2"].length === 0
                                                ) {
                                                    if (textError.length > 0) {
                                                        textError =
                                                            "El Meta_2(" +
                                                            this
                                                                .arrMetacatalogos[1]
                                                                .cDescripcionMetacatalogo +
                                                            ") es obligatorio";
                                                    } else {
                                                        textError =
                                                            textError +
                                                            ", el Meta_2(" +
                                                            this
                                                                .arrMetacatalogos[1]
                                                                .cDescripcionMetacatalogo +
                                                            ") es obligatorio";
                                                    }
                                                }
                                            }
                                        } else if (this.arrMetacatalogos[2]) {
                                            if (
                                                this.arrMetacatalogos[2]
                                                    .bOligatorio
                                            ) {
                                                if (
                                                    row["Meta_3"] ===
                                                        undefined ||
                                                    row["Meta_3"].length === 0
                                                ) {
                                                    if (textError.length > 0) {
                                                        textError =
                                                            "El Meta_3(" +
                                                            this
                                                                .arrMetacatalogos[2]
                                                                .cDescripcionMetacatalogo +
                                                            ") es obligatorio";
                                                    } else {
                                                        textError =
                                                            textError +
                                                            ", el Meta_3(" +
                                                            this
                                                                .arrMetacatalogos[2]
                                                                .cDescripcionMetacatalogo +
                                                            ") es obligatorio";
                                                    }
                                                }
                                            }
                                        } else if (this.arrMetacatalogos[3]) {
                                            if (
                                                this.arrMetacatalogos[3]
                                                    .bOligatorio
                                            ) {
                                                if (
                                                    row["Meta_4"] ===
                                                        undefined ||
                                                    row["Meta_4"].length === 0
                                                ) {
                                                    if (textError.length > 0) {
                                                        textError =
                                                            "El Meta_4(" +
                                                            this
                                                                .arrMetacatalogos[3]
                                                                .cDescripcionMetacatalogo +
                                                            ") es obligatorio";
                                                    } else {
                                                        textError =
                                                            textError +
                                                            ", el Meta_4(" +
                                                            this
                                                                .arrMetacatalogos[3]
                                                                .cDescripcionMetacatalogo +
                                                            ") es obligatorio";
                                                    }
                                                }
                                            }
                                        } else if (this.arrMetacatalogos[4]) {
                                            if (
                                                this.arrMetacatalogos[4]
                                                    .bOligatorio
                                            ) {
                                                if (
                                                    row["Meta_5"] ===
                                                        undefined ||
                                                    row["Meta_5"].length === 0
                                                ) {
                                                    if (textError.length > 0) {
                                                        textError =
                                                            "El Meta_5(" +
                                                            this
                                                                .arrMetacatalogos[4]
                                                                .cDescripcionMetacatalogo +
                                                            ") es obligatorio";
                                                    } else {
                                                        textError =
                                                            textError +
                                                            ", el Meta_5(" +
                                                            this
                                                                .arrMetacatalogos[4]
                                                                .cDescripcionMetacatalogo +
                                                            ") es obligatorio";
                                                    }
                                                }
                                            }
                                        }

                                        if (
                                            encontro.visibilidade &&
                                            encontro.visibilidade.length > 0
                                        ) {
                                            const visibilidad = this.menuService.tipoInformacion.find(
                                                (tipo: { id: string }) =>
                                                    tipo.id ===
                                                    encontro.visibilidade
                                            );
                                            if (visibilidad) {
                                                this.documentos[x].informacion =
                                                    visibilidad.cDescripcionVisibilidad;
                                                this.documentos[
                                                    x
                                                ].visibilidade = visibilidad.id;
                                            } else {
                                                this.documentos[
                                                    x
                                                ].valido = false;
                                                if (textError.length > 0) {
                                                    textError =
                                                        "El tipo de información es obligatorio";
                                                } else {
                                                    textError =
                                                        textError +
                                                        ", el tipo de información es obligatorio";
                                                }
                                            }
                                        } else {
                                            this.documentos[x].valido = false;
                                            if (textError.length > 0) {
                                                textError =
                                                    "El tipo de información es obligatorio";
                                            } else {
                                                textError =
                                                    textError +
                                                    ", el tipo de información es obligatorio";
                                            }
                                        }
                                    }
                                } else {
                                    this.documentos[x].valido = false;
                                    if (textError.length > 0) {
                                        textError =
                                            "El tipo de documento es obligatorio";
                                    } else {
                                        textError =
                                            textError +
                                            ", el tipo de documento es obligatorio";
                                    }
                                }
                            } else {
                                this.documentos[x].valido = false;
                                if (textError.length > 0) {
                                    textError =
                                        "El tipo de documento es obligatorio";
                                } else {
                                    textError =
                                        textError +
                                        ", el tipo de documento es obligatorio";
                                }
                            }
                            /*
                                                        if (row['Ente'] && row['Ente'].length > 0) {
                                                            const encontro = this.arrEntes.find((ente: { cDescripcionEnte: string; }) =>
                                                                ente.cDescripcionEnte === row['Ente']);
                                                            if (encontro) {
                                                                this.documentos[x].idEnte = encontro['id'];
                                                                this.documentos[x].ente = encontro;
                                                            } else {
                                                                this.documentos[x].valido = false;
                                                                if (textError.length > 0) {
                                                                    textError = 'El ente es obligatorio';
                                                                } else {
                                                                    textError = textError + ', el ente es obligatorio';
                                                                }
                                                            }
                                                        } else {
                                                            this.documentos[x].valido = false;
                                                            if (textError.length > 0) {
                                                                textError = 'El ente es obligatorio';
                                                            } else {
                                                                textError = textError + ', el ente es obligatorio';
                                                            }
                                                        }
                             */
                            if (Number(row["Páginas"])) {
                                this.documentos[x].paginas = Number(
                                    row["Páginas"]
                                );
                            } else {
                                this.documentos[x].paginas = "0";
                            }

                            if (new Date(row["Fecha de creación"])) {
                                console.log("err4");
                                this.documentos[x].fechaCreacion =
                                    this.datePipe.transform(
                                        row["Fecha de creación"],
                                        "yyyy-MM-dd"
                                    ) + "T06:00:00.000Z";
                            } else {
                                this.documentos[x].valido = false;
                                if (textError.length > 0) {
                                    textError =
                                        "La fecha de creación obligatorio";
                                } else {
                                    textError =
                                        textError +
                                        ", la fecha de creación obligatorio";
                                }
                            }

                            if (
                                row["Tipo de expediente"] &&
                                row["Tipo de expediente"].length > 0
                            ) {
                                const encontro = this.arrExpediente.find(
                                    (tipo: {
                                        cDescripcionTipoExpediente: string;
                                    }) =>
                                        tipo.cDescripcionTipoExpediente ===
                                        row["Tipo de expediente"]
                                );

                                if (encontro) {
                                    this.documentos[x].tipo_de_expediente =
                                        encontro.id;
                                    this.documentos[x].expediente =
                                        encontro.cDescripcionTipoExpediente;
                                    this.documentos[x].idExpediente =
                                        encontro.id;
                                } else {
                                    this.documentos[x].valido = false;
                                    if (textError.length > 0) {
                                        textError =
                                            "El tipo de expediente es obligatorio";
                                    } else {
                                        textError =
                                            textError +
                                            ", el tipo de expediente es obligatorio";
                                    }
                                }
                            } else {
                                this.documentos[x].valido = false;
                                if (textError.length > 0) {
                                    textError =
                                        "El tipo de expediente es obligatorio";
                                } else {
                                    textError =
                                        textError +
                                        ", el tipo de expediente es obligatorio";
                                }
                            }
                            if (String(row["Folio de expediente"]).length > 0) {
                                this.documentos[x].folioExpediente = String(
                                    row["Folio de expediente"]
                                );
                            } else {
                                this.documentos[x].folioExpediente = "0";
                            }

                            if (Number(row["Estatus"])) {
                                if (Number(row["Estatus"]) === 1) {
                                    this.documentos[x].bActivo = true;
                                } else {
                                    this.documentos[x].bActivo = false;
                                }
                            } else if (row["Estatus"] === "Vigente") {
                                this.documentos[x].bActivo = true;
                            } else {
                                this.documentos[x].bActivo = false;
                            }

                            if (this.arrMetacatalogos.length > 0) {
                                this.arrMetacatalogos.forEach((meta) => {});

                                let num = 0;
                                let metaRow = 1;
                                while (num <= 5) {
                                    if (this.arrMetacatalogos[num]) {
                                        this.arrMetacatalogos[num].text = "";
                                    }
                                    if (this.arrMetacatalogos[num]) {
                                        if (
                                            this.arrMetacatalogos[num]
                                                .bOligatorio
                                        ) {
                                            if (
                                                String(row["Meta_" + metaRow])
                                                    .length > 0
                                            ) {
                                                if (
                                                    this.arrMetacatalogos[num]
                                                        .cTipoMetacatalogo ===
                                                    "Fecha"
                                                ) {
                                                    console.log("fecha");
                                                    if (
                                                        new Date(
                                                            row[
                                                                "Meta_" +
                                                                    metaRow
                                                            ]
                                                        )
                                                    ) {
                                                        console.log("err5");
                                                        this.arrMetacatalogos[
                                                            num
                                                        ].text =
                                                            this.datePipe.transform(
                                                                row[
                                                                    "Meta_" +
                                                                        metaRow
                                                                ],
                                                                "yyyy-MM-dd"
                                                            ) +
                                                            "T06:00:00.000Z";
                                                    } else {
                                                        this.documentos[
                                                            x
                                                        ].valido = false;
                                                        if (
                                                            textError.length > 0
                                                        ) {
                                                            textError =
                                                                "El " +
                                                                "Meta_" +
                                                                metaRow +
                                                                " es incorrecto";
                                                        } else {
                                                            textError =
                                                                textError +
                                                                ", el " +
                                                                "Meta_" +
                                                                metaRow +
                                                                " es incorrecto";
                                                        }
                                                    }
                                                } else if (
                                                    this.arrMetacatalogos[num]
                                                        .cTipoMetacatalogo ===
                                                        "Sí o no" ||
                                                    this.arrMetacatalogos[num]
                                                        .cTipoMetacatalogo ===
                                                        "Texto"
                                                ) {
                                                    if (
                                                        String(
                                                            row[
                                                                "Meta_" +
                                                                    metaRow
                                                            ]
                                                        )
                                                    ) {
                                                        this.arrMetacatalogos[
                                                            num
                                                        ].text = String(
                                                            row[
                                                                "Meta_" +
                                                                    metaRow
                                                            ]
                                                        );
                                                    } else {
                                                        this.documentos[
                                                            x
                                                        ].valido = false;
                                                        if (
                                                            textError.length > 0
                                                        ) {
                                                            textError =
                                                                "El " +
                                                                "Meta_" +
                                                                metaRow +
                                                                " es incorrecto";
                                                        } else {
                                                            textError =
                                                                textError +
                                                                ", el " +
                                                                "Meta_" +
                                                                metaRow +
                                                                " es incorrecto";
                                                        }
                                                    }
                                                } else if (
                                                    this.arrMetacatalogos[num]
                                                        .cTipoMetacatalogo ===
                                                    "Numérico"
                                                ) {
                                                    if (
                                                        Number(
                                                            row[
                                                                "Meta_" +
                                                                    metaRow
                                                            ]
                                                        )
                                                    ) {
                                                        this.arrMetacatalogos[
                                                            num
                                                        ].text = Number(
                                                            row[
                                                                "Meta_" +
                                                                    metaRow
                                                            ]
                                                        );
                                                    } else {
                                                        this.documentos[
                                                            x
                                                        ].valido = false;
                                                        if (
                                                            textError.length > 0
                                                        ) {
                                                            textError =
                                                                "El " +
                                                                "Meta_" +
                                                                metaRow +
                                                                " es incorrecto";
                                                        } else {
                                                            textError =
                                                                textError +
                                                                ", el " +
                                                                "Meta_" +
                                                                metaRow +
                                                                " es incorrecto";
                                                        }
                                                    }
                                                }
                                            } else {
                                                this.arrMetacatalogos[
                                                    num
                                                ].text =
                                                    "El metacatalago " +
                                                    "Meta_" +
                                                    metaRow +
                                                    "  es obligatorio";
                                                if (textError.length > 0) {
                                                    textError =
                                                        "El metacatalago " +
                                                        "Meta_" +
                                                        metaRow +
                                                        "  es obligatorio";
                                                } else {
                                                    textError =
                                                        textError +
                                                        ", el metacatalago " +
                                                        "Meta_" +
                                                        metaRow +
                                                        "  es obligatorio";
                                                    this.documentos[
                                                        x
                                                    ].valido = false;
                                                }
                                            }
                                        } else {
                                            if (
                                                this.arrMetacatalogos[num]
                                                    .cTipoMetacatalogo ===
                                                "Fecha"
                                            ) {
                                                if (
                                                    new Date(
                                                        row["Meta_" + metaRow]
                                                    )
                                                ) {
                                                    console.log("err1");
                                                    this.arrMetacatalogos[
                                                        num
                                                    ].text =
                                                        this.datePipe.transform(
                                                            row[
                                                                "Meta_" +
                                                                    metaRow
                                                            ],
                                                            "yyyy-MM-dd"
                                                        ) + "T06:00:00.000Z";
                                                } else {
                                                    this.arrMetacatalogos[
                                                        num
                                                    ].text = "";
                                                }
                                            } else if (
                                                this.arrMetacatalogos[num]
                                                    .cTipoMetacatalogo ===
                                                    "Sí o no" &&
                                                this.arrMetacatalogos[num]
                                                    .cTipoMetacatalogo ===
                                                    "Texto"
                                            ) {
                                                if (
                                                    String(
                                                        row["Meta_" + metaRow]
                                                    )
                                                ) {
                                                    this.arrMetacatalogos[
                                                        num
                                                    ].text = String(
                                                        row["Meta_" + metaRow]
                                                    );
                                                } else {
                                                    this.arrMetacatalogos[
                                                        num
                                                    ].text = "";
                                                }
                                            } else if (
                                                this.arrMetacatalogos[num]
                                                    .cTipoMetacatalogo ===
                                                "Numérico"
                                            ) {
                                                if (
                                                    Number(
                                                        row["Meta_" + metaRow]
                                                    )
                                                ) {
                                                    this.arrMetacatalogos[
                                                        num
                                                    ].text = Number(
                                                        row["Meta_" + metaRow]
                                                    );
                                                } else {
                                                    this.arrMetacatalogos[
                                                        num
                                                    ].text = "";
                                                }
                                            }
                                        }
                                    }
                                    metaRow++;
                                    num++;
                                    if (textError.length === 0) {
                                        this.documentos[x].valido = true;
                                    } else {
                                        this.documentos[x].valido = false;
                                    }
                                    if (this.documentos[x].valido === false) {
                                        this.validarGuardado = false;
                                    }
                                    this.arrMetacatalogos = [
                                        ...this.arrMetacatalogos,
                                    ];
                                    this.documentos[
                                        x
                                    ].metacatalogos = this.arrMetacatalogos;
                                    this.documentos = [...this.documentos];
                                }
                                if (this.documentos[x].metacatalogos) {
                                    let meta = "";
                                    if (this.documentos[x].metacatalogos) {
                                        for (const i of this.documentos[x]
                                            .metacatalogos) {
                                            if (meta === "") {
                                                if (
                                                    i.cTipoMetacatalogo ===
                                                    "Fecha"
                                                ) {
                                                    if (i.text) {
                                                        console.log("err2");
                                                        meta =
                                                            meta +
                                                            i.cDescripcionMetacatalogo +
                                                            ": " +
                                                            this.datePipe.transform(
                                                                i.text,
                                                                "yyyy-MM-dd"
                                                            ) +
                                                            "T06:00:00.000Z";
                                                    }
                                                } else {
                                                    if (i.text) {
                                                        meta =
                                                            meta +
                                                            i.cDescripcionMetacatalogo +
                                                            ": " +
                                                            i.text;
                                                    }
                                                }
                                            } else {
                                                if (
                                                    i.cTipoMetacatalogo ===
                                                    "Fecha"
                                                ) {
                                                    if (i.bOligatorio) {
                                                        if (i.text) {
                                                            console.log("err3");
                                                            meta =
                                                                meta +
                                                                " , " +
                                                                i.cDescripcionMetacatalogo +
                                                                ": " +
                                                                this.datePipe.transform(
                                                                    i.text,
                                                                    "yyyy-MM-dd"
                                                                ) +
                                                                "T06:00:00.000Z";
                                                        }
                                                    }
                                                } else if (
                                                    i.cTipoMetacatalogo ===
                                                    "Sí o no"
                                                ) {
                                                    if (i.text) {
                                                        meta =
                                                            meta +
                                                            " , " +
                                                            i.cDescripcionMetacatalogo +
                                                            ": Sí";
                                                    } else {
                                                        meta =
                                                            meta +
                                                            " , " +
                                                            i.cDescripcionMetacatalogo +
                                                            ": No";
                                                    }
                                                } else {
                                                    if (i.text) {
                                                        meta =
                                                            meta +
                                                            " , " +
                                                            i.cDescripcionMetacatalogo +
                                                            ": " +
                                                            i.text;
                                                    }
                                                }
                                            }
                                        }
                                    }

                                    this.documentos[x].clasificacion = meta;
                                }
                            }
                            this.documentos[x].errorText = textError;
                            textError = "";
                        }
                    } catch (err) {
                        console.log(err);
                        this.documentos[x].errorText = err.toString();
                        this.documentos[x].valido = false;
                        this.validarGuardado = false;
                    }
                }
            });

            this.documentos = [...this.documentos];
        };
        reader.readAsBinaryString(file);
        excelInput.value = "";
    }

    mensajeError(row: any): void {
        Swal.fire("Error", row.errorText, "error");
    }

    guardarDocumento(): void {
        this.documentos.forEach((row) => {
            this.spinner.show();
            this.loadingIndicator = true;
            if (row.valido) {
                row.usuario = this.menuService.usuario;
                this.documentoService.guardarDocumento(row).subscribe(
                    (resp: any) => {
                        if (resp) {
                            const x = this.documentos.findIndex(
                                (std: { documento: string }) =>
                                    std.documento === row.documento
                            );
                            // Obtenemos el historial de carga
                            this.historialCarga
                                .actualizarDetalle(
                                    { bCargado: true },
                                    row.idDetalle
                                )
                                .subscribe(
                                    (resp: any) => {},
                                    (err) => {
                                        this.spinner.hide();
                                        Swal.fire(
                                            "Error",
                                            "Ocurrió un error al guardar el historial de cargas detalle." +
                                                err.error,
                                            "error"
                                        );
                                    }
                                );
                            this.documentos.splice(x, 1);
                            this.documentos = [...this.documentos];
                            this.obtenerHistorialCarga();
                            this.spinner.hide();
                            if (this.documentos.length === 0) {
                                this.historialCarga
                                    .actualizarHistorial(
                                        { bCompletado: true },
                                        row.idEncabezado
                                    )
                                    .subscribe(
                                        (resp: any) => {
                                            Swal.fire(
                                                "Éxito",
                                                "Documentos guardados. ",
                                                "success"
                                            );
                                            this.selectedHistorial = "";
                                            this.obtenerHistorialCarga();
                                        },
                                        (err) => {
                                            this.spinner.hide();
                                            console.log(err);

                                            if (err.error) {
                                                Swal.fire(
                                                    "Error",
                                                    "Ocurrió un error al guardar el historial de cargas." +
                                                        JSON.stringify(
                                                            err.error
                                                        ),
                                                    "error"
                                                );
                                            }
                                        }
                                    );
                                this.spinner.hide();
                                this.loadingIndicator = false;
                            }
                        } else {
                            this.spinner.hide();
                            Swal.fire(
                                "Error",
                                "Ocurrió un error al guardar. ",
                                "error"
                            );
                        }
                    },
                    (err: any) => {
                        console.log(err);
                        this.spinner.hide();
                        if (err.error.error) {
                            Swal.fire(
                                "Error",
                                "Ocurrió un error al guardar. " +
                                    JSON.stringify(err.error.error),
                                "error"
                            );
                        } else {
                            Swal.fire(
                                "Error",
                                "Ocurrió un error al guardar. " +
                                    JSON.stringify(err.error),
                                "error"
                            );
                        }
                    }
                );
            }
        });
        this.loadingIndicator = false;
    }
    limpiar(): void {
        this.documentos = [];
        this.documentos = [...this.documentos];
        this.documentosTemporal = [];
        this.documentosTemporal = [...this.documentosTemporal];
        this.selectedHistorial = "";
    }

    borrarFiltros(): void {
        // Limpiamos inputs
        this.documentoBusqueda = "";
        this.vigenteBusqueda = "";
        this.selectedInformacion = "";
        this.fechaCreacion = "";
        this.fechaCarga = "";
        this.fechaModificacion = "";
        this.selectTipoDocumento = "";
        this.selectedEntes = "";
        this.selectedExpediente = "";
        this.selectedFolioExpediente = "";
        this.arrMetacatalogos = [];
    }

    selectAll(selected: boolean): void {
        this.documentos.forEach((element) => {
            if (selected) {
                element.selected = true;
            } else {
                element.selected = false;
            }
        });
    }

    async eliminarHistorialCarga(): Promise<void> {
        this.spinner.show();
        Swal.fire({
            title: "¿Está seguro que desea eliminar el historial de carga?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Si",
            cancelButtonText: "No",
        }).then((result) => {
            if (result.value) {
                // realizamos delete
                this.historialCarga
                    .actualizarHistorial(
                        { bActivo: false },
                        this.selectedHistorial
                    )
                    .subscribe(
                        (resp: any) => {
                            this.selectedHistorial = "";
                            this.obtenerHistorialCarga();
                            this.spinner.hide();
                        },
                        (err) => {
                            this.spinner.hide();
                            Swal.fire(
                                "Error",
                                "Ocurrió un error al eliminar el historial de carga." +
                                    err.error,
                                "error"
                            );
                        }
                    );
            }
            this.spinner.hide();
        });
    }

    async readAsDataURL(file) {
        return new Promise((resolve, reject) => {
            let fileReader = new FileReader();
            fileReader.onload = function () {
                return resolve({
                    data: fileReader.result.toString(),
                    name: file.name,
                    size: file.size,
                    type: file.type,
                });
            };
            fileReader.readAsDataURL(file);
        });
    }
}
