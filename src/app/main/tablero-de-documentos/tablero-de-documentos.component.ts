import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GuardarDocumentosComponent } from './guardar-documentos/guardar-documentos.component';
import { DocumentosModel } from 'models/documento.models';
import { DocumentosService } from 'services/documentos.service';
import { MenuService } from 'services/menu.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import Swal from 'sweetalert2';
import { ClasficacionDeDocumentosComponent } from './clasficacion-de-documentos/clasficacion-de-documentos.component';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
    selector: 'app-tablero-de-documentos',
    templateUrl: './tablero-de-documentos.component.html',
    styleUrls: ['./tablero-de-documentos.component.scss'],
    providers: [DatePipe]
})
export class TableroDeDocumentosComponent implements OnInit {

    @ViewChild('archivoPDF', { static: false }) archivoPDF;
    public PDFtexto = '';
    archivoBase64: any;
    file: any;
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
    valueBuscador: string;
    constructor(
        private spinner: NgxSpinnerService,
        private datePipe: DatePipe,
        private router: Router,
        public dialog: MatDialog,
        private documentoService: DocumentosService,
        private menuService: MenuService,
        private sanitizer: DomSanitizer
    ) {
        // Obtenemos documentos

    }

    ngOnInit() {

        this.obtenerDocumentos();
    }

