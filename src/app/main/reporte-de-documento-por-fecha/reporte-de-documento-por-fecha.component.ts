import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DocumentosService } from 'services/documentos.service';
import { MenuService } from 'services/menu.service';
import { UsuariosService } from 'services/usuarios.service';
import { PdfMakeWrapper, Table, Img, Txt, Stack } from 'pdfmake-wrapper';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;  // fonts provided for pdfmake
import { EncabezadoReporte1Model } from 'models/encabezadoReporte1';
import { environment } from '../../../environments/environment';
import { MatDatepicker } from '@angular/material/datepicker';
import Swal from 'sweetalert2';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import * as moment from 'moment';
import { date } from '@rxweb/reactive-form-validators';
@Component({
    selector: 'app-reporte-de-documento-por-fecha',
    templateUrl: './reporte-de-documento-por-fecha.component.html',
    styleUrls: ['./reporte-de-documento-por-fecha.component.scss'],
    providers: [DatePipe]
})
export class ReporteDeDocumentoPorFechaComponent implements OnInit {
    firstFormGroup: FormGroup;
    secondFormGroup: FormGroup;
    documentos = [];
    documentosTemporal = [];
    arrInformacion = [];
    vigenteBusqueda = '';
    selectedInformacion = '';
    loadingIndicator: boolean;
    optAgregar: boolean;
    optConsultar: boolean;
    optEditar: boolean;
    optEliminar: boolean;
    reorderable = true;
    isLinear = false;
    encabezado = new EncabezadoReporte1Model();
    arrCols = [];
    arrBody: any[] = [];
    arr: any[] = [];
    imageBase64: any;
    fechaIni: Date;
    fechaFin: Date;
    arrDepartamentos = [];
    externalDataRetrievedFromServer = [
        { name: 'Bartek', age: 34 },
        { name: 'John', age: 27 },
        { name: 'Elizabeth', age: 30 },
    ];

    @ViewChild('pickerFechaInicial') pickerFechaInicial: any;
    @ViewChild('pickerFechaFinal') pickerFechaFinal: MatDatepicker<Date>;

    constructor(private _formBuilder: FormBuilder, private datePipe: DatePipe,
        private router: Router,
        private spinner: NgxSpinnerService,
        private documentoService: DocumentosService,
        private usuariosService: UsuariosService,
        private menuService: MenuService) {
        this.imageBase64 = environment.imageBase64;
    }

    async ngOnInit(): Promise<void> {
        moment.locale('es');
        // Formulario reactivo
        this.firstFormGroup = this._formBuilder.group({
            pickerFechaInicial: [new Date(), Validators.required],
            pickerFechaFinal: [new Date(), Validators.required]
        });


        this.secondFormGroup = this._formBuilder.group({
            secondCtrl: ['', Validators.required],
            documento: ['', Validators.required],
        });

        this.arrInformacion = this.menuService.tipoInformacion;
        await this.obtenerDepartamentos();
        //  this.obtenerDocumentos();
    }

    async obtenerDepartamentos(): Promise<void> {
        return new Promise(resolve => {
            // Obtenemos departamentos
            this.usuariosService.obtenerDepartamentos().subscribe(
                (resp: any) => {
                    this.arrDepartamentos = resp;
                    resolve(resp)

                },
                (err) => {
                    Swal.fire(
                        "Error",
                        "Ocurrió un error obtener el documento." + err,
                        "error"
                    );
                    resolve(err)
                }
            );
        })

    }

    async filterDatatable(): Promise<void> {

        await this.obtenerDocumentos();
        let temp = [];
        if (this.documentosTemporal) {
            this.documentos = this.documentosTemporal;
        }
        // Filtramos tabla
        if (this.vigenteBusqueda !== '' && this.vigenteBusqueda !== undefined) {
            if (this.vigenteBusqueda === 'false') {
                temp = this.documentos.filter((d) => d.bActivo === false);
            } else {
                temp = this.documentos.filter((d) => d.bActivo === true);
            }
            this.documentos = temp;
        }

        if (this.selectedInformacion !== '' && this.selectedInformacion !== undefined) {
            temp = this.documentos.filter((d) => d.informacion.toLowerCase().indexOf(this.selectedInformacion.toLowerCase()) !== -1 || !this.selectedInformacion);
            this.documentos = temp;
        }

    }


