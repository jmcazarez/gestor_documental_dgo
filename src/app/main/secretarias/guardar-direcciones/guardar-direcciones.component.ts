import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { SecretariasModel } from 'models/secretarias.models';
import { DireccionesModel} from 'models/direcciones.models';
import { UsuariosService } from 'services/usuarios.service';
import { MenuService } from 'services/menu.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { SecretariasComponent } from '../secretarias.component';
import { ModaldireccionesComponent} from './modaldirecciones/modaldirecciones.component';
import { stringify } from '@angular/compiler/src/util';
import { GuardarDepartamentosComponent } from '../guardar-departamentos/guardar-departamentos.component';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
    selector: 'app-guardar-direcciones',
    templateUrl: './guardar-direcciones.component.html',
    styleUrls: ['./guardar-direcciones.component.scss']
  })
export class GuardarDireccionesComponent implements OnInit {
    loadingIndicator: boolean;
    reorderable: boolean;
    cargando: boolean;
    direcciones = [];
    direccionesTemp = [];
    optAgregar: boolean;
    optConsultar: boolean;
    optEditar: boolean;
    optEliminar: boolean;
    form: FormGroup;
    idSecretaria: string = this.secretaria.id;
    valueBuscador: string = '';
    constructor(
        private formBuilder: FormBuilder,
        private dialogRef: MatDialogRef<SecretariasComponent>,
        private usuariosService: UsuariosService,
        private menuService: MenuService,
        private router: Router,
        private dialog: MatDialog,
        private spinner: NgxSpinnerService,
        @Inject(MAT_DIALOG_DATA) public secretaria: SecretariasModel,
        
    ) { }

    ngOnInit(): void {
        this.obtenerDireccion();
    }

    obtenerDireccion(): void {
        this.spinner.show();
        const direccionesTemp: any[] = [];
        this.loadingIndicator = true;
        //let secretariaId = '';
        // Obtenemos las direcciones
        this.usuariosService.obtenerDirecciones().subscribe((resp: any) => {

            // Buscamos permisos
            const opciones = this.menuService.opcionesPerfil.find((opcion: { cUrl: string; }) => opcion.cUrl === this.router.routerState.snapshot.url.replace('/', ''));

            this.optAgregar = opciones.Agregar;
            this.optEditar = opciones.Editar;
            this.optConsultar = opciones.Consultar;
            this.optEliminar = opciones.Eliminar;
            
            // Si tiene permisos para consultar
            if (this.optConsultar) {
                for (const direccion of resp) {
                            //secretariaId = '';
                        if (direccion.secretariaId === this.secretaria.id) {
                        direccionesTemp.push({
                        id: direccion.id,
                        cDescripcionDireccion: direccion.cDescripcionDireccion,
                        bActivo: direccion.bActivo,
                     });
                    }       
                }

                this.direcciones = direccionesTemp;
                this.direccionesTemp = this.direcciones;
                this.spinner.hide();
            }
            this.loadingIndicator = false;
            this.spinner.hide();
        }, err => {
            this.spinner.hide();
            this.loadingIndicator = false;
        });
    }

    editarDireccion(direcciones: DireccionesModel): void {

        // Abrimos modal de editar direccion
        const dialogRef = this.dialog.open(ModaldireccionesComponent, {
            width: '60%',
            height: '80%',
            disableClose: true,
            data: direcciones
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.limpiar();
                this.obtenerDireccion();
            }

        });
    }

    nuevaDireccion(): void {
        // Abrimos modal de guardar direccion
        this.usuariosService.idSecretaria = this.secretaria.id;
        console.log(this.usuariosService.idSecretaria);
        const dialogRef = this.dialog.open(ModaldireccionesComponent, {
            width: '50%',
            height: '80%',
            disableClose: true,
            data: new DireccionesModel(),
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.limpiar();
                this.obtenerDireccion();
            }

        });
    }

    filterDatatable(value): void {
        // Filtramos tabla
        if (value.target.value === '') {
            this.direcciones = this.direccionesTemp;
        } else {
            const val = value.target.value.toLowerCase();
            const temp = this.direcciones.filter((d) => d.cDescripcionDireccion.toLowerCase().indexOf(val) !== -1 || !val );
            this.direcciones = temp;
        }
    }

    eliminarDireccion(row: { id: string; }): void {
        // Eliminamos dirección
        Swal.fire({
            title: '¿Está seguro que desea eliminar esta dirección?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Si',
            cancelButtonText: 'No'
        }).then((result) => {
            if (result.value) {

                // realizamos delete
                this.usuariosService.eliminarDireccion(row.id).subscribe((resp: any) => {
                    Swal.fire('Eliminado', 'La dirección ha sido eliminada.', 'success');
                    this.limpiar();
                    this.obtenerDireccion();
                }, err => {
                    this.cargando = false;
                    Swal.fire(
                        'Error',
                        'Ocurrió un error al eliminar la dirección.' + err,
                        'error'
                    );
                });

            }
        });
    }

    departamentos(direcciones: DireccionesModel): void {
        // Abrimos modal de guardar departamentos
        const dialogRef = this.dialog.open(GuardarDepartamentosComponent, {
            width: '80%',
            height: '80%',
            disableClose: true,
            data: direcciones,
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.limpiar();
                this.obtenerDireccion();
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
