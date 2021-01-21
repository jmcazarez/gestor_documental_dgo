import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GuardarDocumentosComponent } from '../tablero-de-documentos/guardar-documentos/guardar-documentos.component';
import { DocumentosModel } from 'models/documento.models';
import { DocumentosService } from 'services/documentos.service';
import { MenuService } from 'services/menu.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import Swal from 'sweetalert2';
import { ClasficacionDeDocumentosComponent } from '../tablero-de-documentos/clasficacion-de-documentos/clasficacion-de-documentos.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuariosService } from 'services/usuarios.service';
import { TipoExpedientesService } from 'services/tipo-expedientes.service';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
    selector: 'app-tablero-de-búsqueda',
    templateUrl: './tablero-de-busqueda.component.html',
    styleUrls: ['./tablero-de-busqueda.component.scss'],
    providers: [DatePipe]
})
export class TableroDeBusquedaComponent implements OnInit {
    documentoBusqueda: string;
    vigenteBusqueda: string;
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
    isLinear = false;
    firstFormGroup: FormGroup;
    secondFormGroup: FormGroup;
    arrInformacion = [];
    selectedInformacion = '';
    maxDate = new Date();
    fechaCreacion = '';
    fechaCarga = '';
    fechaModificacion = '';
    arrTipoDocumentos = [];
    arrExpediente = [];
    arrDocumentosTexto = [];
    selectTipoDocumento: '';
    selectedEntes: '';
    selectedExpediente: '';
    selectedFolioExpediente: '';
    selectedTextoDocumento: '';
    arrEntes: [];
    arrMetacatalogos: any;
    url: string;

    constructor(private _formBuilder: FormBuilder, private datePipe: DatePipe,
        private usuariosService: UsuariosService,
        private router: Router,
        public dialog: MatDialog,
        private documentoService: DocumentosService,
        private menuService: MenuService,
        private tipoExpedientesService: TipoExpedientesService,
        private spinner: NgxSpinnerService,
        private sanitizer: DomSanitizer) {
        this.url = 'tablero-de-búsqueda';
        // this.url = this.router.routerState.snapshot.url.replace('/', '').replace('%C3%BA', 'ú');
        // Obtenemos documentos
        this.obtenerDocumentos();
    }

    ngOnInit(): void {
        this.spinner.show();
        this.obtenerEntes();
        this.obtenerTiposExpedientes();
        for (const documentosAgregar of this.menuService.tipoDocumentos) {

            // Si tiene permisos de agregar estos documentos los guardamos en una array
            if (documentosAgregar.Consultar) {
                this.arrTipoDocumentos.push({
                    id: documentosAgregar.id,
                    cDescripcionTipoDocumento: documentosAgregar.cDescripcionTipoDocumento,
                    metacatalogos: documentosAgregar.metacatalogos,

                });
            }
        }
        this.arrInformacion = this.menuService.tipoInformacion;

        // Formulario reactivo
        this.firstFormGroup = this._formBuilder.group({
            firstCtrl: [''],
            documento: [''],
            vigente: [''],
            informacion: [''],
            fechaCreacion: [''],
            fechaCarga: [''],
            fechaModificacion: [''],
            tipoDocumentos: [''],
            entes: [''],
            expediente: [''],
            folioExpediente: [''],
            textoDocumento: ['']
        });
        this.secondFormGroup = this._formBuilder.group({
            secondCtrl: ['', Validators.required],
            documento: ['', Validators.required],
        });


        this.firstFormGroup.get('tipoDocumentos').valueChanges.subscribe(val => {
            this.arrMetacatalogos = [];
            if (val) {
                const tempMetacatalogos = this.arrTipoDocumentos.filter((d) => d.id.toLowerCase().indexOf(val.toLowerCase()) !== -1 || !val);
                if (tempMetacatalogos[0].metacatalogos) {
                    this.arrMetacatalogos = tempMetacatalogos[0].metacatalogos;
                }
                // tslint:disable-next-line: forin
            }
        });
        this.spinner.hide();
    }


