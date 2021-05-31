import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TipoExpedientesModel } from 'models/tipo-expedientes.models';
import { MenuService } from 'services/menu.service';
import { TipoExpedientesService } from 'services/tipo-expedientes.service';
import Swal from 'sweetalert2';
import { GuardarTipoDeExpedientesComponent } from './guardar-tipo-de-expedientes/guardar-tipo-de-expedientes.component';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
    selector: 'app-tipo-de-expedientes',
    templateUrl: './tipo-de-expedientes.component.html',
    styleUrls: ['./tipo-de-expedientes.component.scss']
})
export class TipoDeExpedientesComponent implements OnInit {
    loadingIndicator: boolean;
    reorderable: boolean;
    cargando: boolean;
    tipoExpedientes = [];
    tipoExpedientesTemp = [];
    optAgregar: boolean;
    optConsultar: boolean;
    optEditar: boolean;
    optEliminar: boolean;
    searchText: string;
    constructor(
        private spinner: NgxSpinnerService,
        private router: Router,
        public dialog: MatDialog,
        private menuService: MenuService,
        private tipoExpedientesService: TipoExpedientesService
    ) { }

    ngOnInit(): void {
        this.obtenerTiposExpedientes();
    }


    obtenerTiposExpedientes(): void {
        this.spinner.show();
        this.loadingIndicator = true;
        // Obtenemos los documentos
        this.tipoExpedientesService.obtenerTipoExpedientes().subscribe((resp: any) => {

            // Buscamos permisos
            const opciones = this.menuService.opcionesPerfil.find((opcion: { cUrl: string; }) => opcion.cUrl === this.router.routerState.snapshot.url.replace('/', ''));
            if (opciones) {
                this.optAgregar = opciones.Agregar;
                this.optEditar = opciones.Editar;
                this.optConsultar = opciones.Consultar;
                this.optEliminar = opciones.Eliminar;
                // Si tiene permisos para consultar
                if (this.optConsultar) {
                    this.tipoExpedientes = resp;
                    this.tipoExpedientesTemp = this.tipoExpedientes;
                }
            }
            this.loadingIndicator = false;
            this.spinner.hide();
        }, err => {
            this.loadingIndicator = false;
            this.spinner.hide();
        });
    }


    nuevoExpediente(): void {
        // Abrimos modal de guardar expediente
        const dialogRef = this.dialog.open(GuardarTipoDeExpedientesComponent, {
            width: '50%',
            height: '80%',
            disableClose: true,
            data: new TipoExpedientesModel(),

        });

        dialogRef.afterClosed().subscribe(result => {
            this.searchText = '';
          
                this.obtenerTiposExpedientes();
           

        });
    }


    eliminarExpediente(row: { id: string; }): void {
        // Eliminamos tipo de expediente
        Swal.fire({
            title: '¿Está seguro que desea eliminar este tipo de expediente?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Si',
            cancelButtonText: 'No'
        }).then((result) => {
            if (result.value) {

                // realizamos delete
                this.tipoExpedientesService.eliminarTipoExpedientes(row.id).subscribe((resp: any) => {
                    Swal.fire('Eliminado', 'El tipo de expediente ha sido eliminado.', 'success');
                    this.obtenerTiposExpedientes();
                }, err => {
                    this.cargando = false;
                    Swal.fire(
                        'Error',
                        'Ocurrió un error al eliminar el tipo de expediente.' + err,
                        'error'
                    );
                });

            }
        });
    }

    editarExpediente(expediente: TipoExpedientesModel): void {
        // Abrimos modal de editar expediente
        const dialogRef = this.dialog.open(GuardarTipoDeExpedientesComponent, {
            width: '50%',
            height: '80%',
            disableClose: true,
            data: expediente,

        });

        dialogRef.afterClosed().subscribe(result => {
          
                this.searchText = '';
                this.obtenerTiposExpedientes();
          
        });
    }

    filterDatatable(value): void {
        this.tipoExpedientes = this.tipoExpedientesTemp;
        // Filtramos tabla
        if (value.target.value === '') {
            this.tipoExpedientes = this.tipoExpedientesTemp;
        } else {
            const val = value.target.value.toLowerCase();
            const temp = this.tipoExpedientes.filter((d) => d.cDescripcionTipoExpediente.toLowerCase().indexOf(val) !== -1 || !val);
            this.tipoExpedientes = temp;
        }


    }
}
