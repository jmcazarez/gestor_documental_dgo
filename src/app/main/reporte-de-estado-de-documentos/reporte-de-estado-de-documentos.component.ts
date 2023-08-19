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
import Swal from 'sweetalert2';
import { ExportService } from 'services/export.service';
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
    arrDepartamentos = [];

    constructor(private _formBuilder: FormBuilder, private datePipe: DatePipe,
        private usuariosService: UsuariosService,
        private router: Router,
        private documentoService: DocumentosService,
        private menuServices: MenuService,
        private exportService: ExportService) {
        this.imageBase64 = environment.imageBase64;
    }

    async ngOnInit(): Promise<void> {
        
        this.arrInformacion = this.menuServices.tipoInformacion;
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
     /*    if (this.documentosTemporal) {
            this.documentos = this.documentosTemporal;
        } */
        // Filtramos tabla
      

       /*  if (this.selectedInformacion !== '' && this.selectedInformacion !== undefined) {
            temp = this.documentos.filter((d) => d.informacion.toLowerCase().indexOf(this.selectedInformacion.toLowerCase()) !== -1 || !this.selectedInformacion);
            this.documentos = temp;
        } */

    }


    borrarFiltros(): void {
        // Limpiamos inputs
        this.vigenteBusqueda = '';
        this.selectedInformacion = '';
    }

    async obtenerDocumentos(): Promise<void> {
        let documentosTemp: any[] = [];
        let idDocumento: any;
        this.loadingIndicator = true;
        let meta = '';
        let visibilidad = '';
        let idEnte = '';
        let idExpediente = '';
        let info: any;
        let filtroReporte = '';
        let cFolioExpediente = '';
      /*   if (this.vigenteBusqueda.length > 0) {
            filtroReporte = 'bActivo=' + this.vigenteBusqueda + '&';
        } */
     /*    if (this.selectedInformacion.length > 0) {
            filtroReporte = filtroReporte + 'visibilidade=' + this.selectedInformacion;
        } */

        // Obtenemos los documentos
       await this.documentoService.obtenerDocumentoReporte(filtroReporte).subscribe((resp: any) => {

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
                    cFolioExpediente = '';
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
                                    cFolioExpediente = documento.folioExpediente
                                    if (documento.legislatura) {
                                        if (documento.legislatura.cLegislatura) {
                                            cFolioExpediente = documento.legislatura.cLegislatura + '-' + documento.folioExpediente
                                        }
                                    }
                                    if (documento.metacatalogos) {
                                        meta = '';
                                        if (documento.metacatalogos) {
                                            for (const x of documento.metacatalogos) {

                                                if (meta === '') {

                                                    if (x.cTipoMetacatalogo === 'Fecha') {
                                                        if (x.text) {
                                                            meta = meta + x.cDescripcionMetacatalogo + ': ' + this.datePipe.transform(x.text, 'dd-MM-yyyy');
                                                        }
                                                    } else {
                                                        if (x.text) {
                                                            meta = meta + x.cDescripcionMetacatalogo + ': ' + x.text;
                                                        }
                                                    }
                                                } else {
                                                    if (x.cTipoMetacatalogo === 'Fecha') {
                                                        if (x.text) {
                                                            meta = meta + ' , ' + x.cDescripcionMetacatalogo + ': ' + this.datePipe.transform(x.text, 'dd-MM-yyyy');
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
                                    let departamento = ""                                
                                  /*   if (documento.tipo_de_documento.departamento) {
                                        departamento = this.arrDepartamentos.find((depto: { id: string; }) => depto.id === documento.tipo_de_documento.departamento).cDescripcionDepartamento;
                                    } */
                                    const vigencia = new Date(documento.fechaCreacion);
                                    const fechaActual = new Date();
                                    let bActivo = false;
                                    if (documento.plazoDeConservacion) {
                                        vigencia.setFullYear(vigencia.getFullYear() + documento.plazoDeConservacion);
                                    }

                                  if (vigencia.getTime() >= fechaActual.getTime()) {
                                        console.log('entro');
                                        bActivo = true
                                    } 

                             

                                    documentosTemp.push({
                                        id: documento.id,
                                        cNombreDocumento: documento.cNombreDocumento,
                                        tipoDocumento: documento.tipo_de_documento.cDescripcionTipoDocumento,
                                        tipo_de_documento: documento.tipo_de_documento.id,
                                        fechaCarga: this.datePipe.transform(documento.fechaCarga, 'dd-MM-yyyy'),
                                        fechaCreacion: this.datePipe.transform(documento.fechaCreacion, 'dd-MM-yyyy'),
                                        paginas: documento.paginas,
                                        bActivo: bActivo,
                                        fechaModificacion: this.datePipe.transform(documento.updatedAt, 'dd-MM-yyyy'),
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
                                        departamento: departamento,
                                        folioExpediente: cFolioExpediente,
                                        clasificacion: meta,
                                        metacatalogos: documento.metacatalogos,
                                        informacion: visibilidad,
                                        visibilidade: documento.visibilidade,
                                        idEnte,
                                        tipo_de_expediente: documento.tipo_de_expediente,
                                        idExpediente,
                                        selected: false,
                                        vigencia: this.datePipe.transform(vigencia, 'dd-MM-yyyy'),
                                        pasillo: documento.pasillo,
                                        estante: documento.estante,
                                        nivel: documento.nivel,
                                        seccion: documento.seccion
                                    });

                                    meta = '';
                                }
                            }
                        }
                    }
                }

                
                if (this.vigenteBusqueda !== '' && this.vigenteBusqueda !== undefined) {
                    if(this.vigenteBusqueda == 'true'){
                        console.log('true');
                        documentosTemp = documentosTemp.filter((d) => d.bActivo == true);
                    }else{
                        console.log('false');
                        documentosTemp = documentosTemp.filter((d) => d.bActivo == false);
                    }
                    
                  
                }

              
                this.documentos =  [...documentosTemp];
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

        body.push([
            /*   { text: 'Id. documento', style: 'tableHeader' }, */
            { text: 'Nombre de documento', style: 'tableHeader' },
            { text: 'Tipo de documento', style: 'tableHeader' },
            { text: 'Fecha de ingreso', style: 'tableHeader' },
            { text: 'Fecha de carga', style: 'tableHeader' },
            { text: 'Fecha de modificación', style: 'tableHeader' },
            { text: 'Fecha de baja', style: 'tableHeader' },
            { text: 'Tipo de expediente', style: 'tableHeader' },
            { text: 'Nro. de caja', style: 'tableHeader' },
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
    async generaReport(): Promise<void> {
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
            let vigencia = ''
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
            if (row.vigencia) {
                vigencia = row.vigencia;
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
                /*       id: row.id, */
                Documento: nombreDocumento,
                tipoDocumento: tipoDocumento,
                fechaCreacion: fechaCreacion,
                fechaCarga: fechaCarga,
                fechaModificacion: fechaModificacion,
                vigencia,
                tipoExpediente: tipoExpediente,
                folioExpediente: folioExpediente,
                version: version,
                estatus: estatus
            });
        });


        const dd = {
            header: {

                columns: [{
                    image: await this.exportService.getBase64ImageFromURL('/assets/images/logos/logo.png'),
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
                        'Documento', 'tipoDocumento', 'fechaCreacion', 'fechaCarga',
                        'fechaModificacion', 'vigencia', 'tipoExpediente', 'folioExpediente',
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
            fontSize: 22,
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

       /*  if (this.selectedInformacion.length > 0) {
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
        } */


        return { stack };

    }
}