    nuevoDocumento(): void {
        // Abrimos modal de guardar usuario
        const dialogRef = this.dialog.open(GuardarDocumentosComponent, {
            width: '30%',
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

    obtenerTiposExpedientes(): void {
        this.spinner.show();
        this.loadingIndicator = true;

        // Obtenemos los documentos
        this.tipoExpedientesService.obtenerTipoExpedientes().subscribe((resp: any) => {

            // Buscamos permisos
            // tslint:disable-next-line: max-line-length
            const opciones = this.menuService.opcionesPerfil.find((opcion: { cUrl: string; }) => opcion.cUrl === this.url);
            this.optAgregar = opciones.Agregar;
            this.optEditar = opciones.Editar;
            this.optConsultar = opciones.Consultar;
            this.optEliminar = opciones.Eliminar;
            // Si tiene permisos para consultar
            if (this.optConsultar) {
                this.arrExpediente = resp;
            }
            this.loadingIndicator = false;
            this.spinner.hide();
        }, err => {
            this.loadingIndicator = false;
            this.spinner.hide();
        });
    }

    obtenerDocumentos(): void {
        this.spinner.show();
        const documentosTemp: any[] = [];
        let idDocumento: any;
        this.loadingIndicator = true;
        let meta = '';
        let visibilidad = '';
        let idEnte = '';
        let idExpediente = '';
        let info: any;
        // Obtenemos los documentos
        this.documentoService.obtenerDocumentos().subscribe((resp: any) => {

            // Buscamos permisos
            const opciones = this.menuService.opcionesPerfil.find((opcion: { cUrl: string; }) => opcion.cUrl === this.url);

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
                        const encontro = this.menuService.tipoDocumentos.find((tipo: { id: string; }) => tipo.id === documento.tipo_de_documento.id);

                        if (documento.visibilidade) {
                            info = this.menuService.tipoInformacion.find((tipo: { id: string; }) => tipo.id === documento.visibilidade.id);
                        }
                        if (encontro) {
                            if (documento.tipo_de_documento.bActivo && encontro.Consultar && info) {

                                if (documento.documento) {
                                    idDocumento = documento.documento.hash + documento.documento.ext;

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
                                                        if (x.text) { meta = meta + ' , ' + x.cDescripcionMetacatalogo + ': Sí'; } else {
                                                            meta = meta + ' , ' + x.cDescripcionMetacatalogo + ': No';
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
                                        idDocumentoFiltro: documento.documento.id,
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
                                        idExpediente
                                    });

                                    meta = '';
                                }
                            }
                        }
                    }
                }

                this.documentos = documentosTemp;
                this.documentosTemporal = this.documentos;
                this.spinner.hide();
            }
            this.loadingIndicator = false;
            this.spinner.hide();
        }, err => {
            this.spinner.hide();
            this.loadingIndicator = false;
        });
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
        if (result.documento) {
            // Abrimos modal de guardar clasificacion
            const dialogRef = this.dialog.open(ClasficacionDeDocumentosComponent, {
                width: '100%',
                height: '90%',
                disableClose: true,
                data: result,

            });

            // tslint:disable-next-line: no-shadowed-variable
            dialogRef.afterClosed().subscribe(result => {
                if (result) {
                    this.obtenerDocumentos();
                }
            });
        } else {
            Swal.fire('Sin documento', 'El documento no tiene un archivo clasificado, por lo que no puede ser consultado.', 'success');
        }
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
                result.disabled = true;
                this.clasificarDocumento(result);
            }

        });
    }

    async obtenerEntes(): Promise<void> {
    this.spinner.show();
        // Obtenemos los entes
        this.usuariosService.obtenerEntes().subscribe((resp: any) => {
            this.arrEntes = resp;
            this.spinner.hide();
        }, err => {
            this.spinner.hide();
            
            Swal.fire(
                'Error',
                'Ocurrió un error al obtener los entes.' + err,
                'error'
            );
        });
    }

    async filterDatatable(): Promise<void> {
        let temp = [];

        this.spinner.show();
        // Filtramos tabla
        if (this.documentosTemporal) {
            this.documentos = this.documentosTemporal;
        }
        if (this.selectedTextoDocumento !== '' && this.selectedTextoDocumento !== undefined && this.selectedTextoDocumento !== null) {

            if(String(this.selectedTextoDocumento).length <= 3){
                Swal.fire(
                    'Error',
                    'El texto capturado en el filtrado de documentos tiene que ser mayor a 3 caracteres.',
                    'error'
                );
            }else{
            console.log(this.selectedTextoDocumento);
            // Obtenemos los entes
            await this.documentoService.obtenerDocumentoPorTexto(this.selectedTextoDocumento).subscribe((resp: any) => {
                console.log('entro');

                this.arrDocumentosTexto = resp;            
                this.arrDocumentosTexto.forEach((row) => {                    
      
                   this.documentos.forEach((doc) =>{
                      
                       if( doc.idDocumentoFiltro == row.id){
                        temp.push(doc);
                       }
                   });
         
                });
                this.documentos = temp;
                
                if (this.documentoBusqueda !== '' && this.documentoBusqueda !== undefined) {
                    temp = this.documentos.filter((d) => d.cNombreDocumento.toLowerCase().indexOf(this.documentoBusqueda.toLowerCase()) !== -1 || !this.documentoBusqueda);
                    this.documentos = temp;
                }


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

                if (this.fechaCreacion !== '' && this.fechaCreacion !== undefined && this.fechaCreacion !== null) {
                    let fecha: string;
                    fecha = this.datePipe.transform(this.fechaCreacion, 'MM-dd-yyyy');
                    temp = this.documentos.filter((d) => d.fechaCreacion === fecha);
                    this.documentos = temp;
                }

                if (this.fechaCarga !== '' && this.fechaCarga !== undefined && this.fechaCarga !== null) {
                    let fecha: string;
                    fecha = this.datePipe.transform(this.fechaCarga, 'MM-dd-yyyy');
                    temp = this.documentos.filter((d) => d.fechaCarga === fecha);
                    this.documentos = temp;
                }

                if (this.fechaModificacion !== '' && this.fechaModificacion !== undefined && this.fechaModificacion !== null) {
                    let fecha: string;
                    fecha = this.datePipe.transform(this.fechaModificacion, 'MM-dd-yyyy');
                    temp = this.documentos.filter((d) => d.fechaModificacion === fecha);
                    this.documentos = temp;
                }

                if (this.selectTipoDocumento !== '' && this.selectTipoDocumento !== undefined && this.selectTipoDocumento !== null) {
                    temp = this.documentos.filter((d) => d.tipo_de_documento.toLowerCase().indexOf(this.selectTipoDocumento.toLowerCase()) !== -1 || !this.selectTipoDocumento);
                    this.documentos = temp;
                    for (const i of this.arrMetacatalogos) {
                        if (i['cTipoMetacatalogo'] === 'Fecha') {
                            let fecha: string;

                            fecha = this.datePipe.transform(i['text'], 'MM-dd-yyyy');

                            if (fecha) {
                                temp = this.documentos.filter((d) => d.clasificacion.indexOf(i['cDescripcionMetacatalogo'] + ': ' + fecha) !== -1 || !fecha);
                                this.documentos = temp;
                            }
                        } else if (i['cTipoMetacatalogo'] === 'Sí o no') {
                            // fecha = this.datePipe.transform(i['text'], 'yyyy-MM-dd');
                            if (i['text']) {

                                temp = this.documentos.filter((d) => d.clasificacion.indexOf(i['cDescripcionMetacatalogo'] + ': ' + i['text']) !== -1 || !i['text']);
                                this.documentos = temp;
                            }
                        }
                        else {
                            if (i['text']) {
                                temp = this.documentos.filter((d) => d.clasificacion.indexOf(i['cDescripcionMetacatalogo'] + ': ' + i['text']) !== -1 || !i['text']);
                                this.documentos = temp;
                            }
                        }
                    }
                    this.documentos = temp;
                }

                if (this.selectedEntes !== '' && this.selectedEntes !== undefined && this.selectedEntes !== null) {
                    temp = this.documentos.filter((d) => d.idEnte.toLowerCase().indexOf(this.selectedEntes.toLowerCase()) !== -1 || !this.selectedEntes);
                    this.documentos = temp;
                }

                if (this.selectedExpediente !== '' && this.selectedExpediente !== undefined && this.selectedExpediente !== null) {
                    temp = this.documentos.filter((d) => d.idExpediente === this.selectedExpediente);
                    this.documentos = temp;
                }

                if (this.selectedFolioExpediente !== '' && this.selectedFolioExpediente !== undefined && this.selectedFolioExpediente !== null) {
                    temp = this.documentos.filter((d) => d.folioExpediente.toString() === this.selectedFolioExpediente);
                    this.documentos = temp;
                }

                if (this.selectedTextoDocumento !== '' && this.selectedTextoDocumento !== undefined && this.selectedTextoDocumento !== null) {
               
                }
                this.spinner.hide();
            }, err => {
                    Swal.fire(
                        'Error',
                        'Ocurrió un error al obtener los documentos filtrados por texto.' + err,
                        'error'
                    );
                    this.spinner.hide();
            });
        }
        } else {
            
            if (this.documentoBusqueda !== '' && this.documentoBusqueda !== undefined) {
                temp = this.documentos.filter((d) => d.cNombreDocumento.toLowerCase().indexOf(this.documentoBusqueda.toLowerCase()) !== -1 || !this.documentoBusqueda);
                this.documentos = temp;
            }


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

            if (this.fechaCreacion !== '' && this.fechaCreacion !== undefined && this.fechaCreacion !== null) {
                let fecha: string;
                fecha = this.datePipe.transform(this.fechaCreacion, 'MM-dd-yyyy');
                temp = this.documentos.filter((d) => d.fechaCreacion === fecha);
                this.documentos = temp;
            }

            if (this.fechaCarga !== '' && this.fechaCarga !== undefined && this.fechaCarga !== null) {
                let fecha: string;
                fecha = this.datePipe.transform(this.fechaCarga, 'MM-dd-yyyy');
                temp = this.documentos.filter((d) => d.fechaCarga === fecha);
                this.documentos = temp;
            }

            if (this.fechaModificacion !== '' && this.fechaModificacion !== undefined && this.fechaModificacion !== null) {
                let fecha: string;
                fecha = this.datePipe.transform(this.fechaModificacion, 'MM-dd-yyyy');
                temp = this.documentos.filter((d) => d.fechaModificacion === fecha);
                this.documentos = temp;
            }

            if (this.selectTipoDocumento !== '' && this.selectTipoDocumento !== undefined && this.selectTipoDocumento !== null) {
                temp = this.documentos.filter((d) => d.tipo_de_documento.toLowerCase().indexOf(this.selectTipoDocumento.toLowerCase()) !== -1 || !this.selectTipoDocumento);
                this.documentos = temp;
                for (const i of this.arrMetacatalogos) {
                    if (i['cTipoMetacatalogo'] === 'Fecha') {
                        let fecha: string;

                        fecha = this.datePipe.transform(i['text'], 'MM-dd-yyyy');

                        if (fecha) {
                            temp = this.documentos.filter((d) => d.clasificacion.indexOf(i['cDescripcionMetacatalogo'] + ': ' + fecha) !== -1 || !fecha);
                            this.documentos = temp;
                        }
                    } else if (i['cTipoMetacatalogo'] === 'Sí o no') {
                        // fecha = this.datePipe.transform(i['text'], 'yyyy-MM-dd');
                        if (i['text']) {

                            temp = this.documentos.filter((d) => d.clasificacion.indexOf(i['cDescripcionMetacatalogo'] + ': ' + i['text']) !== -1 || !i['text']);
                            this.documentos = temp;
                        }
                    }
                    else {
                        if (i['text']) {
                            temp = this.documentos.filter((d) => d.clasificacion.indexOf(i['cDescripcionMetacatalogo'] + ': ' + i['text']) !== -1 || !i['text']);
                            this.documentos = temp;
                        }
                    }
                }
                this.documentos = temp;
            }

            if (this.selectedEntes !== '' && this.selectedEntes !== undefined && this.selectedEntes !== null) {
                temp = this.documentos.filter((d) => d.idEnte.toLowerCase().indexOf(this.selectedEntes.toLowerCase()) !== -1 || !this.selectedEntes);
                this.documentos = temp;
            }

            if (this.selectedExpediente !== '' && this.selectedExpediente !== undefined && this.selectedExpediente !== null) {
                temp = this.documentos.filter((d) => d.idExpediente === this.selectedExpediente);
                this.documentos = temp;
            }

            if (this.selectedFolioExpediente !== '' && this.selectedFolioExpediente !== undefined && this.selectedFolioExpediente !== null) {
                temp = this.documentos.filter((d) => d.folioExpediente.toString() === this.selectedFolioExpediente);
                this.documentos = temp;
            }

            if (this.selectedTextoDocumento !== '' && this.selectedTextoDocumento !== undefined && this.selectedTextoDocumento !== null) {
                temp = this.documentos.filter(item => !this.arrDocumentosTexto.includes(item));
                console.log(temp);
                // temp = this.documentos.filter((d) => d.folioExpediente.toString() === this.selectedFolioExpediente);
                this.documentos = temp;
            }
            this.spinner.hide();
        }

    }


    borrarFiltros(): void {
        // Limpiamos inputs
        this.documentoBusqueda = '';
        this.vigenteBusqueda = '';
        this.selectedInformacion = '';
        this.fechaCreacion = '';
        this.fechaCarga = '';
        this.fechaModificacion = '';
        this.selectTipoDocumento = '';
        this.selectedEntes = '';
        this.selectedExpediente = '';
        this.selectedFolioExpediente = '';
        this.arrMetacatalogos = [];
        this.arrDocumentosTexto = [];
        this.selectedTextoDocumento = '';
        this.obtenerDocumentos();
    }


    changeTipoDocumento(event: any): void {

    }
}
