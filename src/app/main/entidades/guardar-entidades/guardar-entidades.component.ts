import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EntidadesModel } from 'models/entidades.models';
import { EntidadesService } from 'services/entidades.service';
import Swal from 'sweetalert2';
import { EntidadesComponent } from '../entidades.component';

@Component({
    selector: 'app-guardar-entidades',
    templateUrl: './guardar-entidades.component.html',
    styleUrls: ['./guardar-entidades.component.scss']
})
export class GuardarEntidadesComponent implements OnInit {
    form: FormGroup;

    constructor(
        private formBuilder: FormBuilder,
        private dialogRef: MatDialogRef<EntidadesComponent>,
        private entidadesService: EntidadesService,
        @Inject(MAT_DIALOG_DATA) public entidad: EntidadesModel
    ) { }

    ngOnInit(): void {

        // Form reactivo
        this.form = this.formBuilder.group({
            // tslint:disable-next-line: max-line-length
            descripcionEntidad: [{ value: this.entidad.cDescripcionEntidad, disabled: this.entidad.disabled }, [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
            nomenclatura: [{ value: this.entidad.cNomenclatura, disabled: this.entidad.disabled }, [Validators.required, Validators.minLength(3), Validators.maxLength(15)]],
            estatus: { value: this.entidad.bActivo, disabled: this.entidad.disabled },
        });
    }

    cerrar(ent): void {
        if (ent) {
            this.dialogRef.close(ent);
        } else {
            this.dialogRef.close();
        }
    }

    async guardar(): Promise<void> {

        // Guardamos documento

        // Asignamos valores a objeto
        this.entidad.bActivo = this.form.get('estatus').value;
        this.entidad.cDescripcionEntidad = this.form.get('descripcionEntidad').value;
        this.entidad.cNomenclatura = this.form.get('nomenclatura').value;
        if (this.entidad.id) {

            if (this.entidad.disabled) {
                this.cerrar(this.entidad);
            } else {
                // Actualizamos la entidad
                this.entidadesService.actualizarEntidades(this.entidad).subscribe((resp: any) => {
                    if (resp) {
                        Swal.fire('Éxito', 'Entidad actualizada correctamente.', 'success');
                        this.entidad = resp.data;
                        this.cerrar(this.entidad);
                    } else {
                        Swal.fire('Error', 'Ocurrió un error al guardar. ' + resp.error.data, 'error');
                    }
                }, err => {
                    Swal.fire('Error', 'Ocurrió un error al guardar.' + err.error.data, 'error');
                });
            }
        } else {
            // Guardamos la entidad
            this.entidadesService.guardarEntidad(this.entidad).subscribe((resp: any) => {
                if (resp) {
                    Swal.fire('Éxito', 'Entidad guardada correctamente.', 'success');
                    this.cerrar(this.entidad);
                } else {
                    Swal.fire('Error', 'Ocurrió un error al guardar. ' + resp.error.data, 'error');
                }
            }, err => {
                Swal.fire('Error', 'Ocurrió un error al guardar.' + err.error.data, 'error');
            });
        }
    }

}
