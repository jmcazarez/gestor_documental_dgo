import { Component, OnDestroy, OnInit, Input, Inject, ɵConsole, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import Swal from 'sweetalert2';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DocumentosModel } from 'models/documento.models';
import { TableroDeDocumentosComponent } from '../tablero-de-documentos.component';
import { Subject } from 'rxjs';
import { MenuService } from 'services/menu.service';
import { DocumentosService } from 'services/documentos.service';
import { UploadFileService } from 'services/upload.service';
import { MatDialog } from '@angular/material/dialog';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { DatePipe } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import * as moment from 'moment';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { Console } from 'console';
import { DateFormat } from "./date-format";


@Component({
    selector: 'guardar-documentos',
    templateUrl: './guardar-documentos.component.html',
    styleUrls: ['./guardar-documentos.component.scss'],
    providers: [DatePipe,{ provide: DateAdapter, useClass: DateFormat }],
})



export class GuardarDocumentosComponent implements OnInit {
    @ViewChild('fileInput', { static: false }) fileInput: ElementRef;
    @ViewChild('paginasInput', { static: false }) paginasInput: ElementRef;
    form: FormGroup;
    selectTipoDocument: any;
    arrTipoDocumentos: any[] = [];
    files = [];
    fileName: string;
    cambioFile: boolean;
    paginasEditar: boolean;
    cambioFecha: boolean;
    date = new Date(2020, 1, 1);
    cNombreDocumento: any;
    documento: any;
    tipoDocumento: any;
    fechaCreacion: any;
    bActivo: any;
    paginas: any;
    cambioDocumento: boolean;
    base64: string;
    // minDate = new Date(2000, 0, 1);
    maxDate = new Date();
    // Private
    private unsubscribeAll: Subject<any>;


    constructor(
        private spinner: NgxSpinnerService,
        private datePipe: DatePipe,
        private formBuilder: FormBuilder,
        private dialogRef: MatDialogRef<TableroDeDocumentosComponent>,
        private menu: MenuService,
        private documentoService: DocumentosService,
        private uploadService: UploadFileService,
        public dialog: MatDialog,
        private dateAdapter: DateAdapter<Date>,
        @Inject(MAT_DIALOG_DATA) public documentos: DocumentosModel
    ) { 
        dateAdapter.setLocale("en-in"); // DD/MM/YYYY
    }

    ngOnInit(): void {
        this.spinner.show();
        this.fileName = '';
        const fecha = new Date(); // Fecha actual
        let mes: any = fecha.getMonth() + 1; // obteniendo mes
        let dia: any = fecha.getDate(); // obteniendo dia
        dia = dia + 1;
        const ano = fecha.getFullYear(); // obteniendo año
        const fechaActual = ano + '-' + mes + '-' + dia;
        if (dia < 10) {
            dia = '0' + dia; // agrega cero si el menor de 10
        }
        if (mes < 10) {
            mes = '0' + mes; // agrega cero si el menor de 10
        }


        // Validamos si es un documento nuevo
        if (this.documentos.id) {

            this.selectTipoDocument = this.documentos.tipo_de_documento;
            if (this.documentos.documento) {
                // Cargamos el nombre del documento
                this.fileName = this.documentos.documento.name;
                this.documento = this.documentos.documento;
            }
            if (this.documentos.paginas) {
                // Habilitamos el # de paginas
                this.paginasEditar = false;
            }
            this.cNombreDocumento = this.documentos.cNombreDocumento;
            this.tipoDocumento = this.documentos.tipo_de_documento;
            this.fechaCreacion = this.documentos.fechaCreacion;
            this.documentos.fechaCreacion = this.documentos.fechaCreacion + 'T16:00:00.000Z';
            this.documentos.fechaCarga = moment().format('YYYY-MM-DD') + 'T16:00:00.000Z';
            this.bActivo = this.documentos.bActivo;
            this.paginas = this.documentos.paginas;
        } else {
            // Seteamos la fecha de carga con la fecha actual
            this.documentos.fechaCarga = moment().format('YYYY-MM-DD') + 'T16:00:00.000Z';
            this.documentos.bActivo = true;
            if (this.documentos.tipo_de_documento) {
                this.tipoDocumento = this.documentos.tipo_de_documento;
                this.selectTipoDocument = this.documentos.tipo_de_documento;
            }
        }

        for (const documentosAgregar of this.menu.tipoDocumentos) {

            // Si tiene permisos de agregar estos documentos los guardamos en una array
            if (documentosAgregar.Agregar) {
                this.arrTipoDocumentos.push({
                    id: documentosAgregar.id,
                    cDescripcionTipoDocumento: documentosAgregar.cDescripcionTipoDocumento,
                    visibilidade: documentosAgregar.visibilidade
                });
            }


        }
        if (!this.documentos.bActivo) {
            this.documentos.bActivo = false;
        }
        if (this.documentos.disabled) {
            this.paginasEditar = true;
        }

        this.cambioDocumento = false;
        // Form reativo
        this.form = this.formBuilder.group({
            tipoDocumentos: [{ value: this.documentos.tipo_de_documento, disabled: this.documentos.disabled }, Validators.required],
            nombreDocumento: [{ value: this.documentos.cNombreDocumento, disabled: this.documentos.disabled }, [Validators.required, Validators.minLength(3), Validators.maxLength(200)]],
            estatus: { value: this.documentos.bActivo, disabled: this.documentos.disabled },
            fechaCreacion: [{ value: this.documentos.fechaCreacion, disabled: this.documentos.disabled }, [Validators.required]],
            //fechaCreacion: [{ value: this.documentos.fechaCreacion, disabled: this.documentos.disabled }, [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
            fechaCarga: [{ value: this.documentos.fechaCarga, disabled: true }],
            paginas: [{ value: this.documentos.paginas, disabled: this.paginasEditar }]
        });



        this.form.get('fechaCreacion').valueChanges.subscribe(val => {

            if (val) {
                this.cambioFecha = true;
            }
        });


        this.spinner.hide();

    }

