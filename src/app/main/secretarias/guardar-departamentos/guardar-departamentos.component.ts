import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { SecretariasModel } from 'models/secretarias.models';
import { DireccionesModel} from 'models/direcciones.models';
import { UsuariosService } from 'services/usuarios.service';
import { DepartamentosModels } from 'models/departamentos.models';
import { MenuService } from 'services/menu.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { GuardarDireccionesComponent } from '../guardar-direcciones/guardar-direcciones.component';
import { DepartamentosComponent } from './departamentos/departamentos.component';
import { stringify } from '@angular/compiler/src/util';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-guardar-departamentos',
  templateUrl: './guardar-departamentos.component.html',
  styleUrls: ['./guardar-departamentos.component.scss']
})
export class GuardarDepartamentosComponent implements OnInit {
    loadingIndicator: boolean;
    reorderable: boolean;
    cargando: boolean;
    departamento = [];
    departamentoTemp = [];
    optAgregar: boolean;
    optConsultar: boolean;
    optEditar: boolean;
    optEliminar: boolean;
    form: FormGroup;
    idDireccion: string = this.direcciones.id;
    valueBuscador: string = '';
    constructor(
        private formBuilder: FormBuilder,
        private dialogRef: MatDialogRef<GuardarDireccionesComponent>,
        private usuariosService: UsuariosService,
        private menuService: MenuService,
        private router: Router,
        private dialog: MatDialog,
        private spinner: NgxSpinnerService,
        @Inject(MAT_DIALOG_DATA) public direcciones: DireccionesModel,
    ) { }
    ngOnInit(): void {
       
        this.obtenerDepartamento();
    }

    obtenerDepartamento(): void {
        this.spinner.show();
        const departamentoTemp: any[] = [];
        this.loadingIndicator = true;
        // Obtenemos los documentos
        this.usuariosService.obtenerDepartamentos().subscribe((resp: any) => {

            // Buscamos permisos
            
            this.optAgregar = true;
            this.optEditar = true;
            this.optConsultar = true;
            this.optEliminar = true;
            
            // Si tiene permisos para consultar
            if (this.optConsultar) {
                for (const departamento of resp) {
                        if (departamento.direccionId === this.idDireccion) {
                        departamentoTemp.push({
                        id: departamento.id,
                        cDescripcionDepartamento: departamento.cDescripcionDepartamento,
                        bActivo: departamento.bActivo,
                     });
                    }       
                }

                this.departamento = departamentoTemp;
                this.departamentoTemp = this.departamento;
                this.spinner.hide();
            }
            this.loadingIndicator = false;
            this.spinner.hide();
        }, err => {
            this.spinner.hide();
            this.loadingIndicator = false;
        });
    }

    editarDepartamento(direcciones: DireccionesModel): void {
      this.usuariosService.idDireccion = this.idDireccion;
        // Abrimos modal de guardar direccion
        const dialogRef = this.dialog.open(DepartamentosComponent, {
            width: '60%',
            // height: '80%',
            disableClose: true,
            data: direcciones
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.limpiar();
                this.obtenerDepartamento();
            }

        });
    }

    nuevoDepartamento(): void {
        // Abrimos modal de guardar direccion
        this.usuariosService.idDireccion = this.idDireccion;
        //console.log(this.usuariosService.idSecretaria);
        const dialogRef = this.dialog.open(DepartamentosComponent, {
            width: '50%',
            // height: '80%',
            disableClose: true,
            data: new DireccionesModel(),
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.limpiar();
                this.obtenerDepartamento();
            }

        });
    }

    filterDatatable(value): void {
        this.departamento = this.departamentoTemp;
        // Filtramos tabla
        if (value.target.value === '') {
            this.departamento = this.departamentoTemp;
        } else {
            const val = value.target.value.toLowerCase();
            const temp = this.departamento.filter((d) => d.cDescripcionDepartamento.toLowerCase().indexOf(val) !== -1 || !val );
            this.departamento = temp;
        }
    }

    eliminarDepartamento(row: { id: string; }): void {
        // Eliminamos dirección
        Swal.fire({
            title: '¿Está seguro que desea eliminar este departamento?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Si',
            cancelButtonText: 'No'
        }).then((result) => {
            if (result.value) {

                // realizamos delete
                this.usuariosService.eliminarDepartamento(row.id).subscribe((resp: any) => {
                    Swal.fire('Eliminado', 'El departamento ha sido eliminado.', 'success');
                    this.limpiar();
                    this.obtenerDepartamento();
                }, err => {
                    this.cargando = false;
                    Swal.fire(
                        'Error',
                        'Ocurrió un error al eliminar el departamento.' + err,
                        'error'
                    );
                });

            }
        });
    }

    limpiar(): void{
        this.valueBuscador = '';
        console.log('buscador' + this.valueBuscador);
    }

    cerrar(ent): void {
        if (ent) {
            this.dialogRef.close(ent);
        } else {
            this.dialogRef.close();
        }
    }
}
