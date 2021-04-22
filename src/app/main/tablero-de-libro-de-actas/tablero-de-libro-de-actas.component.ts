import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GuardarlibroDeActasComponent } from './guardar-libro-de-actas/guardar-libro-de-actas.component';
import { MenuService } from 'services/menu.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
import { LibroDeActasService } from 'services/libro-de-actas.service';
import { LibroDeActasModel } from 'models/libro-de-actas.models';
@Component({
    selector: 'app-tablero-de-libro-de-actas',
    templateUrl: './tablero-de-libro-de-actas.component.html',
    styleUrls: ['./tablero-de-libro-de-actas.component.scss'],
    providers: [DatePipe]
})
export class TableroDeLibroDeActasComponent implements OnInit {
    valueBuscador: string;
    loadingIndicator: boolean;
    reorderable: boolean;
    cargando: boolean;
    libroDeActas = [];
    libroDeActasTemporal = [];
    optAgregar: boolean;
    optConsultar: boolean;
    optEditar: boolean;
    optEliminar: boolean;

    constructor(
        private spinner: NgxSpinnerService,
        private datePipe: DatePipe,
        public dialog: MatDialog,
        private libroDeActasService: LibroDeActasService,
        private menuService: MenuService,
    ) {
        // Obtenemos recepcion de actas
        this.obtenerLibroDeActas();

    }

    ngOnInit(): void {

    }

    obtenerLibroDeActas(): void {
        this.spinner.show();
        this.valueBuscador = '';
        this.loadingIndicator = true;
        const actasTemp: any[] = [];

        // Obtenemos los iniciativas
        this.libroDeActasService.obtenerLibrosDeActas().subscribe((resp: any) => {

            // Buscamos permisos
            const opciones = this.menuService.opcionesPerfil.find((opcion: { cUrl: string; }) => opcion.cUrl === 'tablero-de-libro-de-actas');

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
                            fechaDeInicio: ini.fechaDeInicio + 'T16:00:00.000Z',
                            fechaDeFin: ini.fechaDeFin + 'T16:00:00.000Z',
                            fechaDeInicioText: this.datePipe.transform(ini.fechaDeInicio, 'dd-MM-yyyy'),
                            fechaDeFinText: this.datePipe.transform(ini.fechaDeFin, 'dd-MM-yyyy'),
                            legislatura: ini.legislatura,
                            descripcionLegislatura,
                            estatus: ini.estatus,
                        });
                    }
                }
                this.libroDeActas = actasTemp;
                this.libroDeActasTemporal = this.libroDeActas;
            }
            this.loadingIndicator = false;
            this.spinner.hide();
        }, err => {
            this.loadingIndicator = false;
            this.spinner.hide();
        });
    }

    nuevaLibroDeActas(): void {
        // Abrimos modal de guardar libro de actas
        const dialogRef = this.dialog.open(GuardarlibroDeActasComponent, {
            width: '50%',
            height: '90%',
            disableClose: true,
            data: new LibroDeActasModel(),

        });

        dialogRef.afterClosed().subscribe(result => {
            this.obtenerLibroDeActas();
        });
    }


    editarLibroDeActas(libro: LibroDeActasModel): void {
        // Abrimos modal de guardar recepcion de actas
        const dialogRef = this.dialog.open(GuardarlibroDeActasComponent, {
            width: '60%',
            height: '80%',
            disableClose: true,
            data: libro,
        });

        dialogRef.afterClosed().subscribe(result => {
            this.obtenerLibroDeActas();
        });
    }


    eliminarLibroDeActas(row): void {
        // Eliminamos recepcion de actas
        Swal.fire({
            title: '¿Está seguro que desea eliminar el libro de actas?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Si',
            cancelButtonText: 'No'
        }).then((result) => {
            if (result.value) {

                // realizamos delete
                this.libroDeActasService.eliminarLibroDeActas(row.id).subscribe((resp: any) => {
                    Swal.fire('Eliminado', 'El libro de actas ha sido eliminado.', 'success');
                    this.obtenerLibroDeActas();
                }, err => {
                    this.cargando = false;
                    Swal.fire(
                        'Error',
                        'Ocurrió un error al eliminar el libro de actas.' + err,
                        'error'
                    );
                });

            }
        });
    }



    filterDatatable(value): void {
        this.libroDeActas = this.libroDeActasTemporal;
        // Filtramos tabla
        if (value.target.value === '') {
            this.libroDeActas = this.libroDeActasTemporal;
        } else {
            const val = value.target.value.toLowerCase();
            const temp = this.libroDeActas.filter(
                (d) =>
                    d.fechaDeInicioText.toLowerCase().indexOf(val) !== -1 ||
                    !val ||
                    d.fechaDeFinText.toLowerCase().indexOf(val) !== -1 ||
                    d.id.toLowerCase().indexOf(val) !== -1 ||
                    d.descripcionLegislatura.toLowerCase().indexOf(val) !== -1
            );

            this.libroDeActas = temp;
        }
    }

}
