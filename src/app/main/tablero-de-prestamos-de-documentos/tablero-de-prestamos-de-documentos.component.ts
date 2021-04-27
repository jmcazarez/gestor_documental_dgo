
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GuardarPrestamoComponent } from './guardar-prestamo/guardar-prestamo.component';
import { MenuService } from 'services/menu.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
import { PrestamosDeDocumentosService } from 'services/prestamo-de-documentos.service';
import { PrestamoDeDocumentosModels } from 'models/prestamo-de-documentos.models';
import * as moment from 'moment';

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
        this.obtenerPrestamosDeDocumentos();

    }

    ngOnInit(): void {

    }

    obtenerPrestamosDeDocumentos(): void {
        this.spinner.show();
        this.valueBuscador = '';
        this.loadingIndicator = true;
        const prestamosTemp: any[] = [];

        // Obtenemos los iniciativas
        this.prestamosDeDocumentosService.obtenerPrestamosDeDocumentos().subscribe((resp: any) => {

            // Buscamos permisos
            const opciones = this.menuService.opcionesPerfil.find((opcion: { cUrl: string; }) => opcion.cUrl === 'tablero-de-prestamos-de-documentos');

            this.optAgregar = opciones.Agregar;
            this.optEditar = opciones.Editar;
            this.optConsultar = opciones.Consultar;
            this.optEliminar = opciones.Eliminar;
            // Si tiene permisos para consultar
            if (this.optConsultar) {
                if (resp) {
                    for (const prestamos of resp) {
                        prestamosTemp.push({
                            id: prestamos.id,
                            dFechaSolicitud: prestamos.dFechaSolicitud,
                            dFechaDevolucion: prestamos.dFechaDevolucion,
                            dFechaDocEntregado: prestamos.dFechaDocEntregado,
                            dFechaSolicitudT: moment(prestamos.dFechaSolicitud).format('DD-MM-YYYY'),
                            dFechaDevolucionT: this.datePipe.transform(prestamos.dFechaDevolucion, 'dd-MM-yyyy'),
                            dFechaDocEntregadoT: this.datePipe.transform(prestamos.dFechaDevolucion, 'dd-MM-yyyy'),
                            cSolicitante: prestamos.cSolicitante,
                            cTipoPrestamo: prestamos.cTipoPrestamo,
                            cTipoExpediente: prestamos.cTipoExpediente,
                            cIdExpediente: prestamos.cIdExpediente,
                            tHoraSolicitud: moment(prestamos.tHoraSolicitud, 'h:mm').format('HH:mm'),
                            tHoraDevolucion: moment(prestamos.tHoraDevolucion, 'h:mm').format('HH:mm'),
                            tHoraDocEntregado: moment(prestamos.tHoraDocEntregado, 'h:mm').format('HH:mm'),
                            cNotas: prestamos.cNotas,
                            cEstatus: prestamos.cEstatus,
                            cTipoDanio: prestamos.cTipoDanio
                        });
                    }
                }
                //console.log(prestamosTemp);
                this.prestamoDocumentos = prestamosTemp;
                this.prestamoDocumentosTemp = this.prestamoDocumentos;
                console.log( this.prestamoDocumentos);
            }
            this.loadingIndicator = false;
            this.spinner.hide();
        }, err => {
            this.loadingIndicator = false;
            this.spinner.hide();
        });
    }

    nuevoPrestamo(): void {
        // Abrimos modal de guardar recepcion de actas
        const dialogRef = this.dialog.open(GuardarPrestamoComponent, {
            width: '50%',
            height: '90%',
            disableClose: true,
            data: new PrestamoDeDocumentosModels(),

        });

        dialogRef.afterClosed().subscribe(result => {
            this.obtenerPrestamosDeDocumentos();
            this.limpiar();
        });
    }

    editarPrestamo(prestamo: PrestamoDeDocumentosModels): void {
        // Abrimos modal de guardar recepcion de actas
        const dialogRef = this.dialog.open(GuardarPrestamoComponent, {
            width: '60%',
            height: '80%',
            disableClose: true,
            data: prestamo,
        });

        dialogRef.afterClosed().subscribe(result => {
            this.obtenerPrestamosDeDocumentos();
            this.limpiar();
        });
    }
    
    eliminarPrestamo(row): void {
        // Eliminamos recepcion de actas
        Swal.fire({
            title: '¿Está seguro que desea eliminar el prestamo de documentos?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Si',
            cancelButtonText: 'No'
        }).then((result) => {
            if (result.value) {

                // realizamos delete
                this.prestamosDeDocumentosService.eliminarPrestamosDeDocumentos(row).subscribe((resp: any) => {
                    Swal.fire('Eliminado', 'El prestamo ha sido eliminado.', 'success');
                    this.obtenerPrestamosDeDocumentos();
                    this.limpiar();
                }, err => {
                    this.cargando = false;
                    Swal.fire(
                        'Error',
                        'Ocurrió un error al eliminar el prestamo de documentos.' + err,
                        'error'
                    );
                });

            }
        });
    }

    filterDatatable(value): void {
        // Filtramos tabla
        this.prestamoDocumentos = this.prestamoDocumentosTemp;
        if (value.target.value === '') {
            this.prestamoDocumentos = this.prestamoDocumentosTemp;
        } else {
            const val = value.target.value.toLowerCase();
            const temp = this.prestamoDocumentos.filter((d) => d.dFechaSolicitudT.toLowerCase().indexOf(val) !== -1 || !val || 
            d.dFechaDevolucionT.toLowerCase().indexOf(val) !== -1 || !val || 
            d.cSolicitante.toLowerCase().indexOf(val) !== -1 || !val || 
            d.cTipoPrestamo.toLowerCase().indexOf(val) !== -1 || !val || 
            d.cTipoExpediente.toLowerCase().indexOf(val) !== -1 || !val || 
            d.tHoraSolicitud.toLowerCase().indexOf(val) !== -1 || !val || 
            d.tHoraDevolucion.toLowerCase().indexOf(val) !== -1 || !val || 
            d.cEstatus.toLowerCase().indexOf(val) !== -1 || !val || 
            d.cIdExpediente.toLowerCase().indexOf(val) !== -1 || 
            d.id.toLowerCase().indexOf(val) !== -1);

            this.prestamoDocumentos = temp;
        }
    }

    limpiar(): void{
        //Limpiamos buscador
        this.valueBuscador = '';
        //console.log('buscador' + this.valueBuscador);
    }
}

