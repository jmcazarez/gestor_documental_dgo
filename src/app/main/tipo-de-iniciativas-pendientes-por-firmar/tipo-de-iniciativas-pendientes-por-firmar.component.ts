import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TipoExpedientesModel } from 'models/tipo-expedientes.models';
import { MenuService } from 'services/menu.service';
import { TipoExpedientesService } from 'services/tipo-expedientes.service';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
import { AutorizarService } from 'services/autorizar.service';
import { UsuarioLoginService } from 'services/usuario-login.service';
@Component({
    selector: 'app-tipo-de-iniciativas-pendientes-por-firmar',
    templateUrl: './tipo-de-iniciativas-pendientes-por-firmar.component.html',
    styleUrls: ['./tipo-de-iniciativas-pendientes-por-firmar.component.scss']
})
export class IniciativasPendientesPorFirmarComponent implements OnInit {
    loadingIndicator: boolean;
    reorderable: boolean;
    cargando: boolean;
    documentosPendientes = [];
    documentosPendientesTemp = [];

    optAgregar: boolean;
    optConsultar: boolean;
    optEditar: boolean;
    optEliminar: boolean;
    searchText: string;
    usuario: any;
    constructor(
        private spinner: NgxSpinnerService,
        private router: Router,
        public dialog: MatDialog,
        private usuarioLoginService: UsuarioLoginService,
        private menuService: MenuService,
        private autorizarService: AutorizarService,
        private tipoExpedientesService: TipoExpedientesService
    ) { }

    async ngOnInit(): Promise<void> {
        this.usuario = await this.usuarioLoginService.obtenerUsuario();
        this.documentosPendientes = await this.obtenerAutorizacionPorLegislatura();
        this.documentosPendientesTemp = this.documentosPendientes
    }


    async obtenerAutorizacionPorLegislatura(): Promise<[]> {

        console.log(this.usuario[0].data.empleado);
        return new Promise((resolve) => {
            {
                this.autorizarService.obtenerAutorizacionesPorEmpleado(this.usuario[0].data.empleado.id).subscribe(
                    (resp: any) => {
                       
                        resolve(resp..filter(
                            (d) => d["estatusAutorizacion"] <= 2
                        ));
                    },
                    (err) => {
                        Swal.fire(
                            "Error",
                            "Ocurrió un error al obtener las autorizaciones por legislatura." +
                            err,
                            "error"
                        );
                        resolve(err);
                    }
                );
            }
        });
    }



    filterDatatable(value): void {
        this.documentosPendientes = this.documentosPendientesTemp;
        // Filtramos tabla
        if (value.target.value === '') {
            this.documentosPendientes = this.documentosPendientesTemp;
        } else {
            const val = value.target.value.toLowerCase();
            const temp = this.documentosPendientes.filter((d) => d.cNombreDocumento.toLowerCase().indexOf(val) !== -1 || !val);
            this.documentosPendientes = temp;
        }


    }
}
