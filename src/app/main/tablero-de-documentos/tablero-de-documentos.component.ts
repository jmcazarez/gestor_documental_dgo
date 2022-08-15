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
import { ExportAsService, ExportAsConfig } from 'ngx-export-as';
import { Page } from 'models/page.models';
import { Console } from 'console';
import { environment } from 'environments/environment';
import { UsuariosService } from 'services/usuarios.service';
interface PageInfo {
    offset: number;
    pageSize: number;
    limit: number;
    count: number;
}
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
    arrDepartamentos = [];
    optAgregar: boolean;
    optConsultar: boolean;
    optEditar: boolean;
    optEliminar: boolean;
    fileBase64: any;
    valueBuscador: string;
    pageNumber = 0;
    cache: any = {};
    isLoading = 0;
    size = 20
    constructor(
        private spinner: NgxSpinnerService,
        private datePipe: DatePipe,
        private router: Router,
        public dialog: MatDialog,
        private documentoService: DocumentosService,
        private menuService: MenuService,
        private sanitizer: DomSanitizer,
        private usuariosService: UsuariosService,
    ) {
        // Obtenemos documentos

    }

    async ngOnInit() {
        await this.obtenerDepartamentos();
        this.obtenerDocumentos(0);

    }
    setPage(pageInfo: PageInfo) {
        let pageActual = this.pageNumber

        // Current page number is determined by last call to setPage
        // This is the page the UI is currently displaying
        // The current page is based on the UI pagesize and scroll position
        // Pagesize can change depending on browser size
        pageInfo.pageSize = this.size;
        this.pageNumber = pageInfo.offset;

        // Calculate row offset in the UI using pageInfo
        // This is the scroll position in rows
        const rowOffset = pageInfo.offset * pageInfo.pageSize;

        // When calling the server, we keep page size fixed
        // This should be the max UI pagesize or larger
        // This is not necessary but helps simplify caching since the UI page size can change
        const page = new Page();
        page.size = this.size;
        page.pageNumber = Math.floor(rowOffset / page.size);
        if (pageActual !== this.pageNumber) {
            this.obtenerDocumentos(this.pageNumber);
        }


        // We keep a index of server loaded pages so we don't load same data twice
        // This is based on the server page not the UI
        if (this.cache[page.pageNumber]) return;
        this.cache[page.pageNumber] = true;

        // Counter of pending API calls
        this.isLoading++;


        /* 
                if (pageActual !== this.pageNumber && this.pageNumber !== 0) {
                    console.log('prueba', this.pageNumber);
        
                    this.obtenerDocumentos('_limit=' + this.size +'&_sort=id%3AASC&_start=' + (this.pageNumber * this.size).toString(), this.pageNumber);
                } */

        /*   this.serverResultsService.getResults(page).subscribe(pagedData => {
            // Update total count
            this.totalElements = pagedData.page.totalElements;
      
            // Create array to store data if missing
            // The array should have the correct number of with "holes" for missing data
            if (!this.rows) {
              this.rows = new Array<CorporateEmployee>(this.totalElements || 0);
            }
      
            // Calc starting row offset
            // This is the position to insert the new data
            const start = pagedData.page.pageNumber * pagedData.page.size;
      
            // Copy existing data
            const rows = [...this.rows];
      
            // Insert new rows into correct position
            rows.splice(start, pagedData.page.size, ...pagedData.data);
      
            // Set rows to our new rows for display
            this.rows = rows;
      
            // Decrement the counter of pending API calls
            this.isLoading--;
          }); */
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
                this.obtenerDocumentos(this.pageNumber);
                if (result.documento) {
                    this.clasificarDocumento(result, this.pageNumber);
                }
            }
        });
    }


    async obtenerDocumentos(numeroPagina: number): Promise<void> {

        this.spinner.show();
        const documentosTemp: any[] = this.documentos;
        let idDocumento: any;
        this.loadingIndicator = true;
        let meta = '';
        let visibilidad = '';
        let info: any;
        this.valueBuscador = '';
        let countFecha = 0;
        let cFolioExpediente = '';
       
        let pasillo = '';
        let estante = '';
        let nivel = '';
        let seccion = '';
        let filtro = '_limit=' + this.size + '&_sort=id%3AASC&_start=' + (numeroPagina * this.size).toString()
        // Obtenemos los documentos
        try {
            // obtenerDocumentoReporte
            
            await this.documentoService.obtenerDocumentoReporte(filtro).subscribe((resp: any) => {
                // await this.documentoService.obtenerDocumentos().subscribe((resp: any) => {

                // Buscamos permisos

                const opciones = this.menuService.opcionesPerfil.find((opcion: { cUrl: string; }) => opcion.cUrl === this.router.routerState.snapshot.url.replace('/', ''));

                this.optAgregar = opciones.Agregar;
                this.optEditar = opciones.Editar;
                this.optConsultar = opciones.Consultar;
                this.optEliminar = opciones.Eliminar;

                // Si tiene permisos para consultar
                if (this.optConsultar) {

                    for (const documento of resp.data) {
                        let eliminar = documentosTemp.findIndex(p => p.id == documento.id)
                        if (eliminar >= 0) {
                            // this.documentos.splice(eliminar, 1)
                        }
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

                                        if (documento.metacatalogos) {
                                            meta = '';
                                            countFecha = 0;
                                            visibilidad = '';
                                            cFolioExpediente = '';
                                            if (documento.metacatalogos) {
                                                for (const x of documento.metacatalogos) {

                                                    if (meta === '') {

                                                        if (x.cTipoMetacatalogo === 'Fecha') {
                                                            if (x.text) {
                                                                countFecha = x.text.split("T16:00:00.000Z").length - 1;

                                                                if (countFecha >= 2) {
                                                                    x.text = x.text.replace('T16:00:00.000ZT16:00:00.000Z', 'T16:00:00.000Z')
                                                                }
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
                                                        } else {
                                                            if (x.text) {
                                                                meta = meta + ' , ' + x.cDescripcionMetacatalogo + ': ' + x.text;
                                                            }
                                                        }

                                                    }
                                                }
                                            }
                                        }

                                        if (documento.visibilidade) {
                                            visibilidad = documento.visibilidade.cDescripcionVisibilidad;
                                        }

                                        if (documento.informacion === undefined || documento.informacion === undefined) {
                                            documento.informacion = '';
                                        }
                                        if (documento.fechaCarga === null || documento.fechaCarga === undefined) {
                                            documento.fechaCarga = '';
                                        }


                                        let departamento = ""
                                        if (documento.tipo_de_documento.departamento) {
                                            departamento = this.arrDepartamentos.find((depto: { id: string; }) => depto.id === documento.tipo_de_documento.departamento).cDescripcionDepartamento;
                                        }

                                        // tslint:disable-next-line: no-unused-expression
                                        /*   if (documento.legislatura) {
                                              if (documento.legislatura.cLegislatura) {
                                                  cFolioExpediente = '';
                                                  cFolioExpediente = documento.legislatura.cLegislatura + '-' + documento.folioExpediente
                                                  
                                              }
                                          } */
                                          console.log(documento.fechaCreacion);
                                        cFolioExpediente = documento.folioExpediente
                                        // Seteamos valores y permisos
                                          
                                        if(documento.pasillo=== undefined){
                                            documento.pasillo = '';
                                        }
                                        if(documento.estante=== undefined){
                                            documento.estante = ''; 
                                        }
                                        if(documento.nivel=== undefined){
                                            documento.nivel = '';
                                        }
                                        if(documento.seccion=== undefined){
                                            documento.seccion = ''; 
                                        }
                                        if(documento.plazoDeConservacion=== undefined){
                                            documento.plazoDeConservacion = ''; 
                                        }
                                        if (eliminar >= 0) {
                                            documentosTemp[eliminar] =
                                            {
                                                id: documento.id,
                                                cNombreDocumento: documento.cNombreDocumento,
                                                tipoDocumento: documento.tipo_de_documento.cDescripcionTipoDocumento,
                                                tipo_de_documento: documento.tipo_de_documento.id,
                                                fechaCarga: this.datePipe.transform(documento.fechaCarga,'yyyy-MM-dd'),
                                                fechaCreacion: this.datePipe.transform(documento.fechaCreacion, 'yyyy-MM-dd'),
                                                paginas: documento.paginas,
                                                bActivo: documento.bActivo,
                                                fechaModificacion: this.datePipe.transform(documento.updatedAt, 'dd-MM-yyyy'),
                                                fechaCargaView: this.datePipe.transform(documento.fechaCarga, 'dd-MM-yyyy'),
                                                fechaCreacionView: this.datePipe.transform(documento.fechaCreacion, 'dd-MM-yyyy'),
                                                fechaModificacionView: this.datePipe.transform(documento.updatedAt, 'dd-MM-yyyy'),
                                                Agregar: encontro.Agregar,
                                                Eliminar: encontro.Eliminar,
                                                Editar: encontro.Editar,
                                                Consultar: encontro.Consultar,
                                                idDocumento: idDocumento,
                                                version: String(parseFloat(documento.version).toFixed(1)),
                                                documento: documento.documento,
                                                //ente: documento.ente,
                                                // secretaria: documento.secretaria,
                                                // direccione: documento.direccione,
                                                // departamento: documento.departamento,
                                                folioExpediente: documento.folioExpediente,
                                                cFolioExpediente,
                                                clasificacion: meta,
                                                metacatalogos: documento.metacatalogos,
                                                informacion: visibilidad,
                                                visibilidade: documento.visibilidade,
                                                tipo_de_expediente: documento.tipo_de_expediente,
                                                usuario: this.menuService.usuario,
                                                numeroPagina: numeroPagina,
                                                plazoDeConservacion: String(documento.plazoDeConservacion),
                                                clave: documento.clave,
                                                departamento: departamento,
                                                pasillo: String(documento.pasillo),
                                                estante: String(documento.estante),
                                                nivel: String(documento.nivel),
                                                seccion: String(documento.seccion)
                                            }
                                        } else {
                                            if(documento.pasillo=== undefined){
                                                documento.pasillo = '';
                                            }
                                            if(documento.estante=== undefined){
                                                documento.estante = ''; 
                                            }
                                            if(documento.nivel=== undefined){
                                                documento.nivel = '';
                                            }
                                            if(documento.seccion=== undefined){
                                                documento.seccion = ''; 
                                            }
                                            if(documento.plazoDeConservacion=== undefined){
                                                documento.plazoDeConservacion = ''; 
                                            }
                                            //  this.documentos.splice(eliminar,1);
                                            documentosTemp.push({
                                                id: documento.id,
                                                cNombreDocumento: documento.cNombreDocumento,
                                                tipoDocumento: documento.tipo_de_documento.cDescripcionTipoDocumento,
                                                tipo_de_documento: documento.tipo_de_documento.id,
                                                fechaCarga: this.datePipe.transform(documento.fechaCarga, 'yyyy-MM-dd'),
                                                fechaCreacion: this.datePipe.transform(documento.fechaCreacion, 'yyyy-MM-dd'),
                                                fechaCargaView: this.datePipe.transform(documento.fechaCarga, 'dd-MM-yyyy'),
                                                fechaCreacionView: this.datePipe.transform(documento.fechaCreacion, 'dd-MM-yyyy'),
                                                fechaModificacionView: this.datePipe.transform(documento.updatedAt, 'dd-MM-yyyy'),
                                                paginas: documento.paginas,
                                                bActivo: documento.bActivo,
                                                fechaModificacion: this.datePipe.transform(documento.updatedAt, 'yyyy-MM-dd'),
                                                Agregar: encontro.Agregar,
                                                Eliminar: encontro.Eliminar,
                                                Editar: encontro.Editar,
                                                Consultar: encontro.Consultar,
                                                idDocumento: idDocumento,
                                                version: String(parseFloat(documento.version).toFixed(1)),
                                                documento: documento.documento,
                                                //ente: documento.ente,
                                                // secretaria: documento.secretaria,
                                                // direccione: documento.direccione,
                                                // departamento: documento.departamento,
                                                folioExpediente: documento.folioExpediente,
                                                cFolioExpediente,
                                                clasificacion: meta,
                                                metacatalogos: documento.metacatalogos,
                                                informacion: visibilidad,
                                                visibilidade: documento.visibilidade,
                                                tipo_de_expediente: documento.tipo_de_expediente,
                                                usuario: this.menuService.usuario,
                                                numeroPagina: numeroPagina,
                                                plazoDeConservacion: String(documento.plazoDeConservacion),
                                                clave: documento.clave,
                                                departamento: departamento,
                                                pasillo: String(documento.pasillo),
                                                estante: String(documento.estante),
                                                nivel: String(documento.nivel),
                                                seccion: String(documento.seccion)
                                            });

                                        }


                                        meta = '';
                                    }
                                }
                            }
                        }
                    }

                    /* 
                                        this.documentos = documentosTemp;
                                        this.documentosTemporal = this.documentos; */
                }


                this.documentos = [...documentosTemp];
                this.documentosTemporal = [...documentosTemp];
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
/*         console.log  (new Date(documento.fechaCarga));
        console.log  (new Date(documento.fechaCreacion)); */
       /*  documento.fechaCarga =  this.datePipe.transform( new Date(documento.fechaCarga), 'yyyy-MM-dd'),
        documento.fechaCreacion = this.datePipe.transform(new Date(documento.fechaCreacion), 'yyyy-MM-dd') */
      
        // Abrimos modal de guardar perfil
        const dialogRef = this.dialog.open(GuardarDocumentosComponent, {
            width: '60%',
            height: '80%',
            disableClose: true,
            data: documento,
        });

        dialogRef.afterClosed().subscribe(result => {

            if (result) {

                this.obtenerDocumentos(documento.numeroPagina);
                if (result.documento) {
                    this.valueBuscador = '';
                    this.clasificarDocumento(result, documento.numeroPagina);
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
                row.bActivo = false;
                row.usuario = this.menuService.usuario;
                // realizamos delete

                this.documentoService.borrarDocumentos(row).subscribe((resp: any) => {
                    Swal.fire('Eliminado', 'El documento ha sido eliminado.', 'success');
                    let eliminar = this.documentos.findIndex(p => p.id == row.id)
                    this.documentos.splice(eliminar, 1);
                    // this.obtenerDocumentos('_limit=-1');
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

    async descargarDocumento(row: any): Promise<void> {
        // Descargamos el documento

        
        if (row.documento.url) { }
        this.spinner.show();
        await this.documentoService.dowloadDocument(row.idDocumento, row.id, row.cNombreDocumento).subscribe((resp: any) => {
           
            const filePath = window.URL.createObjectURL(resp);

            const downloadLink = document.createElement('a');
            const fileName = row.idDocumento;

            downloadLink.href = filePath;
            downloadLink.download = fileName;
            downloadLink.click();
            this.spinner.hide();
        }, err => {
            this.spinner.hide();
            Swal.fire(
                'Error',
                'Ocurrió un error al descargar el documento.' + err,
                'error'
            );
            this.loadingIndicator = false;
        });
    }


    convertFile(buf: any): string {
        // Convertimos el resultado en binstring
        const binstr = Array.prototype.map.call(buf, (ch: number) => String.fromCharCode(ch)).join('');
        return btoa(binstr);
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

    clasificarDocumento(result: any, numeroPagina: number): void {
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
                this.obtenerDocumentos(numeroPagina);
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
                this.clasificarDocumento(result, documento.numeroPagina);
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
                d.informacion.toLowerCase().indexOf(val) !== - 1 || d.fechaCarga.toLowerCase().indexOf(val) !== - 1
                || d.cFolioExpediente.toLowerCase().indexOf(val) !== - 1
                || d.version.toLowerCase().indexOf(val) !== - 1
                || d.departamento.toLowerCase().indexOf(val) !== - 1
                || d.pasillo.toLowerCase().indexOf(val) !== - 1
                || d.estante.toLowerCase().indexOf(val) !== - 1
                || d.seccion.toLowerCase().indexOf(val) !== - 1
                || d.plazoDeConservacion.toLowerCase().indexOf(val) !== - 1);
            this.documentos = temp;
        }
    }

    onFooterPage(event): void {
        console.log(event);
    }

    keytab(event, row) {
        let element = event.srcElement.nextElementSibling; // get the sibling element

        if (element == null)  // check if its null
            return;
        else
            element.focus();   // focus if not null
    }

}
