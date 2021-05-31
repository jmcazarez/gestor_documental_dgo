import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { EntesModel } from 'models/entes.models';
import { EntesService } from 'services/entes.service';
import { MenuService } from 'services/menu.service';
import Swal from 'sweetalert2';
import { GuardarSesionesComponent } from './guardar-sesiones/guardar-sesiones.component';
import { ActasSesionsService } from 'services/actas-sesions.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { DatePipe } from '@angular/common';

export interface Estado {
    id: string;
    descripcion: string;
}

@Component({
    selector: 'app-sesiones',
    templateUrl: './sesiones.component.html',
    styleUrls: ['./sesiones.component.scss'],
    providers: [DatePipe]
})
export class SesionesComponent implements OnInit {
    loadingIndicator: boolean;
    reorderable: boolean;
    cargando: boolean;
    sesiones = [];
    sesionesTemp = [];
    optAgregar: boolean;
    optConsultar: boolean;
    optEditar: boolean;
    optEliminar: boolean;
    tipoSesion: Estado[] = []
    valorBusqueda = '';
    constructor(
        private datePipe: DatePipe,
        private spinner: NgxSpinnerService,
        public dialog: MatDialog,
        private menuService: MenuService,
        private sesionesService: ActasSesionsService) { }

    ngOnInit(): void {

        this.obtenerSesiones();
    }

    obtenerSesiones(): void {
        this.spinner.show();
        let descripcionLegislatura = ''
        this.loadingIndicator = true;
        const sesionesTemp: any[] = [];
        // Obtenemos las sesiones
        this.sesionesService.obtenerActasSesions().subscribe((resp: any) => {

            // Buscamos permisos
            const opciones = this.menuService.opcionesPerfil.find((opcion: { cUrl: string; }) => opcion.cUrl === 'tablero-de-sesiones');
            this.optAgregar = opciones.Agregar;
            this.optEditar = opciones.Editar;
            this.optConsultar = opciones.Consultar;
            this.optEliminar = opciones.Eliminar;
            // Si tiene permisos para consultar
            if (this.optConsultar) {
                for (const sesion of resp) {
                  
                    descripcionLegislatura = '';
                    if (sesion.legislatura) {
                        descripcionLegislatura = sesion.legislatura.cLegislatura
                    }
                    sesionesTemp.push({
                        id: sesion.id,
                        tipoSesion: sesion.tipoSesion,
                        fechaSesion: sesion.fechaSesion,
                        fechaSesionView: this.datePipe.transform(sesion.fechaSesion, 'dd/MM/yyyy'),
                        horaSesion: sesion.horaSesion.toLowerCase().replace(':00.000',''),
                        horaSesionView: sesion.horaSesion.toLowerCase().replace(':00.000',''),
                        legislatura: sesion.legislatura,
                        descripcionLegislatura: descripcionLegislatura,
                        iniciativas: sesion.iniciativas,
                        bActivo: sesion.bActivo,
                        ordenDelDia: sesion.ordenDelDia,
                        listaDeAsistencia: sesion.listaDeAsistencia,
                        actasSesion: sesion.actasSesion
                    });
                    ;
                }
                this.sesiones = sesionesTemp;
                this.sesionesTemp = this.sesiones;
            }
            this.loadingIndicator = false;
            this.spinner.hide();
        }, err => {
            this.spinner.hide();
            this.loadingIndicator = false;
            Swal.fire(
                'Error',
                'Ocurrió un error al obtener las sesiones.' + err,
                'error'
            );
        });
    }

    editarSesion(ente: EntesModel): void {

        // Abrimos modal de guardar perfil
        const dialogRef = this.dialog.open(GuardarSesionesComponent, {
            width: '60%',
            // height: '80%',
            disableClose: true,
            data: ente,
        });

        dialogRef.afterClosed().subscribe(result => {
            this.valorBusqueda = '';
            if (result) {                
                this.obtenerSesiones();
            }else{
                this.sesiones = this.sesionesTemp;
            }

        });
    }

    nuevaSesion(): void {
        // Abrimos modal de guardar ente
        const dialogRef = this.dialog.open(GuardarSesionesComponent, {
            width: '50%',
            // height: '80%',
            disableClose: true,
            data: new EntesModel(),

        });

        dialogRef.afterClosed().subscribe(result => {
            this.valorBusqueda = '';
            if (result) {               
                this.obtenerSesiones();
            }else{
                this.sesiones = this.sesionesTemp;
            }

        });
    }

    filterDatatable(value): void {
        this.sesiones = this.sesionesTemp;
        // Filtramos tabla
        if (value.target.value === '') {
            this.sesiones = this.sesionesTemp;
        } else {
            const val = value.target.value.toLowerCase();
            const temp = this.sesiones.filter((d) => d.tipoSesion.toLowerCase().indexOf(val) !== -1 || !val || d.fechaSesionView.toLowerCase().indexOf(val) !== -1
                || d.horaSesion.toLowerCase().indexOf(val) !== -1 || d.descripcionLegislatura.toLowerCase().indexOf(val) !== -1 || d.id.toLowerCase().indexOf(val) !== -1);
            this.sesiones = temp;
        }
    }

    eliminarSesion(row: { id: string; }): void {
        // Eliminamos sesion
        Swal.fire({
            title: '¿Está seguro que desea eliminar esta sesión?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Si',
            cancelButtonText: 'No'
        }).then((result) => {
            if (result.value) {

                // realizamos delete
                this.sesionesService.eliminarActasSesions(row.id).subscribe((resp: any) => {
                    Swal.fire('Eliminado', 'La sesión ha sido eliminado.', 'success');
                    this.valorBusqueda = '';
                    this.obtenerSesiones();
                }, err => {
                    this.cargando = false;
                    Swal.fire(
                        'Error',
                        'Ocurrió un error al eliminar la sesión.' + err,
                        'error'
                    );
                });

            }
        });
    }
}
