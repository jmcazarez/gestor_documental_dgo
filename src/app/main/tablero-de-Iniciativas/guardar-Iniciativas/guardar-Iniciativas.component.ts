import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import Swal from 'sweetalert2';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DocumentosModel } from 'models/documento.models';
import { TableroDeIniciativasComponent } from '../tablero-de-iniciativas.component';
import { Subject } from 'rxjs';
import { MenuService } from 'services/menu.service';
import { UploadFileService } from 'services/upload.service';
import { MatDialog } from '@angular/material/dialog';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { DatePipe } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { IniciativasService } from 'services/iniciativas.service';
import { IniciativasModel } from 'models/iniciativas.models';
import { MatChipInputEvent } from '@angular/material/chips';
import {COMMA, ENTER} from '@angular/cdk/keycodes';

export interface Autores {
    name: string;
  }

  export interface Temas {
    name: string;
  }
@Component({
    selector: 'guardar-iniciativas',
    templateUrl: './guardar-iniciativas.component.html',
    styleUrls: ['./guardar-iniciativas.component.scss'],
    providers: [DatePipe]
})
export class GuardarIniciativasComponent implements OnInit {
    @ViewChild('fileInput', { static: false }) fileInput: ElementRef;
    @ViewChild('paginasInput', { static: false }) paginasInput: ElementRef;
    form: FormGroup;
    selectTipo: any;
    arrTipo: any[] = [];
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
    visible = true;
    selectable = true;
    selectable2 = true;
    removable = true;
    removable2 = true;
    addOnBlur = true;
    addOnBlur2 = true;
    readonly separatorKeysCodes: number[] = [ENTER, COMMA];
    autores: Autores[] = [];
    temas: Temas[] = [];

    constructor(
        private spinner: NgxSpinnerService,
        private datePipe: DatePipe,
        private formBuilder: FormBuilder,
        private dialogRef: MatDialogRef<TableroDeIniciativasComponent>,
        private menu: MenuService,
        private iniciativaService: IniciativasService,
        public dialog: MatDialog,
        @Inject(MAT_DIALOG_DATA) public iniciativa: IniciativasModel
    ) { }

    ngOnInit(): void {
        
        this.obtenerTiposIniciativas();
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
        if (this.iniciativa.id) {
            this.selectTipo = this.iniciativa.tipo_de_iniciativa.id;
            this.autores =  this.iniciativa.autores;
            this.temas =  this.iniciativa.tema;
            this.iniciativa.fechaCreacion = this.iniciativa.fechaCreacion + 'T16:00:00.000Z';
            this.iniciativa.fechaIniciativa = this.iniciativa.fechaIniciativa + 'T16:00:00.000Z';
        } else {
            // Seteamos la fecha de carga con la fecha actual
            this.iniciativa.estatus = 'Registrada';
            this.iniciativa.fechaCreacion = ano + '-' + mes + '-' + dia;
        }

        // Form reativo
        this.form = this.formBuilder.group({
            id: [{ value: this.iniciativa.id, disabled: true }],
            tipo: [{ value: this.iniciativa.tipo_de_iniciativa, disabled: false }, Validators.required],
            fechaIniciativa: [{ value: this.iniciativa.fechaIniciativa, disabled: false }, Validators.required],
            fechaRegistro: [{ value: this.iniciativa.fechaCreacion, disabled: true }, Validators.required],
            estatus: [{ value: this.iniciativa.estatus, disabled: true }, Validators.required],
            autores: [''],
            etiquetasAutores: [{ value: '', disabled: false }],
            tema: [''],
            etiquetasTema: [{ value: '', disabled: false }],
        });



    }

    async guardar(): Promise<void> {
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


        // Guardamos Iniciativa

        // Asignamos valores a objeto
        this.iniciativa.tipo_de_iniciativa = this.selectTipo;
        this.iniciativa.autores =  this.autores
        this.iniciativa.tema =  this.temas;
        this.iniciativa.fechaIniciativa = this.form.get('fechaIniciativa').value ;
        this.iniciativa.estatus = this.form.get('estatus').value
        if (this.iniciativa.id) {

            // Actualizamos el ente
            this.iniciativaService.actualizarIniciativa(this.iniciativa).subscribe((resp: any) => {
                if (resp) {
                    Swal.fire('Éxito', 'Iniciativa actualizada correctamente.', 'success');
                    this.iniciativa = resp.data;
                    this.spinner.hide();
                    this.cerrar(this.iniciativa);
                } else {
                    this.spinner.hide();
                    Swal.fire('Error', 'Ocurrió un error al guardar. ' + resp.error.data, 'error');
                }
            }, err => {
                this.spinner.hide();
                Swal.fire('Error', 'Ocurrió un error al guardar.' + err.error.data, 'error');
            });

        } else {
            // Guardamos el ente
            this.iniciativaService.guardarIniciativa(this.iniciativa).subscribe((resp: any) => {
                if (resp) {
                    this.spinner.hide();
                    Swal.fire('Éxito', 'Iniciativa guardada correctamente.', 'success');
                    this.cerrar(this.iniciativa);
                } else {
                    this.spinner.hide();
                    Swal.fire('Error', 'Ocurrió un error al guardar. ' + resp.error.data, 'error');
                }
            }, err => {
                this.spinner.hide();
                Swal.fire('Error', 'Ocurrió un error al guardar.' + err.error.data, 'error');
            });
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
        await this.iniciativaService.obtenerTiposIniciativas().subscribe((resp: any) => {

            this.arrTipo = resp;
            this.spinner.hide();
        }, err => {
            Swal.fire('Error', 'Ocurrió un error obtener los distritos.' + err, 'error');
            this.spinner.hide();
        });
    }

    change(): void {        
        this.cambioDocumento = true;
    }

  
    agregarAutor(event: MatChipInputEvent): void {
      const input = event.input;
      const value = event.value;
  
      if ((value || '').trim()) {
        this.autores.push({name: value.trim()});
      }
  
      // Reset the input value
      if (input) {
        input.value = '';
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
    
        if ((value || '').trim()) {
          this.temas.push({name: value.trim()});
        }
    
        // Reset the input value
        if (input) {
          input.value = '';
        }
      }
    
      eliminarTema(tema: Temas): void {
        const index = this.temas.indexOf(tema);
    
        if (index >= 0) {
          this.temas.splice(index, 1);
        }
      }

}