    nuevoDocumento(): void {
        // Abrimos modal de guardar usuario
        const dialogRef = this.dialog.open(GuardarDocumentosComponent, {
            width: '50%',
            height: '80%',
            // height: '75%',
            // height: '100%',
            disableClose: true,
            data: new DocumentosModel(),

        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.obtenerDocumentos();
                if (result.documento) {
                    this.clasificarDocumento(result);
                }
            }
        });
    }


    obtenerDocumentos(): void {
        console.log('entro');
        this.spinner.show();
        const documentosTemp: any[] = [];
        let idDocumento: any;
        this.loadingIndicator = true;
        let meta = '';
        let visibilidad = '';
        let info: any;
        this.valueBuscador = '';
        // Obtenemos los documentos
        try {
            this.documentoService.obtenerDocumentos().subscribe((resp: any) => {

                // Buscamos permisos

                const opciones = this.menuService.opcionesPerfil.find((opcion: { cUrl: string; }) => opcion.cUrl === this.router.routerState.snapshot.url.replace('/', ''));

                this.optAgregar = opciones.Agregar;
                this.optEditar = opciones.Editar;
                this.optConsultar = opciones.Consultar;
                this.optEliminar = opciones.Eliminar;

                // Si tiene permisos para consultar
                if (this.optConsultar) {

                    for (const documento of resp.data) {
                        console.log('entro');
                        //                console.log(documento.tipo_de_documento.bActivo);
                        idDocumento = '';
                        // Validamos permisos

                        if (documento.tipo_de_documento) {
                            const encontro = this.menuService.tipoDocumentos.find((tipo: { id: string; }) => tipo.id === documento.tipo_de_documento.id);

                            if (documento.visibilidade) {
                                info = this.menuService.tipoInformacion.find((tipo: { id: string; }) => tipo.id === documento.visibilidade.id);
                            }

                            if (encontro) {
                                if (documento.tipo_de_documento.bActivo && encontro.Consultar) {

                                    if (documento.documento) {

                                        idDocumento = documento.documento.hash + documento.documento.ext;

                                        // console.log(documento.cNombreDocumento);
                                        if (documento.metacatalogos) {
                                            meta = '';
                                            if (documento.metacatalogos) {
                                                for (const x of documento.metacatalogos) {

                                                    if (meta === '') {

                                                        if (x.cTipoMetacatalogo === 'Fecha') {
                                                            if (x.text) {
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
                                        visibilidad = '';
                                        if (documento.visibilidade) {
                                            visibilidad = documento.visibilidade.cDescripcionVisibilidad;
                                        }

                                        if (documento.informacion === undefined || documento.informacion === undefined) {
                                            documento.informacion = '';
                                        }
                                        if (documento.fechaCarga === null || documento.fechaCarga === undefined) {
                                            documento.fechaCarga = '';
                                        }


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
                                            usuario: this.menuService.usuario
                                        });

                                        meta = '';
                                    }
                                }
                            }
                        }
                    }
                    console.log(documentosTemp);
                    this.documentos = documentosTemp;
                    this.documentosTemporal = this.documentos;
                }
                this.loadingIndicator = false;
                this.spinner.hide();
            }, err => {
                console.log(err);
                this.spinner.hide();
                this.loadingIndicator = false;
            });
        } catch (err) {
            console.log(err);
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

                this.obtenerDocumentos();
                if (result.documento) {
                    this.valueBuscador = '';
                    this.clasificarDocumento(result);
                }
            }

        });
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
                row.usuario = this.menuService.usuario;
                // realizamos delete
                this.documentoService.borrarDocumentos(row).subscribe((resp: any) => {
                    Swal.fire('Eliminado', 'El documento ha sido eliminado.', 'success');

                    this.obtenerDocumentos();
                }, err => {
                    this.cargando = false;
                    Swal.fire(
                        'Error',
                        'Ocurrió un error al eliminar el documento.' + err,
                        'error'
                    );
                });

            }
        });
    }

    descargarDocumento(row: any): void {
        // Descargamos el documento
        this.documentoService.dowloadDocument(row.idDocumento, row.id, this.menuService.usuario, row.cNombreDocumento).subscribe((resp: any) => {

            const linkSource = 'data:application/octet-stream;base64,' + resp.data;
            const downloadLink = document.createElement('a');
            const fileName = row.idDocumento;

            downloadLink.href = linkSource;
            downloadLink.download = fileName;
            downloadLink.click();
        }, err => {
            this.loadingIndicator = false;
        });
    }


    convertFile(buf: any): string {
        // Convertimos el resultado en binstring
        const binstr = Array.prototype.map.call(buf, (ch: number) => String.fromCharCode(ch)).join('');
        return btoa(binstr);
    }

    clasificarDocumento(result: any): void {
        let encontro: any;
        encontro = this.menuService.tipoDocumentos.find((tipo: { id: string; }) => tipo.id === result.tipo_de_documento.id);
        if (encontro) {
            if (encontro.Eliminar && this.optEliminar) {
                result.Eliminar = true;
            } else {
                result.Eliminar = false;
            }
        }
        // Abrimos modal de guardar usuario
        const dialogRef = this.dialog.open(ClasficacionDeDocumentosComponent, {
            width: '100%',
            height: '90%',
            disableClose: true,
            data: result,

        });

        // tslint:disable-next-line: no-shadowed-variable
        dialogRef.afterClosed().subscribe(result => {

            if (result) {
                this.valueBuscador = '';
                this.obtenerDocumentos();
            }
        });
    }


    consultarDcumento(documento: DocumentosModel): void {
        documento.disabled = true;
        // Abrimos modal de guardar perfil
        const dialogRef = this.dialog.open(GuardarDocumentosComponent, {
            width: '60%',
            height: '80%',
            disableClose: true,
            data: documento,
        });

        dialogRef.afterClosed().subscribe(result => {

            if (result) {
                this.valueBuscador = '';
                result.disabled = true;
                // this.obtenerDocumentos();
                //  if (result.documento.ext === '.pdf') {
                this.clasificarDocumento(result);
                // }
            }

        });
    }

    filterDatatable(value): void {
        // Filtramos tabla
        this.documentos = this.documentosTemporal;
        if (value.target.value === '') {
            this.documentos = this.documentosTemporal;
        } else {
            const val = value.target.value.toLowerCase();
            const temp = this.documentos.filter((d) => d.cNombreDocumento.toLowerCase().indexOf(val) !== -1 || !val ||
                d.clasificacion.toLowerCase().indexOf(val) !== - 1 || d.tipoDocumento.toLowerCase().indexOf(val) !== - 1 ||
                d.informacion.toLowerCase().indexOf(val) !== - 1 || d.fechaCarga.toLowerCase().indexOf(val) !== - 1);
            this.documentos = temp;
        }
    }

   
}
