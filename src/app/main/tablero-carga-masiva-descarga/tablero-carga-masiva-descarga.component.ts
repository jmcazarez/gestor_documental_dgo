import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatStepper } from '@angular/material/stepper';
import { Router } from "@angular/router";
import { DatePipe } from "@angular/common";
import { DomSanitizer } from "@angular/platform-browser";
import Swal from "sweetalert2";
import { AbstractControl, FormControl, FormGroup, Validators } from "@angular/forms";
import * as XLSX from "xlsx";
import { NgxSpinnerService } from "ngx-spinner";
import * as _ from "lodash";

// Components

// Models
import { HistorialCargaEncabezadoModel } from "models/historial-carga-encabezado.models";
import { DocumentoFormatoExcelModel } from "models/documento-formato-excel.models";

// Services
import { DocumentosService } from "services/documentos.service";
import { MenuService } from "services/menu.service";
import { UsuariosService } from "services/usuarios.service";
import { TipoExpedientesService } from "services/tipo-expedientes.service";
import { UploadFileService } from "services/upload.service";
import { ExportService } from "services/export.service";
import { HistorialCargaService } from "services/historial-carga.service";
import { UsuarioLoginService } from "services/usuario-login.service";
import { LegislaturaService } from "services/legislaturas.service";
import { Console } from "console";
import { isNumber } from "lodash";
import { HttpEventType, HttpResponse } from "@angular/common/http";


@Component({
    selector: 'app-tablero-carga-masiva-descarga',
    templateUrl: './tablero-carga-masiva-descarga.component.html',
    styleUrls: ['./tablero-carga-masiva-descarga.component.scss'],
    providers: [DatePipe],
})
export class TableroCargaMasivaDescargaComponent implements OnInit {

    @ViewChild("fileInput", { static: false }) fileInput: ElementRef;
    @ViewChild("excelInput", { static: false }) excelInput: ElementRef;
    @ViewChild("paginasInput", { static: false }) paginasInput: ElementRef;
    @ViewChild('stepper') private myStepper: MatStepper;
    selectedFiles: FileList;
    cambioFile: boolean;
    paginasEditar: boolean;
    documentoBusqueda: "";
    vigenteBusqueda = "";
    fileUrl: any;
    loadingIndicator: boolean;
    reorderable: boolean;
    cargando: boolean;
    documentos: any[] = [];
    documentosTemporal: any[] = [];
    optAgregar: boolean;
    optConsultar: boolean;
    optEditar: boolean;
    optEliminar: boolean;
    fileBase64: any;
    isLinear = false;
    firstFormGroup: FormGroup;
    secondFormGroup: FormGroup;
    firstFormGroupFiltro: FormGroup;
    secondFormGroupFiltro: FormGroup;
    arrInformacion: any[] = [];
    selectedInformacion = "";
    maxDate = new Date();
    fechaCreacion = "";
    fechaCarga = "";
    fechaModificacion = "";
    arrTipoDocumentos: any[] = [];
    arrExpediente: any[] = [];
    selectTipoDocumento: "";
    selectedEntes: "";
    selectedExpediente: "";
    selectedFolioExpediente: "";
    selectedHistorial: "";
    selectedDescarga: false;
    arrEntes: any[] = [];
    arrLegislaturas: any[] = [];
    arrHistorialCarga: any[] = [];
    arrMetacatalogos: any[] = [];
    arrMetacatalogosFiltro: any[] = [];
    url: string;
    files: any[] = [];
    fileName: string;
    validarGuardado: boolean = false;
    cargarArchivos: boolean = false;
    historialEncabezado: HistorialCargaEncabezadoModel;
    base64: any;
    usuario: any;
    excelSeleccionado: boolean = false;
    /* progressInfo = [] */
    constructor(
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
        this.url = "tablero-de-carga-masiva-y-descarga";
    }

    async ngOnInit(): Promise<void> {
        this.usuario = await this.usuarioLoginService.obtenerUsuario();

        this.selectedHistorial = "";
        // Formulario reactivo
        this.firstFormGroup = new FormGroup({
            historial: new FormControl(""),
        });
        this.secondFormGroup = new FormGroup({
            secondCtrl: new FormControl("", Validators.required),
            documento: new FormControl("", Validators.required),
            selected: new FormControl(false),
        });

        this.firstFormGroupFiltro = new FormGroup({
            selected: new FormControl(false),
            firstCtrl: new FormControl(""),
            documento: new FormControl(""),
            vigente: new FormControl(""),
            informacion: new FormControl(""),
            fechaCreacion: new FormControl(""),
            fechaCarga: new FormControl(""),
            fechaModificacion: new FormControl(""),
            tipoDocumentos: new FormControl(""),
            /*          entes: new FormControl(""),
                     legislatura: new FormControl(""), */
            expediente: new FormControl(""),
            folioExpediente: new FormControl(""),
            historialFiltro: new FormControl(""),
        });
        this.secondFormGroupFiltro = new FormGroup({
            secondCtrl: new FormControl("", Validators.required),
            documento: new FormControl("", Validators.required),
            selected: new FormControl(false),
        });

        this.changeValueDocumento();
        this.changeValueHistorial();
        await Promise.all([
            this.obtenerTiposDocumentos(),
            /*      this.obtenerLegislaturas(),
                 this.obtenerEntes(), */
            this.obtenerTiposExpedientes(),
            this.obtenerHistorialCarga()
        ]);

    }

    get historial(): AbstractControl { return this.firstFormGroup.get('historial'); }

    get secondCtrl(): AbstractControl { return this.secondFormGroup.get('secondCtrl'); }
    get documento(): AbstractControl { return this.secondFormGroup.get('documento'); }
    get selected(): AbstractControl { return this.secondFormGroup.get('selected'); }