    async guardar(): Promise<void> {
        try {
            this.spinner.show();
            const fecha = new Date(); // Fecha actual
            let mes: any = fecha.getMonth() + 1; // obteniendo mes
            let dia: any = fecha.getDate(); // obteniendo dia      
            const ano = fecha.getFullYear(); // obteniendo año
            if (dia < 10) {
                dia = '0' + dia; // agrega cero si el menor de 10
            }
            if (mes < 10) {
                mes = '0' + mes; // agrega cero si el menor de 10
            }
            const fechaActual = ano + '-' + mes + '-' + dia;


            // Guardamos documento

            // Asignamos valores a objeto
            this.documentos.bActivo = this.form.get('estatus').value;
            this.documentos.cNombreDocumento = this.form.get('nombreDocumento').value;

            const fechaCreacion = new Date(this.form.get('fechaCreacion').value);
            let mesCreacion: any = fechaCreacion.getMonth() + 1; // obteniendo mes
            let diaCreacion: any = fechaCreacion.getDate(); // obteniendo dia      
            const anoCreacion = fechaCreacion.getFullYear(); // obteniendo año

            if (diaCreacion < 10) {
                diaCreacion = '0' + diaCreacion; // agrega cero si el menor de 10
            }
            if (mesCreacion < 10) {
                mesCreacion = '0' + mesCreacion; // agrega cero si el menor de 10
            }
            this.documentos.fechaCreacion = moment(this.form.get('fechaCreacion').value).format('YYYY-MM-DD') + 'T16:00:00.000Z';
            this.documentos.fechaCarga = moment().format('YYYY-MM-DD') + 'T16:00:00.000Z';
            this.documentos.tipo_de_documento = this.selectTipoDocument;

            let tipoDoc = this.arrTipoDocumentos.filter((tipo) => tipo.id === this.selectTipoDocument);
            if (tipoDoc.length > 0) {

                this.documentos.visibilidade = tipoDoc[0]['visibilidade'];
            }
            if (this.paginasInput.nativeElement.value > 0) {
                this.documentos.paginas = this.paginasInput.nativeElement.value;
            }

            // Validamos el selecciono un archivo para subirlo
            if (this.cambioFile) {

                // Subimos archivo
                await this.upload();

            }

            if (this.documentos.documento === '') {
                this.spinner.hide();
                Swal.fire('Error', 'Ocurrió un error al subir el archivo. ', 'error');
            } else {
                if (this.documentos.id) {

                    if (this.documentos.disabled) {
                        this.cerrar(this.documentos);
                    } else {

                        this.documentos.usuario = this.menu.usuario;
                        // tslint:disable-next-line: no-bitwise
                        if (this.documentos.cNombreDocumento !== this.cNombreDocumento || this.documentos.documento !== this.documento ||
                            // tslint:disable-next-line: max-line-length
                            this.documentos.tipo_de_documento !== this.tipoDocumento || this.datePipe.transform(this.documentos.fechaCreacion) !== this.datePipe.transform(this.fechaCreacion) ||
                            String(this.documentos.paginas) !== String(this.paginas) || this.documentos.bActivo !== this.bActivo) {

                            this.documentos.version = Number(this.documentos.version) + .1;

                            this.documentoService.actualizarDocumentos(this.documentos).subscribe((resp: any) => {
                                if (resp) {

                                    this.documentos = resp.data;
                                    this.documentos.fechaCarga = this.datePipe.transform(this.documentos.fechaCarga, 'yyyy-MM-dd') + 'T16:00:00.000Z';
                                    this.documentos.fechaCreacion = this.datePipe.transform(this.documentos.fechaCreacion, 'yyyy-MM-dd') + 'T16:00:00.000Z';

                                    this.spinner.hide();
                                    this.cerrar(this.documentos);
                                } else {
                                    this.spinner.hide();
                                    Swal.fire('Error', 'Ocurrió un error al guardar. ' + resp.error.data, 'error');

                                }
                            }, err => {
                                this.spinner.hide();
                                if (err.error.data) {
                                    Swal.fire('Error', 'Ocurrió un error al guardar.' + err.error.data, 'error');
                                } else {
                                    Swal.fire('Error', 'Ocurrió un error al guardar.' + err.error, 'error');
                                }
                            });
                        } else {
                            this.documentos.tipo_de_documento = this.selectTipoDocument;

                            this.documentoService.actualizarDocumentosSinVersion(this.documentos).subscribe((resp: any) => {

                                if (resp) {

                                    this.documentos = resp.data;
                                    this.documentos.fechaCarga = this.datePipe.transform(this.documentos.fechaCarga, 'yyyy-MM-dd') + 'T16:00:00.000Z';
                                    this.documentos.fechaCreacion = this.datePipe.transform(this.documentos.fechaCreacion, 'yyyy-MM-dd') + 'T16:00:00.000Z';
                                    this.spinner.hide();
                                    this.cerrar(this.documentos);
                                } else {
                                    this.spinner.hide();
                                    Swal.fire('Error', 'Ocurrió un error al guardar. ' + resp.error.data, 'error');
                                }
                            }, err => {
                                this.spinner.hide();
                                console.log(err);
                                Swal.fire('Error', 'Ocurrió un error al guardar.' + err, 'error');
                            });
                        }
                        // Seteamos version


                        // Actualizamos documento

                    }
                } else {
                    // Seteamos version

                    this.documentos.tipo_de_documento = this.selectTipoDocument;
                    this.documentos.version = 1;
                    this.documentos.usuario = this.menu.usuario;
                    // Guardamos documento
                    this.documentoService.guardarDocumentos(this.documentos).subscribe((resp: any) => {

                        if (resp) {
                            this.documentos = resp.data;

                            this.documentos.fechaCarga = this.datePipe.transform(this.documentos.fechaCarga, 'yyyy-MM-dd') + 'T16:00:00.000Z';
                            this.documentos.fechaCreacion = this.datePipe.transform(this.documentos.fechaCreacion, 'yyyy-MM-dd') + 'T16:00:00.000Z';
                            this.spinner.hide();
                            Swal.fire('Éxito', 'Documento guardado correctamente.', 'success');

                            this.cerrar(this.documentos);
                        } else {
                            this.spinner.hide();
                            Swal.fire('Error', 'Ocurrió un error al guardar. ' + resp.error.data, 'error');
                        }
                    }, (err: any) => {
                        this.spinner.hide();
                        console.log(err);
                        Swal.fire('Error', 'Ocurrió un error al guardar. ' + err.error.data, 'error');
                    });
                }
            }

        } catch (err) {
            this.spinner.hide();

            Swal.fire('Error', 'Ocurrió un error al guardar .' + err, 'error');
        }

    }

