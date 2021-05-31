import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EmpleadosModel } from 'models/empleados.models';
import { UsuariosService } from 'services/usuarios.service';
import { PuestosService } from 'services/puestos.service';
import { EmpleadosDelCongresoService } from 'services/empleados-del-congreso.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { EmpleadosDelCongresoComponent } from '../empleados-del-congreso.component';
import { RxwebValidators } from '@rxweb/reactive-form-validators';

@Component({
  selector: 'app-guardar-empleado',
  templateUrl: './guardar-empleado.component.html',
  styleUrls: ['./guardar-empleado.component.scss']
})
export class GuardarEmpleadoComponent implements OnInit {
    form: FormGroup;

    arrSecretarias: any[];
    arrPuestos: any[];
    selectedSecretaria: any;
    selectedPuestos: any;
    constructor(
        private formBuilder: FormBuilder,
        private dialogRef: MatDialogRef<EmpleadosDelCongresoComponent>,
        private usuariosService: UsuariosService,
        private puestosService: PuestosService,
        private empleadosService: EmpleadosDelCongresoService,
        private spinner: NgxSpinnerService,
        @Inject(MAT_DIALOG_DATA) public empleados: EmpleadosModel
    ) { }

    ngOnInit(): void {
        // Form reactivo

        this.obtenerSecretarias();
        this.obtenerPuestos();

        if (this.empleados.secretaria) {
            this.selectedSecretaria = this.empleados.secretaria.id;
        }

        if (this.empleados.puesto) {
            this.selectedPuestos = this.empleados.puesto.id;
        }

        if (this.empleados.id === undefined) {
            this.empleados.activo = true;
        }
      
        this.form = this.formBuilder.group({
            nombre: [this.empleados.nombre, [Validators.required, ,Validators.minLength(3), Validators.maxLength(100)]],
            apellidoPaterno: [this.empleados.apellidoPaterno, [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
            apellidoMaterno: [this.empleados.apellidoMaterno, [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
            telefono: [this.empleados.telefono, [RxwebValidators.mask({ mask: '(999)-999 9999' }), Validators.required]],
            email: [this.empleados.email, [Validators.required, Validators.minLength(6), Validators.maxLength(100), Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
            puestos: [{ value: this.arrPuestos }, [Validators.required]],
            secretarias: [{ value: this.arrSecretarias }, [Validators.required]],
            estatus: this.empleados.activo
        });
    }

    get primEmail(){
        return this.form.get('email');
    }

    get telf(){
        return this.form.get('telefono');
    }

    async obtenerSecretarias(): Promise<void> {
        // Obtenemos empleados
        this.spinner.show();
        await this.usuariosService.obtenerSecretarias().subscribe((resp: any) => {

            this.arrSecretarias = resp;
            this.spinner.hide();
        }, err => {
            Swal.fire('Error', 'Ocurrió un error obtener las secretarias.' + err, 'error');
            this.spinner.hide();
        });
    }

    async obtenerPuestos(): Promise<void> {
        // Obtenemos empleados
        this.spinner.show();
        await this.puestosService.obtenerPuestos().subscribe((resp: any) => {

            this.arrPuestos = resp;
            this.spinner.hide();
        }, err => {
            Swal.fire('Error', 'Ocurrió un error obtener los puestos.' + err, 'error');
            this.spinner.hide();
        });
    }

    async guardar(): Promise<void> {
        
        // Guardamos empleado
        // console.log(this.secretaria);
        // Asignamos valores a objeto
        this.spinner.show();
        this.empleados.nombre = this.form.get('nombre').value;
        this.empleados.apellidoPaterno = this.form.get('apellidoPaterno').value;
        this.empleados.apellidoMaterno = this.form.get('apellidoMaterno').value;
        this.empleados.telefono = this.form.get('telefono').value;
        this.empleados.email = this.form.get('email').value;
        this.empleados.puesto = this.selectedPuestos;
        this.empleados.secretaria = this.selectedSecretaria;
        this.empleados.activo = this.form.get('estatus').value;
        //console.log('Petición guardar '+this.empleados);

        if (this.empleados.id) {

            // Actualizamos el empleado
            this.empleadosService.actualizarEmpleado(this.empleados).subscribe((resp: any) => {
                if (resp) {
                    this.spinner.hide();
                    Swal.fire('Éxito', 'Empleado actualizado correctamente.', 'success');
                    this.empleados = resp.data;
                    this.cerrar(this.empleados);
                } else {
                    this.spinner.hide();
                    Swal.fire('Error', 'Ocurrió un error al guardar. ' + resp.error.data, 'error');
                }
            }, err => {
                this.spinner.hide();
                Swal.fire('Error', 'Ocurrió un error al guardar.' + err.error.data, 'error');
            });

        } else {
            // Guardamos el empleado
            this.empleadosService.guardarEmpleado(this.empleados).subscribe((resp: any) => {
                if (resp) {
                    this.spinner.hide();
                    Swal.fire('Éxito', 'Empleado guardado correctamente.', 'success');
                    this.cerrar(this.empleados);
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
