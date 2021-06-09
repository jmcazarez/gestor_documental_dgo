import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EntesModel } from 'models/entes.models';
import { EntesService } from 'services/entes.service';
import Swal from 'sweetalert2';
import { EntesComponent } from '../entes.component';

@Component({
    selector: 'app-guardar-entes',
    templateUrl: './guardar-entes.component.html',
    styleUrls: ['./guardar-entes.component.scss']
})
export class GuardarEntesComponent implements OnInit {
    form: FormGroup;
    constructor(
        private formBuilder: FormBuilder,
        private dialogRef: MatDialogRef<EntesComponent>,
        private entesService: EntesService,
        @Inject(MAT_DIALOG_DATA) public ente: EntesModel
    ) { }

    ngOnInit(): void {       
        // Form reactivo
      
        this.form = this.formBuilder.group({
            descripcionEnte:   [this.ente.cDescripcionEnte, [Validators.required, Validators.minLength(3), Validators.maxLength(100)]] ,
            estatus: this.ente.bActivo,
        });
    }

    async guardar(): Promise<void> {

        // Guardamos dependencia

        // Asignamos valores a objeto
        this.ente.bActivo = this.form.get('estatus').value;
        this.ente.cDescripcionEnte = this.form.get('descripcionEnte').value;
     
        if (this.ente.id) {

                // Actualizamos el ente
                this.entesService.actualizarEnte(this.ente).subscribe((resp: any) => {
                    if (resp) {
                        Swal.fire('Éxito', 'Ente actualizado correctamente.', 'success');
                        this.ente = resp.data;
                        this.cerrar(this.ente);
                    } else {
                        Swal.fire('Error', 'Ocurrió un error al guardar. ' + resp.error.data, 'error');
                    }
                }, err => {
                    Swal.fire('Error', 'Ocurrió un error al guardar.' + err.error.data, 'error');
                });
        
        } else {
            // Guardamos el ente
            this.entesService.guardarEnte(this.ente).subscribe((resp: any) => {
                if (resp) {
                    Swal.fire('Éxito', 'Ente guardada correctamente.', 'success');
                    this.cerrar(this.ente);
                } else {
                    Swal.fire('Error', 'Ocurrió un error al guardar. ' + resp.error.data, 'error');
                }
            }, err => {
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
