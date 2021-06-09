import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TipoExpedientesModel } from 'models/tipo-expedientes.models';
import { MenuService } from 'services/menu.service';
import { TipoExpedientesService } from 'services/tipo-expedientes.service';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
    selector: 'app-tipo-de-iniciativas-pendientes-por-firmar',
    templateUrl: './tipo-de-iniciativas-pendientes-por-firmar.component.html',
    styleUrls: ['./tipo-de-iniciativas-pendientes-por-firmar.component.scss']
})
export class IniciativasPendientesPorFirmarComponent implements OnInit {
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
