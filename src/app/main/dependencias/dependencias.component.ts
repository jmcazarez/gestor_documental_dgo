import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DependenciasModel } from 'models/dependencias.model';
import { DependenciasService } from 'services/dependencias.service';
import { MenuService } from 'services/menu.service';
import Swal from 'sweetalert2';
import { GuardarDependenciaComponent } from './guardar-dependencia/guardar-dependencia.component';

@Component({
    selector: 'app-dependencias',
    templateUrl: './dependencias.component.html',
    styleUrls: ['./dependencias.component.scss']
})
export class DependenciasComponent implements OnInit {
    loadingIndicator: boolean;
    reorderable: boolean;
    cargando: boolean;
    dependencias = [];
    dependenciasTemp = [];
    optAgregar: boolean;
    optConsultar: boolean;
    optEditar: boolean;
    optEliminar: boolean;
    constructor(private router: Router,
                public dialog: MatDialog,
                private menuService: MenuService,
                private dependenciasService: DependenciasService) { }

    ngOnInit(): void {
        this.obtenerDependencias();
    }
    obtenerDependencias(): void {

        this.loadingIndicator = true;
        // Obtenemos los documentos
        this.dependenciasService.obtenerDependencias().subscribe((resp: any) => {           
            // Buscamos permisos
            const opciones = this.menuService.opcionesPerfil.find((opcion: { cUrl: string; }) => opcion.cUrl === this.router.routerState.snapshot.url.replace('/', ''));
            this.optAgregar = opciones.Agregar;
            this.optEditar = opciones.Editar;
            this.optConsultar = opciones.Consultar;
            this.optEliminar = opciones.Eliminar;
            // Si tiene permisos para consultar
            if (this.optConsultar) {
                this.dependencias = resp;
                this.dependenciasTemp = this.dependencias;
            }
            this.loadingIndicator = false;
        }, err => {
            this.loadingIndicator = false;
        });
    }

   editarDependencia(dependencia: DependenciasModel): void {
 
        // Abrimos modal de guardar perfil
        const dialogRef = this.dialog.open(GuardarDependenciaComponent, {
            width: '60%',
            // height: '80%',
            disableClose: true,
            data: dependencia,
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.obtenerDependencias();
            }

        });
    }

    nuevaDependencia(): void {
        // Abrimos modal de guardar dependencia
        const dialogRef = this.dialog.open(GuardarDependenciaComponent, {
            width: '50%',
            // height: '80%',
            disableClose: true,
            data: new DependenciasModel(),

        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.obtenerDependencias();
            }

        });
    }

    filterDatatable(value): void {
        // Filtramos tabla
        if (value.target.value === '') {
            this.dependencias = this.dependenciasTemp;
        } else {
            const val = value.target.value.toLowerCase();
            const temp = this.dependencias.filter((d) => d.cDescripcionDependencia.toLowerCase().indexOf(val) !== -1 || !val || d.cNomenclatura.toLowerCase().indexOf(val) !== -1);
            this.dependencias = temp;
        }
    }

    eliminarDependencia(row: { id: string; }): void {
        // Eliminamos dependencia
        Swal.fire({
            title: '¿Está seguro que desea eliminar esta dependencia?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Si',
            cancelButtonText: 'No'
        }).then((result) => {
            if (result.value) {

                // realizamos delete
                this.dependenciasService.eliminarDependencias(row.id).subscribe((resp: any) => {
                    Swal.fire('Eliminado', 'La dependencia ha sido eliminado.', 'success');
                    this.obtenerDependencias();
                }, err => {
                    this.cargando = false;
                    Swal.fire(
                        'Error',
                        'Ocurrió un error al eliminar la dependencia.' + err,
                        'error'
                    );
                });

            }
        });
    }
}
