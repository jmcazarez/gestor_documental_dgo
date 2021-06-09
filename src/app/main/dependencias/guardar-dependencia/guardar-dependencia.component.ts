import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DependenciasModel } from 'models/dependencias.model';
import { DependenciasService } from 'services/dependencias.service';
import Swal from 'sweetalert2';
import { DependenciasComponent } from '../dependencias.component';

@Component({
    selector: 'app-guardar-dependencia',
    templateUrl: './guardar-dependencia.component.html',
    styleUrls: ['./guardar-dependencia.component.scss']
})
export class GuardarDependenciaComponent implements OnInit {
    form: FormGroup;

    constructor(private formBuilder: FormBuilder, private dialogRef: MatDialogRef<DependenciasComponent>,
                private dependenciaService: DependenciasService,
                @Inject(MAT_DIALOG_DATA) public dependencia: DependenciasModel) { }

    ngOnInit(): void {
        // Form reactivo      
        this.form = this.formBuilder.group({
            cDescripcionDependencia: [this.dependencia.cDescripcionDependencia, [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
            cNomenclatura: [this.dependencia.cNomenclatura, [Validators.required, Validators.minLength(1), Validators.maxLength(20)]],
            estatus: this.dependencia.bActivo,
        });
    }

    async guardar(): Promise<void> {

        // Guardamos dependencia

        // Asignamos valores a objeto
        this.dependencia.bActivo = this.form.get('estatus').value;
        this.dependencia.cDescripcionDependencia = this.form.get('cDescripcionDependencia').value;
        this.dependencia.cNomenclatura = this.form.get('cNomenclatura').value;
     
        if (this.dependencia.id) {

                // Actualizamos el dependencia
                this.dependenciaService.actualizarDependencias(this.dependencia).subscribe((resp: any) => {
                    if (resp) {
                        Swal.fire('Éxito', 'Dependencia actualizado correctamente.', 'success');
                        this.dependencia = resp.data;
                        this.cerrar(this.dependencia);
                    } else {
                        Swal.fire('Error', 'Ocurrió un error al guardar. ' + resp.error.data, 'error');
                    }
                }, err => {
                    Swal.fire('Error', 'Ocurrió un error al guardar.' + err.error.data, 'error');
                });
        
        } else {
            // Guardamos el dependencia
            this.dependenciaService.guardarDependencias(this.dependencia).subscribe((resp: any) => {
                if (resp) {
                    Swal.fire('Éxito', 'Dependencia guardada correctamente.', 'success');
                    this.cerrar(this.dependencia);
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