    borrarFiltros(): void {
        // Limpiamos inputs
        this.vigenteBusqueda = '';
        this.selectedInformacion = '';
        this.firstFormGroup.get('pickerFechaInicial').setValue(null);
        this.firstFormGroup.get('pickerFechaFinal').setValue(null);

    }

    obtenerDocumentos(): void {
        const documentosTemp: any[] = [];
        let idDocumento: any;
        this.loadingIndicator = true;
        let cFolioExpediente = '';
        try {
            this.spinner.show();
            const dFechaInicial = this.pickerFechaInicial._datepickerInput.value;
            const dFechaFinal = this.pickerFechaFinal._datepickerInput.value;
            if (dFechaInicial == null || dFechaFinal == null) {
                Swal.fire('Error', 'La fecha inicial y la fecha final son requeridas.', 'error');
                this.spinner.hide();
                return
            }
            const fIni = new Date(dFechaInicial);
            const fFin = new Date(dFechaFinal);

            if (fIni > fFin) {
                Swal.fire('Error', 'La fecha inicial no puede ser mayor a la final.', 'error');
                this.spinner.hide();
            } else if (this.pickerFechaInicial._datepickerInput.value === undefined || this.pickerFechaFinal._datepickerInput.value === undefined) {
                Swal.fire('Error', 'Las fechas son obligatorias.', 'error');
                this.spinner.hide();
            } else {

                dFechaFinal.setHours(23);
                dFechaFinal.setMinutes(59);
                dFechaFinal.setSeconds(59);
                const cFechaInicial = dFechaInicial.toISOString();
                const cFechaFinal = dFechaFinal.toISOString();
                const filtroReporte = `createdAt_gte=${cFechaInicial}&createdAt_lte=${cFechaFinal}`;

                // Obtenemos los documentos
                this.documentoService.obtenerDocumentoReportePorFecha(cFechaInicial,cFechaFinal).subscribe((resp: any) => {

                    if (resp.listado && resp.listado.length > 0) {

                        // Buscamos permisos
                        const opciones = this.menuService.opcionesPerfil.find((opcion: { cUrl: string; }) => opcion.cUrl === this.router.routerState.snapshot.url.replace('/', ''));
                        this.optAgregar = opciones.Agregar;
                        this.optEditar = opciones.Editar;
                        this.optConsultar = opciones.Consultar;
                        this.optEliminar = opciones.Eliminar;

                        // Si tiene permisos para consultar
                        if (this.optConsultar) {
                            for (const documento of resp.listado) {
                                cFolioExpediente = documento.folioExpediente;
                                let departamento = ""

                              /*   if (documento.tipo_de_documento.departamento) {
                                    departamento = this.arrDepartamentos.find((depto: { id: string; }) => depto.id === documento.tipo_de_documento.departamento).cDescripcionDepartamento;
                                } */
                                idDocumento = '';
                                documentosTemp.push({
                                    id: documento.id,
                                    tipoDocumento: documento.tipoDocumento,
                                    tipoExpediente: documento.tipoExpediente,
                                    tipoInformacion: documento.tipoInformacion,
                                    fechaCreacion: this.datePipe.transform(documento.fechaCreacion, 'dd-MM-yyyy'),
                                    folioExpediente: cFolioExpediente,
                                    fechaCarga: this.datePipe.transform(documento.fechaCarga, 'dd-MM-yyyy'),
                                    fechaModificacion: this.datePipe.transform(documento.fechaModificacion, 'dd-MM-yyyy'),
                                    fechaMovimiento: moment(documento.createdAt).format('dd-MM-yyyy'),
                                    cNombreDocumento: documento.cNombreDocumento,
                                    cNombreUsuario: documento.nombreUsuario,
                                    bActivo: documento.estatus,
                                    ente: documento.ente,
                                    version: parseFloat(documento.version).toFixed(1),
                                    cAccion: documento.accion,
                                    departamento,
                                    pasillo: documento.pasillo,
                                    estante: documento.estante,
                                    nivel: documento.nivel,
                                    seccion: documento.seccion
                                });

                            }

                            this.documentos = documentosTemp;
                            this.documentosTemporal = this.documentos;


                        }
                        this.loadingIndicator = false;
                        this.spinner.hide();

                    } else {
                        Swal.fire('Alerta', 'No existen movimientos en el periodo seleccionado.', 'warning');
                        this.spinner.hide();
                        this.loadingIndicator = false;
                    }

                    this.spinner.hide();
                    this.loadingIndicator = false;
                }, err => {
                    Swal.fire('Error', 'Ocurrió un problema al consultar la información.', 'error');
                    this.spinner.hide();
                    this.loadingIndicator = false;
                });
            }
        } catch (err) {
            Swal.fire('Error', 'Ocurrió un problema al consultar la información.', 'error');
            this.spinner.hide();
            this.loadingIndicator = false;
        }
    }

