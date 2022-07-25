import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { UsuariosService } from 'services/usuarios.service';
import { MenuService } from 'services/menu.service';
import Swal from 'sweetalert2';
import { GuardarSecretariaComponent } from './guardar-secretaria/guardar-secretaria.component';
import { GuardarDireccionesComponent } from './guardar-direcciones/guardar-direcciones.component';
import { GuardarDepartamentosComponent } from './guardar-departamentos/guardar-departamentos.component';
import { SecretariasModel } from 'models/secretarias.models';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
    selector: 'app-secretarias',
    templateUrl: './secretarias.component.html',
    styleUrls: ['./secretarias.component.scss']
})
export class SecretariasComponent implements OnInit {
    loadingIndicator: boolean;
    reorderable: boolean;
    cargando: boolean;
    secretarias = [];
    secretariasTemp = [];
    optAgregar: boolean;
    optConsultar: boolean;
    optEditar: boolean;
    optEliminar: boolean;
    valueBuscador: string = '';
    constructor(private router: Router,
                public dialog: MatDialog,
                private menuService: MenuService,
                private usuariosService: UsuariosService,
                private spinner: NgxSpinnerService) { }

    ngOnInit(): void {
        this.obtenerSecretaria();
    }

    obtenerSecretaria(): void {
        this.spinner.show();
        this.loadingIndicator = true;
        this.optAgregar = true;
        this.optEditar = true;
        this.optConsultar = true;
        this.optEliminar = true;
        // Obtenemos los documentos
        this.usuariosService.obtenerSecretarias().subscribe((resp: any) => {

            // Buscamos permisos
            this.secretarias = resp;
            this.secretariasTemp = this.secretarias;
            this.loadingIndicator = false;
            this.spinner.hide();
        }, err => {
            this.loadingIndicator = false;
            this.spinner.hide();
        });
    }

    editarSecretaria(secretaria: SecretariasModel): void {

        // Abrimos modal de guardar secretaria
        const dialogRef = this.dialog.open(GuardarSecretariaComponent, {
            width: '60%',
            // height: '80%',
            disableClose: true,
            data: secretaria,
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.limpiar();
                this.obtenerSecretaria();
            }

        });
    }

    nuevaSecretaria(): void {
        // Abrimos modal de guardar secretaria
        const dialogRef = this.dialog.open(GuardarSecretariaComponent, {
            width: '50%',
            // height: '80%',
            disableClose: true,
            data: new SecretariasModel(),

        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.limpiar();
                this.obtenerSecretaria();
            }

        });
    }

    direcciones(secretaria: SecretariasModel): void {
        // Abrimos modal de guardar direccion
        const dialogRef = this.dialog.open(GuardarDireccionesComponent, {
            width: '80%',
            height: '90%',
            disableClose: true,
            data: secretaria,
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.limpiar();
                this.obtenerSecretaria();
            }

        });
    }

    filterDatatable(value): void {
        this.secretarias = this.secretariasTemp;
        // Filtramos tabla
        if (value.target.value === '') {
            this.secretarias = this.secretariasTemp;
        } else {
            const val = value.target.value.toLowerCase();
            const temp = this.secretarias.filter((d) => d.cDescripcionSecretaria.toLowerCase().indexOf(val) !== -1 || !val );
            this.secretarias = temp;
        }
    }

    limpiar(): void{
        //Limpiamos buscador
        this.valueBuscador = '';
        //console.log('buscador' + this.valueBuscador);
    }

    eliminarSecretaria(row: { id: string; }): void {
        // Eliminamos secretaría
        Swal.fire({
            title: '¿Está seguro que desea eliminar esta SubSecretaria?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Si',
            cancelButtonText: 'No'
        }).then((result) => {
            if (result.value) {

                // realizamos delete
                this.usuariosService.eliminarSecretaria(row.id).subscribe((resp: any) => {
                    Swal.fire('Eliminado', 'La SubSecretaria ha sido eliminada.', 'success');
                    this.obtenerSecretaria();
                }, err => {
                    this.cargando = false;
                    Swal.fire(
                        'Error',
                        'Ocurrió un error al eliminar la SubSecretaria.' + err,
                        'error'
                    );
                });

            }
        });
    }
}
