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
import { DocumentosModel } from "models/documento.models";
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
export interface Autores {
    name: string;
}

export interface Temas {
    name: string;
}
@Component({
    selector: "guardar-iniciativas",
    templateUrl: "./guardar-iniciativas.component.html",
    styleUrls: ["./guardar-iniciativas.component.scss"],
    providers: [DatePipe],
})
export class GuardarIniciativasComponent implements OnInit {
    @ViewChild("fileInput", { static: false }) fileInput: ElementRef;
    @ViewChild("paginasInput", { static: false }) paginasInput: ElementRef;
    form: FormGroup;
    selectTipo: any;
    arrTipo: any[] = [];
    files = [];
    fileName: string;
    cambioFile: boolean;
    date = new Date(2020, 1, 1);
    cambioDocumento: boolean;
    base64: string;
    loadingIndicator: boolean;
    reorderable: boolean;
    // minDate = new Date(2000, 0, 1);
    maxDate = new Date();
    // Private
    private unsubscribeAll: Subject<any>;
    visible = true;
    selectable = true;
    selectable2 = true;
    removable = true;
    removable2 = true;
    addOnBlur = true;
    addOnBlur2 = true;
    documentos: any[] = [];
    firstFormGroup: FormGroup;
    readonly separatorKeysCodes: number[] = [ENTER, COMMA];
    autores: Autores[] = [];
    temas: Temas[] = [];
    legislatura: any[] = [];
    imageBase64: any;
    constructor(
        private spinner: NgxSpinnerService,
        private datePipe: DatePipe,
        private formBuilder: FormBuilder,
        private dialogRef: MatDialogRef<TableroDeIniciativasComponent>,
        private legislaturaService: LegislaturaService,
        private iniciativaService: IniciativasService,
        public dialog: MatDialog,
        @Inject(MAT_DIALOG_DATA) public iniciativa: IniciativasModel
    ) {
        this.imageBase64 = environment.imageBase64;
    }

    ngOnInit(): void {
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
        } else {
            // Seteamos la fecha de carga con la fecha actual
            this.iniciativa.estatus = "Registrada";
            this.iniciativa.fechaCreacion = ano + "-" + mes + "-" + dia;
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
            autores: [""],
            etiquetasAutores: [{ value: "", disabled: false }],
            tema: [""],
            etiquetasTema: [{ value: "", disabled: false }],
        });
    }

    async guardar(): Promise<void> {
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
        this.iniciativa.fechaIniciativa = this.form.get(
            "fechaIniciativa"
        ).value;
        this.iniciativa.estatus = this.form.get("estatus").value;
        if (this.iniciativa.id) {
            // Actualizamos el ente
            this.iniciativaService
                .actualizarIniciativa(this.iniciativa)
                .subscribe(
                    (resp: any) => {
                        if (resp) {
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
            // Guardamos el ente
            this.iniciativaService.guardarIniciativa(this.iniciativa).subscribe(
                (resp: any) => {
                    if (resp) {
                        this.spinner.hide();
                        Swal.fire(
                            "Éxito",
                            "Iniciativa guardada correctamente.",
                            "success"
                        );
                        this.cerrar(this.iniciativa);
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
                    Swal.fire(
                        "Error",
                        "Ocurrió un error al guardar." + err.error.data,
                        "error"
                    );
                }
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
                    "Ocurrió un error obtener los distritos." + err,
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
            this.autores.splice(index, 1);
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
            this.temas.splice(index, 1);
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
        // Filtramos tabla
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

    buildTableBody(data: any[], columns: any[]) {
        const body = [];
        // Fecha, acción, documento (nombre del documento), tipo de documento,
        // fecha de creación, fecha de carga, fecha de ultima modificación,
        // tipo de información, tipo de documento, tipo de expediente,
        // folio de expediente y estatus
        body.push([
            { text: "Fecha", style: "tableHeader" },
            { text: "Acción", style: "tableHeader" },
            { text: "Documento", style: "tableHeader" },
            { text: "Tipo de documento", style: "tableHeader" },
            { text: "Fecha de creación", style: "tableHeader" },
            { text: "Fecha de carga", style: "tableHeader" },
            { text: "Fecha de modificación", style: "tableHeader" },
            { text: "Tipo de información", style: "tableHeader" },
            { text: "Tipo de documento", style: "tableHeader" },
            { text: "Tipo de expediente", style: "tableHeader" },
            { text: "Folio de expediente", style: "tableHeader" },
            { text: "Estatus", style: "tableHeader" },
        ]);

        data.forEach((row) => {
            const dataRow = [];
            columns.forEach((column) => {
                if (row[column]) {
                    dataRow.push({
                        text: row[column].toString(),
                        style: "subheader",
                    });
                } else {
                    dataRow.push({ text: "", style: "subheader" });
                }
            });
            body.push(dataRow);
        });

        return body;
    }

    // tslint:disable-next-line: typedef
    table({ data, columns }: { data: any; columns: any }) {
        return {
            //layout: "lightHorizontalLines",
            table: {
                headerRows: 1,
                body: this.buildTableBody(data, columns),
            },
        };
    }

    async generaReport(): Promise<void> {
        const value = [];
        let header: any[] = [];
        let presente: any[] = [];
        let legislaturas = await this.obtenerLegislatura();
        // Creamos el reporte

        header = this.configuraHeaderReport(legislaturas[0]["cLegislatura"]);

        presente.push({
            text: "Lic. David Gerardo Enrique Diaz",
            fontSize: 14,
            bold: true,
            alignment: "left",
            margin: [0, 10, 0, 0],
        });
        presente.push({
            text: "Director del Centro de Investigación y",
            fontSize: 14,
            bold: true,
            alignment: "left",
        });
        presente.push({
            text: "Estudios Legislativos",
            fontSize: 14,
            bold: true,
            alignment: "left",
        });
        presente.push({
            text: "PRESENTE",
            fontSize: 14,
            bold: true,
            alignment: "left",
        });

        presente.push({
            text:
                "Con fundamento en lo dispuesto por el artículo 102  de la Ley Orgánica del Congreso del Estado de Durango, me permito remitirle Iniciativa presentada por los CC. Diputados Rigoberto Quiñonez Samaniego, Sandra Lilia Amaya Rosales y Luis Iván Gurrola Vega de la coalición parlamentaria “cuarta transformación”, que contiene reformas y adiciones a la fracción I del artículo 52 de la ley de presupuesto, contabilidad y gasto público del estado de Durango siga su trámite legislativo correspondiente ante el Pleno Legislativo.",
            fontSize: 12,
            bold: false,
            alignment: "justify",
            margin: [0, 50, 5, 5],
        });

        presente.push({
            text:
                "Sin más por el momento, le envió un saludo fraterno y patentizo las seguridades de mi consideración y respeto.",
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
            text: "SUFRAGIO EFECTTIVO, NO REELECIÒN",
            fontSize: 12,
            bold: true,
            alignment: "center",
        });

        presente.push({
            text: "Durango, Dgo., 28/09/2020",
            fontSize: 12,
            bold: true,
            alignment: "center",
        });

        presente.push({
            text: "Lic. Ángel Gerardo Bonilla Sauced",
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

        pdfMake.createPdf(dd).open();
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
}
