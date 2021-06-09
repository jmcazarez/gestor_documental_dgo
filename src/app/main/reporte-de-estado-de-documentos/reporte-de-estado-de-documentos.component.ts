import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DocumentosService } from 'services/documentos.service';
import { MenuService } from 'services/menu.service';
import { UsuariosService } from 'services/usuarios.service';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;  // fonts provided for pdfmake
import { EncabezadoReporte1Model } from 'models/encabezadoReporte1';
import { environment } from '../../../environments/environment';
@Component({
    selector: 'app-reporte-de-estado-de-documentos',
    templateUrl: './reporte-de-estado-de-documentos.component.html',
    styleUrls: ['./reporte-de-estado-de-documentos.component.scss'],
    providers: [DatePipe]
})
export class ReporteDeEstadoDeDocumentosComponent implements OnInit {
    firstFormGroup: FormGroup;
    secondFormGroup: FormGroup;
    documentos = [];
    documentosTemporal = [];
    arrInformacion = [];
    arrUsuarios = [];
    vigenteBusqueda = '';
    selectedInformacion = '';
    selectedUsuario = '';
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

    constructor(private _formBuilder: FormBuilder, private datePipe: DatePipe,
        private usuariosService: UsuariosService,
        private router: Router,
        private documentoService: DocumentosService,
        private menuServices: MenuService) {
        this.imageBase64 = environment.imageBase64;
    }

    ngOnInit(): void {

        this.arrInformacion = this.menuServices.tipoInformacion;
        console.log(this.arrInformacion);
        // Formulario reactivo
        this.firstFormGroup = this._formBuilder.group({
            vigente: [''],
            informacion: ['']
        });

        this.secondFormGroup = this._formBuilder.group({
            secondCtrl: ['', Validators.required],
            documento: ['', Validators.required],
            usuario: ['', Validators.required],
        });


        //  this.obtenerDocumentos();
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
    }