    get tipoDocumentos(): AbstractControl { return this.firstFormGroupFiltro.get('tipoDocumentos'); }

    changeValueDocumento() {
        this.firstFormGroupFiltro.get("tipoDocumentos").valueChanges.subscribe((val) => {
            this.arrMetacatalogos = [];
            if (val) {
                const tempMetacatalogos = this.arrTipoDocumentos.filter(
                    (d) => d.id.toLowerCase().indexOf(val.toLowerCase()) !== -1 || !val
                );
                if (tempMetacatalogos[0].metacatalogos) {
                    this.arrMetacatalogos =
                        tempMetacatalogos[0].metacatalogos;

                    for (const i in this.arrMetacatalogos) {
                        this.arrMetacatalogos[i].text = "";
                    }
                    this.arrMetacatalogosFiltro = this.arrMetacatalogos;
                }
                // tslint:disable-next-line: forin
            }
        });
    }

    uploadFiles() {
        
        for (let i = 0; i < this.selectedFiles.length; i++) {

            this.upload(i, this.selectedFiles[i]);
        }

    }

    selectFiles(event) {
        /* this.progressInfo = []; */
        event.target.files.length == 1 ? this.fileName = event.target.files[0].name : this.fileName = event.target.files.length + " archivos";
        this.selectedFiles = event.target.files;
    }

    async upload(index, file) {
      


        this.documentos[index].progress = { value: 0, fileName: file.name }
        return new Promise<string>(async (resolve) => {
            await this.uploadService.upload(file).subscribe(
                event => {

                    if (event.type === HttpEventType.UploadProgress) {
                        this.documentos[index].progress.value = Math.round(100 * event.loaded / event.total);
                        if (this.documentos[index].progress.value == 100) {

                        }
                    } else if (event instanceof HttpResponse) {
                       
                        resolve(event.body[0])
                    }
                },
                err => {
                    this.documentos[index].progress.value = 0;
                });

        })


    }

    changeValueHistorial() {

        this.firstFormGroup.get("historial").valueChanges.subscribe((val) => {
            this.selectedHistorial = val;
            this.documentos = [];
            let tempHistorial: any;
            const fecha = new Date(); // Fecha actual

            if (val) {
                this.myStepper.next();
                tempHistorial = this.arrHistorialCarga.filter(
                    (d) => d.id.toLowerCase().indexOf(val.toLowerCase()) !== -1 || !val
                );
                if (tempHistorial[0]) {
                    if (tempHistorial[0].historial_carga_detalles) {
                        tempHistorial[0].historial_carga_detalles.forEach(async (element) => {
                            if (element.documento && element.bCargado === false) {
                                const doc: any = await this.obtenerDocumento(element.documento.id);
                               
                                let documento = new DocumentoFormatoExcelModel();
                                documento.id = element.documento.id;
                                documento.cNombreDocumento = element.documento.name;
                                documento.metacatalogos = [];
                                /*      documento.cLegislatura = '';
                                     documento.idLegislatura = '';
                                     documento.cTema = '';
                                     documento.cComision = '';
                                     documento.cSolicitante = '';
                                     documento.cEntidad = '';
                                     documento.cPeriodo = '';
                                     documento.nNumeroPeriodico = 0; 
                                     documento.nIdActa = 0;
                                     documento.cActa = '';
                                     documento.cHora = '';
                                     documento.cTipoSesion = '';*/
                                documento.cDocumento = '';

                                documento.tipoDocumento = '';
                                documento.tipo_de_documento = '';
                                documento.informacion = '';
                                documento.visibilidade = '';
                                documento.tipoDocumento = '';
                                documento.folioExpediente = '';
                                documento.paginas = 0;
                                documento.fechaCreacion = element.createdAt;
                                documento.fechaCarga = this.datePipe.transform(fecha, "yyyy-MM-dd")
                                    + "T06:00:00.000Z";
                                documento.fechaCreacionDate = this.datePipe.transform(new Date(element.createdAt), "dd-MM-yyyy");
                                documento.fechaCargaDate = this.datePipe.transform(fecha, "dd-MM-yyyy");
                                documento.metacatalogos = [];
                                documento.clasificacion = '';
                                documento.tipo_de_expediente = '';
                                documento.expediente = '';
                                documento.idExpediente = tempHistorial[0].id;
                                documento.idDetalle = tempHistorial[0].historial_carga_detalles[0].id;
                                documento.valido = false;
                                documento.bActivo = false;
                                documento.filePDF = null;
                                documento.fileBase = null;
                                documento.progress = { value: 0, fileName: '' }
                                this.documentos.push(documento);

                                this.documentos = [...this.documentos];
                            }
                        });
                    }
                }
            }
        });

    }

    async obtenerDocumento(id: any) {
        return new Promise((resolve) => {
            this.documentoService.obtenerDocumentoById(id).subscribe((resp: any) => {
                
                resolve(resp.data);
            },
                (err) => {
                    resolve(null);
                });
        });
    }

    obtenerTiposDocumentos(): Promise<any> {
        return new Promise((resolve) => {
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
            resolve(this.arrInformacion);
        });
    }