    // tslint:disable-next-line: typedef
    buildTableBody(data: any[], columns: any[]) {
        const body = [];
        // Fecha, acción, documento (nombre del documento), tipo de documento, 
        // fecha de ingreso, fecha de carga, fecha de ultima modificación, 
        // tipo de información, tipo de documento, tipo de expediente, 
        // folio de expediente y estatus
        body.push([{ text: 'Fecha', style: 'tableHeader' },
        { text: 'Acción', style: 'tableHeader' },
        { text: 'Usuario', style: 'tableHeader' },
        { text: 'Documento', style: 'tableHeader' },
        { text: 'Tipo de documento', style: 'tableHeader' },
        { text: 'Fecha de ingreso', style: 'tableHeader' },
        { text: 'Fecha de carga', style: 'tableHeader' },
        { text: 'Fecha de modificación', style: 'tableHeader' },
        /*  { text: 'Tipo de información', style: 'tableHeader' }, */
        { text: 'Tipo de documento', style: 'tableHeader' },
        { text: 'Tipo de expediente', style: 'tableHeader' },
        { text: 'Folio de expediente', style: 'tableHeader' },
        { text: 'Estatus', style: 'tableHeader' },
        ]);

        data.forEach((row) => {
            const dataRow = [];
            columns.forEach((column) => {
                if (row[column]) {
                    dataRow.push({ text: row[column].toString(), style: 'subheader' });
                } else {
                    dataRow.push({ text: '', style: 'subheader' });
                }
            });
            body.push(dataRow);
        });

        return body;
    }

    // tslint:disable-next-line: typedef
    table({ data, columns }: { data: any; columns: any; }) {
        return {
            layout: 'lightHorizontalLines',
            table: {
                headerRows: 1,
                body: this.buildTableBody(data, columns)
            }
        };
    }

