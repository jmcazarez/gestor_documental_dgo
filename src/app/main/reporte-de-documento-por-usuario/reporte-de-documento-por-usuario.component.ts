import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DocumentosService } from 'services/documentos.service';
import { MenuService } from 'services/menu.service';
import { UsuariosService } from 'services/usuarios.service';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs; // fonts provided for pdfmake
import { EncabezadoReporte1Model } from 'models/encabezadoReporte1';
import { environment } from '../../../environments/environment';
import Swal from 'sweetalert2';
import { MatDatepicker } from '@angular/material/datepicker';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
    selector: 'app-reporte-de-documento-por-usuario',
    templateUrl: './reporte-de-documento-por-usuario.component.html',
    styleUrls: ['./reporte-de-documento-por-usuario.component.scss'],
    providers: [DatePipe],
})
export class ReporteDeDocumentoPorUsuarioComponent implements OnInit {
    firstFormGroup: FormGroup;
    secondFormGroup: FormGroup;
    documentos = [];
    arrUsuarios = [];
    selectedUsuario = '';
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
                private spinner: NgxSpinnerService,
                private documentoService: DocumentosService,
                private menuService: MenuService) {
        this.imageBase64 = environment.imageBase64;
    }

    ngOnInit(): void {

        // Formulario reactivo
        this.firstFormGroup = this._formBuilder.group({
            pickerFechaInicial: [new Date()],
            pickerFechaFinal: [new Date()],
            usuario: ['', Validators.required],
        });


        this.secondFormGroup = this._formBuilder.group({
            secondCtrl: ['', Validators.required],
            documento: ['', Validators.required],
            usuario: ['', Validators.required],
        });

        this.obtenerListaUsuarios();

    }


    borrarFiltros(): void {
        // Limpiamos inputs
        this.selectedUsuario = '';
    }

    obtenerDocumentos(): void {
        const documentosTemp: any[] = [];
        let idDocumento: any;
        this.spinner.show();

        const filtroReporte = 'trazabilidads.usuario=' + this.selectedUsuario;

        // Obtenemos los documentos
        this.documentoService.obtenerDocumentoReportePorFecha(filtroReporte).subscribe((resp: any) => {

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
                        idDocumento = '';

                        documentosTemp.push({
                            id: documento.id,
                            tipoDocumento: documento.tipoDocumento,
                            tipoExpediente: documento.tipoExpediente,
                            tipoInformacion: documento.tipoInformacion,
                            fechaCreacion: this.datePipe.transform(documento.fechaCreacion, 'dd-MM-yyyy'),
                            folioExpediente: documento.folioExpediente,
                            fechaCarga: this.datePipe.transform(documento.fechaCarga, 'dd-MM-yyyy'),
                            fechaModificacion: this.datePipe.transform(documento.fechaModificacion, 'dd-MM-yyyy'),
                            cNombreDocumento: documento.cNombreDocumento,
                            bActivo: documento.estatus,
                            ente: documento.ente,
                            version: parseFloat(documento.version).toFixed(1),
                            cAccion: documento.accion
                        });

                    }

                    this.documentos = documentosTemp;                  
                    this.spinner.hide();
                }

            } else {
                Swal.fire('Alerta', 'No existen movimientos en el periodo seleccionado.', 'warning');
                this.spinner.hide();
            }

         
        }, err => {
            Swal.fire('Error', 'Ocurrió un problema al consultar la información.', 'error');
            this.spinner.hide();
        });
    }

    // tslint:disable-next-line: typedef
    buildTableBody(data: any[], columns: any[]) {
        const body = [];
        // Fecha, acción, documento (nombre del documento), tipo de documento, 
        // fecha de creación, fecha de carga, fecha de ultima modificación, 
        // tipo de información, tipo de documento, tipo de expediente, 
        // folio de expediente y estatus
        body.push([{ text: 'Fecha', style: 'tableHeader' },
        { text: 'Acción', style: 'tableHeader' },
        { text: 'Documento', style: 'tableHeader' },
        { text: 'Tipo de documento', style: 'tableHeader' },
        { text: 'Fecha de creación', style: 'tableHeader' },
        { text: 'Fecha de carga', style: 'tableHeader' },
        { text: 'Fecha de modificación', style: 'tableHeader' },
        { text: 'Tipo de información', style: 'tableHeader' },
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

        // Creamos el reporte
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

            if (row.fechaModificacion) {
                fecha = row.fechaModificacion;
            }
            if (row.cAccion) {
                accion = row.cAccion;
            }
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
            fontSize: 8,
            pageMargins: [40, 100, 40, 50],
            content: [
                { text: '', style: 'tableExample' },
                this.table({
                    data: value, columns: [
                        'fechaModificacion', 'accion', 'nombreDocumento', 'tipoDocumento',
                        'fechaCreacion', 'fechaCarga', 'fechaModificacion', 'tipoInformacion',
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

        // Configuramos en encabezado
        const stack: any[] = [];

        stack.push({
            text: 'Reporte de movimiento de documentos por usuario',
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
        ;
        stack.push({
            text: 'Usuario: ' + this.arrUsuarios.filter(item => item['id'] === this.selectedUsuario)[0].cUsuario,
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


    obtenerListaUsuarios(): void {
        this.spinner.show();
        // Obtenemos la lista de usuarios
        this.usuariosService.obtenerUsuarios().subscribe((resp: any) => {
            this.arrUsuarios = resp;
            this.spinner.hide();
        }, err => {
            this.spinner.hide();
            Swal.fire('Error', 'Ocurrio un error el obtener los usuarios.', 'error');
        });
    }

}