    obtenerDocumentos(): void {
        const documentosTemp: any[] = [];
        let idDocumento: any;
        this.loadingIndicator = true;
        let meta = '';
        let visibilidad = '';
        let idEnte = '';
        let idExpediente = '';
        let info: any;
        let filtroReporte = '';

        if (this.vigenteBusqueda.length > 0) {
            filtroReporte = 'bActivo=' + this.vigenteBusqueda + '&';
        }
        if (this.selectedInformacion.length > 0) {
            filtroReporte = filtroReporte + 'visibilidade=' + this.selectedInformacion;
        }

        // Obtenemos los documentos
        this.documentoService.obtenerDocumentoReporte(filtroReporte).subscribe((resp: any) => {

            // Buscamos permisos
            const opciones = this.menuServices.opcionesPerfil.find((opcion: { cUrl: string; }) => opcion.cUrl === this.router.routerState.snapshot.url.replace('/', ''));
            this.optAgregar = opciones.Agregar;
            this.optEditar = opciones.Editar;
            this.optConsultar = opciones.Consultar;
            this.optEliminar = opciones.Eliminar;

            // Si tiene permisos para consultar
            if (this.optConsultar) {
                for (const documento of resp.data) {
                    idDocumento = '';
                    // Validamos permisos
                    if (documento.tipo_de_documento) {
                        if (documento.documento) {
                            const encontro = this.menuServices.tipoDocumentos.find((tipo: { id: string; }) => tipo.id === documento.tipo_de_documento.id);

                            if (documento.visibilidade) {
                                info = this.menuServices.tipoInformacion.find((tipo: { id: string; }) => tipo.id === documento.visibilidade.id);
                            }
                            if (encontro) {
                                if (documento.tipo_de_documento.bActivo && encontro.Consultar && info) {
                                    if (documento.documento) {
                                        idDocumento = documento.documento.hash + documento.documento.ext;
                                    }
                                    if (documento.metacatalogos) {
                                        meta = '';
                                        if (documento.metacatalogos) {
                                            for (const x of documento.metacatalogos) {

                                                if (meta === '') {

                                                    if (x.cTipoMetacatalogo === 'Fecha') {
                                                        if (x.text) {
                                                            meta = meta + x.cDescripcionMetacatalogo + ': ' + this.datePipe.transform(x.text, 'MM-dd-yyyy');
                                                        }
                                                    } else {
                                                        if (x.text) {
                                                            meta = meta + x.cDescripcionMetacatalogo + ': ' + x.text;
                                                        }
                                                    }
                                                } else {
                                                    if (x.cTipoMetacatalogo === 'Fecha') {
                                                        if (x.text) {
                                                            meta = meta + ' , ' + x.cDescripcionMetacatalogo + ': ' + this.datePipe.transform(x.text, 'MM-dd-yyyy');
                                                        }
                                                    } else if (x.cTipoMetacatalogo === 'Sí o no') {
                                                        if (x.text) { meta = meta + x.cDescripcionMetacatalogo + ': Sí'; } else {
                                                            meta = meta + x.cDescripcionMetacatalogo + ': No';
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
                                    visibilidad = '';
                                    if (documento.visibilidade) {
                                        visibilidad = documento.visibilidade.cDescripcionVisibilidad;
                                    }
                                    idEnte = '';
                                    if (documento.ente) {

                                        idEnte = documento.ente.id;
                                    }
                                    idExpediente = '';
                                    if (documento.tipo_de_expediente) {

                                        idExpediente = documento.tipo_de_expediente.id;
                                    }


                                    // tslint:disable-next-line: no-unused-expression
                                    // Seteamos valores y permisos
                                    documentosTemp.push({
                                        id: documento.id,
                                        cNombreDocumento: documento.cNombreDocumento,
                                        tipoDocumento: documento.tipo_de_documento.cDescripcionTipoDocumento,
                                        tipo_de_documento: documento.tipo_de_documento.id,
                                        fechaCarga: this.datePipe.transform(documento.fechaCarga, 'MM-dd-yyyy'),
                                        fechaCreacion: this.datePipe.transform(documento.fechaCreacion, 'MM-dd-yyyy'),
                                        paginas: documento.paginas,
                                        bActivo: documento.bActivo,
                                        fechaModificacion: this.datePipe.transform(documento.updatedAt, 'MM-dd-yyyy'),
                                        Agregar: encontro.Agregar,
                                        Eliminar: encontro.Eliminar,
                                        Editar: encontro.Editar,
                                        Consultar: encontro.Consultar,
                                        idDocumento: idDocumento,
                                        version: parseFloat(documento.version).toFixed(1),
                                        documento: documento.documento,
                                        ente: documento.ente,
                                        secretaria: documento.secretaria,
                                        direccione: documento.direccione,
                                        departamento: documento.departamento,
                                        folioExpediente: documento.folioExpediente,
                                        clasificacion: meta,
                                        metacatalogos: documento.metacatalogos,
                                        informacion: visibilidad,
                                        visibilidade: documento.visibilidade,
                                        idEnte,
                                        tipo_de_expediente: documento.tipo_de_expediente,
                                        idExpediente,
                                        selected: false
                                    });

                                    meta = '';
                                }
                            }
                        }
                    }
                }

                this.documentos = documentosTemp;
                this.documentosTemporal = this.documentos;

            }
            this.loadingIndicator = false;
        }, err => {
            this.loadingIndicator = false;
        });
    }

    // tslint:disable-next-line: typedef
    buildTableBody(data: any[], columns: any[]) {
        const body = [];

        body.push([{ text: 'Id. documento', style: 'tableHeader' },
        { text: 'Documento', style: 'tableHeader' },
        { text: 'Tipo de documento', style: 'tableHeader' },
        { text: 'Fecha de creación', style: 'tableHeader' },
        { text: 'Fecha de carga', style: 'tableHeader' },
        { text: 'Fecha de modificación', style: 'tableHeader' },
        { text: 'Tipo de información', style: 'tableHeader' },
        { text: 'Tipo de expediente', style: 'tableHeader' },
        { text: 'Folio de expediente', style: 'tableHeader' },
        { text: 'Versión', style: 'tableHeader' },
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
            let nombreDocumento = '';
            let tipoDocumento = '';
            let fechaCreacion = '';
            let fechaCarga = '';
            let fechaModificacion = '';
            let informacion = '';
            let tipoExpediente = '';
            let folioExpediente = '';
            let version = '';
            let estatus = '';
            if (row.cNombreDocumento) {
                nombreDocumento = row.cNombreDocumento;
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
            if (row.informacion) {
                informacion = row.informacion;
            }
            if (row.tipo_de_expediente) {
                tipoExpediente = row.tipo_de_expediente.cDescripcionTipoExpediente;
            }
            if (row.folioExpediente) {
                folioExpediente = row.folioExpediente.toString();
            }
            if (row.version) {
                version = row.version;
            }
            if (row.bActivo) {
                estatus = 'Vigente';
            } else {
                estatus = 'No vigente';
            }

            value.push({
                id: row.id,
                Documento: nombreDocumento,
                tipoDocumento: tipoDocumento,
                fechaCreacion: fechaCreacion,
                fechaCarga: fechaCarga,
                fechaModificacion: fechaModificacion,
                informacion: informacion,
                tipoExpediente: tipoExpediente,
                folioExpediente: folioExpediente,
                version: version,
                estatus: estatus
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
            fontSize: 8,
            pageMargins: [40, 100, 40, 50],
            content: [

                { text: '', style: 'tableExample' },
                this.table({
                    data: value, columns: [
                        'id', 'Documento', 'tipoDocumento', 'fechaCreacion', 'fechaCarga',
                        'fechaModificacion', 'informacion', 'tipoExpediente', 'folioExpediente',
                        'version', 'estatus',
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
        let stack: any[] = [];
        const fecha = new Date(); // Fecha actual
        let mes: any = fecha.getMonth() + 1; // obteniendo mes
        let dia: any = fecha.getDate(); // obteniendo dia
        // dia = dia + 1;
        const ano = fecha.getFullYear(); // obteniendo año
        const fechaActual = ano + '-' + mes + '-' + dia;

        stack.push({
            text: 'Reporte de estado de documentos',
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

        if (this.vigenteBusqueda.length > 0) {
            let vigente = '';
            if (this.vigenteBusqueda === 'true') {
                vigente = 'Vigente';
            } else {
                vigente = 'No Vigente';
            }
            stack.push({
                text: 'Estado: ' + vigente + '                  Fecha: ' + fechaActual,
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
        } else {
            stack.push({
                text: 'Fecha: ' + fechaActual,
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
        }

        if (this.selectedInformacion.length > 0) {
            stack.push({
                text: 'Tipo de información: ' + this.selectedInformacion,
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
        }


        return { stack };

    }
}

