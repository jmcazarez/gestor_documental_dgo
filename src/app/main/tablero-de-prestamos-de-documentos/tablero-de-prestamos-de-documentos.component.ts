
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GuardarPrestamoComponent } from './guardar-prestamo/guardar-prestamo.component';
import { MenuService } from 'services/menu.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { PdfMakeWrapper, Table, Img, Txt, Stack } from 'pdfmake-wrapper';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
import { PrestamosDeDocumentosService } from 'services/prestamo-de-documentos.service';
import { PrestamoDeDocumentosModels } from 'models/prestamo-de-documentos.models';
import * as moment from 'moment';
import { TipoExpedientesService } from 'services/tipo-expedientes.service';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;  // fonts provided for pdfmake
import { environment } from '../../../environments/environment';

@Component({
    selector: 'app-tablero-de-prestamos-de-documentos',
    templateUrl: './tablero-de-prestamos-de-documentos.component.html',
    styleUrls: ['./tablero-de-prestamos-de-documentos.component.scss'],
    providers: [DatePipe]
})

export class TableroDePrestamosDeDocumentosComponent implements OnInit {

    valueBuscador: string;
    loadingIndicator: boolean;
    reorderable: boolean;
    cargando: boolean;
    prestamoDocumentos = [];
    prestamoDocumentosTemp = [];
    optAgregar: boolean;
    optConsultar: boolean;
    optEditar: boolean;
    optEliminar: boolean;
    tipoExpedientes: any[] = [];
    documentos = [];
    imageBase64: any;
    constructor(
        private spinner: NgxSpinnerService,
        private datePipe: DatePipe,
        public dialog: MatDialog,
        private tipoExpedientesService: TipoExpedientesService,
        private prestamosDeDocumentosService: PrestamosDeDocumentosService,
        private menuService: MenuService,

    ) {
        // Obtenemos recepcion de actas
        this.imageBase64 = environment.imageBase64;
    }

    async ngOnInit(): Promise<void> {
        await this.obtenerTiposExpedientes();
        await this.obtenerPrestamosDeDocumentos();
    }

    async obtenerPrestamosDeDocumentos(): Promise<void> {
        this.spinner.show();
        this.valueBuscador = '';
        this.loadingIndicator = true;
        const prestamosTemp: any[] = [];

        // Obtenemos los iniciativas
        await this.prestamosDeDocumentosService.obtenerPrestamosDeDocumentos().subscribe((resp: any) => {

            // Buscamos permisos
            const opciones = this.menuService.opcionesPerfil.find((opcion: { cUrl: string; }) => opcion.cUrl === 'tablero-de-prestamos-de-documentos');

            this.optAgregar = opciones.Agregar;
            this.optEditar = opciones.Editar;
            this.optConsultar = opciones.Consultar;
            this.optEliminar = opciones.Eliminar;
            // Si tiene permisos para consultar
            if (this.optConsultar) {
                if (resp) {
                    for (const prestamos of resp) {
                        console.log(prestamos);
                        let cDescripcionTipoExpediente = "";
                        let tipoExpediente: any;
                        if (prestamos.tipo_de_expediente) {
                            cDescripcionTipoExpediente =
                                prestamos.tipo_de_expediente.cDescripcionTipoExpediente;
                            prestamos.cTipoExpediente = prestamos.tipo_de_expediente.id
                        }
                        if (prestamos.cTipoExpediente) {
                            tipoExpediente = this.tipoExpedientes.find(tipoOpcion => tipoOpcion.id === prestamos.cTipoExpediente);
                            if (tipoExpediente) {
                                cDescripcionTipoExpediente = tipoExpediente.cDescripcionTipoExpediente;
                            }
                        }
                        prestamosTemp.push({
                            id: prestamos.id,
                            dFechaSolicitud: prestamos.dFechaSolicitud,
                            dFechaDevolucion: prestamos.dFechaDevolucion,
                            dFechaDocEntregado: prestamos.dFechaDocEntregado,
                            dFechaSolicitudT: moment(prestamos.dFechaSolicitud).format('DD-MM-YYYY'),
                            dFechaDevolucionT: this.datePipe.transform(prestamos.dFechaDevolucion, 'dd-MM-yyyy'),
                            dFechaDocEntregadoT: this.datePipe.transform(prestamos.dFechaDevolucion, 'dd-MM-yyyy'),
                            cSolicitante: prestamos.cSolicitante,
                            cTipoPrestamo: prestamos.cTipoPrestamo,

                            cIdExpediente: prestamos.cIdExpediente,
                            tHoraSolicitud: moment(prestamos.tHoraSolicitud, 'h:mm').format('HH:mm'),
                            tHoraDevolucion: moment(prestamos.tHoraDevolucion, 'h:mm').format('HH:mm'),
                            tHoraDocEntregado: moment(prestamos.tHoraDocEntregado, 'h:mm').format('HH:mm'),
                            cNotas: prestamos.cNotas,
                            cEstatus: prestamos.cEstatus,
                            cTipoDanio: prestamos.cTipoDanio,
                            tipo_de_expediente: prestamos.tipo_de_expediente,
                            cDescripcionTipoExpediente: cDescripcionTipoExpediente,
                            cTipoExpediente: prestamos.cTipoExpediente
                        });
                    }
                }
                //console.log(prestamosTemp);
                this.prestamoDocumentos = prestamosTemp;
                this.prestamoDocumentosTemp = this.prestamoDocumentos;
            }
            this.loadingIndicator = false;
            this.spinner.hide();
        }, err => {
            this.loadingIndicator = false;
            this.spinner.hide();
        });
    }