    generaReport(): void {
        const value = [];


        this.documentos.forEach(row => {
            let fecha = '';
            let accion = '';
            let nombreDocumento = '';
            let tipoDocumento = '';
            let fechaCreacion = '';
            let fechaCarga = '';
            let fechaModificacion = '';
            let tipoInformacion = '';
            let tipoExpediente = '';
            let folioExpediente = '';
            let estatus = '';
            let nombreUsuario = '';

            if (row.fechaModificacion) {
                fecha = row.fechaModificacion;
            }
            if (row.cAccion) {
                accion = row.cAccion;
            }
            if (row.cNombreDocumento) {
                nombreDocumento = row.cNombreDocumento;
            }

            if (row.cNombreUsuario) {
                nombreUsuario = row.cNombreUsuario;
            }

            if (row.tipoDocumento) {
                tipoDocumento = row.tipoDocumento;
            }
            if (row.fechaCreacion) {
                fechaCreacion = row.fechaCreacion;
            }
            if (row.fechaCarga) {
                fechaCarga = row.fechaCarga;
            }
            if (row.fechaModificacion) {
                fechaModificacion = row.fechaModificacion;
            }
            if (row.tipoInformacion) {
                tipoInformacion = row.tipoInformacion;
            }
            if (row.tipoDocumento) {
                tipoDocumento = row.tipoDocumento;
            }
            if (row.tipoExpediente) {
                tipoExpediente = row.tipoExpediente;
            }
            if (row.folioExpediente) {
                folioExpediente = row.folioExpediente.toString();
            }
            if (row.bActivo) {
                estatus = 'Vigente';
            } else {
                estatus = 'No vigente';
            }

            value.push({
                fecha,
                accion,
                nombreUsuario,
                nombreDocumento,
                tipo: tipoDocumento,
                fechaCreacion,
                fechaCarga,
                fechaModificacion,
                tipoInformacion,
                tipoDocumento,
                tipoExpediente,
                folioExpediente,
                estatus
            });


        });

        const dd = {
            header: {
                columns: [{
                    image: 'data:image/jpeg;base64,' + this.imageBase64,
                    width: 120,
                    margin: [20, 5, 5, 5],
                }, {
                    nodeName: 'DIV',
                    stack: [
                        this.configuraHeaderReport()
                    ]
                },
                ],

            },
            pageOrientation: 'landscape',
            pageSize: 'A4',
            fontSize: 6,
            pageMargins: [2, 100, 40, 50],
            content: [
                { text: '', style: 'tableExample' },
                this.table({
                    data: value, columns: [
                        'fechaModificacion', 'accion', 'nombreUsuario', 'nombreDocumento', 'tipoDocumento',
                        'fechaCreacion', 'fechaCarga', 'fechaModificacion',
                        'tipoDocumento', 'tipoExpediente', 'folioExpediente', 'estatus',
                    ]
                })
            ],
            styles: {
                header: {
                    fontSize: 8,
                    bold: true,
                    margin: 0
                },
                subheader: {
                    fontSize: 8,
                    margin: 0
                },
                tableExample: {
                    margin: 0,

                },
                tableOpacityExample: {
                    margin: [0, 5, 0, 15],
                    fillColor: 'blue',
                    fillOpacity: 0.3
                },
                tableHeader: {
                    bold: true,
                    fontSize: 9,
                    color: 'black'
                }
            },
            defaultStyle: {
                // alignment: 'justify'
            }
        };

        pdfMake.createPdf(dd).open();
    }

    configuraHeaderReport(): any {
        const stack: any[] = [];

        stack.push({
            text: 'Reporte de movimiento de documentos por fecha',
            nodeName: 'H1',
            fontSize: 24,
            bold: true,
            marginBottom: 5,
            marginLeft: 35,
            marginTop: 5,
            style: [
                'html-h1',
                'html-div'
            ]
        });

        stack.push({
            text: 'Fecha inicio: ' + this.pickerFechaInicial._datepickerInput.value.toLocaleDateString(),
            nodeName: 'H4',
            fontSize: 12,
            bold: false,
            marginBottom: 5,
            marginLeft: 35,
            marginTop: 0,
            style: [
                'html-h1',
                'html-div'
            ]
        });

        stack.push({
            text: 'Fecha fin: ' + this.pickerFechaFinal._datepickerInput.value.toLocaleDateString(),
            nodeName: 'H4',
            fontSize: 12,
            bold: false,
            marginBottom: 5,
            marginLeft: 35,
            marginTop: 0,
            style: [
                'html-h1',
                'html-div'
            ]
        });

        return { stack };

    }
}

