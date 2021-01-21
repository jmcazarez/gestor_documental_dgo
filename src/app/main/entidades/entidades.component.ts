import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { EntidadesModel } from 'models/entidades.models';
import { EntidadesService } from 'services/entidades.service';
import { MenuService } from 'services/menu.service';
import Swal from 'sweetalert2';
import { GuardarEntidadesComponent } from './guardar-entidades/guardar-entidades.component';

@Component({
    selector: 'app-entidades',
    templateUrl: './entidades.component.html',
    styleUrls: ['./entidades.component.scss']
})
export class EntidadesComponent implements OnInit {

    loadingIndicator: boolean;
    reorderable: boolean;
    cargando: boolean;
    entidades = [];
    entidadesTemp = [];
    optAgregar: boolean;
    optConsultar: boolean;
    optEditar: boolean;
    optEliminar: boolean;
    
    constructor(
        private router: Router,
        public dialog: MatDialog,
        private menuService: MenuService,
        private entidadesService: EntidadesService,
    ) {

    }

    ngOnInit(): void {
        this.obtenerEntidades();
    }


    obtenerEntidades(): void {

        this.loadingIndicator = true;
        // Obtenemos los documentos
        this.entidadesService.obtenerEntidades().subscribe((resp: any) => {

            // Buscamos permisos
            const opciones = this.menuService.opcionesPerfil.find((opcion: { cUrl: string; }) => opcion.cUrl === this.router.routerState.snapshot.url.replace('/', ''));
            this.optAgregar = opciones.Agregar;
            this.optEditar = opciones.Editar;
            this.optConsultar = opciones.Consultar;
            this.optEliminar = opciones.Eliminar;
     
            // Si tiene permisos para consultar
            if (this.optConsultar) {
                this.entidades = resp;
                this.entidadesTemp = this.entidades;
            }
            this.loadingIndicator = false;
        }, err => {
            this.loadingIndicator = false;
        });
    }

    editarEntidad(entidad: EntidadesModel): void {

        // Abrimos modal de guardar perfil
        const dialogRef = this.dialog.open(GuardarEntidadesComponent, {
            width: '60%',
            // height: '80%',
            disableClose: true,
            data: entidad,
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.obtenerEntidades();
            }

        });
    }

    nuevaEntidad(): void {
        // Abrimos modal de guardar entidades
        const dialogRef = this.dialog.open(GuardarEntidadesComponent, {
            width: '50%',
            // height: '80%',
            disableClose: true,
            data: new EntidadesModel(),

        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.obtenerEntidades();
            }

        });
    }

    filterDatatable(value): void {
        // Filtramos tabla
        if (value.target.value === '') {
            this.entidades = this.entidadesTemp;
        } else {
            const val = value.target.value.toLowerCase();
            const temp = this.entidades.filter((d) => d.cDescripcionEntidad.toLowerCase().indexOf(val) !== -1 || !val ||
                d.cNomenclatura.toLowerCase().indexOf(val) !== - 1);
            this.entidades = temp;
        }
    }

    eliminarEntidad(row: { id: string; }): void {
        // Eliminamos entidad
        Swal.fire({
            title: '¿Está seguro que desea eliminar esta entidad?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Si',
            cancelButtonText: 'No'
        }).then((result) => {
            if (result.value) {

                // realizamos delete
                this.entidadesService.eliminarEntidad(row.id).subscribe((resp: any) => {
                    Swal.fire('Eliminado', 'La entidad ha sido eliminada.', 'success');
                    this.obtenerEntidades();
                }, err => {
                    this.cargando = false;
                    Swal.fire(
                        'Error',
                        'Ocurrió un error al eliminar la entidad.' + err,
                        'error'
                    );
                });

            }
        });
    }
}
