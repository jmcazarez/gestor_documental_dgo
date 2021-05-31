import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { PartidosPoliticosModel } from 'models/partidos-politicos.models';
import { MenuService } from 'services/menu.service';
import { PartidosPoliticosService } from 'services/partidos-politicos.service';
import Swal from 'sweetalert2';
import { GuardarPartidosPoliticosComponent } from './guardar-partidos-politicos/guardar-partidos-politicos.component';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
    selector: 'app-partidos-politicos',
    templateUrl: './partidos-politicos.component.html',
    styleUrls: ['./partidos-politicos.component.scss']
})
export class PartidosPoliticosComponent implements OnInit {
    filterName: string;
    loadingIndicator: boolean;
    reorderable: boolean;
    cargando: boolean;
    partidosPoliticos = [];
    partidosPoliticosTemp = [];
    optAgregar: boolean;
    optConsultar: boolean;
    optEditar: boolean;
    optEliminar: boolean;
    constructor(private router: Router,
        public dialog: MatDialog,
        private menuService: MenuService,
        private spinner: NgxSpinnerService,
        private partidoPoliticoService: PartidosPoliticosService) { }

    ngOnInit(): void {
        this.obtenerPartidosPoliticos();
    }

    obtenerPartidosPoliticos(): void {
        this.spinner.show();
        this.filterName = '';
        this.loadingIndicator = true;
        // Obtenemos los documentos
        this.partidoPoliticoService.obtenerPartidoPolitico().subscribe((resp: any) => {

            // Buscamos permisos
            const opciones = this.menuService.opcionesPerfil.find((opcion: { cUrl: string; }) => opcion.cUrl === 'partidos-políticos');

            this.optAgregar = opciones.Agregar;
            this.optEditar = opciones.Editar;
            this.optConsultar = opciones.Consultar;
            this.optEliminar = opciones.Eliminar;
            // Si tiene permisos para consultar
            if (this.optConsultar) {
                this.partidosPoliticos = resp;
                this.partidosPoliticosTemp = this.partidosPoliticos;
            }
            this.loadingIndicator = false;
            this.spinner.hide();
        }, err => {
            this.loadingIndicator = false;
            this.spinner.hide();
        });
    }

    editarPartidoPolitico(partido: PartidosPoliticosModel): void {

        // Abrimos modal de guardar perfil
        const dialogRef = this.dialog.open(GuardarPartidosPoliticosComponent, {
            width: '60%',
            // height: '80%',
            disableClose: true,
            data: partido,
        });

        dialogRef.afterClosed().subscribe(result => {
            this.obtenerPartidosPoliticos();
        });
    }

    nuevoPartidoPolitico(): void {
        // Abrimos modal de guardar partido politico
        const dialogRef = this.dialog.open(GuardarPartidosPoliticosComponent, {
            width: '50%',
            // height: '80%',
            disableClose: true,
            data: new PartidosPoliticosModel(),

        });

        dialogRef.afterClosed().subscribe(result => {
            this.obtenerPartidosPoliticos();

        });
    }

    filterDatatable(value): void {
        this.partidosPoliticos = this.partidosPoliticosTemp;
        // Filtramos tabla
        if (value.target.value === '') {
            this.partidosPoliticos = this.partidosPoliticosTemp;
        } else {
            const val = value.target.value.toLowerCase();
            const temp = this.partidosPoliticos.filter((d) => d.cPartidoPolitico.toLowerCase().indexOf(val) !== -1 || !val ||
                d.cNomenclatura.toLowerCase().indexOf(val) !== - 1);
            this.partidosPoliticos = temp;
        }
    }

    eliminarPartidoPolitico(row: { id: string; }): void {
        // Eliminamos partido politico
        Swal.fire({
            title: '¿Está seguro que desea eliminar este partido político?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Si',
            cancelButtonText: 'No'
        }).then((result) => {
            if (result.value) {
                // realizamos delete
                this.partidoPoliticoService.eliminarPartidoPolitico(row.id).subscribe((resp: any) => {
                    Swal.fire('Eliminado', 'El partido político ha sido eliminado.', 'success');
                    this.obtenerPartidosPoliticos();
                }, err => {
                    this.cargando = false;
                    Swal.fire(
                        'Error',
                        'Ocurrió un error al eliminar el partido político.' + err,
                        'error'
                    );
                });

            }
        });
    }

}
