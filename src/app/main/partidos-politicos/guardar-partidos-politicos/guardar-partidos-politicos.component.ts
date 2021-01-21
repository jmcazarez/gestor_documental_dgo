import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PartidosPoliticosModel } from 'models/partidos-politicos.models';
import { PartidosPoliticosService } from 'services/partidos-politicos.service';
import Swal from 'sweetalert2';
import { PartidosPoliticosComponent } from '../partidos-politicos.component';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
    selector: 'app-guardar-partidos-politicos',
    templateUrl: './guardar-partidos-politicos.component.html',
    styleUrls: ['./guardar-partidos-politicos.component.scss']
})
export class GuardarPartidosPoliticosComponent implements OnInit {
    form: FormGroup;
    constructor(
        private formBuilder: FormBuilder,
        private spinner: NgxSpinnerService,
        private dialogRef: MatDialogRef<PartidosPoliticosComponent>,
        private partidosPoliticosService: PartidosPoliticosService,
        @Inject(MAT_DIALOG_DATA) public partidoPolitico: PartidosPoliticosModel
    ) { }

    ngOnInit(): void {       
        // Form reactivo
      
        if(this.partidoPolitico.bActivo === undefined){
            this.partidoPolitico.bActivo = true;
        }
        this.form = this.formBuilder.group({
            partidoPolitico:   [this.partidoPolitico.cPartidoPolitico, [Validators.required, Validators.minLength(3), Validators.maxLength(100)]] ,
            nomenclatura:   [this.partidoPolitico.cNomenclatura, [Validators.required, Validators.minLength(3), Validators.maxLength(100)]] ,
            estatus: this.partidoPolitico.bActivo,
        });
    }

    async guardar(): Promise<void> {

        this.spinner.show();
        // Asignamos valores a objeto
        this.partidoPolitico.bActivo = this.form.get('estatus').value;
        this.partidoPolitico.cPartidoPolitico = this.form.get('partidoPolitico').value;
        this.partidoPolitico.cNomenclatura = this.form.get('nomenclatura').value;

        if (this.partidoPolitico.id) {

                // Actualizamos el partido politico
                this.partidosPoliticosService.actualizarPartidoPolitico(this.partidoPolitico).subscribe((resp: any) => {
                    if (resp) {
                        this.spinner.hide();
                        Swal.fire('Éxito', 'Partido político actualizado correctamente.', 'success');
                        this.partidoPolitico = resp.data;
                     
                        this.cerrar(this.partidoPolitico);
                    } else {
                        this.spinner.hide();
                        Swal.fire('Error', 'Ocurrió un error al guardar. ' + resp.error.data, 'error');
                    }
                }, err => {
                    this.spinner.hide();
                    Swal.fire('Error', 'Ocurrió un error al guardar.' + err.error.data, 'error');
                });
        
        } else {
            // Guardamos el partido politico
            this.partidosPoliticosService.guardarPartidoPolitico(this.partidoPolitico).subscribe((resp: any) => {
                if (resp) {
                    this.spinner.hide();
                    Swal.fire('Éxito', 'Partido político guardada correctamente.', 'success');
                    this.cerrar(this.partidoPolitico);
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

    cerrar(ent): void {
        if (ent) {
            this.dialogRef.close(ent);
        } else {
            this.dialogRef.close();
        }
    }


}
