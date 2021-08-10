import {
    Component,
    OnInit,
    Inject,
    ViewChild,
    ElementRef,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import Swal from "sweetalert2";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

import { TableroDeIniciativasComponent } from "../tablero-de-iniciativas.component";
import { Subject } from "rxjs";
import { MenuService } from "services/menu.service";
import { UploadFileService } from "services/upload.service";
import { MatDialog } from "@angular/material/dialog";
import { DatePipe } from "@angular/common";
import { NgxSpinnerService } from "ngx-spinner";
import { IniciativasService } from "services/iniciativas.service";
import { IniciativasModel } from "models/iniciativas.models";
import { MatChipInputEvent } from "@angular/material/chips";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs; // fonts provided for pdfmake
import { environment } from "../../../../environments/environment";
import { LegislaturaService } from "services/legislaturas.service";
import { ParametrosService } from "services/parametros.service";
import { FirmasPorEtapaService } from "services/configuracion-de-firmas-por-etapa.service";
import { DocumentosModel } from "models/documento.models";
import { ClasficacionDeDocumentosComponent } from "app/main/tablero-de-documentos/clasficacion-de-documentos/clasficacion-de-documentos.component";
import { DocumentosService } from "services/documentos.service";
import * as moment from 'moment';
import { GuardarDocumentosComponent } from '../../tablero-de-documentos/guardar-documentos/guardar-documentos.component';
import { LegislaturaModel } from "models/legislaturas.models";
import { DateFormat } from "./date-format";
import { DateAdapter } from "@angular/material/core";
import { EmpleadosDelCongresoService } from "services/empleados-del-congreso.service";

export interface Autores {
    name: string;
}

export interface Temas {
    name: string;
}

export class Documentos {
    id: string;
}

@Component({
    selector: "guardar-iniciativas",
    templateUrl: "./guardar-iniciativas.component.html",
    styleUrls: ["./guardar-iniciativas.component.scss"],
    providers: [DatePipe, { provide: DateAdapter, useClass: DateFormat }],
})
export class GuardarIniciativasComponent implements OnInit {
    @ViewChild("fileInput", { static: false }) fileInput: ElementRef;
    @ViewChild("paginasInput", { static: false }) paginasInput: ElementRef;
    form: FormGroup;
    selectTipo: any;
    arrTipo: any[] = [];
    files = [];
    fileCheck = [];
    filesTemp = [];
    fileName: string;
    cambioFile: boolean;
    date = new Date(2020, 1, 1);
    cambioDocumento: boolean;
    base64: string;
    loadingIndicator: boolean;
    reorderable: boolean;
    // minDate = new Date(2000, 0, 1);
    maxDate = new Date();
    optEliminar: boolean;
    // Private
    private unsubscribeAll: Subject<any>;
    visible = true;
    selectable = true;
    selectable2 = true;
    removable = true;
    removable2 = true;
    addOnBlur = true;
    addOnBlur2 = true;

    firstFormGroup: FormGroup;
    readonly separatorKeysCodes: number[] = [ENTER, COMMA];
    autores: Autores[] = [];
    temas: Temas[] = [];
    legislatura: LegislaturaModel = new LegislaturaModel();;
    imageBase64: any;
    documentos: DocumentosModel = new DocumentosModel();
    documentosTemp: DocumentosModel = new DocumentosModel();
    idDocumento: string = '';
    cargando: boolean;
    constructor(
        private spinner: NgxSpinnerService,
        private formBuilder: FormBuilder,
        private menu: MenuService,
        private datePipe: DatePipe,
        private dialogRef: MatDialogRef<TableroDeIniciativasComponent>,
        private legislaturaService: LegislaturaService,
        private iniciativaService: IniciativasService,
        private parametros: ParametrosService,
        private firmas: FirmasPorEtapaService,
        private documentoService: DocumentosService,
        public dialog: MatDialog,
        private uploadService: UploadFileService,
        private dateAdapter: DateAdapter<Date>,
        private empleadosService: EmpleadosDelCongresoService,
        @Inject(MAT_DIALOG_DATA) public iniciativa: IniciativasModel
    ) {
        dateAdapter.setLocale("en-in"); // DD/MM/YYYY
        if (this.iniciativa.documentos == undefined) {
            this.iniciativa.documentos = [];
        }
        if (this.iniciativa.formatosTipoIniciativa == undefined) {
            this.iniciativa.formatosTipoIniciativa = [];
        }
        this.imageBase64 = environment.imageBase64;
    }

    async ngOnInit() {
        let validaTags = [];
        console.log('1');
        var isoDateString = new Date().toISOString();

        await this.obtenerDocumento();
        this.obtenerTiposIniciativas();

        this.fileName = "";
        const fecha = new Date(); // Fecha actual
        let mes: any = fecha.getMonth() + 1; // obteniendo mes
        let dia: any = fecha.getDate(); // obteniendo dia
        dia = dia + 1;
        const ano = fecha.getFullYear(); // obteniendo año
        const fechaActual = ano + "-" + mes + "-" + dia;
        if (dia < 10) {
            dia = "0" + dia; // agrega cero si el menor de 10
        }
        if (mes < 10) {
            mes = "0" + mes; // agrega cero si el menor de 10
        }
        // Validamos si es un documento nuevo
        if (this.iniciativa.id) {
            this.selectTipo = this.iniciativa.tipo_de_iniciativa.id;
            this.autores = this.iniciativa.autores;
            this.temas = this.iniciativa.tema;

            this.iniciativa.fechaCreacion =
                this.iniciativa.fechaCreacion + "T16:00:00.000Z";
            this.iniciativa.fechaIniciativa =
                this.iniciativa.fechaIniciativa + "T16:00:00.000Z";
            validaTags = [Validators.minLength(3), Validators.maxLength(200)];
        } else {
            // Seteamos la fecha de carga con la fecha actual
            this.iniciativa.estatus = "Registrada";
            this.iniciativa.fechaCreacion = isoDateString;
            validaTags = [Validators.required, Validators.minLength(3), Validators.maxLength(200)];
        }

        // Form reativo
        this.form = this.formBuilder.group({
            id: [{ value: this.iniciativa.id, disabled: true }],
            tipo: [
                { value: this.iniciativa.tipo_de_iniciativa, disabled: false },
                Validators.required,
            ],
            fechaIniciativa: [
                { value: this.iniciativa.fechaIniciativa, disabled: false },
                Validators.required,
            ],
            fechaRegistro: [
                { value: this.iniciativa.fechaCreacion, disabled: true },
                Validators.required,
            ],
            estatus: [
                { value: this.iniciativa.estatus, disabled: true },
                Validators.required,
            ],
            autores: ["", validaTags],
            etiquetasAutores: [{ value: "", disabled: false }],
            tema: ["", validaTags],
            etiquetasTema: [{ value: "", disabled: false }],
        });
    }

    async obtenerDocumento() {
        try {
            this.spinner.show();
            const documentosTemp: any[] = [];
            let idDocumento: any;
            this.loadingIndicator = true;
            let meta = '';
            let visibilidad = '';
            let countFecha = 0;
            let info: any;
            // Obtenemos los documentos
            this.documentoService.obtenerDocumentos().subscribe((resp: any) => {

                // Buscamos permisos
                for (const documento of resp.data) {

                    idDocumento = '';
                    // Validamos permisos

                    if (documento.tipo_de_documento) {
                        const encontro = this.menu.tipoDocumentos.find((tipo: { id: string; }) => tipo.id === documento.tipo_de_documento.id);

                        if (documento.visibilidade) {
                            info = this.menu.tipoInformacion.find((tipo: { id: string; }) => tipo.id === documento.visibilidade.id);
                        }
                        if (encontro) {
                            if (documento.tipo_de_documento.bActivo && encontro.Consultar && info) {

                                if (documento.documento) {

                                    idDocumento = documento.documento.hash + documento.documento.ext;


                                    if (documento.metacatalogos) {
                                        meta = '';
                                        countFecha = 0;
                                        if (documento.metacatalogos) {
                                            for (const x of documento.metacatalogos) {
                                                if (x) {
                                                    if (meta === '') {

                                                        if (x.cTipoMetacatalogo === 'Fecha') {
                                                            if (x.text) {
                                                                countFecha = x.text.split("T16:00:00.000Z").length - 1;

                                                                if (countFecha >= 2) {
                                                                    x.text = x.text.replace('T16:00:00.000ZT16:00:00.000Z', 'T16:00:00.000Z')
                                                                }
                                                                meta = meta + x.cDescripcionMetacatalogo + ': ' + this.datePipe.transform(x.text, 'yyyy-MM-dd');
                                                            }
                                                        } else {
                                                            if (x.text) {
                                                                meta = meta + x.cDescripcionMetacatalogo + ': ' + x.text;
                                                            }
                                                        }
                                                    } else {
                                                        if (x.cTipoMetacatalogo === 'Fecha') {
                                                            if (x.text) {
                                                                meta = meta + ' , ' + x.cDescripcionMetacatalogo + ': ' + this.datePipe.transform(x.text, 'yyyy-MM-dd');
                                                            }
                                                        } else {
                                                            if (x.text) {
                                                                meta = meta + ' , ' + x.cDescripcionMetacatalogo + ': ' + x.text;
                                                            }
                                                        }

                                                    }
                                                }
                                            }
                                        }
                                    }
                                    visibilidad = '';
                                    if (documento.visibilidade) {
                                        visibilidad = documento.visibilidade.cDescripcionVisibilidad;
                                    }

                                    if (documento.iniciativa === undefined || documento.iniciativa === null) {
                                        documento.iniciativa = '';
                                    } else {


                                        if (documento.iniciativa.id == this.iniciativa.id && documento.formulario == 'Iniciativas') {
                                            // tslint:disable-next-line: no-unused-expression
                                            // Seteamos valores y permisos
                                            documentosTemp.push({
                                                id: documento.id,
                                                cNombreDocumento: documento.cNombreDocumento,
                                                tipoDocumento: documento.tipo_de_documento.cDescripcionTipoDocumento,
                                                tipo_de_documento: documento.tipo_de_documento.id,
                                                fechaCarga: this.datePipe.transform(documento.fechaCarga, 'yyyy-MM-dd'),
                                                fechaCreacion: this.datePipe.transform(documento.fechaCreacion, 'yyyy-MM-dd'),
                                                paginas: documento.paginas,
                                                bActivo: documento.bActivo,
                                                fechaModificacion: this.datePipe.transform(documento.updatedAt, 'yyyy-MM-dd'),
                                                Agregar: encontro.Agregar,
                                                Eliminar: encontro.Eliminar,
                                                Editar: encontro.Editar,
                                                Consultar: encontro.Consultar,
                                                idDocumento: idDocumento,
                                                version: parseFloat(documento.version).toFixed(1),
                                                documento: documento.documento,
                                                iniciativa: documento.iniciativa,
                                                //ente: documento.ente,
                                                // secretaria: documento.secretaria,
                                                // direccione: documento.direccione,
                                                // departamento: documento.departamento,
                                                folioExpediente: documento.folioExpediente,
                                                clasificacion: meta,
                                                metacatalogos: documento.metacatalogos,
                                                informacion: visibilidad,
                                                visibilidade: documento.visibilidade,
                                                tipo_de_expediente: documento.tipo_de_expediente,
                                                usuario: this.menu.usuario
                                            });
                                        }
                                    }
                                    meta = '';
                                }
                            }
                        }
                    }
                }
                this.files = documentosTemp;
                this.fileCheck = documentosTemp;
                this.filesTemp = this.files;


                this.loadingIndicator = false;
                this.spinner.hide();
            }, err => {
                this.spinner.hide();
                this.loadingIndicator = false;
            });
        } catch (err) {
            this.spinner.hide();
            Swal.fire(
                "Error",
                "Ocurrió un error al obtener documentos." + err,
                "error"
            );
        }
    }

    async guardar(): Promise<void> {
        try {
            let reporte: any
            this.spinner.show();
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

            // Guardamos Iniciativa

            // Asignamos valores a objeto
            this.iniciativa.tipo_de_iniciativa = this.selectTipo;
            this.iniciativa.autores = this.autores;
            this.iniciativa.tema = this.temas;
            this.iniciativa.fechaIniciativa = moment(this.form.get(
                "fechaIniciativa"
            ).value).format('YYYY-MM-DD') + 'T16:00:00.000Z';
            this.iniciativa.estatus = this.form.get("estatus").value;
            if (this.iniciativa.id) {
                // Actualizamos la iniciativa
                if (this.iniciativa.estatus == "Registrada") {
                    reporte = await this.generaReport();
                    console.log('salio reporte');
                    if (reporte === "err") {
                        return
                    }
                }
                if (reporte !== "err") {

                    if (this.iniciativa.formatosTipoIniciativa) {
                        this.iniciativaService
                            .actualizarIniciativa(this.iniciativa)
                            .subscribe(
                                (resp: any) => {
                                    if (resp.data) {
                                        Swal.fire(
                                            "Éxito",
                                            "Iniciativa actualizada correctamente.",
                                            "success"
                                        );
                                        this.iniciativa = resp.data;
                                        this.spinner.hide();
                                        this.cerrar(this.iniciativa);
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
                                    Swal.fire(
                                        "Error",
                                        "Ocurrió un error al guardar." + err.error.data,
                                        "error"
                                    );
                                }
                            );
                    } else {
                        this.spinner.hide();
                        Swal.fire(
                            "Error",
                            "Ocurrió un error al generar el documento SPP 01. ",
                            "error"
                        );
                    }
                } else {
                    this.spinner.hide();
                }
            } else {
                // Guardamos la 

                if (this.iniciativa.estatus == "Registrada") {
                    reporte = await this.generaReport();
                    if (reporte === "err") {
                        return
                    } else {
                        this.iniciativa.formatosTipoIniciativa = [this.documentos.id];
                    }
                }

                if (reporte !== "err") {


                    this.iniciativaService.guardarIniciativa(this.iniciativa).subscribe(

                        async (resp: any) => {
                            if (resp.data) {
                                this.iniciativa = resp.data;
                                Swal.fire(
                                    "Éxito",
                                    "Iniciativa guardada correctamente.",
                                    "success"
                                );

                                this.cerrar(this.iniciativa);
                            } else {
                                this.spinner.hide();
                                console.log('err1')
                                this.temas = [];
                                this.autores = [];
                                Swal.fire(
                                    "Error",
                                    "Ocurrió un error al guardar. " + resp.error.data,
                                    "error"
                                );
                            }
                        },
                        (err) => {
                            console.log('err2')
                            this.temas = [];
                            this.autores = [];
                            this.spinner.hide();
                            Swal.fire(
                                "Error",
                                "Ocurrió un error al guardar." + err.error.data,
                                "error"
                            );
                        }
                    );
                } else {
                    this.spinner.hide();
                }
            }
        } catch (err) {
            this.spinner.hide();
            Swal.fire(
                "Error",
                "Ocurrió un error al guardar." + err,
                "error"
            );
        }
    }

    cerrar(doc: any): void {
        if (doc) {
            this.dialogRef.close(doc);
        } else {
            this.dialogRef.close();
        }
    }

    async obtenerTiposIniciativas(): Promise<void> {
        // Obtenemos Distritos
        this.spinner.show();
        await this.iniciativaService.obtenerTiposIniciativas().subscribe(
            (resp: any) => {
                this.arrTipo = resp;
                this.spinner.hide();
            },
            (err) => {
                Swal.fire(
                    "Error",
                    "Ocurrió un error obtener los tipos de iniciativas." + err,
                    "error"
                );
                this.spinner.hide();
            }
        );
    }

    change(): void {
        this.cambioDocumento = true;
    }

    agregarAutor(event: MatChipInputEvent): void {
        const input = event.input;
        const value = event.value;

        if ((value || "").trim()) {
            this.autores.push({ name: value.trim() });
        }

        // Reset the input value
        if (input) {
            input.value = "";
        }
    }

    eliminarAutor(autor: Autores): void {
        const index = this.autores.indexOf(autor);

        if (index >= 0) {
            if (index === 0) {
                this.form.get('autores').setValue('');
                this.iniciativa.autores = '';
            }
            this.autores.splice(index, 1);
        } else {
            console.log('limpio');
        }
    }

    agregarTema(event: MatChipInputEvent): void {
        const input = event.input;
        const value = event.value;

        if ((value || "").trim()) {
            this.temas.push({ name: value.trim() });
        }

        // Reset the input value
        if (input) {
            input.value = "";
        }
    }

    eliminarTema(tema: Temas): void {
        const index = this.temas.indexOf(tema);

        if (index >= 0) {
            if (index === 0) {
                console.log('tema limpio');
                this.form.get('tema').setValue('');
                this.iniciativa.tema = '';
            }
            this.temas.splice(index, 1);
        } else {
            console.log('limpio');
        }
    }

    add(): void {
        // Agregamos elemento file
        let base64Result: string;
        const fileInput = this.fileInput.nativeElement;
        fileInput.onchange = () => {
            // tslint:disable-next-line: prefer-for-of
            for (let index = 0; index < fileInput.files.length; index++) {
                const file = fileInput.files[index];
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onloadend = () => {
                    this.files.push({
                        data: file,
                        base64: reader.result.toString(),
                        filename: file.name,
                        inProgress: false,
                        progress: 0,
                    });
                    this.files = [...this.files];
                };
                this.cambioFile = true;
            }

            //  this.upload();
        };
        fileInput.click();
    }

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

    filterDatatable(value): void {
        this.files = this.filesTemp;
        // Filtramos tabla
        if (value.target.value === '') {
            this.files = this.filesTemp;
        } else {
            const val = value.target.value.toLowerCase();
            const temp = this.files.filter((d) => d.cNombreDocumento.toLowerCase().indexOf(val) !== -1);
            this.files = temp;
        }
    }

    async obtenerLegislatura(): Promise<LegislaturaModel> {

        return new Promise((resolve) => {
            {
                this.legislaturaService.obtenerLegislatura().subscribe(
                    (resp: any) => {
                        this.legislatura = resp.filter(element => {
                            return element.bActual && element.bActivo
                        })

                        resolve(this.legislatura);
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
    async obtenerFirma(id: string): Promise<void> {
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
                            "Ocurrió un error al obtener los parametros." + err,
                            "error"
                        );
                        resolve(err);
                    }
                );
            }
        });
    }

    async obtenerEmpleadosByIdPuesto(idPuesto: string): Promise<void> {
        // Obtenemos empleados
        return new Promise(async (resolve) => {
            {
                await this.empleadosService.obtenerEmpleadosByPuesto(idPuesto).subscribe((resp: any) => {

                    resolve(resp);

                }, err => {
                    Swal.fire('Error', 'Ocurrió un error obtener los puestos.' + err, 'error');
                    resolve(err);
                });
            }
        });

    }

    async generaReport(): Promise<string> {
        return new Promise(async (resolve) => {
            try {
                this.documentos = new DocumentosModel();
                const fecha = new Date(); // Fecha actual
                let mes: any = fecha.getMonth() + 1; // obteniendo mes
                let dia: any = fecha.getDate(); // obteniendo dia
                const anio = fecha.getFullYear(); // obteniendo año
                let cAutores = "";
                let cTemas = "";
                let header: any[] = [];
                let presente: any[] = [];
                if (dia < 10) {
                    dia = "0" + dia; // agrega cero si el menor de 10
                }
                if (mes < 10) {
                    mes = "0" + mes; // agrega cero si el menor de 10
                }
                const fechaActual = dia + "/" + mes + "/" + anio;
                let puestoSecretarioGeneral: any[];
                let legislaturas = await this.obtenerLegislatura();
                let parametrosSSP001 = await this.obtenerParametros("SSP-001");


                puestoSecretarioGeneral = await this.obtenerParametros(
                    "Id-Puesto-Secretario-General"
                );

                let idFirmasPorEtapas = parametrosSSP001.filter(
                    (d) => d["cParametroAdministrado"] === "SSP-001-Firmas"
                );
                let idPuesto = parametrosSSP001.filter(
                    (d) => d["cParametroAdministrado"] === "SSP-001-Puesto"
                );
                let firmasPorEtapas = await this.obtenerFirma(
                    idFirmasPorEtapas[0]["cValor"]
                );

                /* let puesto = firmasPorEtapas[0].participantes.filter(
                     (d) => d["puesto"] === idPuesto[0]["cValor"]
                 );*/
                let puestoSecretario = firmasPorEtapas[0].participantes.filter(
                    (d) => d["puesto"] === puestoSecretarioGeneral[0].cValor
                );
                let tipoIniciativa = this.arrTipo.filter(
                    (d) => d["id"] === this.selectTipo
                );
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

                let puesto: any = await this.obtenerEmpleadosByIdPuesto(idPuesto[0]['cValor']);

                this.temas.forEach((element) => {
                    if (cTemas === "") {
                        cTemas = element.name;
                    } else {
                        cTemas = cTemas + ", " + element.name;
                    }
                });

                this.autores.forEach((element) => {
                    if (cAutores === "") {
                        cAutores = element.name;
                    } else {
                        cAutores = cAutores + ", " + element.name;
                    }
                });

                // Creamos el reporte

                header = this.configuraHeaderReport(
                    legislaturas[0]["cLegislatura"] + " LEGISLATURA " + legislaturas[0]["cPeriodoLegislatura"]
                );

                if (puesto[0]) {
                    presente.push({
                        text:
                            "Lic. " +
                            puesto[0]["nombre"] +
                            " " +
                            puesto[0]["apellidoPaterno"] +
                            " " +
                            puesto[0]["apellidoMaterno"],
                        fontSize: 14,
                        bold: true,
                        alignment: "left",
                        margin: [0, 10, 0, 0],
                    });
                }
                presente.push({
                    text: "Secretaria de Servicios Parlamentarios",
                    fontSize: 14,
                    bold: true,
                    alignment: "left",
                });
                presente.push({
                    text: "H. Congreso del Estado",
                    fontSize: 14,
                    bold: true,
                    alignment: "left",
                });

                presente.push({
                    text: [
                        "Con fundamento en lo dispuesto en la Ley Orgánica del Congreso del Estado de Durango, me permito remitirle ",
                        { text: tipoIniciativa["0"]["descripcion"], bold: true },
                        " presentada por los CC. ",
                        { text: cAutores, bold: true },
                        ", que contiene ",
                        { text: cTemas, bold: true },
                        ", siga su trámite legislativo correspondiente ante el Pleno Legislativo. ",
                    ],
                    fontSize: 12,
                    bold: false,
                    alignment: "justify",
                    margin: [0, 50, 5, 5],
                });

                presente.push({
                    text:
                        "Sin más por el momento, le envío un saludo fraterno y patentizo las seguridades de mi consideración y respeto.",
                    fontSize: 12,
                    bold: false,
                    alignment: "justify",
                    margin: [0, 20, 5, 5],
                });

                presente.push({
                    text: "ATENTAMENTE",
                    fontSize: 12,
                    bold: true,
                    alignment: "center",
                    margin: [0, 120, 0, 0],
                });

                presente.push({
                    text: "SUFRAGIO EFECTIVO, NO REELECCIÓN",
                    fontSize: 12,
                    bold: true,
                    alignment: "center",
                });

                presente.push({
                    text: "Durango, Dgo., " + fechaActual,
                    fontSize: 12,
                    bold: true,
                    alignment: "center",
                });
                if (puestoSecretario[0]) {
                    presente.push({
                        text:
                            "Lic. " +
                            puestoSecretario[0]["nombre"] +
                            " " +
                            puestoSecretario[0]["apellidoPaterno"] +
                            " " +
                            puestoSecretario[0]["apellidoMaterno"],
                        fontSize: 12,
                        bold: true,
                        alignment: "center",
                        margin: [0, 80, 0, 0],
                    });
                    presente.push({
                        text: "SECRETARIO GENERAL DEL H. CONGRESO DEL ESTADO",
                        fontSize: 12,
                        bold: true,
                        alignment: "center",
                    });
                } else {
                    presente.push({
                        text: "SECRETARIO GENERAL DEL H. CONGRESO DEL ESTADO",
                        fontSize: 12,
                        bold: true,
                        alignment: "center",
                        margin: [0, 80, 0, 0],
                    });
                }

                const aa = {
                    header: {
                        columns: [
                            {
                                image: "data:image/jpeg;base64," + this.imageBase64,
                                width: 120,
                                margin: [20, 20, 5, 5],
                            },
                            {
                                nodeName: "DIV",
                                stack: [header],
                            },
                        ],
                    },
                    pageOrientation: "portrait",
                    pageSize: "A4",
                    fontSize: 8,
                    pageMargins: [40, 100, 40, 50],
                    content: [presente],
                    styles: {
                        header: {
                            fontSize: 8,
                            bold: true,
                            margin: 0,
                        },
                        subheader: {
                            fontSize: 8,
                            margin: 0,
                        },
                        tableExample: {
                            margin: 0,
                        },
                        tableOpacityExample: {
                            margin: [0, 5, 0, 15],
                            fillColor: "blue",
                            fillOpacity: 0.3,
                        },
                        tableHeader: {
                            bold: true,
                            fontSize: 9,
                            color: "black",
                        },
                    },
                    defaultStyle: {
                        // alignment: 'justify'
                    },
                };

                // pdfMake.createPdf(dd).open();

                let pdfDocGenerator = pdfMake.createPdf(aa);
                let base64 = await this.pdfBase64(pdfDocGenerator);

                await this.upload(base64, "SP001.pdf");
                let documentoRespuesta: any = await this.guardarDocumento(
                    cTemas,
                    tipoDocumento[0]["cValor"],
                    tipoExpediente[0]["cValor"],
                    tipoInformacion[0]["cValor"],
                    legislaturas[0]
                );
                if (documentoRespuesta.error) {
                    console.log('salio err');
                    console.log(this.iniciativa.formatosTipoIniciativa.length);
                    resolve("err");
                } else {
                    const dd = {
                        header: {
                            columns: [
                                {
                                    image: "data:image/jpeg;base64," + this.imageBase64,
                                    width: 120,
                                    margin: [20, 20, 5, 5],
                                },
                                {
                                    nodeName: "DIV",
                                    stack: [header],
                                },
                            ],
                        },
                        footer: {
                            columns: [
                                '',
                                {
                                    alignment: 'right',
                                    text: 'Id. Documento: ' + this.idDocumento
                                }
                            ],
                            margin: [10, 0]
                        },
                        pageOrientation: "portrait",
                        pageSize: "A4",
                        fontSize: 8,
                        pageMargins: [40, 100, 40, 50],
                        content: [presente],
                        styles: {
                            header: {
                                fontSize: 8,
                                bold: true,
                                margin: 0,
                            },
                            subheader: {
                                fontSize: 8,
                                margin: 0,
                            },
                            tableExample: {
                                margin: 0,
                            },
                            tableOpacityExample: {
                                margin: [0, 5, 0, 15],
                                fillColor: "blue",
                                fillOpacity: 0.3,
                            },
                            tableHeader: {
                                bold: true,
                                fontSize: 9,
                                color: "black",
                            },
                        },
                        defaultStyle: {
                            // alignment: 'justify'
                        },
                    };

                    // pdfMake.createPdf(dd).open();

                    pdfDocGenerator = pdfMake.createPdf(dd);
                    base64 = await this.pdfBase64(pdfDocGenerator);

                    await this.upload(base64, "SP001.pdf");
                    await this.guardarDocumento(
                        cTemas,
                        tipoDocumento[0]["cValor"],
                        tipoExpediente[0]["cValor"],
                        tipoInformacion[0]["cValor"],
                        legislaturas[0]
                    );
                    console.log('dps de todo')
                    resolve("ok");
                }


            } catch (err) {
                this.spinner.hide();
                Swal.fire('Error', 'Ocurrió un error  generaReport. ' + err, 'error');
                resolve("err");
            }
        });
    }

    configuraHeaderReport(legislatura: string): any {
        // Configuramos en encabezado
        const stack: any[] = [];

        stack.push({
            text: "H. CONGRESO DEL ESTADO DE DURANGO",
            nodeName: "H1",
            fontSize: 14,
            bold: true,
            alignment: "center",
            margin: [0, 20, 0, 0],
        });
        stack.push({
            text: legislatura,
            nodeName: "H4",
            fontSize: 12,
            bold: false,
            alignment: "center",
        });

        return { stack };
    }

    async upload(base64: any, nombre: string): Promise<void> {
        try {
            // Subimos documento
            // const resp = await this.uploadService.uploadFile(this.files[0].data);
            const data = {
                name: nombre,
            };
            const resp = await this.uploadService.subirArchivo(data, base64);

            if (resp.error) {
                Swal.fire(
                    "Error",
                    "Ocurrió un error al subir el documento. " + resp.error.error,
                    "error"
                );
            } else {
                // La peticion nos retorna el id del documento y lo seteamos al usuario

                if (resp.data) {
                    this.documentos.documento = resp.data[0].id;
                    this.documentos.textoOcr = resp.text;
                } else {
                    this.spinner.hide();
                    Swal.fire(
                        "Error",
                        "Ocurrió un error al subir el documento. ",
                        "error"
                    );
                }
            }
        } catch (err) {
            this.spinner.hide();
            Swal.fire(
                "Error",
                "Ocurrió un error al subir documento." + err,
                "error"
            );
        }
    }

    async pdfBase64(pdf: any): Promise<[]> {
        return new Promise((resolve) => {
            {
                pdf.getBase64((data) => {
                    resolve(data);
                });
            }
        });
    }

    async guardarDocumento(
        tema: string,
        tipoDocumento: string,
        tipoExpediente: string,
        tipoInformacion: string,
        legislatura: any
    ): Promise<string> {
        return new Promise(async (resolve) => {
            try {
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
                this.documentos.bActivo = true;
                this.documentos.cNombreDocumento = "Formato SSP 01 de " + tema;
                this.documentos.fechaCarga = fechaActual + 'T16:00:00.000Z';
                this.documentos.fechaCreacion = fechaActual + 'T16:00:00.000Z';
                this.documentos.version = 1;
                this.documentos.paginas = 1;
                this.documentos.usuario = this.menu.usuario;
                this.documentos.tipo_de_documento = tipoDocumento;
                this.documentos.tipo_de_expediente = tipoExpediente;
                this.documentos.visibilidade = tipoInformacion;

                if (this.documentos.legislatura != legislatura.id) {
                    this.documentos.legislatura = legislatura.id;

                }

                if (this.iniciativa.formatosTipoIniciativa.length > 0 || this.idDocumento.length > 5) {

                    if (this.idDocumento.length > 5) {
                        this.documentos.id = this.idDocumento;
                    } else {
                        this.documentos.id = this.iniciativa.formatosTipoIniciativa[0].id;
                    }


                    this.documentoService.actualizarDocumentos(this.documentos).subscribe(
                        (resp: any) => {
                            if (resp.data) {
                                this.documentos = resp.data;
                                this.idDocumento = resp.data._id;
                                this.iniciativa.formatosTipoIniciativa = [this.iniciativa.formatosTipoIniciativa[0]];

                                resolve(this.documentos.id);
                            } else {
                                this.spinner.hide();
                                Swal.fire(
                                    "Error",
                                    "Ocurrió un error al guardar. " +
                                    JSON.stringify(resp.error.data),
                                    "error"
                                );
                            }
                        },
                        (err: any) => {
                            this.spinner.hide();
                            console.log(err);
                            Swal.fire(
                                "Error",
                                "Ocurrió un error al guardar." +
                                JSON.stringify(err.error.data),
                                "error"
                            );
                        }
                    );
                } else {
                    this.documentos.folioExpediente =
                        Number(Number(legislatura.folioExpediente) + 1);
                    delete this.legislatura[0].documentos;
                    this.iniciativa.folioExpediente = this.documentos.folioExpediente;
                    this.legislatura[0].folioExpediente = this.documentos.folioExpediente;
                    this.documentoService
                        .guardarDocumentos(this.documentos)
                        .subscribe(
                            (resp: any) => {
                                if (resp) {
                                    this.documentos = resp.data;
                                    this.idDocumento = resp.data._id;
                                    this.documentos.fechaCarga = this.datePipe.transform(
                                        this.documentos.fechaCarga,
                                        "yyyy-MM-dd"
                                    );
                                    this.documentos.fechaCreacion = this.datePipe.transform(
                                        this.documentos.fechaCreacion,
                                        "yyyy-MM-dd"
                                    );

                                    this.iniciativa.formatosTipoIniciativa = [this.iniciativa.formatosTipoIniciativa[0]];
                                    this.legislaturaService.actualizarLegislatura(this.legislatura[0]).subscribe()
                                    resolve(this.documentos.id);
                                    // this.clasificarDocumento(this.documentos)
                                } else {
                                    this.spinner.hide();
                                    Swal.fire(
                                        "Error",
                                        "Ocurrió un error al guardar. " +
                                        JSON.stringify(resp.error.data),
                                        "error"
                                    );
                                    resolve('');
                                }
                            },
                            (err: any) => {
                                this.spinner.hide();
                                console.log(err);
                                console.log(this.iniciativa.formatosTipoIniciativa);
                                if (err.error.data === "La descripción del documento ya se encuentra capturada en otro documento.") {
                                    Swal.fire(
                                        "Error",
                                        "Ocurrió un error al guardar." +
                                        "El tema de esta iniciativa, ya se encuentra capturada en otro documento.",
                                        "error"
                                    );
                                } else {
                                    Swal.fire(
                                        "Error",
                                        "Ocurrió un error al guardar." +
                                        JSON.stringify(err.error.data),
                                        "error"
                                    );
                                }
                                resolve(err);
                            }
                        );
                }
            } catch (err) {
                this.spinner.hide();
                Swal.fire(
                    "Error",
                    "Ocurrió un error al guardar." + err,
                    "error"
                );
                resolve(err);
            }
        });
    }

    async cargaClasificacionDocumento(): Promise<void> {
        try {
            //mostramos spinner para evitar abrir el modal varias veces
            this.spinner.show();
            //creamos un nuevo modelo de documentos.
            this.documentos = new DocumentosModel();
            this.documentos.bActivo = true;
            this.documentos.iniciativa = this.iniciativa.id;
            this.documentos.formulario = 'Iniciativas';
            let parametrosSSP001 = await this.obtenerParametros("SSP-001");
            let legislaturas = await this.obtenerLegislatura();
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
            this.documentos.legislatura = legislaturas[0].id;
            this.documentos.folioExpediente = this.iniciativa.folioExpediente;
            this.documentos.tipo_de_documento = tipoDocumento[0]["cValor"];
            this.documentos.tipo_de_expediente = tipoExpediente[0]["cValor"];
            this.documentos.visibilidade = tipoInformacion[0]["cValor"];

            this.spinner.hide();

            const dialogRef = this.dialog.open(GuardarDocumentosComponent, {
                width: '60%',
                height: '80%',
                disableClose: true,
                data: this.documentos,
            });

            dialogRef.afterClosed().subscribe(result => {
                if (result) {
                    if (result.documento) {
                        this.clasificarDocAnex(result, '');
                    }
                }
            });
        } catch (err) {
            this.spinner.hide();
            Swal.fire(
                "Error",
                "Ocurrió un error al clasificar." + err,
                "error"
            );
        }
    }
    async cargaClasificacionDocumentoComplementario(): Promise<void> {
        try {
            //mostramos spinner para evitar abrir el modal varias veces
            this.spinner.show();
            //creamos un nuevo modelo de documentos.
            this.documentos = new DocumentosModel();
            this.documentos.bActivo = true;
            this.documentos.iniciativa = this.iniciativa.id;
            this.documentos.formulario = 'Iniciativas';
            let parametrosSSP001 = await this.obtenerParametros("SSP-001");
            let parametrosTipoDocumentos = await this.obtenerParametros("Tipo-de-documento-complementario");
            let legislaturas = await this.obtenerLegislatura();
            let tipoDocumento: any = parametrosTipoDocumentos;
            let tipoExpediente = parametrosSSP001.filter(
                (d) =>
                    d["cParametroAdministrado"] === "SSP-001-Tipo-de-Expediente"
            );
            let tipoInformacion = parametrosSSP001.filter(
                (d) =>
                    d["cParametroAdministrado"] ===
                    "SSP-001-Tipo-de-Informacion"
            );
            this.documentos.legislatura = legislaturas[0].id;
            this.documentos.folioExpediente = this.iniciativa.folioExpediente;
            this.documentos.tipo_de_documento = tipoDocumento[0]["cValor"];
            this.documentos.tipo_de_expediente = tipoExpediente[0]["cValor"];
            this.documentos.visibilidade = tipoInformacion[0]["cValor"];

            this.spinner.hide();

            const dialogRef = this.dialog.open(GuardarDocumentosComponent, {
                width: '60%',
                height: '80%',
                disableClose: true,
                data: this.documentos,
            });

            dialogRef.afterClosed().subscribe(result => {
                if (result) {
                    if (result.documento) {
                        this.clasificarDocAnex(result, 'Complementario');
                    }
                }
            });
        } catch (err) {
            this.spinner.hide();
            Swal.fire(
                "Error",
                "Ocurrió un error al clasificar." + err,
                "error"
            );
        }
    }
    clasificarDocAnex(result: any, tipoDoc: string): void {
        try {
            this.spinner.show();
            const fecha = new Date(); // Fecha actual
            let mes: any = fecha.getMonth() + 1; // obteniendo mes
            let dia: any = fecha.getDate(); // obteniendo dia

            const anio = fecha.getFullYear(); // obteniendo año

            if (dia < 10) {
                dia = "0" + dia; // agrega cero si el menor de 10
            }
            if (mes < 10) {
                mes = "0" + mes; // agrega cero si el menor de 10
            }
            const fechaActual = dia + "/" + mes + "/" + anio;
            this.documentos.bActivo = true;

            this.documentos.fechaCreacion = this.documentos.fechaCreacion + 'T16:00:00.000Z';
            this.documentos.fechaCarga = this.documentos.fechaCarga + 'T16:00:00.000Z';

            this.documentos = result;

            let cAutores = "";

            this.autores.forEach((element) => {
                if (cAutores === "") {
                    cAutores = element.name;
                } else {
                    cAutores = cAutores + ", " + element.name;
                }
            });

            let cTema = "";
            this.temas.forEach((element) => {
                if (cTema === "") {
                    cTema = element.name;
                } else {
                    cTema = cTema + ", " + element.name;
                }
            });
            if (tipoDoc !== 'Complementario') {
                this.documentos.metacatalogos = [
                    {
                        cDescripcionMetacatalogo: "Fecha",
                        bOligatorio: true,
                        cTipoMetacatalogo: "Fecha",
                        text: this.documentos.fechaCarga,
                    },
                    {
                        cDescripcionMetacatalogo: "Autores",
                        bOligatorio: true,
                        cTipoMetacatalogo: "Texto",
                        text: cAutores,
                    },
                    {
                        cDescripcionMetacatalogo: "Temas",
                        bOligatorio: true,
                        cTipoMetacatalogo: "Texto",
                        text: cTema,
                    },
                ];
            } else {
                this.documentos.metacatalogos = [
                    {
                        cDescripcionMetacatalogo: "Fecha",
                        bOligatorio: true,
                        cTipoMetacatalogo: "Fecha",
                        text: this.documentos.fechaCarga,
                    },
                    {
                        cDescripcionMetacatalogo: "Documento",
                        bOligatorio: true,
                        cTipoMetacatalogo: "Texto",
                        text: cAutores,
                    }
                ];
            }
            this.documentos.folioExpediente = Number(this.documentos.folioExpediente);

            delete this.documentos['tipo_de_documento'];
            this.documentoService
                .actualizarDocumentosSinVersion(this.documentos)
                .subscribe(
                    (resp: any) => {
                        if (resp.data) {
                            this.documentosTemp = resp.data;
                            this.documentosTemp.fechaCreacion = moment(this.documentos.fechaCreacion).format('YYYY/MM/DD') + 'T16:00:00.000Z';
                            this.documentosTemp.fechaCarga = moment(this.documentos.fechaCarga).format('YYYY/MM/DD') + 'T16:00:00.000Z';
                            this.documentosTemp.iniciativas = true;
                            this.documentosTemp.iniciativa = this.iniciativa;
                            if (this.iniciativa.tipo_de_iniciativa) {
                                if (
                                    this.iniciativa.tipo_de_iniciativa.descripcion ==
                                    "Iniciativa"
                                ) {
                                    this.documentosTemp.estatus =
                                        "Turnar iniciativa a comisión";
                                } else {
                                    this.documentosTemp.estatus =
                                        "Turnar cuenta pública a EASE";
                                }
                            }
                            //this.documentosTemp.fechaCreacion = fechaActual;
                            //this.documentosTemp.fechaCarga = fechaActual;

                            this.spinner.hide();

                            const dialogRef = this.dialog.open(
                                ClasficacionDeDocumentosComponent,
                                {
                                    width: "100%",
                                    height: "90%",
                                    disableClose: true,
                                    data: this.documentosTemp,
                                }
                            );

                            // tslint:disable-next-line: no-shadowed-variable
                            dialogRef.afterClosed().subscribe((result) => {

                                /*asignamos valores a iniciativa.documentos debido a que al
                                iniciar el componente inicia como [] y al guardar asi se desasignan
                                los documentos*/

                                this.iniciativa.documentos.push(this.documentos.id);
                                //this.iniciativa.documentos = [this.documentos.id];
                                this.obtenerDocumento();
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
        } catch (err) {
            this.spinner.hide();
            Swal.fire(
                "Error",
                "Ocurrió un error al clasificar." + err,
                "error"
            );
        }
    }

    editarDocumento(documento: DocumentosModel): void {

        // Abrimos modal de guardar perfil
        const dialogRef = this.dialog.open(GuardarDocumentosComponent, {
            width: '60%',
            height: '80%',
            disableClose: true,
            data: documento,
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                if (result.documento) {
                    this.clasificarDocAnex(result, 'Complementario');
                }
            }
        });
    }


    clasificarDocumento(): void {
        try {
            this.spinner.show();
            const fecha = new Date(); // Fecha actual
            let mes: any = fecha.getMonth() + 1; // obteniendo mes
            let dia: any = fecha.getDate(); // obteniendo dia
            const anio = fecha.getFullYear(); // obteniendo año
            let countCreacion = 0;
            let sFechaCreacion = '';
            let countModificacion = 0;
            let sFechaModificacion = '';

            if (dia < 10) {
                dia = "0" + dia; // agrega cero si el menor de 10
            }
            if (mes < 10) {
                mes = "0" + mes; // agrega cero si el menor de 10
            }
            const fechaActual = dia + "/" + mes + "/" + anio;
            this.documentos.bActivo = true;
            if (!this.documentos.id) {
                console.log('entro');
                this.documentos.fechaCreacion = this.documentos.fechaCreacion + 'T16:00:00.000Z';
                this.documentos.fechaCarga = this.documentos.fechaCreacion + 'T16:00:00.000Z';
            }

            let cAutores = "";
            let cTema = "";
            this.autores.forEach((element) => {
                if (cAutores === "") {
                    cAutores = element.name;
                } else {
                    cAutores = cAutores + ", " + element.name;
                }
            });
            this.temas.forEach((element) => {
                if (cTema === "") {
                    cTema = element.name;
                } else {
                    cTema = cTema + ", " + element.name;
                }
            });
            this.documentos = this.iniciativa.formatosTipoIniciativa[0];
            this.documentos.metacatalogos = [
                {
                    cDescripcionMetacatalogo: "Fecha",
                    bOligatorio: true,
                    cTipoMetacatalogo: "Fecha",
                    text: this.documentos.fechaCarga,
                },
                {
                    cDescripcionMetacatalogo: "Autores",
                    bOligatorio: true,
                    cTipoMetacatalogo: "Texto",
                    text: cAutores,
                },
                {
                    cDescripcionMetacatalogo: "Temas",
                    bOligatorio: true,
                    cTipoMetacatalogo: "Texto",
                    text: cTema,
                },
            ];


            this.documentos.folioExpediente = Number(this.documentos.folioExpediente);

            if (this.documentos.fechaCreacion) {
                sFechaCreacion = this.documentos.fechaCreacion;
                countCreacion = sFechaCreacion.split("T16:00:00.000Z").length - 1;

                if (countCreacion >= 2) {
                    this.documentos.fechaCreacion = this.documentos.fechaCreacion.replace('T16:00:00.000ZT16:00:00.000Z', 'T16:00:00.000Z')
                }
            }
            if (this.documentos.fechaCarga) {
                sFechaModificacion = this.documentos.fechaCarga;
                countModificacion = sFechaModificacion.split("T16:00:00.000Z").length - 1;

                if (countModificacion >= 2) {
                    this.documentos.fechaCarga = this.documentos.fechaCarga.replace('T16:00:00.000ZT16:00:00.000Z', 'T16:00:00.000Z')
                }
            }
            this.documentoService
                .actualizarDocumentosSinVersion(this.documentos)
                .subscribe(
                    (resp: any) => {
                        if (resp.data) {
                            this.documentosTemp = resp.data;
                            this.documentosTemp.fechaCreacion = moment(this.documentos.fechaCreacion).format('YYYY/MM/DD') + 'T16:00:00.000Z';
                            this.documentosTemp.fechaCarga = moment(this.documentos.fechaCarga).format('YYYY/MM/DD') + 'T16:00:00.000Z';
                            this.documentosTemp.iniciativas = true;
                            this.documentosTemp.iniciativa = this.iniciativa;
                            if (
                                this.iniciativa.tipo_de_iniciativa.descripcion ==
                                "Iniciativa"
                            ) {
                                this.documentosTemp.estatus =
                                    "Turnar iniciativa a comisión";
                            } if (this.iniciativa.tipo_de_iniciativa.descripcion == 'Cuenta Pública') {
                                this.documentosTemp.estatus = "Turnar cuenta pública a EASE";
                            }

                            //this.documentosTemp.fechaCreacion = fechaActual;
                            //this.documentosTemp.fechaCarga = fechaActual;

                            this.spinner.hide();

                            const dialogRef = this.dialog.open(
                                ClasficacionDeDocumentosComponent,
                                {
                                    width: "100%",
                                    height: "90%",
                                    disableClose: true,
                                    data: this.documentosTemp,
                                }
                            );

                            // tslint:disable-next-line: no-shadowed-variable
                            dialogRef.afterClosed().subscribe((result) => {
                                if (result == "0") {
                                    this.cerrar("");
                                    // this.obtenerDocumentos();
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
        } catch (err) {
            this.spinner.hide();
            Swal.fire(
                "Error",
                "Ocurrió un error al clasificar." + err,
                "error"
            );
        }
    }

    eliminarDocumento(row): void {
        // Eliminamos documento
        Swal.fire({
            title: '¿Está seguro que desea eliminar este documento?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Si',
            cancelButtonText: 'No'
        }).then((result) => {
            if (result.value) {
                row.documento = '';
                row.usuario = this.menu.usuario;
                // realizamos delete
                this.documentoService.borrarDocumentos(row).subscribe((resp: any) => {
                    let index: number = this.iniciativa.documentos.indexOf(row);
                    this.iniciativa.documentos.splice(index, 1);
                    Swal.fire('Eliminado', 'El documento ha sido eliminado.', 'success');
                    this.obtenerDocumento();
                }, err => {
                    this.cargando = false;
                    Swal.fire(
                        'Error',
                        'Ocurrió un error al eliminar el documento.' + JSON.stringify(err),
                        'error'
                    );
                });

            }
        });
    }
}