    cerrar(doc: any): void {
        if (doc) {
            this.dialogRef.close(doc);
        } else {
            this.dialogRef.close();
        }
    }

    add(): void {

        // Agregamos elemento file
        let base64Result: string;
        this.files = [];
        const fileInput = this.fileInput.nativeElement;
        const paginasInput = this.paginasInput.nativeElement;
        fileInput.onchange = () => {


            // tslint:disable-next-line: prefer-for-of
            for (let index = 0; index < fileInput.files.length; index++) {
                const file = fileInput.files[index];
                this.fileName = file.name;
                this.files.push({ data: file, inProgress: false, progress: 0 });

                const reader = new FileReader();
                reader.readAsBinaryString(file);
                reader.onloadend = () => {
                    // Obtenemos el # de paginas del documento

                    base64Result = reader.result.toString();
                    //  base64Result = base64Result.slice(this.base64.search('/Count'), this.base64.search('/Count') + 10).replace('/Count ', '');
                    this.paginasEditar = false;
                    // paginasInput.value = this.getNumbersInString(base64Result);

                };
                const reader2 = new FileReader();
                reader2.readAsDataURL(file);
                reader2.onloadend = () => {
                    //me.modelvalue = reader.result;
                    this.base64 = reader2.result.toString();
                };


                this.cambioFile = true;

            }
            //  this.upload();
        };
        fileInput.click();

    }

    // tslint:disable-next-line: variable-name
    getNumbersInString(string: string): string {
        const tmp = string.split('');
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

        return numbers.join('');
    }

    async upload(): Promise<void> {
        // Subimos documento
        // const resp = await this.uploadService.uploadFile(this.files[0].data);

        const resp = await this.uploadService.subirArchivo(this.fileInput.nativeElement.files[0], this.base64);

        if (resp.error) {
            Swal.fire('Error', 'Ocurrió un error al subir el documento. ' + resp.error.error, 'error');
            this.documentos.documento = '';
        } else {
            // La peticion nos retorna el id del documento y lo seteamos al usuario
            if (resp.data) {
                this.documentos.documento = resp.data[0].id;

                this.documentos.textoOcr = resp.text;
            } else {
                this.documentos.documento = '';
            }
        }

    }


    change(): void {

        this.cambioDocumento = true;
    }


}
