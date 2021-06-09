import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { EntesModel } from 'models/entes.models';
import { EntesService } from 'services/entes.service';
import { MenuService } from 'services/menu.service';
import Swal from 'sweetalert2';
import { GuardarEntesComponent } from './guardar-entes/guardar-entes.component';

@Component({
    selector: 'app-entes',
    templateUrl: './entes.component.html',
    styleUrls: ['./entes.component.scss']
})
export class EntesComponent implements OnInit {
    loadingIndicator: boolean;
    reorderable: boolean;
    cargando: boolean;
    entes = [];
    entesTemp = [];
    optAgregar: boolean;
    optConsultar: boolean;
    optEditar: boolean;
    optEliminar: boolean;
    constructor(private router: Router,
                public dialog: MatDialog,
                private menuService: MenuService,
                private enteService: EntesService) { }

    ngOnInit(): void {
        this.obtenerEntes();
    }

    obtenerEntes(): void {

        this.loadingIndicator = true;
        // Obtenemos los documentos
        this.enteService.obtenerEntes().subscribe((resp: any) => {

            // Buscamos permisos
            const opciones = this.menuService.opcionesPerfil.find((opcion: { cUrl: string; }) => opcion.cUrl === this.router.routerState.snapshot.url.replace('/', ''));
            this.optAgregar = opciones.Agregar;
            this.optEditar = opciones.Editar;
            this.optConsultar = opciones.Consultar;
            this.optEliminar = opciones.Eliminar;
            // Si tiene permisos para consultar
            if (this.optConsultar) {
                this.entes = resp;
                this.entesTemp = this.entes;
            }
            this.loadingIndicator = false;
        }, err => {
            this.loadingIndicator = false;
        });
    }

    editarEnte(ente: EntesModel): void {

        // Abrimos modal de guardar perfil
        const dialogRef = this.dialog.open(GuardarEntesComponent, {
            width: '60%',
            // height: '80%',
            disableClose: true,
            data: ente,
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.obtenerEntes();
            }

        });
    }

    nuevoEnte(): void {
        // Abrimos modal de guardar ente
        const dialogRef = this.dialog.open(GuardarEntesComponent, {
            width: '50%',
            // height: '80%',
            disableClose: true,
            data: new EntesModel(),

        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.obtenerEntes();
            }

        });
    }

    filterDatatable(value): void {
        // Filtramos tabla
        if (value.target.value === '') {
            this.entes = this.entesTemp;
        } else {
            const val = value.target.value.toLowerCase();
            const temp = this.entes.filter((d) => d.cDescripcionEnte.toLowerCase().indexOf(val) !== -1 || !val );
            this.entes = temp;
        }
    }

    eliminarEnte(row: { id: string; }): void {
        // Eliminamos ente
        Swal.fire({
            title: '¿Está seguro que desea eliminar este ente?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Si',
            cancelButtonText: 'No'
        }).then((result) => {
            if (result.value) {

                // realizamos delete
                this.enteService.eliminarEnte(row.id).subscribe((resp: any) => {
                    Swal.fire('Eliminado', 'El ente ha sido eliminado.', 'success');
                    this.obtenerEntes();
                }, err => {
                    this.cargando = false;
                    Swal.fire(
                        'Error',
                        'Ocurrió un error al eliminar el ente.' + err,
                        'error'
                    );
                });

            }
        });
    }
}
