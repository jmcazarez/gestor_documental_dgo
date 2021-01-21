import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
//import { GuardarlibroDeActasComponent } from './guardar-libro-de-actas/guardar-libro-de-actas.component';
import { MenuService } from 'services/menu.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
import { PrestamosDeDocumentosService } from 'services/prestamo-de-documentos.service';
import { LibroDeActasModel } from 'models/libro-de-actas.models';

@Component({
  selector: 'app-tablero-de-prestamos-de-documentos',
  templateUrl: './tablero-de-prestamos-de-documentos.component.html',
  styleUrls: ['./tablero-de-prestamos-de-documentos.component.scss'],
  providers: [DatePipe]
})

export class TableroDePrestamosDeDocumentosComponent implements OnInit {
    valueBuscador: string;
    loadingIndicator: boolean;
    reorderable: boolean;
    cargando: boolean;
    prestamoDocumentos = [];
    prestamoDocumentosTemp = [];
    optAgregar: boolean;
    optConsultar: boolean;
    optEditar: boolean;
    optEliminar: boolean;

    constructor(
        private spinner: NgxSpinnerService,
        private datePipe: DatePipe,
        public dialog: MatDialog,
        private prestamosDeDocumentosService: PrestamosDeDocumentosService,
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
        const prestamosTemp: any[] = [];

        // Obtenemos los iniciativas
        this.prestamosDeDocumentosService.obtenerPrestamosDeDocumentos().subscribe((resp: any) => {

            // Buscamos permisos
            const opciones = this.menuService.opcionesPerfil.find((opcion: { cUrl: string; }) => opcion.cUrl === 'tablero-de-libro-de-actas');

            this.optAgregar = opciones.Agregar;
            this.optEditar = opciones.Editar;
            this.optConsultar = opciones.Consultar;
            this.optEliminar = opciones.Eliminar;
            // Si tiene permisos para consultar
            if (this.optConsultar) {
                if (resp) {
                    for (const prestamos of resp) {
                        console.log(prestamos);
                        prestamosTemp.push({
                            id: prestamos.id,
                            dFechaSolicitud: prestamos.dFechaSolicitud + 'T16:00:00.000Z',
                            dFechaDevolucion: prestamos.dFechaDevolucion + 'T16:00:00.000Z',
                            dFechaSolicitudT: this.datePipe.transform(prestamos.dFechaSolicitud, 'dd-MM-yyyy'),
                            dFechaDevolucionT: this.datePipe.transform(prestamos.dFechaDevolucion, 'dd-MM-yyyy'),
                            cSolicitante: prestamos.cSolicitante,
                            cTipoPrestamo: prestamos.cTipoPrestamo,
                            cTipoExpediente: prestamos.cTipoExpediente,
                            cIdExpediente: prestamos.cIdExpediente,
                            hora: prestamos.hora,
                            horaDev: prestamos.horaDev,
                            bActivo: prestamos.bActivo,
                        });
                    }
                }
                this.prestamoDocumentos = prestamosTemp;
                this.prestamoDocumentosTemp = this.prestamoDocumentos;
            }
            this.loadingIndicator = false;
            this.spinner.hide();
        }, err => {
            this.loadingIndicator = false;
            this.spinner.hide();
        });
    }

    nuevoPrestamo(): void {

    }

    editarPrestamo(libro: LibroDeActasModel): void {

    }
    
    eliminarPrestamo(row): void {
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
                this.prestamosDeDocumentosService.eliminarPrestamosDeDocumentos(row).subscribe((resp: any) => {
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
        // Filtramos tabla
        if (value.target.value === '') {
            this.prestamoDocumentos = this.prestamoDocumentosTemp;
        } else {
            const val = value.target.value.toLowerCase();
            const temp = this.prestamoDocumentos.filter((d) => d.fechaDeInicio.toLowerCase().indexOf(val) !== -1 || !val ||
                d.fechaDeFin.toLowerCase().indexOf(val) !== - 1 || d.legislatura.cLegislatura.toLowerCase().indexOf(val) !== - 1);

            this.prestamoDocumentos = temp;
        }
    }

}
