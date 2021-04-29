import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GuardarRecepcionDeActasComponent } from './guardar-recepcion-de-actas/guardar-recepcion-de-actas.component';
import { RecepcionDeActasModel } from 'models/recepcion-de-actas.models';
import { MenuService } from 'services/menu.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
import { RecepcionDeActasService } from 'services/recepcion-de-actas.service';
@Component({
    selector: 'app-tablero-de-recepcion-de-actas',
    templateUrl: './tablero-de-recepcion-de-actas.component.html',
    styleUrls: ['./tablero-de-recepcion-de-actas.component.scss'],
    providers: [DatePipe]
})
export class TableroDeRecepcionDeActasComponent implements OnInit {
    valueBuscador: string;
    loadingIndicator: boolean;
    reorderable: boolean;
    cargando: boolean;
    recepcionDeActas = [];
    recepcionDeActasTemporal = [];
    optAgregar: boolean;
    optConsultar: boolean;
    optEditar: boolean;
    optEliminar: boolean;

    constructor(
        private spinner: NgxSpinnerService,
        private datePipe: DatePipe,
        private router: Router,
        public dialog: MatDialog,
        private recepcionDeActasService: RecepcionDeActasService,
        private menuService: MenuService,
        private sanitizer: DomSanitizer
    ) {
        // Obtenemos recepcion de actas
        this.obtenerRecepcionesDeActas();

    }

    ngOnInit(): void {

    }

    obtenerRecepcionesDeActas(): void {
        this.spinner.show();
        this.valueBuscador = '';
        this.loadingIndicator = true;
        const actasTemp: any[] = [];

        // Obtenemos los iniciativas
        this.recepcionDeActasService.obtenerRecepcionesDeActas().subscribe((resp: any) => {
    
            // Buscamos permisos
            const opciones = this.menuService.opcionesPerfil.find((opcion: { cUrl: string; }) => opcion.cUrl === 'tablero-de-recepción-de-actas-de-sesión');

            this.optAgregar = opciones.Agregar;
            this.optEditar = opciones.Editar;
            this.optConsultar = opciones.Consultar;
            this.optEliminar = opciones.Eliminar;
            // Si tiene permisos para consultar
            if (this.optConsultar) {
                if (resp) {
                    for (const ini of resp) {
                        let descripcionLegislatura = '';
                        if (ini.legislatura) {
                            descripcionLegislatura = ini.legislatura.cLegislatura;
                        }
                        actasTemp.push({
                            id: ini.id,
                            fechaCreacion: ini.fechaCreacion,
                            fechaCreacionText: this.datePipe.transform(ini.fechaCreacion, 'dd-MM-yyyy'),
                            fechaRecepcion: ini.fechaRecepcion,
                            legislatura: ini.legislatura,
                            descripcionLegislatura,
                            emisor: ini.emisor,
                            receptor: ini.receptor,
                            estatus: ini.estatus,
                            hora: ini.hora,
                            notas: ini.notas
                        });
                    }
                }
                this.recepcionDeActas = actasTemp;
                this.recepcionDeActasTemporal = this.recepcionDeActas;
            }
            this.loadingIndicator = false;
            this.spinner.hide();
        }, err => {
            this.loadingIndicator = false;
            this.spinner.hide();
        });
    }

    nuevaRecepcionDeActas(): void {
        // Abrimos modal de guardar recepcion de actas
        const dialogRef = this.dialog.open(GuardarRecepcionDeActasComponent, {
            width: '50%',
            height: '90%',
            disableClose: true,
            data: new RecepcionDeActasModel(),

        });

        dialogRef.afterClosed().subscribe(result => {
            this.obtenerRecepcionesDeActas();
        });
    }


    editarRecepcionDeActas(recepcion: RecepcionDeActasModel): void {
        // Abrimos modal de guardar recepcion de actas
        const dialogRef = this.dialog.open(GuardarRecepcionDeActasComponent, {
            width: '60%',
            height: '80%',
            disableClose: true,
            data: recepcion,
        });

        dialogRef.afterClosed().subscribe(result => {
            this.obtenerRecepcionesDeActas();
        });
    }


    eliminarRecepcionDeActas(row): void {
        // Eliminamos recepcion de actas
        Swal.fire({
            title: '¿Está seguro que desea eliminar recepción de actas?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Si',
            cancelButtonText: 'No'
        }).then((result) => {
            if (result.value) {

                // realizamos delete
                this.recepcionDeActasService.eliminarRecepcionDeActa(row).subscribe((resp: any) => {
                    Swal.fire('Eliminado', 'La recepción de actas ha sido eliminado.', 'success');
                    this.obtenerRecepcionesDeActas();
                }, err => {
                    this.cargando = false;
                    Swal.fire(
                        'Error',
                        'Ocurrió un error al eliminar la recepción de actas.' + err,
                        'error'
                    );
                });

            }
        });
    }



    filterDatatable(value): void {
        this.recepcionDeActas = this.recepcionDeActasTemporal;
        // Filtramos tabla
        if (value.target.value === '') {
            this.recepcionDeActas = this.recepcionDeActasTemporal;
        } else {
            const val = value.target.value.toLowerCase();
            const temp = this.recepcionDeActas.filter((d) => d.fechaCreacionText.toLowerCase().indexOf(val) !== -1 || !val ||
                d.hora.toLowerCase().indexOf(val) !== - 1 || d.descripcionLegislatura.toLowerCase().indexOf(val) !== - 1 ||
                d.estatus.toLowerCase().indexOf(val) !== - 1 ||
                d.id.toLowerCase().indexOf(val) !== - 1);

            this.recepcionDeActas = temp;
        }
    }

}
