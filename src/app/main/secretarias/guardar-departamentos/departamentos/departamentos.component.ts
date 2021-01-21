import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DepartamentosModels } from 'models/departamentos.models';
import { DireccionesModel} from 'models/direcciones.models'
import { UsuariosService } from 'services/usuarios.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { GuardarDepartamentosComponent } from '../guardar-departamentos.component';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-departamentos',
  templateUrl: './departamentos.component.html',
  styleUrls: ['./departamentos.component.scss']
})

export class DepartamentosComponent implements OnInit {
    direccionId: string;
    form: FormGroup;
    constructor(
        private formBuilder: FormBuilder,
        private dialogRef: MatDialogRef<GuardarDepartamentosComponent>,
        public usuariosService: UsuariosService,
        private spinner: NgxSpinnerService,
        @Inject(MAT_DIALOG_DATA) public departamentos: DepartamentosModels,
    ) { }


    ngOnInit(): void {
        // Form reactivo
        this.direccionId = this.usuariosService.idDireccion;
        console.log('Id de direccion '+this.direccionId);
        this.form = this.formBuilder.group({
            descripcionDepartamento: [this.departamentos.cDescripcionDepartamento, [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
            estatus: this.departamentos.bActivo,
        });
    }

    async guardarDepartamento(): Promise<void> {
        this.spinner.show();
        // Guardamos dependencia
        // console.log(this.secretaria);
        // Asignamos valores a objeto.
        let idDireccion = this.usuariosService.idDireccion;
        this.departamentos.bActivo = this.form.get('estatus').value;
        this.departamentos.cDescripcionDepartamento = this.form.get('descripcionDepartamento').value;
        let id = this.departamentos.id;
        let activo = this.departamentos.bActivo;
        let cDepartamento = this.departamentos.cDescripcionDepartamento;
        let departamentos = {
            id: id,
            bActivo: activo,
            cDescripcionDepartamento: cDepartamento,
            direcciones: idDireccion
        };
        console.log(departamentos);
        if (this.departamentos.id) {

            // Actualizamos el secretaria
            this.usuariosService.actualizarDepartamento(departamentos).subscribe((resp: any) => {
                if (resp) {
                    this.spinner.hide();
                    Swal.fire('Éxito', 'Departamento actualizado correctamente.', 'success');
                    this.departamentos = resp.data;
                    this.cerrar(this.departamentos);
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
            this.usuariosService.guardarDepartamento({"cDescripcionDepartamento": this.departamentos.cDescripcionDepartamento, "bActivo": this.departamentos.bActivo, "direcciones": idDireccion}).subscribe((resp: any) => {
                if (resp) {
                    this.spinner.hide();
                    Swal.fire('Éxito', 'Departamento guardada correctamente.', 'success');
                    this.cerrar(this.departamentos);
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