    nuevoPrestamo(): void {
        // Abrimos modal de guardar recepcion de actas
        const dialogRef = this.dialog.open(GuardarPrestamoComponent, {
            width: '50%',
            height: '90%',
            disableClose: true,
            data: new PrestamoDeDocumentosModels(),

        });

        dialogRef.afterClosed().subscribe(result => {
            this.obtenerPrestamosDeDocumentos();
            this.limpiar();
        });
    }

    editarPrestamo(prestamo: PrestamoDeDocumentosModels): void {
        // Abrimos modal de guardar recepcion de actas
        const dialogRef = this.dialog.open(GuardarPrestamoComponent, {
            width: '60%',
            height: '80%',
            disableClose: true,
            data: prestamo,
        });

        dialogRef.afterClosed().subscribe(result => {
            this.obtenerPrestamosDeDocumentos();
            this.limpiar();
        });
    }

    eliminarPrestamo(row): void {
        // Eliminamos recepcion de actas
        Swal.fire({
            title: '¿Está seguro que desea eliminar el prestamo de documentos?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Si',
            cancelButtonText: 'No'
        }).then((result) => {
            if (result.value) {

                // realizamos delete
                this.prestamosDeDocumentosService.eliminarPrestamosDeDocumentos(row).subscribe((resp: any) => {
                    Swal.fire('Eliminado', 'El prestamo ha sido eliminado.', 'success');
                    this.obtenerPrestamosDeDocumentos();
                    this.limpiar();
                }, err => {
                    this.cargando = false;
                    Swal.fire(
                        'Error',
                        'Ocurrió un error al eliminar el prestamo de documentos.' + err,
                        'error'
                    );
                });

            }
        });
    }

    filterDatatable(value): void {
        // Filtramos tabla
        this.prestamoDocumentos = this.prestamoDocumentosTemp;
        if (value.target.value === '') {
            this.prestamoDocumentos = this.prestamoDocumentosTemp;
        } else {
            const val = value.target.value.toLowerCase();
            const temp = this.prestamoDocumentos.filter((d) => d.dFechaSolicitudT.toLowerCase().indexOf(val) !== -1 || !val ||
                d.dFechaDevolucionT.toLowerCase().indexOf(val) !== -1 || !val ||
                d.cSolicitante.toLowerCase().indexOf(val) !== -1 || !val ||
                d.cTipoPrestamo.toLowerCase().indexOf(val) !== -1 || !val ||
                d.cDescripcionTipoExpediente.toLowerCase().indexOf(val) !== -1 || !val ||
                d.tHoraSolicitud.toLowerCase().indexOf(val) !== -1 || !val ||
                d.tHoraDevolucion.toLowerCase().indexOf(val) !== -1 || !val ||
                d.cEstatus.toLowerCase().indexOf(val) !== -1 || !val ||
                d.cIdExpediente.toLowerCase().indexOf(val) !== -1 ||
                d.id.toLowerCase().indexOf(val) !== -1);

            this.prestamoDocumentos = temp;
        }
    }

    limpiar(): void {
        //Limpiamos buscador
        this.valueBuscador = '';
        //console.log('buscador' + this.valueBuscador);
    }

    async obtenerTiposExpedientes(): Promise<any> {
        // Obtenemos tipos de expedientes
        this.spinner.show();
        return new Promise(async (resolve) => {
            {

                await this.tipoExpedientesService.obtenerTipoExpedientes().subscribe(
                    (resp: any) => {
                        this.tipoExpedientes = resp;
                        console.log(this.tipoExpedientes);
                        resolve(this.tipoExpedientes);
                        this.spinner.hide();
                    },
                    (err) => {
                        Swal.fire(
                            "Error",
                            "Ocurrió un error obtener los tipos de expedientes." + err,
                            "error"
                        );
                        this.spinner.hide();
                        resolve(err);
                    }
                );
            }
        });
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
        const stack: any[] = [];

        stack.push({
            text: 'Reporte de préstamos de documentos',
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

        return { stack };

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
    // tslint:disable-next-line: typedef
    buildTableBody(data: any[], columns: any[]) {
        const body = [];
        // Fecha, acción, documento (nombre del documento), tipo de documento, 
        // fecha de creación, fecha de carga, fecha de ultima modificación, 
        // tipo de información, tipo de documento, tipo de expediente, 
        // folio de expediente y estatus
        body.push([{ text: 'Fecha', style: 'tableHeader' },
        { text: 'Acción', style: 'tableHeader' },
        { text: 'Usuario', style: 'tableHeader' },
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

}

