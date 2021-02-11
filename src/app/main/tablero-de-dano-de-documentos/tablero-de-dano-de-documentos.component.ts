import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MenuService } from 'services/menu.service';
import { DatePipe } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { PrestamosDeDocumentosService } from 'services/prestamo-de-documentos.service';
import * as moment from 'moment';

@Component({
    selector: 'app-tablero-de-dano-de-documentos',
    templateUrl: './tablero-de-dano-de-documentos.component.html',
    styleUrls: ['./tablero-de-dano-de-documentos.component.scss'],
    providers: [DatePipe]
})

export class TableroDeDanoDeDocumentosComponent implements OnInit {
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
        // Obtenemos prestamos de documentos
        this.obtenerPrestamosDeDocumentos();

    }

    ngOnInit(): void {

    }

    obtenerPrestamosDeDocumentos(): void {
        this.spinner.show();
        this.valueBuscador = '';
        this.loadingIndicator = true;
        const prestamosTemp: any[] = [];

        // Obtenemos los permisos
        this.prestamosDeDocumentosService.obtenerPrestamosDeDocumentos().subscribe((resp: any) => {
            // Buscamos permisos
            const opciones = this.menuService.opcionesPerfil.find((opcion: { cUrl: string; }) => opcion.cUrl === 'tablero-de-daño-de-documentos');

            this.optAgregar = opciones.Agregar;
            this.optEditar = opciones.Editar;
            this.optConsultar = opciones.Consultar;
            this.optEliminar = opciones.Eliminar;
            // Si tiene permisos para consultar 
            if (this.optConsultar) {
                if (resp) {
                    for (const prestamos of resp) {         
                        if (prestamos.cTipoDanio === 'Perdida de documentos' || prestamos.cTipoDanio === 'Deterioro de documentos') {
                            prestamosTemp.push({
                                id: prestamos.id,
                                dFechaSolicitud: prestamos.dFechaSolicitud,
                                dFechaDevolucion: prestamos.dFechaDevolucion,
                                dFechaDocEntregado: prestamos.dFechaDocEntregado,
                                dFechaSolicitudT: this.datePipe.transform(prestamos.dFechaSolicitud, 'dd-MM-yyyy'),
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

    filterDatatable(value): void {
        // Filtramos tabla
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
                d.cIdExpediente.toLowerCase().indexOf(val) !== -1||
                d.cTipoDanio.toLowerCase().indexOf(val) !== -1);

            this.prestamoDocumentos = temp;
        }
    }

}

