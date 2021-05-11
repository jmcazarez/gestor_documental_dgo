import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LegislaturaModel } from 'models/legislaturas.models';
import { LegislaturaService } from 'services/legislaturas.service';
import Swal from 'sweetalert2';
import { LegislaturaComponent } from '../legislaturas.component';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
    selector: 'app-guardar-legislaturas',
    templateUrl: './guardar-legislaturas.component.html',
    styleUrls: ['./guardar-legislaturas.component.scss']
})
export class GuardarLegislaturasComponent implements OnInit {
    form: FormGroup;
    constructor(
        private formBuilder: FormBuilder,
        private spinner: NgxSpinnerService,
        private dialogRef: MatDialogRef<LegislaturaComponent>,
        private legislaturaService: LegislaturaService,
        @Inject(MAT_DIALOG_DATA) public legislatura: LegislaturaModel
    ) { }

    ngOnInit(): void {       
        // Form reactivo
      
        if(this.legislatura.bActivo === undefined){
            this.legislatura.bActivo = true;
        }

        if(this.legislatura.bActual === undefined){
            this.legislatura.bActual = true;
        }
        this.form = this.formBuilder.group({
            descripcionLegislatura:   [this.legislatura.cLegislatura, [Validators.required, Validators.minLength(3), Validators.maxLength(100)]] ,
            actual: this.legislatura.bActual,
            estatus: this.legislatura.bActivo,
        });
    }

    async guardar(): Promise<void> {

        this.spinner.show();
        // Asignamos valores a objeto
        this.legislatura.bActivo = this.form.get('estatus').value;
        this.legislatura.cLegislatura = this.form.get('descripcionLegislatura').value;
        this.legislatura.bActual = this.form.get('actual').value;
        delete this.legislatura["documentos"];
        if (this.legislatura.id) {

                // Actualizamos el legislatura
                this.legislaturaService.actualizarLegislatura(this.legislatura).subscribe((resp: any) => {
                    if (resp) {
                        this.spinner.hide();
                        Swal.fire('Éxito', 'Legislatura actualizada correctamente.', 'success');
                        this.legislatura = resp.data;
                     
                        this.cerrar(this.legislatura);
                    } else {
                        this.spinner.hide();
                        Swal.fire('Error', 'Ocurrió un error al guardar. ' + resp.error.data, 'error');
                    }
                }, err => {
                    this.spinner.hide();
                    Swal.fire('Error', 'Ocurrió un error al guardar.' + err.error.data, 'error');
                });
        
        } else {
            // Guardamos el legislatura
            this.legislaturaService.guardarLegislatura(this.legislatura).subscribe((resp: any) => {
                if (resp) {
                    this.spinner.hide();
                    Swal.fire('Éxito', 'Legislatura guardada correctamente.', 'success');
                    this.cerrar(this.legislatura);
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
