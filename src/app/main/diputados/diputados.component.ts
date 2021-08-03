import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DiputadosModel } from 'models/diputados.models';
import { MenuService } from 'services/menu.service';
import { DiputadosService } from 'services/diputados.service';
import Swal from 'sweetalert2';
import { GuardarDiputadosComponent } from './guardar-diputados/guardar-diputados.component';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
    selector: 'app-diputados',
    templateUrl: './diputados.component.html',
    styleUrls: ['./diputados.component.scss']
})
export class DiputadosComponent implements OnInit {
    filterName: string;
    loadingIndicator: boolean;
    reorderable: boolean;
    cargando: boolean;
    Diputados = [];
    DiputadosTemp = [];
    optAgregar: boolean;
    optConsultar: boolean;
    optEditar: boolean;
    optEliminar: boolean;
    constructor(private router: Router,
        public dialog: MatDialog,
        private menuService: MenuService,
        private spinner: NgxSpinnerService,
        private diputadosService: DiputadosService) { }

    ngOnInit(): void {
        this.obtenerDiputados();
    }

    obtenerDiputados(): void {
        this.spinner.show();
        this.filterName = '';
        this.loadingIndicator = true;
        let diputados = [];
        let legislatura: string;
        // Obtenemos los documentos
        this.diputadosService.obtenerDiputados().subscribe((resp: any) => {

            // Buscamos permisos
            const opciones = this.menuService.opcionesPerfil.find((opcion: { cUrl: string; }) => opcion.cUrl === 'diputados');

            this.optAgregar = opciones.Agregar;
            this.optEditar = opciones.Editar;
            this.optConsultar = opciones.Consultar;
            this.optEliminar = opciones.Eliminar;
            // Si tiene permisos para consultar
            if (this.optConsultar) {
                for(const diputado of resp){
                    if(diputado.legislatura){
                        legislatura = diputado.legislatura.cLegislatura;
                    } else {
                        legislatura = 'N/A';
                    }
                    diputados.push({
                        id: diputado.id,
                        nombre: diputado.nombre,
                        distrito: diputado.distrito,
                        partidos_politico: diputado.partidos_politico,
                        legislatura: diputado.legislatura,
                        legislaturaText: legislatura,
                        telefono: diputado.telefono,
                        email: diputado.email,
                        activo: diputado.activo,
                        detalle_participantes_mesa_directiva: diputado.detalle_participantes_mesa_directiva,
                        detalle_participantes_mesa_directivas: diputado.detalle_participantes_mesa_directivas,
                        detalle_participantes_comisions: diputado.detalle_participantes_comisions
                    });
                }
                this.Diputados = diputados;
                this.DiputadosTemp = this.Diputados;
            }
            this.loadingIndicator = false;
            this.spinner.hide();
        }, err => {
            this.loadingIndicator = false;
            this.spinner.hide();
        });
    }

    editarDiputados(partido: DiputadosModel): void {

        // Abrimos modal de guardar perfil
        const dialogRef = this.dialog.open(GuardarDiputadosComponent, {
            width: '60%',
            height: '80%',
            disableClose: true,
            data: partido,
        });

        dialogRef.afterClosed().subscribe(result => {
            this.obtenerDiputados();
        });
    }

    nuevoDiputados(): void {
        // Abrimos modal de guardar partido politico
        const dialogRef = this.dialog.open(GuardarDiputadosComponent, {
            width: '50%',
            height: '80%',
            disableClose: true,
            data: new DiputadosModel(),

        });

        dialogRef.afterClosed().subscribe(result => {
            this.obtenerDiputados();

        });
    }

    filterDatatable(value): void {
        this.Diputados = this.DiputadosTemp;
        // Filtramos tabla
        if (value.target.value === '') {
            this.Diputados = this.DiputadosTemp;
        } else {
            const val = value.target.value.toLowerCase();
            const temp = this.Diputados.filter((d) => d.nombre.toLowerCase().indexOf(val) !== -1 || !val ||
                d.distrito.descripcion.toLowerCase().indexOf(val) !== -1 || d.partidos_politico.cPartidoPolitico.toLowerCase().indexOf(val) !== -1 ||
                d.legislaturaText.toLowerCase().indexOf(val) !== -1 );
            this.Diputados = temp;
        }
    }

    eliminarDiputados(row: { id: string; }): void {
        // Eliminamos partido politico
        Swal.fire({
            title: '¿Está seguro que desea eliminar este diputado?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Si',
            cancelButtonText: 'No'
        }).then((result) => {
            if (result.value) {
                // realizamos delete
                this.diputadosService.eliminarDiputados(row.id).subscribe((resp: any) => {
                    Swal.fire('Eliminado', 'El diputado ha sido eliminado.', 'success');
                    this.obtenerDiputados();
                }, err => {
                    this.cargando = false;
                    Swal.fire(
                        'Error',
                        'Ocurrió un error al eliminar el diputado.' + err,
                        'error'
                    );
                });

            }
        });
    }
}
