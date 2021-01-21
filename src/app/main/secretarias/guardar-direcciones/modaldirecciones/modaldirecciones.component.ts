import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SecretariasModel } from 'models/secretarias.models';
import { DireccionesModel} from 'models/direcciones.models'
import { UsuariosService } from 'services/usuarios.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { GuardarDireccionesComponent } from '../guardar-direcciones.component';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-modaldirecciones',
  templateUrl: './modaldirecciones.component.html',
  styleUrls: ['./modaldirecciones.component.scss']
})

export class ModaldireccionesComponent implements OnInit {
    secretariaId: string;
    form: FormGroup;
    constructor(
        private formBuilder: FormBuilder,
        private dialogRef: MatDialogRef<GuardarDireccionesComponent>,
        public usuariosService: UsuariosService,
        private spinner: NgxSpinnerService,
        @Inject(MAT_DIALOG_DATA) public direcciones: DireccionesModel,
    ) { }


    ngOnInit(): void {
        // Form reactivo
        this.secretariaId = this.usuariosService.idSecretaria;
        console.log(this.secretariaId);
        this.form = this.formBuilder.group({
            descripcionDireccion: [this.direcciones.cDescripcionDireccion, [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
            estatus: this.direcciones.bActivo,
        });
    }

    async guardarDireccion(): Promise<void> {
        this.spinner.show();
        // Guardamos dependencia
        // console.log(this.secretaria);
        // Asignamos valores a objeto.
        let secretariaid = this.usuariosService.idSecretaria;
        this.direcciones.bActivo = this.form.get('estatus').value;
        this.direcciones.cDescripcionDireccion = this.form.get('descripcionDireccion').value;
        let id = this.direcciones.id;
        let activo = this.direcciones.bActivo;
        let cDireccion = this.direcciones.cDescripcionDireccion;
        let direcciones = {
            id: id,
            bActivo: activo,
            cDescripcionDireccion: cDireccion,
            secretaria: [secretariaid]
        };
        console.log(direcciones)
        if (this.direcciones.id) {

            // Actualizamos la dirección
            this.usuariosService.actualizarDireccion(direcciones).subscribe((resp: any) => {
                if (resp) {
                    this.spinner.hide();
                    Swal.fire('Éxito', 'Dirección actualizado correctamente.', 'success');
                    this.direcciones = resp.data;
                    this.cerrar(this.direcciones);
                } else {
                    this.spinner.hide();
                    Swal.fire('Error', 'Ocurrió un error al guardar. ' + resp.error.data, 'error');
                }
            }, err => {
                this.spinner.hide();
                Swal.fire('Error', 'Ocurrió un error al guardar.' + err.error.data, 'error');
            });

        } else {
            // Guardamos la dirección
            this.usuariosService.guardarDireccion({"cDescripcionDireccion": this.direcciones.cDescripcionDireccion, "bActivo": this.direcciones.bActivo, "secretarias": [secretariaid]}).subscribe((resp: any) => {
                if (resp) {
                    this.spinner.hide();
                    Swal.fire('Éxito', 'Dirección guardada correctamente.', 'success');
                    this.cerrar(this.direcciones);
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