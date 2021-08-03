import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SecretariasModel } from 'models/secretarias.models';
import { UsuariosService } from 'services/usuarios.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { SecretariasComponent } from '../secretarias.component';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
    selector: 'app-guardar-secretaria',
    templateUrl: './guardar-secretaria.component.html',
    styleUrls: ['./guardar-secretaria.component.scss']
})
export class GuardarSecretariaComponent implements OnInit {
    form: FormGroup;
    constructor(
        private formBuilder: FormBuilder,
        private dialogRef: MatDialogRef<SecretariasComponent>,
        private usuariosService: UsuariosService,
        private spinner: NgxSpinnerService,
        @Inject(MAT_DIALOG_DATA) public secretaria: SecretariasModel
    ) { }

    ngOnInit(): void {
        // Form reactivo

        this.form = this.formBuilder.group({
            descripcionSecretaria: [this.secretaria.cDescripcionSecretaria, [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
            estatus: this.secretaria.bActivo,
        });
    }

    async guardar(): Promise<void> {

        this.spinner.show();
        // Guardamos dependencia
        // Asignamos valores a objeto
        this.secretaria.bActivo = this.form.get('estatus').value;
        this.secretaria.cDescripcionSecretaria = this.form.get('descripcionSecretaria').value;
        let id = this.secretaria.id;
        let activo = this.secretaria.bActivo;
        let secretaria = this.secretaria.cDescripcionSecretaria;
        let secretarias = {
            id: id,
            bActivo: activo,
            cDescripcionSecretaria: secretaria
        }
        if (this.secretaria.id) {

            // Actualizamos el secretaria
            this.usuariosService.actualizarSecretaria(secretarias).subscribe((resp: any) => {
                if (resp) {
                    this.spinner.hide();
                    Swal.fire('Éxito', 'Secretaría actualizado correctamente.', 'success');
                    this.secretaria = resp.data;
                    this.cerrar(this.secretaria);
                } else {
                    this.spinner.hide();
                    Swal.fire('Error', 'Ocurrió un error al guardar. ' + resp.error.data, 'error');
                }
            }, err => {
                this.spinner.hide();
                Swal.fire('Error', 'Ocurrió un error al guardar.' + err.error.data, 'error');
            });

        } else {
            // Guardamos la secretaria
            this.usuariosService.guardarSecretaria({"cDescripcionSecretaria": this.secretaria.cDescripcionSecretaria, "bActivo": this.secretaria.bActivo}).subscribe((resp: any) => {
                if (resp) {
                    this.spinner.hide();
                    Swal.fire('Éxito', 'Secretaría guardada correctamente.', 'success');
                    this.cerrar(this.secretaria);
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