    obtenerTiposExpedientes(): Promise<any> {
        return new Promise((resolve) => {
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
                    resolve(this.arrExpediente);
                },
                (err) => {
                    Swal.fire(
                        "Error",
                        "Ocurrió un error al obtener los tipos de expedientes.",
                        "error"
                    );
                    resolve(err);
                });
        });
    }

    obtenerEntes(): Promise<any> {
        return new Promise((resolve) => {
            // Obtenemos los entes
            this.usuariosService.obtenerEntes().subscribe(
                (resp: any) => {
                    this.arrEntes = resp;
                    resolve(this.arrEntes);
                },
                (err) => {
                    Swal.fire(
                        "Error",
                        "Ocurrió un error al obtener los entes.",
                        "error"
                    );
                    resolve(err);
                });
        });
    }

    obtenerLegislaturas(): Promise<any> {
        return new Promise((resolve) => {
            // Obtenemos secretarias
            this.legislaturaService.obtenerLegislatura().subscribe((resp: any) => {
                this.arrLegislaturas = resp;
                resolve(this.arrLegislaturas);
            },
                (err) => {
                    Swal.fire(
                        "Error",
                        "Ocurrió un error obtener las legislaturas.",
                        "error"
                    );
                    resolve(err);
                });
        });
    }

    obtenerHistorialCarga(): Promise<any> {
        return new Promise((resolve) => {
            // Obtenemos el historial de carga
            this.historialCarga.obtenerHistorialCarga(this.usuario[0].data.id).subscribe((resp: any) => {
                this.arrHistorialCarga = resp;
                resolve(this.arrHistorialCarga);
            },
                (err) => {
                    Swal.fire(
                        "Error",
                        "Ocurrió un error al  obtener el historial de cargas.",
                        "error"
                    );
                    this.arrHistorialCarga = [];
                    resolve(err);
                });
        });
    }

    cargarDocumentos(): void {
        this.loadingIndicator = true;
        this.spinner.show();
        // Agregamos elemento file
        this.fileInput.nativeElement.click();
        let fileInput = this.fileInput.nativeElement;
        fileInput.onchange = async (event) => {
            let matchDocFile = 0;
            let index = 0;
            let encontrado: boolean = false;

            if (fileInput.files.length > 0) {
                this.cargarArchivos = false;
                for (const documento of this.documentos) {
                    for (const pdf of fileInput.files) {
                        if (pdf.name.trim() == documento.cNombreDocumento.trim()) {
                            matchDocFile = matchDocFile + 1;
                            /*   documento.fileBase = await this.readAsDataURL(pdf); */
                            documento.filePDF = pdf;
                            encontrado = true;
                            break;
                        }
                    }
                    if (encontrado) {
                        if (documento.valido) {
                            documento.bActivo = true;
                        } else {
                            documento.bActivo = false;
                        }
                    } else {
                        documento.fileBase = null;
                        documento.filePDF = null;
                        documento.valido = false;
                        documento.bActivo = false;
                        if (documento.errorText.length == 0) {
                            documento.errorText = "El documento PDF es obligatorio";
                        } else {
                            documento.errorText = documento.errorText + ", el documento PDF es obligatorio";
                        }
                    }
                    encontrado = false;
                    index = index + 1;
                }
                this.loadingIndicator = false;
                this.spinner.hide();
                this.validarGuardado = (matchDocFile > 0) ? true : false;
                if (matchDocFile < this.documentos.length) {
                    Swal.fire(
                        "Estimado usuario:",
                        "El total de archivos subidos (" + matchDocFile + ") es menor al total de registros del excel" +
                        "(" + this.documentos.length + ") se recomienda eliminar dichos registros en el Excel para completar" +
                        " la carga y puedan ser guardados, de lo contrario quedaran como carga pendiente y solo se " +
                        "guardaron los verificados.",
                        "warning"
                    );
                } else if (matchDocFile > this.documentos.length) {
                    Swal.fire(
                        "Estimado usuario:",
                        "El total de archivos seleccionados (" + matchDocFile + ") es mayor al total de registros del excel" +
                        "(" + this.documentos.length + "), por lo que los archivos restantes no se tomaron en cuenta en la subida.",
                        "warning"
                    );
                } else {
                    Swal.fire(
                        "Exito",
                        "Los archivos subidos fueron validados exitosamente con los documentos.",
                        "success"
                    );
                }
            } else {
                this.validarGuardado = false;
                this.loadingIndicator = false;
                this.spinner.hide();
                Swal.fire(
                    "Estimado usuario:",
                    "No seleccionó los archivos de los documentos para subir",
                    "warning"
                );
                fileInput.value = "";
                return;
            }
        };
    }

    descargarFormatoExcel(): void {
        this.exportExcel.exportAsExcelFile(
            this.documentosTemporal,
            "formatoDeCarga"
        );
    }

    getNumbersInString(string: string): string {
        const tmp = string.split("");
        const map = tmp.map((current) => {
            if (!isNaN(parseInt(current))) {
                return current;
            }
        });

        const numbers = map.filter((value) => value != undefined);

        return numbers.join("");
    }

    subirExcel(): void {
        const excelInput = this.excelInput.nativeElement;

        excelInput.click();
    }
    onFileChange(ev: any): void {

        try {


            this.loadingIndicator = true;
            this.spinner.show();
            this.documentos = [];
            let workBook = null;
            let jsonData = null;
            const file = ev.target.files[0];
            const excelInput = this.excelInput.nativeElement;
            this.excelSeleccionado = true;
            const reader = new FileReader();
            reader.onload = async (event) => {
                this.myStepper.next();
                const data = reader.result;

                workBook = XLSX.read(data, { type: "binary" });
                jsonData = workBook.SheetNames.reduce((initial, name) => {
                    const sheet = workBook.Sheets[name];
                    initial[name] = XLSX.utils.sheet_to_json(sheet);
                    return initial;
                }, {});
                if (!_.has(jsonData, 'data')) {
                    this.loadingIndicator = false;
                    this.spinner.hide();
                    Swal.fire(
                        'Error',
                        'El archivo seleccionado ' + file.name + ', no contiene hoja con nombre (data). Por favor, intente de nuevo.',
                        'error'
                    );
                    this.excelSeleccionado = false;
                    excelInput.value = "";
                    this.myStepper.previous();
                    return;
                }
                this.cargarArchivos = true;

                jsonData['data'].forEach((row) => {
                    try {



                        let textError = "";
                        this.arrMetacatalogos = [];
                        let documento = new DocumentoFormatoExcelModel;
                        const fechaHoy: any = new Date();
                        documento.metacatalogos = [];
                        if (_.has(row, 'DOCUMENTO') && row['DOCUMENTO'].length > 0) {
                            if (_.has(row, 'DOCUMENTO') && row['DOCUMENTO'].length > 0) {
                                documento.cNombreDocumento = row['DOCUMENTO'].trim();
                            } else {
                                if (textError.length == 0) {
                                    textError =
                                        "El nombre del documento es obligatorio";
                                } else {
                                    textError =
                                        textError +
                                        ", el nombre del documento es obligatorio";
                                }
                            }


                            if (_.has(row, 'NUMERO DE CAJA')) {

                                if (Number(row['NUMERO DE CAJA'])) {
                                    documento.folioExpediente = String(row['NUMERO DE CAJA']);
                                } else {
                                    documento.folioExpediente = String(row['NUMERO DE CAJA'].trim());
                                }



                            } else {
                                if (textError.length == 0) {
                                    textError =
                                        "El Nro. de caja es obligatorio";
                                } else {
                                    textError =
                                        textError +
                                        ", el Nro. de caja es obligatorio";
                                }
                            }
                            if (_.has(row, 'TIPO DOCUMENTAL') && row['TIPO DOCUMENTAL'].length > 0) {

                                const encontro = this.menuService.tipoDocumentos.find(
                                    (tipo: { cDescripcionTipoDocumento: any; }) =>
                                        this.normalize(tipo.cDescripcionTipoDocumento.trim().toLowerCase()) == row['TIPO DOCUMENTAL'].trim().toLowerCase()
                                );
                                if (encontro) {
                                    if (encontro.Agregar === "undefined") {
                                        if (textError.length == 0) {
                                            textError =
                                                "El tipo de documento es obligatorio";
                                        } else {
                                            textError =
                                                textError +
                                                ", el tipo de documento es obligatorio";
                                        }
                                    } else {
                                        documento.tipoDocumento = row['TIPO DOCUMENTAL'];
                                        documento.tipo_de_documento = encontro.id;
                                        this.arrMetacatalogos = encontro.metacatalogos;
                                        documento.visibilidade = encontro.visibilidade;

                                        if (this.arrMetacatalogos.length > 0) {
                                            for (let i = 0; i < this.arrMetacatalogos.length; i++) {
                                                let valido = false;

                                            }
                                        }

                                    }
                                } else {
                                    documento.tipoDocumento = row['TIPO DOCUMENTAL'];
                                    if (textError.length == 0) {
                                        textError = "El tipo de documento es obligatorio";
                                    } else {
                                        textError = textError + ", el tipo de documento es obligatorio";
                                    }
                                }
                            } else {
                                if (textError.length == 0) {
                                    textError = "El tipo de documento es obligatorio";
                                } else {
                                    textError = textError + ", el tipo de documento es obligatorio";
                                }
                            }


                            /*       if (_.has(row, 'FOLIO EXPEDIENTE') && Number(row['FOLIO EXPEDIENTE'])) {
                                      if (_.has(row, 'TIPO DOCUMENTAL') && row['TIPO DOCUMENTAL'].length > 0 &&
                                          this.normalize(row['TIPO DOCUMENTAL'].toUpperCase()) === 'ACTA') {
                                          documento.folioExpediente = "";
                                      } else {
                                          documento.folioExpediente = String(
                                              row["FOLIO EXPEDIENTE"]
                                          );
                                      }
                                  } else {
                                      if (_.has(row, 'TIPO DOCUMENTAL') && row['TIPO DOCUMENTAL'].length > 0 &&
                                          this.normalize(row['TIPO DOCUMENTAL'].toUpperCase()) === 'ACTA') {
                                          documento.folioExpediente = '';
                                      } else {
                                          if (textError.length > 0) {
                                              textError =
                                                  "El folio de expediente es obligatorio";
                                          } else {
                                              textError =
                                                  textError +
                                                  ", el folio de expediente es obligatorio";
                                          }
                                      }
                  
                                  } */

                            if (_.has(row, 'FECHA') && new Date(row["FECHA"])) {
                                const fecha = new Date((row["FECHA"] - (25567 + 2)) * 86400 * 1000);
                                documento.fechaCreacion = this.datePipe.transform(fecha, "yyyy-MM-dd")
                                    + "T06:00:00.000Z";
                                documento.fechaCreacionDate = this.datePipe.transform(fecha, "dd-MM-yyyy");

                            } else {
                                if (textError.length == 0) {
                                    textError =
                                        "La fecha de ingreso obligatorio";
                                } else {
                                    textError =
                                        textError +
                                        ", la fecha de ingreso obligatorio";
                                }
                            }

                            documento.paginas = 0;
                            documento.fechaCarga = this.datePipe.transform(fechaHoy, "yyyy-MM-dd") + "T06:00:00.000Z";
                            documento.fechaCargaDate = this.datePipe.transform(fechaHoy, "dd-MM-yyyy");
                            documento.metacatalogos = this.arrMetacatalogos;

                            if (_.has(row, 'PLAZO DE CONSERVACION') && (row['PLAZO DE CONSERVACION'].length > 0 || isNumber(row['PLAZO DE CONSERVACION']))) {
                                if (isNumber(row['PLAZO DE CONSERVACION'])) {
                                    documento.plazoDeConservacion = String(
                                        row["PLAZO DE CONSERVACION"]
                                    );
                                } else {
                                    documento.plazoDeConservacion = row['PLAZO DE CONSERVACION'].trim();
                                }

                            } else {
                                if (textError.length == 0) {
                                    textError =
                                        "El plazo de conservación es obligatorio";
                                } else {
                                    textError =
                                        textError +
                                        ", el plazo de conservación es obligatorio";
                                }
                            }


                            if (_.has(row, 'CLAVE') && (row['CLAVE'].length > 0 || isNumber(row['CLAVE']))) {
                                if (isNumber(row['CLAVE'])) {
                                    documento.clave = String(
                                        row["CLAVE"]
                                    );
                                } else {
                                    documento.clave = row['CLAVE'].trim();
                                }
                            } else {
                                if (textError.length == 0) {
                                    textError =
                                        "La clave es obligatorio";
                                } else {
                                    textError =
                                        textError +
                                        ", la clave es obligatorio";
                                }
                            }

                            if (_.has(row, 'PASILLO') && (row['PASILLO'].length > 0 || isNumber(row['PASILLO']))) {
                                if (isNumber(row['PASILLO'])) {
                                    documento.pasillo = String(
                                        row["PASILLO"]
                                    );
                                } else {
                                    documento.pasillo = row['PASILLO'].trim();
                                }
                            } else {
                                if (textError.length == 0) {
                                    textError =
                                        "La clave es obligatorio";
                                } else {
                                    textError =
                                        textError +
                                        ", la clave es obligatorio";
                                }
                            }


                            if (_.has(row, 'ESTANTE') && (row['ESTANTE'].length > 0 || isNumber(row['ESTANTE']))) {
                                if (isNumber(row['ESTANTE'])) {
                                    documento.estante = String(
                                        row["ESTANTE"]
                                    );
                                } else {
                                    documento.estante = row['ESTANTE'].trim();
                                }
                            } else {
                                if (textError.length == 0) {
                                    textError =
                                        "La clave es obligatorio";
                                } else {
                                    textError =
                                        textError +
                                        ", la clave es obligatorio";
                                }
                            }

                            if (_.has(row, 'NIVEL') && (row['NIVEL'].length > 0 || isNumber(row['NIVEL']))) {
                                if (isNumber(row['NIVEL'])) {
                                    documento.nivel = String(
                                        row["NIVEL"]
                                    );
                                } else {
                                    documento.plazoDeConservacion = row['NIVEL'].trim();
                                }
                            } else {
                                if (textError.length == 0) {
                                    textError =
                                        "La clave es obligatorio";
                                } else {
                                    textError =
                                        textError +
                                        ", la clave es obligatorio";
                                }
                            }

                            if (_.has(row, 'SECCION') && (row['SECCION'].length > 0 || isNumber(row['SECCION']))) {
                                if (isNumber(row['SECCION'])) {
                                    documento.seccion = String(
                                        row["SECCION"]
                                    );
                                } else {
                                    documento.seccion = row['SECCION'].trim();
                                }
                            } else {
                                if (textError.length == 0) {
                                    textError =
                                        "La clave es obligatorio";
                                } else {
                                    textError =
                                        textError +
                                        ", la clave es obligatorio";
                                }
                            }





                            /* 
                            
                                            if (_.has(row, 'LEGISLATURA') && row['LEGISLATURA'].length > 0) {
                                                const encontro = this.arrLegislaturas.find((legislatura: { cLegislatura: any }) =>
                                                    legislatura.cLegislatura.trim().toUpperCase() == row["LEGISLATURA"].trim().toUpperCase()
                                                );
                                                if (encontro) {
                                                    documento.cLegislatura = row['LEGISLATURA'];
                                                    documento.idLegislatura = encontro["id"];
                                                } else {
                                                    if (textError.length == 0) {
                                                        textError = "La legislatura es obligatoria";
                                                    } else {
                                                        textError = textError + ", la legislatura es obligatoria";
                                                    }
                                                }
                                            } else {
                                                if (textError.length == 0) {
                                                    textError = "La legislatura es obligatoria";
                                                } else {
                                                    textError = textError + ", la legislatura es obligatoria";
                                                }
                                            } */

                            let meta = "";

                            const keys = Object.keys(row);
                            let iMeta = 0;
                            for (let i = 10; i < keys.length; i++) {

                                documento.metacatalogos[iMeta].text = String(row[keys[i]]);
                                iMeta++
                            };


                            for (const i of documento.metacatalogos) {

                                if (meta === "") {
                                    if (i.bOligatorio && i.text == '') {
                                        meta = meta + i.cDescripcionMetacatalogo + ": " + '';
                                        if (textError.length == 0) {
                                            textError =
                                                "El metacatalogo " + i.cDescripcionMetacatalogo + " es obligatorio";
                                        } else {
                                            textError =
                                                textError +
                                                ", el metacatalogo " + i.cDescripcionMetacatalogo + " es obligatorio";
                                        }

                                    } else {
                                        if (i.cTipoMetacatalogo === "Fecha") {

                                            if (new Date(i.text)) {
                                                meta = meta + i.cDescripcionMetacatalogo + ": " +
                                                    this.datePipe.transform(i.text, "yyyy-MM-dd") + "T06:00:00.000Z";
                                            } else {
                                                if (textError.length == 0) {
                                                    textError =
                                                        "El metacatalogo " + i.cDescripcionMetacatalogo + " tiene un valor no valido";
                                                } else {
                                                    textError =
                                                        textError +
                                                        ", el metacatalogo " + i.cDescripcionMetacatalogo + " tiene un valor no valido";
                                                }
                                            }

                                        } else {

                                            meta = meta + i.cDescripcionMetacatalogo + ": " + i.text;

                                        }
                                    }



                                } else {

                                    if (i.bOligatorio && i.text == '') {
                                        meta = meta + i.cDescripcionMetacatalogo + ": " + '';
                                        if (textError.length == 0) {
                                            textError =
                                                "El metacatalogo " + i.cDescripcionMetacatalogo + " es obligatorio";
                                        } else {
                                            textError =
                                                textError +
                                                ", el metacatalogo " + i.cDescripcionMetacatalogo + " es obligatorio";
                                        }

                                    } else {
                                        if (i.cTipoMetacatalogo === "Fecha") {

                                            if (new Date(i.text)) {
                                                meta = meta + " , " + i.cDescripcionMetacatalogo + ": " +
                                                    this.datePipe.transform(i.text, "yyyy-MM-dd") + "T06:00:00.000Z";

                                            } else {
                                                if (textError.length == 0) {
                                                    textError =
                                                        "El metacatalogo " + i.cDescripcionMetacatalogo + " tiene un valor no valido";
                                                } else {
                                                    textError =
                                                        textError +
                                                        ", el metacatalogo " + i.cDescripcionMetacatalogo + " tiene un valor no valido";
                                                }
                                            }

                                        } else if (i.cTipoMetacatalogo === "Sí o no") {
                                            if (i.text) {
                                                meta = meta + " , " + i.cDescripcionMetacatalogo + ": Sí";
                                            } else {
                                                meta = meta + " , " + i.cDescripcionMetacatalogo + ": No";
                                            }
                                        } else {

                                            meta = meta + " , " + i.cDescripcionMetacatalogo + ": " + i.text;

                                        }
                                    }
                                }
                            }

                            /*  for (var x in row) if (row.hasOwnProperty(x)) {
                                console.log(x);
                             } */

                            documento.clasificacion = meta;
                            /* console.log( documento.clasificacion); */
                            let arrExpedienteTipo: any[]

                            if (row["TIPO DOCUMENTAL"]) {
                                arrExpedienteTipo = this.arrExpediente.filter(
                                    (d) =>

                                        this.normalize(d.descripcionTiposDocumentos
                                            .toLowerCase())
                                            .indexOf(this.normalize(row["TIPO DOCUMENTAL"]).toLowerCase()) !== -1


                                );

                            } else {
                                if (textError.length > 0) {
                                    textError =
                                        "Formato de carga mal formado.";
                                } else {
                                    textError =
                                        textError +
                                        ", el formato de carga esta mal formado";
                                }
                            }

                            /* 
                                           const arrExpedienteTipo: any = this.arrExpediente.filter((d) => {
                                                if (row["TIPO DOCUMENTAL"]) {
                            
                                                    d.descripcionTiposDocumentos.toLowerCase().indexOf(row["TIPO DOCUMENTAL"].toLowerCase()) !== -1 
                                                 //   this.normalize(d.descripcionTiposDocumentos.toLowerCase()).indexOf(row["TIPO DOCUMENTAL"].toLowerCase()) !== -1
                                                }else{
                                                    if (textError.length > 0) {
                                                        textError =
                                                            "Formato de carga mal formado.";
                                                    } else {
                                                        textError =
                                                            textError +
                                                            ", el formato de carga esta mal formado";
                                                    }
                                                }
                                            }); */

                         

                            documento.progress = { value: 0, fileName: '' }
                            if (arrExpedienteTipo.length > 0) {
                                documento.tipo_de_expediente =
                                    arrExpedienteTipo[0].id;
                                documento.expediente =
                                    arrExpedienteTipo[0].cDescripcionTipoExpediente;
                                documento.idExpediente =
                                    arrExpedienteTipo[0].id;
                            } else {
                                if (textError.length > 0) {
                                    textError =
                                        "El tipo de documento no corresponde al tipo de expediente.";
                                } else {
                                    textError =
                                        textError +
                                        ", el tipo de documento no corresponde al tipo de expediente";
                                }
                            }

                            documento.errorText = textError;

                            if (documento.errorText.length === 0) {
                                documento.valido = true;
                            } else {
                                documento.valido = false;
                            }

                            documento.bActivo = false;

                            this.documentos.push(documento);
                            textError = '';
                        }
                    } catch (error) {
                        this.spinner.hide();
                        console.log(error);
                    }
                });
                this.documentos = [...this.documentos];
                this.loadingIndicator = false;
                this.spinner.hide();
                excelInput.value = "";
            };

            reader.readAsBinaryString(file);

        } catch (error) {


        }
    }

    validarTipoMetaDato(tipo: any, campo: any, indice: number) {
        if (this.arrMetacatalogos[indice].bOligatorio) {
            if (String(campo).length > 0) {
                if (this.arrMetacatalogos[indice].cTipoMetacatalogo === "Fecha") {
                    if (new Date(campo)) {
                        this.arrMetacatalogos[indice].text = this.datePipe.transform(
                            campo, "yyyy-MM-dd") + "T06:00:00.000Z";
                    } else {
                        return false;
                    }
                } else if (this.arrMetacatalogos[indice].cTipoMetacatalogo === "Sí o no" ||
                    this.arrMetacatalogos[indice].cTipoMetacatalogo === "Texto") {
                    if (String(campo)) {
                        this.arrMetacatalogos[indice].text = String(campo);
                    } else {
                        return false;
                    }
                } else if (this.arrMetacatalogos[indice].cTipoMetacatalogo === "Numérico") {
                    if (Number(campo)) {
                        this.arrMetacatalogos[indice].text = Number(campo);
                    } else {
                        return false;
                    }
                }
            }
        } else {
            if (this.arrMetacatalogos[indice].cTipoMetacatalogo === "Fecha") {
                if (new Date(campo)) {
                    if (campo) {
                        this.arrMetacatalogos[indice].text = this.datePipe.transform(
                            campo, "yyyy-MM-dd") + "T06:00:00.000Z";
                    } else {
                        this.arrMetacatalogos[indice].text = "";
                    }
                } else {
                    this.arrMetacatalogos[indice].text = "";
                }
            } else if (this.arrMetacatalogos[indice].cTipoMetacatalogo === "Sí o no" ||
                this.arrMetacatalogos[indice].cTipoMetacatalogo === "Texto") {
                if (String(campo)) {
                    this.arrMetacatalogos[indice].text = String(campo);
                } else {
                    this.arrMetacatalogos[indice].text = "";
                }
            } else if (this.arrMetacatalogos[indice].cTipoMetacatalogo === "Numérico") {
                if (Number(campo)) {
                    this.arrMetacatalogos[indice].text = Number(campo);
                } else {
                    this.arrMetacatalogos[indice].text = "";
                }
            }
        }
        return true;

    }

    mensajeError(row: any): void {
        Swal.fire("Error", row.errorText, "error");
    }

    async guardarDocumento(): Promise<any> {
        Swal.fire({
            title: 'Carga masiva de documentos',
            text: '¿Desea realizar la carga masiva de los documentos?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#039BE5',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si',
            cancelButtonText: 'No'
        }).then(async (result: any) => {
            if (result.value) {

                await this.confirmarGuardarDocumentos();
            }
        });
    }

    async confirmarGuardarDocumentos() {
        this.historialCarga.guardarHistorial({ cUsuario: this.menuService.usuario })
            .subscribe(async (resp: any) => {
                if (resp.data) {
                    await this.subirDocumentos(resp.data.id);
                } else {
                    this.arrHistorialCarga = [];
                    this.limpiar();
                    await this.obtenerHistorialCarga();
                    Swal.fire(
                        "Error",
                        "Ocurrió un error al guardar el historial de cargas.",
                        "error"
                    );
                }
            }, async (err: any) => {
                this.arrHistorialCarga = [];
                this.limpiar();
                await this.obtenerHistorialCarga();
                Swal.fire(
                    "Error",
                    "Ocurrió un error al guardar el historial de cargas.",
                    "error"
                );
            });
    }

    async subirDocumentos(idHistorial) {
        return new Promise(async (resolve) => {
            //  this.spinner.show();
            this.loadingIndicator = true;
            const fecha = new Date(); // Fecha actual
            let index = 0;
            let resp: any;
        
            for (const row of this.documentos) {
                /*             const idx = this.documentos.findIndex(object => {
                      return object.cNombreDocumento === file.name;
                    }); */


                // Agregamos elemento file
                row.usuario = this.menuService.usuario;
                row.idEncabezado = idHistorial;
                /*     const hCarga = await this.historialCarga.guardarHistorialDetalle(
                        {
                            documento: '',
                            historial_carga_encabezados: [
                                idHistorial,
                            ],
                        }); */
                /*   if (hCarga.error) {
                      console.log("Error al guardar detalle del historial: " + idHistorial);
                  } else {
                     
                  } */

                row.documento = '';
                row.version = '';
                row.fechaCarga = this.datePipe.transform(fecha, "yyyy-MM-dd") + "T06:00:00.000Z";
                /*   row.idDetalle = hCarga.data.id; */
                if (row.bActivo) {
                    //heber
                    for (let i = 0; i < this.selectedFiles.length; i++) {
                        if (this.selectedFiles[i].name.trim() == row.cNombreDocumento.trim()) {
                            resp = await this.upload(index, this.selectedFiles[i]);


                            break;
                        }
                    }

                    if (resp) {
                        row.documento = resp.id;
                        row.version = 1;

                        this.uploadService.subirOCR(resp);
                        await this.documentoService.guardarDocumento(row).subscribe((resp: any) => {
                            // Actualizamos el detalle del historial de carga
                            /*    this.historialCarga.actualizarDetalle({ bCargado: true }, row.idDetalle).subscribe(
                                   (resp: any) => { }); */
                        },
                            (err: any) => {
                                console.log('Error al guardar documento ' + row.cNombreDocumento);
                                /*  this.historialCarga.actualizarDetalle({ bCargado: false }, row.idDetalle).subscribe(
                                     (resp: any) => { }); */
                            });

                    } else {

                        Swal.fire(
                            "Error",
                            "Ocurrió un error al subir el documento.",
                            "error"
                        );
                    }
                    /*   this.upload(index, row.filePDF); */
                    /*     const resultado = await this.uploadService.subirArchivo(
                            { name: row.filePDF.name },
                            row.fileBase.data
                        );
                        setTimeout(() => {
                        }, 1500);
                        if (resultado.error) {
                            console.log("Error upload archivo: " + row.filePDF.name);
                        } */



                } else {
                    /*   this.documentoService.guardarDocumento(row).subscribe((resp: any) => {
                          // Actualizamos el detalle del historial de carga
                          this.historialCarga.actualizarDetalle({ bCargado: true }, row.idDetalle).subscribe(
                              (resp: any) => { });
                      },
                          (err: any) => {
                              console.log('Error al guardar documento ' + row.cNombreDocumento);
                              this.historialCarga.actualizarDetalle({ bCargado: false }, row.idDetalle).subscribe(
                                  (resp: any) => { });
                          }); */
                }
                /* row.fileBase.data = ''; */
                index++
            };

            Swal.fire(
                "Éxito",
                "Documentos guardados. ",
                "success"
            );
            resolve(true);

            /*    this.historialCarga.actualizarHistorial({ bCompletado: true }, idHistorial)
                   .subscribe(async (resp: any) => {
                       this.loadingIndicator = false;
                       this.spinner.hide();
                       this.arrHistorialCarga = [];
                       this.limpiar();
                       await this.obtenerHistorialCarga();
                       this.limpiar();
                       Swal.fire(
                           "Éxito",
                           "Documentos guardados. ",
                           "success"
                       );
                       resolve(true);
                   },
                       async (err) => {
                           this.loadingIndicator = false;
                           this.spinner.hide();
                           this.selectedHistorial = "";
                           this.arrHistorialCarga = [];
                           this.limpiar();
                           await this.obtenerHistorialCarga();
                           this.limpiar();
                           Swal.fire(
                               "Error",
                               "Ocurrió un error al actualizar el historial.",
                               "error"
                           );
                           resolve(true);
                       }); */

        });
    }

    limpiar(): void {
        this.documentos = [];
        this.documentosTemporal = [];
        this.selectedHistorial = "";
        this.excelSeleccionado = false;
        this.cargarArchivos = false;
        this.validarGuardado = false;
        this.myStepper.previous();
        this.fileInput.nativeElement.value = "";
        window.scroll(0, 0);
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
        this.arrMetacatalogosFiltro = [];
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
                this.historialCarga.actualizarHistorial({ bActivo: false }, this.selectedHistorial)
                    .subscribe(async (resp: any) => {
                        this.selectedHistorial = "";
                        this.arrHistorialCarga = [];
                        await this.obtenerHistorialCarga();
                        this.myStepper.previous();
                        window.scroll(0, 0);
                        this.spinner.hide();
                    },
                        (err) => {
                            this.spinner.hide();
                            Swal.fire(
                                "Error",
                                "Ocurrió un error al eliminar el historial de carga.",
                                "error"
                            );
                        });
            }
        });
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
                                            progress: { value: 0, fileName: '' },
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
                                            idExpediente
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
                        for (const i of this.arrMetacatalogosFiltro) {
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

    async descargarDocumento(row: any): Promise<void> {
        // Descargamos el documento
     
        let idx = this.documentos.findIndex(
            (doc) => doc.id === row.id
        );

        this.uploadService.download(row.idDocumento).subscribe(
            event => {


                if (event.type === HttpEventType.DownloadProgress) {
                    
                    if (this.documentos[idx]) {
                        this.documentos[idx].progress.value = Math.round(100 * event.loaded / event.total);
                    }
                } else if (event instanceof HttpResponse) {
                    const filePath = window.URL.createObjectURL(event.body);

                    const downloadLink = document.createElement('a');
                    const fileName = row.idDocumento;

                    downloadLink.href = filePath;
                    downloadLink.download = fileName;
                    downloadLink.click();
                }
            },
            err => {
                console.log(err);
            });
    }

    descargarDocumentos(): void {
        this.spinner.show();
        let index = 0;
        this.documentos.forEach(async (element) => {
            this.documentos[index].progress = { value: 0, fileName: '' }

            if (element.selected && String(element.idDocumento).length > 0) {
                let idx = index

                //this.documentoService.dowloadDocumentStrapi('http://138.185.2.214:64082/uploads/53_42_01_01_2017_FERIAS_Y_ESPECTACULOS_85ee493739.pdf')
                this.uploadService.download(element.idDocumento).subscribe(
                    event => {


                        if (event.type === HttpEventType.DownloadProgress) {
                        
                            if (this.documentos[idx]) {
                                this.documentos[idx].progress.value = Math.round(100 * event.loaded / event.total);
                            }
                        } else if (event instanceof HttpResponse) {
                            
                            const filePath = window.URL.createObjectURL(event.body);

                            const downloadLink = document.createElement('a');
                            const fileName = element.idDocumento;

                            downloadLink.href = filePath;
                            downloadLink.download = fileName;
                            downloadLink.click();
                        }
                    },
                    err => {
                        console.log(err);
                    });

                /*  await this.documentoService.dowloadDocument(element.idDocumento, element.id, this.menuService.usuario, element.cNombreDocumento).subscribe((resp: any) => {
 
                     const filePath = window.URL.createObjectURL(resp);
         
                     const downloadLink = document.createElement('a');
                     const fileName = element.idDocumento;
         
                     downloadLink.href = filePath;
                     downloadLink.download = fileName;
                     downloadLink.click();
                  
                 }, err => {
                     this.spinner.hide();
                     Swal.fire(
                         'Error',
                         'Ocurrió un error al descargar el documento.' + err,
                         'error'
                     );
                     this.loadingIndicator = false;
                 }); */
            } else {
                this.spinner.hide();
            }
            index++
            this.spinner.hide();
        });
    }

    convertFile(buf: any): string {
        // Convertimos el resultado en binstring
        const binstr = Array.prototype.map
            .call(buf, (ch: number) => String.fromCharCode(ch))
            .join("");
        return btoa(binstr);
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

    async readAsDataURL(file: File) {
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

    normalize(str: string): any {
        let from = "ÃÀÁÄÂÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛãàáäâèéëêìíïîòóöôùúüûÑñÇç",
            to = "AAAAAEEEEIIIIOOOOUUUUaaaaaeeeeiiiioooouuuunncc",
            mapping = {};

        for (let i = 0, j = from.length; i < j; i++)
            mapping[from.charAt(i)] = to.charAt(i);

        let ret = [];
        for (let i = 0, j = str.length; i < j; i++) {
            const c = str.charAt(i);
            if (mapping.hasOwnProperty(str.charAt(i)))
                ret.push(mapping[c]);
            else
                ret.push(c);
        }
        return ret.join('');
    }
}
