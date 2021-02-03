import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GuardarDocumentosComponent } from '../tablero-de-documentos/guardar-documentos/guardar-documentos.component';
import { DocumentosModel } from 'models/documento.models';
import { DocumentosService } from 'services/documentos.service';
import { TrazabilidadService } from 'services/trazabilidad.service';
import { MenuService } from 'services/menu.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import Swal from 'sweetalert2';
import { ClasficacionDeDocumentosComponent } from '../tablero-de-documentos/clasficacion-de-documentos/clasficacion-de-documentos.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuariosService } from 'services/usuarios.service';
import { TipoExpedientesService } from 'services/tipo-expedientes.service';
import { fuseAnimations } from '@fuse/animations';

import { environment } from '../../../environments/environment';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
    selector: 'app-dashboard-de-indicadores',
    templateUrl: './dashboard-de-indicadores.component.html',
    styleUrls: ['./dashboard-de-indicadores.component.scss'],
    providers: [DatePipe],

})
export class DashboardDeIndicadoresComponent implements OnInit {
    documentoBusqueda: string;
    vigenteBusqueda: string;
    fileUrl: any;
    loadingIndicator: boolean;
    reorderable: boolean;
    cargando: boolean;
    documentos = [];
    documentosTemporal = [];
    optAgregar: boolean;
    optConsultar: boolean;
    optEditar: boolean;
    optEliminar: boolean;
    fileBase64: any;
    isLinear = false;
    firstFormGroup: FormGroup;
    secondFormGroup: FormGroup;
    arrInformacion = [];
    selectedInformacion = '';
    maxDate = new Date();
    fechaIni = '';
    fechaFin = '';
    fechaModificacion = '';
    arrTipoDocumentos = [];
    arrExpediente = [];
    selectTipoDocumento: '';
    selectedEntes: '';
    selectedExpediente: '';
    selectedFolioExpediente: '';
    arrMetacatalogos: any;

    arrDocumentosIngresadosAyer: any[];
    arrCreacionGraficaAyer = [];
    arrConsultaGraficaAyer = [];
    arrEliminadosGraficaAyer = [];
    docDisponiblesAyer: number;
    docCargadosAyer: number;
    docConsultadosAyer: number;
    docEliminadosAyer: number;
    docExpedientesAyer: number;

    arrDocumentosIngresados7dias: any[];
    arrCreacionGrafica7dias = [];
    arrConsultaGrafica7dias = [];
    arrEliminadosGrafica7dias = [];
    docDisponibles7dias: number;
    docCargados7dias: number;
    docConsultados7dias: number;
    docEliminados7dias: number;
    docExpedientes7dias: number;

    arrDocumentosIngresadosMes: any[];
    arrCreacionGraficaMes = [];
    arrConsultaGraficaMes = [];
    arrEliminadosGraficaMes = [];
    docDisponiblesMes: number;
    docCargadosMes: number;
    docConsultadosMes: number;
    docEliminadosMes: number;
    docExpedientesMes: number;

    arrDocumentosIngresadosFechas: any[];
    arrCreacionGraficaFechas = [];
    arrConsultaGraficaFechas = [];
    arrEliminadosGraficaFechas = [];
    docDisponiblesFechas: number;
    docCargadosFechas: number;
    docConsultadosFechas: number;
    docEliminadosFechas: number;
    docExpedientesFechas: number;

    arrDiasMes = [];
    arrDiasRango = [];
    widget1SelectedYear = '2016';
    widget5SelectedDay = 'today';
    widgets: any;
    grafica: any;
    grafica7dias: any;
    graficaMes: any;
    graficaFechas: any;
    constructor(private _formBuilder: FormBuilder, private datePipe: DatePipe,
        private router: Router,
        public dialog: MatDialog,
        private spinner: NgxSpinnerService,
        private menuService: MenuService,
        private trazabilidad: TrazabilidadService,
        private tipoExpedientesService: TipoExpedientesService,
        private sanitizer: DomSanitizer) {
        // Obtenemos documentos
        // this.obtenerDocumentos();
        this.configuragraficas();
        this.configurarGraficaFechas();
        // this.obtenerMovimientos();
        this.widgets = environment.widgets;
        this._registerCustomChartJSPlugin();
    }


    private _registerCustomChartJSPlugin(): void {
        (window as any).Chart.plugins.register({
            afterDatasetsDraw: function (chart, easing): any {
                // Only activate the plugin if it's made available
                // in the options
                if (
                    !chart.options.plugins.xLabelsOnTop ||
                    (chart.options.plugins.xLabelsOnTop && chart.options.plugins.xLabelsOnTop.active === false)
                ) {
                    return;
                }

                // To only draw at the end of animation, check for easing === 1
                const ctx = chart.ctx;

                chart.data.datasets.forEach(function (dataset, i): any {
                    const meta = chart.getDatasetMeta(i);
                    if (!meta.hidden) {
                        meta.data.forEach(function (element, index): any {

                            // Draw the text in black, with the specified font
                            ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
                            const fontSize = 13;
                            const fontStyle = 'normal';
                            const fontFamily = 'Roboto, Helvetica Neue, Arial';
                            ctx.font = (window as any).Chart.helpers.fontString(fontSize, fontStyle, fontFamily);

                            // Just naively convert to string for now
                            const dataString = dataset.data[index].toString() + 'k';

                            // Make sure alignment settings are correct
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'middle';
                            const padding = 15;
                            const startY = 24;
                            const position = element.tooltipPosition();
                            ctx.fillText(dataString, position.x, startY);

                            ctx.save();

                            ctx.beginPath();
                            ctx.setLineDash([5, 3]);
                            ctx.moveTo(position.x, startY + padding);
                            ctx.lineTo(position.x, position.y - padding);
                            ctx.strokeStyle = 'rgba(255,255,255,0.12)';
                            ctx.stroke();

                            ctx.restore();
                        });
                    }
                });
            }
        });
    }

    ngOnInit(): void {

        this.arrDocumentosIngresados7dias = [];
        this.obtenerTiposExpedientes();
        for (const documentosAgregar of this.menuService.tipoDocumentos) {

            // Si tiene permisos de agregar estos documentos los guardamos en una array
            if (documentosAgregar.Consultar) {
                this.arrTipoDocumentos.push({
                    id: documentosAgregar.id,
                    cDescripcionTipoDocumento: documentosAgregar.cDescripcionTipoDocumento,
                    metacatalogos: documentosAgregar.metacatalogos,

                });
            }

        }
        this.arrInformacion = this.menuService.tipoInformacion;

        // Formulario reactivo
        this.firstFormGroup = this._formBuilder.group({
            firstCtrl: [''],
            documento: [''],
            vigente: [''],
            informacion: [''],
            fechaIni: [''],
            fechaFin: [''],
            tipoDocumentos: [''],
            entes: [''],
            expediente: [''],
            folioExpediente: ['']
        });
        this.secondFormGroup = this._formBuilder.group({
            secondCtrl: ['', Validators.required],
            documento: ['', Validators.required],
            fechaIni: [''],
            fechaFin: [''],
        });


        this.firstFormGroup.get('tipoDocumentos').valueChanges.subscribe(val => {
            this.arrMetacatalogos = [];
            if (val) {
                const tempMetacatalogos = this.arrTipoDocumentos.filter((d) => d.id.toLowerCase().indexOf(val.toLowerCase()) !== -1 || !val);
                if (tempMetacatalogos[0].metacatalogos) {
                    this.arrMetacatalogos = tempMetacatalogos[0].metacatalogos;
                }
                // tslint:disable-next-line: forin
            }
        });

    }


    obtenerTiposExpedientes(): void {

        this.loadingIndicator = true;
        // Obtenemos los documentos
        this.tipoExpedientesService.obtenerTipoExpedientes().subscribe((resp: any) => {

            // Buscamos permisos
            const opciones = this.menuService.opcionesPerfil.find((opcion: { cUrl: string; }) => opcion.cUrl === this.router.routerState.snapshot.url.replace('/', ''));
            this.optAgregar = opciones.Agregar;
            this.optEditar = opciones.Editar;
            this.optConsultar = opciones.Consultar;
            this.optEliminar = opciones.Eliminar;
            // Si tiene permisos para consultar
            if (this.optConsultar) {
                this.arrExpediente = resp;
            }
            this.loadingIndicator = false;
        }, err => {
            this.loadingIndicator = false;
        });
    }


    async obtenerMovimientos(): Promise<void> {
        this.docDisponiblesAyer = 0;
        this.docCargadosAyer = 0;
        this.docConsultadosAyer = 0;
        this.docEliminadosAyer = 0;
        this.docExpedientesAyer = 0;
        this.docExpedientes7dias = 0;
        this.docEliminados7dias = 0;
        this.docConsultados7dias = 0;
        this.arrCreacionGraficaAyer = [];
        this.arrCreacionGraficaMes = [];
        this.arrConsultaGraficaMes = [];
        this.arrEliminadosGraficaMes = [];
        let arrDocumentosIngresados7diasFiltro = [];
        let arrDocumentosIngresadosMesFiltro = [];
        const fecha = new Date();
        const fechaMes = fecha.getMonth() + 1;
        const fechaDia = fecha.getDate();
        const fechaAnio = fecha.getFullYear();
        const date = new Date();
        const primerDia = new Date(date.getFullYear(), date.getMonth(), 1);
        const ultimoDia = new Date(date.getFullYear(), date.getMonth() + 1, 0);

        const diaFin7Dias = this.datePipe.transform(date, 'MM-dd-yyyy');
        date.setDate(date.getDate() - 6);
        const diaIni7Dias = this.datePipe.transform(date, 'MM-dd-yyyy');
       
        let fechaInicial = new Date(diaIni7Dias);
       
        let fechaFinal = new Date(diaFin7Dias);
        let filtroReporte = '';
        if (this.vigenteBusqueda !== undefined && this.vigenteBusqueda !== '') {
            filtroReporte = 'documento.bActivo=' + this.vigenteBusqueda + '&';
        }
        if (this.selectedInformacion !== undefined && this.selectedInformacion !== '') {
            if (filtroReporte === '') {
                filtroReporte = 'documento.visibilidade.cDescripcionVisibilidad=' + this.selectedInformacion;
            } else {
                filtroReporte = filtroReporte + '&documento.visibilidade.cDescripcionVisibilidad=' + this.selectedInformacion;
            }
        }

        if (this.selectTipoDocumento !== undefined && this.selectTipoDocumento !== '') {
            if (filtroReporte === '') {
                filtroReporte = 'documento.tipo_de_documento.id=' + this.selectTipoDocumento;
            } else {
                filtroReporte = filtroReporte + '&documento.tipo_de_documento.id=' + this.selectTipoDocumento;
            }
        }

        if (this.selectedExpediente !== undefined && this.selectedExpediente !== '') {
            if (filtroReporte === '') {
                filtroReporte = 'documento.tipo_de_expediente.id=' + this.selectedExpediente;
            } else {
                filtroReporte = filtroReporte + '&documento.tipo_de_expediente.id=' + this.selectedExpediente;
            }
        }


        if (filtroReporte === '') {
            // tslint:disable-next-line: max-line-length
            filtroReporte = 'createdAt_gte=' + fechaAnio + '-' + ("0000" + fechaMes).slice(-2) + '-' + ('0000' + primerDia.getDate()).slice(-2) + 'T01:00:00.000Z&createdAt_lte=' + fechaAnio + '-' + ("0000" + fechaMes).slice(-2) + '-' + ("0000" + ultimoDia.getDate()).slice(-2) + 'T24:00:00.000Z&_limit=-1';
        } else {
            // tslint:disable-next-line: max-line-length
            filtroReporte = filtroReporte + '&createdAt_gte=' + fechaAnio + '-' + ("0000" + fechaMes).slice(-2) + '-' + ('0000' + primerDia.getDate()).slice(-2) + 'T01:00:00.000Z&createdAt_lte=' + fechaAnio + '-' + ("0000" + fechaMes).slice(-2) + '-' + ("0000" + ultimoDia.getDate()).slice(-2) + 'T24:00:00.000Z&_limit=-1';
        }
        // Obtenemos los entes
        this.trazabilidad.obtenerTrazabilidadFiltrado(filtroReporte).subscribe((resp: any) => {
            this.arrDocumentosIngresadosAyer = resp.ayer;

            arrDocumentosIngresados7diasFiltro = resp.ultimos7Dias;

           // this.arrDocumentosIngresados7dias = arrDocumentosIngresados7diasFiltro.filter((d) => (d['fecha'] >= diaIni7Dias && d['fecha'] <= diaFin7Dias));
            arrDocumentosIngresados7diasFiltro.forEach(element => {
                let fecha = new Date(element.fechaFiltro);
               
               
                if (fecha.getTime() >= fechaInicial.getTime()) {
                    if (fecha.getTime() <= fechaFinal.getTime()) {
                    
                        this.arrDocumentosIngresados7dias.push(element);
                    }
                }

            });
            this.docCargados7dias = this.arrDocumentosIngresados7dias.filter((d) => d['movimiento'] === 'Creación').length;
            console.log( this.arrDocumentosIngresados7dias);
            this.docExpedientes7dias = this.arrDocumentosIngresados7dias.filter((d) => d['movimiento'] === 'Creación' && d['folioExpediente'] !== '').length;
            this.docConsultados7dias = this.arrDocumentosIngresados7dias.filter((d) => d['movimiento'] === 'Consulto').length;
            this.docEliminados7dias = this.arrDocumentosIngresados7dias.filter((d) => d['movimiento'] === 'Borro' || d['movimiento'] === 'Cancelo').length;

            arrDocumentosIngresadosMesFiltro = resp.ultimoMes;
            // tslint:disable-next-line: max-line-length
            this.arrDocumentosIngresadosMes = [];
            arrDocumentosIngresadosMesFiltro.forEach(element => {
                let fecha = new Date(element.fechaFiltro);
             
                if (fecha.getTime() >= primerDia.getTime()) {
                    if (fecha.getTime() <= ultimoDia.getTime()) {
                        console.log(element);
                        this.arrDocumentosIngresadosMes.push(element);
                    }
                }

            });
           
            // this.arrDocumentosIngresadosMes = arrDocumentosIngresadosMesFiltro.filter((d) => (d['fechaFiltro'] >= this.datePipe.transform(primerDia, 'dd-MM-yyyy') && d['fecha'] <= this.datePipe.transform(ultimoDia, 'dd-MM-yyyy')));
            this.docCargadosMes = this.arrDocumentosIngresadosMes.filter((d) => d['movimiento'] === 'Creación').length;
            this.docExpedientesMes = this.arrDocumentosIngresadosMes.filter((d) => d['movimiento'] === 'Creación' && d['folioExpediente'] !== '').length;
            this.docConsultadosMes = this.arrDocumentosIngresadosMes.filter((d) => d['movimiento'] === 'Consulto').length;
            this.docEliminadosMes = this.arrDocumentosIngresadosMes.filter((d) => (d['movimiento'] === 'Borro' || d['movimiento'] === 'Cancelo')).length;



            this.arrDocumentosIngresadosAyer.forEach(doc => {
                if (doc['movimiento'] === 'Creación') {
                    this.docCargadosAyer++;

                    if (doc['folioExpediente'] !== '') {
                        this.docExpedientesAyer++;
                    }

                }
                if (doc['movimiento'] === 'Consulto') {
                    this.docConsultadosAyer++;
                }
                if (doc['movimiento'] === 'Borro' || doc['movimiento'] === 'Cancelo') {
                    this.docEliminadosAyer++;
                }
            });

            this.arrCreacionGraficaAyer = [
                this.arrDocumentosIngresadosAyer.filter((d) => d['movimiento'] === 'Creación' && d['hora'] === 12).length,
                this.arrDocumentosIngresadosAyer.filter((d) => d['movimiento'] === 'Creación' && d['hora'] === 1).length,
                this.arrDocumentosIngresadosAyer.filter((d) => d['movimiento'] === 'Creación' && d['hora'] === 2).length,
                this.arrDocumentosIngresadosAyer.filter((d) => d['movimiento'] === 'Creación' && d['hora'] === 3).length,
                this.arrDocumentosIngresadosAyer.filter((d) => d['movimiento'] === 'Creación' && d['hora'] === 4).length,
                this.arrDocumentosIngresadosAyer.filter((d) => d['movimiento'] === 'Creación' && d['hora'] === 5).length,
                this.arrDocumentosIngresadosAyer.filter((d) => d['movimiento'] === 'Creación' && d['hora'] === 6).length,
                this.arrDocumentosIngresadosAyer.filter((d) => d['movimiento'] === 'Creación' && d['hora'] === 7).length,
                this.arrDocumentosIngresadosAyer.filter((d) => d['movimiento'] === 'Creación' && d['hora'] === 8).length,
                this.arrDocumentosIngresadosAyer.filter((d) => d['movimiento'] === 'Creación' && d['hora'] === 9).length,
                this.arrDocumentosIngresadosAyer.filter((d) => d['movimiento'] === 'Creación' && d['hora'] === 10).length,
                this.arrDocumentosIngresadosAyer.filter((d) => d['movimiento'] === 'Creación' && d['hora'] === 11).length,
                this.arrDocumentosIngresadosAyer.filter((d) => d['movimiento'] === 'Creación' && d['hora'] === 12).length,
                this.arrDocumentosIngresadosAyer.filter((d) => d['movimiento'] === 'Creación' && d['hora'] === 13).length,
                this.arrDocumentosIngresadosAyer.filter((d) => d['movimiento'] === 'Creación' && d['hora'] === 14).length,
                this.arrDocumentosIngresadosAyer.filter((d) => d['movimiento'] === 'Creación' && d['hora'] === 15).length,
                this.arrDocumentosIngresadosAyer.filter((d) => d['movimiento'] === 'Creación' && d['hora'] === 16).length,
                this.arrDocumentosIngresadosAyer.filter((d) => d['movimiento'] === 'Creación' && d['hora'] === 17).length,
                this.arrDocumentosIngresadosAyer.filter((d) => d['movimiento'] === 'Creación' && d['hora'] === 18).length,
                this.arrDocumentosIngresadosAyer.filter((d) => d['movimiento'] === 'Creación' && d['hora'] === 19).length,
                this.arrDocumentosIngresadosAyer.filter((d) => d['movimiento'] === 'Creación' && d['hora'] === 20).length,
                this.arrDocumentosIngresadosAyer.filter((d) => d['movimiento'] === 'Creación' && d['hora'] === 21).length,
                this.arrDocumentosIngresadosAyer.filter((d) => d['movimiento'] === 'Creación' && d['hora'] === 22).length,
                this.arrDocumentosIngresadosAyer.filter((d) => d['movimiento'] === 'Creación' && d['hora'] === 23).length,
                this.arrDocumentosIngresadosAyer.filter((d) => d['movimiento'] === 'Creación' && d['hora'] === 24).length
            ];

            this.arrConsultaGraficaAyer = [
                this.arrDocumentosIngresadosAyer.filter((d) => d['movimiento'] === 'Consulto' && d['hora'] === 12).length,
                this.arrDocumentosIngresadosAyer.filter((d) => d['movimiento'] === 'Consulto' && d['hora'] === 1).length,
                this.arrDocumentosIngresadosAyer.filter((d) => d['movimiento'] === 'Consulto' && d['hora'] === 2).length,
                this.arrDocumentosIngresadosAyer.filter((d) => d['movimiento'] === 'Consulto' && d['hora'] === 3).length,
                this.arrDocumentosIngresadosAyer.filter((d) => d['movimiento'] === 'Consulto' && d['hora'] === 4).length,
                this.arrDocumentosIngresadosAyer.filter((d) => d['movimiento'] === 'Consulto' && d['hora'] === 5).length,
                this.arrDocumentosIngresadosAyer.filter((d) => d['movimiento'] === 'Consulto' && d['hora'] === 6).length,
                this.arrDocumentosIngresadosAyer.filter((d) => d['movimiento'] === 'Consulto' && d['hora'] === 7).length,
                this.arrDocumentosIngresadosAyer.filter((d) => d['movimiento'] === 'Consulto' && d['hora'] === 8).length,
                this.arrDocumentosIngresadosAyer.filter((d) => d['movimiento'] === 'Consulto' && d['hora'] === 9).length,
                this.arrDocumentosIngresadosAyer.filter((d) => d['movimiento'] === 'Consulto' && d['hora'] === 10).length,
                this.arrDocumentosIngresadosAyer.filter((d) => d['movimiento'] === 'Consulto' && d['hora'] === 11).length,
                this.arrDocumentosIngresadosAyer.filter((d) => d['movimiento'] === 'Consulto' && d['hora'] === 12).length,
                this.arrDocumentosIngresadosAyer.filter((d) => d['movimiento'] === 'Consulto' && d['hora'] === 13).length,
                this.arrDocumentosIngresadosAyer.filter((d) => d['movimiento'] === 'Consulto' && d['hora'] === 14).length,
                this.arrDocumentosIngresadosAyer.filter((d) => d['movimiento'] === 'Consulto' && d['hora'] === 15).length,
                this.arrDocumentosIngresadosAyer.filter((d) => d['movimiento'] === 'Consulto' && d['hora'] === 16).length,
                this.arrDocumentosIngresadosAyer.filter((d) => d['movimiento'] === 'Consulto' && d['hora'] === 17).length,
                this.arrDocumentosIngresadosAyer.filter((d) => d['movimiento'] === 'Consulto' && d['hora'] === 18).length,
                this.arrDocumentosIngresadosAyer.filter((d) => d['movimiento'] === 'Consulto' && d['hora'] === 19).length,
                this.arrDocumentosIngresadosAyer.filter((d) => d['movimiento'] === 'Consulto' && d['hora'] === 20).length,
                this.arrDocumentosIngresadosAyer.filter((d) => d['movimiento'] === 'Consulto' && d['hora'] === 21).length,
                this.arrDocumentosIngresadosAyer.filter((d) => d['movimiento'] === 'Consulto' && d['hora'] === 22).length,
                this.arrDocumentosIngresadosAyer.filter((d) => d['movimiento'] === 'Consulto' && d['hora'] === 23).length,
                this.arrDocumentosIngresadosAyer.filter((d) => d['movimiento'] === 'Consulto' && d['hora'] === 24).length
            ];
            this.arrEliminadosGraficaAyer = [
                this.arrDocumentosIngresadosAyer.filter((d) => d['movimiento'] === 'Borro' && d['hora'] === 24 || d['movimiento'] === 'Cancelo' && d['hora'] === 24).length,
                this.arrDocumentosIngresadosAyer.filter((d) => d['movimiento'] === 'Borro' && d['hora'] === 1 || d['movimiento'] === 'Cancelo' && d['hora'] === 1).length,
                this.arrDocumentosIngresadosAyer.filter((d) => d['movimiento'] === 'Borro' && d['hora'] === 2 || d['movimiento'] === 'Cancelo' && d['hora'] === 2).length,
                this.arrDocumentosIngresadosAyer.filter((d) => d['movimiento'] === 'Borro' && d['hora'] === 3 || d['movimiento'] === 'Cancelo' && d['hora'] === 3).length,
                this.arrDocumentosIngresadosAyer.filter((d) => d['movimiento'] === 'Borro' && d['hora'] === 4 || d['movimiento'] === 'Cancelo' && d['hora'] === 4).length,
                this.arrDocumentosIngresadosAyer.filter((d) => d['movimiento'] === 'Borro' && d['hora'] === 5 || d['movimiento'] === 'Cancelo' && d['hora'] === 5).length,
                this.arrDocumentosIngresadosAyer.filter((d) => d['movimiento'] === 'Borro' && d['hora'] === 6 || d['movimiento'] === 'Cancelo' && d['hora'] === 6).length,
                this.arrDocumentosIngresadosAyer.filter((d) => d['movimiento'] === 'Borro' && d['hora'] === 7 || d['movimiento'] === 'Cancelo' && d['hora'] === 7).length,
                this.arrDocumentosIngresadosAyer.filter((d) => d['movimiento'] === 'Borro' && d['hora'] === 8 || d['movimiento'] === 'Cancelo' && d['hora'] === 8).length,
                this.arrDocumentosIngresadosAyer.filter((d) => d['movimiento'] === 'Borro' && d['hora'] === 9 || d['movimiento'] === 'Cancelo' && d['hora'] === 9).length,
                this.arrDocumentosIngresadosAyer.filter((d) => d['movimiento'] === 'Borro' && d['hora'] === 10 || d['movimiento'] === 'Cancelo' && d['hora'] === 10).length,
                this.arrDocumentosIngresadosAyer.filter((d) => d['movimiento'] === 'Borro' && d['hora'] === 11 || d['movimiento'] === 'Cancelo' && d['hora'] === 11).length,
                this.arrDocumentosIngresadosAyer.filter((d) => d['movimiento'] === 'Borro' && d['hora'] === 12 || d['movimiento'] === 'Cancelo' && d['hora'] === 12).length,
                this.arrDocumentosIngresadosAyer.filter((d) => d['movimiento'] === 'Borro' && d['hora'] === 13 || d['movimiento'] === 'Cancelo' && d['hora'] === 13).length,
                this.arrDocumentosIngresadosAyer.filter((d) => d['movimiento'] === 'Borro' && d['hora'] === 14 || d['movimiento'] === 'Cancelo' && d['hora'] === 14).length,
                this.arrDocumentosIngresadosAyer.filter((d) => d['movimiento'] === 'Borro' && d['hora'] === 15 || d['movimiento'] === 'Cancelo' && d['hora'] === 15).length,
                this.arrDocumentosIngresadosAyer.filter((d) => d['movimiento'] === 'Borro' && d['hora'] === 16 || d['movimiento'] === 'Cancelo' && d['hora'] === 16).length,
                this.arrDocumentosIngresadosAyer.filter((d) => d['movimiento'] === 'Borro' && d['hora'] === 17 || d['movimiento'] === 'Cancelo' && d['hora'] === 17).length,
                this.arrDocumentosIngresadosAyer.filter((d) => d['movimiento'] === 'Borro' && d['hora'] === 18 || d['movimiento'] === 'Cancelo' && d['hora'] === 18).length,
                this.arrDocumentosIngresadosAyer.filter((d) => d['movimiento'] === 'Borro' && d['hora'] === 19 || d['movimiento'] === 'Cancelo' && d['hora'] === 19).length,
                this.arrDocumentosIngresadosAyer.filter((d) => d['movimiento'] === 'Borro' && d['hora'] === 20 || d['movimiento'] === 'Cancelo' && d['hora'] === 20).length,
                this.arrDocumentosIngresadosAyer.filter((d) => d['movimiento'] === 'Borro' && d['hora'] === 21 || d['movimiento'] === 'Cancelo' && d['hora'] === 21).length,
                this.arrDocumentosIngresadosAyer.filter((d) => d['movimiento'] === 'Borro' && d['hora'] === 22 || d['movimiento'] === 'Cancelo' && d['hora'] === 22).length,
                this.arrDocumentosIngresadosAyer.filter((d) => d['movimiento'] === 'Borro' && d['hora'] === 23 || d['movimiento'] === 'Cancelo' && d['hora'] === 23).length,

            ];

            this.arrDiasMes.forEach(element => {
                this.arrCreacionGraficaMes.push(this.arrDocumentosIngresadosMes.filter((d) => d['movimiento'] === 'Creación' && element[0] === d['fecha']).length);
                this.arrConsultaGraficaMes.push(this.arrDocumentosIngresadosMes.filter((d) => d['movimiento'] === 'Consulto' && element[0] === d['fecha']).length);

                this.arrEliminadosGraficaMes.push(this.arrDocumentosIngresadosMes.filter((d) => element[0] === d['fecha'] && d['movimiento'] === 'Borro'
                    || element[0] === d['fecha'] && d['movimiento'] === 'Cancelo').length);
            });


            this.configuragraficas();

        }, err => {

        });
    }

    async obtenerMovimientosPorFechas(): Promise<void> {
        const fecha = new Date();
        const fechaMes = fecha.getMonth() + 1;
        const fechaDia = fecha.getDate();
        const fechaAnio = fecha.getFullYear();
        const date = new Date();
        const primerDia = new Date(date.getFullYear(), date.getMonth(), 1);
        const ultimoDia = new Date(date.getFullYear(), date.getMonth() + 1, 0);

        this.spinner.show();
        let filtroReporte = '';
        if (this.vigenteBusqueda !== undefined && this.vigenteBusqueda !== '') {
            filtroReporte = 'documento.bActivo=' + this.vigenteBusqueda + '&';
        }
        if (this.selectedInformacion !== undefined && this.selectedInformacion !== '') {
            if (filtroReporte === '') {
                filtroReporte = 'documento.visibilidade.cDescripcionVisibilidad=' + this.selectedInformacion;
            } else {
                filtroReporte = filtroReporte + '&documento.visibilidade.cDescripcionVisibilidad=' + this.selectedInformacion;
            }
        }

        if (this.selectTipoDocumento !== undefined && this.selectTipoDocumento !== '') {
            if (filtroReporte === '') {
                filtroReporte = 'documento.tipo_de_documento.id=' + this.selectTipoDocumento;
            } else {
                filtroReporte = filtroReporte + '&documento.tipo_de_documento.id=' + this.selectTipoDocumento;
            }
        }

        if (this.selectedExpediente !== undefined && this.selectedExpediente !== '') {
            if (filtroReporte === '') {
                filtroReporte = 'documento.tipo_de_expediente.id=' + this.selectedExpediente;
            } else {
                filtroReporte = filtroReporte + '&documento.tipo_de_expediente.id=' + this.selectedExpediente;
            }
        }

        if (filtroReporte === '') {

            // tslint:disable-next-line: max-line-length
            filtroReporte = 'createdAt_gte=' + fechaAnio + '-' + ('0000' + fechaMes).slice(-2) + '-' + ('0000' + primerDia.getDate()).slice(-2) + 'T01:00:00.000Z&createdAt_lte=' + fechaAnio + '-' + ('0000' + fechaMes).slice(-2) + '-' + ('0000' + ultimoDia.getDate()).slice(-2) + 'T24:00:00.000Z&_limit=-1';
        } else {
            // tslint:disable-next-line: max-line-length
            filtroReporte = filtroReporte + '&createdAt_gte=' + fechaAnio + '-' + ('0000' + fechaMes).slice(-2) + '-' + ('0000' + primerDia.getDate()).slice(-2) + 'T01:00:00.000Z&createdAt_lte=' + fechaAnio + '-' + ('0000' + fechaMes).slice(-2) + '-' + ('0000' + ultimoDia.getDate()).slice(-2) + 'T24:00:00.000Z&_limit=-1';
        }
        // Obtenemos los entes

        this.trazabilidad.obtenerTrazabilidadFiltrado(filtroReporte).subscribe((resp: any) => {

            this.arrDocumentosIngresadosMes = resp.ultimoMes;
            this.docCargadosMes = this.arrDocumentosIngresadosMes.filter((d) => d['movimiento'] === 'Creación').length;
            this.docExpedientesMes = this.arrDocumentosIngresadosMes.filter((d) => d['movimiento'] === 'Creación' && d['folioExpediente'] !== '').length;
            this.docConsultadosMes = this.arrDocumentosIngresadosMes.filter((d) => d['movimiento'] === 'Consulto').length;
            this.docEliminadosMes = this.arrDocumentosIngresadosMes.filter((d) => (d['movimiento'] === 'Borro' || d['movimiento'] === 'Cancelo')).length;


            this.arrDiasMes.forEach(element => {
                this.arrCreacionGraficaMes.push(this.arrDocumentosIngresadosMes.filter((d) => d['movimiento'] === 'Creación' && element[0] === d['fecha']).length);
                this.arrConsultaGraficaMes.push(this.arrDocumentosIngresadosMes.filter((d) => d['movimiento'] === 'Consulto' && element[0] === d['fecha']).length);

                this.arrEliminadosGraficaMes.push(this.arrDocumentosIngresadosMes.filter((d) => element[0] === d['fecha'] && d['movimiento'] === 'Borro'
                    || element[0] === d['fecha'] && d['movimiento'] === 'Cancelo').length);
            });

            this.configuragraficas();
            this.spinner.hide();
        }, err => {

        });
    }



    borrarFiltros(): void {
        // Limpiamos inputs

        this.vigenteBusqueda = '';
        this.selectedInformacion = '';
        this.fechaIni = '';
        this.fechaFin = '';
        this.selectTipoDocumento = '';
        this.selectedExpediente = '';
        this.selectedFolioExpediente = '';

    }


    changeTipoDocumento(event: any): void {

    }


    configuragraficas(): void {
        let date = new Date();
        let primerDiaRango: number;
        let ultimoDiaRango: number;
        this.arrDiasMes = [];
        const primerDia = new Date(date.getFullYear(), date.getMonth(), 1);
        const ultimoDia = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        date.setDate(date.getDate() - 6);
        const dia1 = this.datePipe.transform(date, 'dd-MM-yyyy');
        date = new Date();
        date.setDate(date.getDate() - 5);
        const dia2 = this.datePipe.transform(date, 'dd-MM-yyyy');
        date = new Date();
        date.setDate(date.getDate() - 4);
        const dia3 = this.datePipe.transform(date, 'dd-MM-yyyy');
        date = new Date();
        date.setDate(date.getDate() - 3);
        const dia4 = this.datePipe.transform(date, 'dd-MM-yyyy');
        date = new Date();
        date.setDate(date.getDate() - 2);
        const dia5 = this.datePipe.transform(date, 'dd-MM-yyyy');
        date = new Date();
        date.setDate(date.getDate() - 1);
        const dia6 = this.datePipe.transform(date, 'dd-MM-yyyy');
        date = new Date();
        const dia7 = this.datePipe.transform(date, 'dd-MM-yyyy');


        this.grafica = {
            chartType: 'line',
            datasets: {
                cargados: [

                    {
                        label: 'Documentos',
                        data: this.arrCreacionGraficaAyer,
                        fill: 'start'
                    }
                ],
                consultados: [

                    {
                        label: 'Documentos',
                        data: this.arrConsultaGraficaAyer,
                        fill: 'start'

                    }
                ],

                eliminados: [

                    {
                        label: 'Documentos',
                        data: this.arrEliminadosGraficaAyer,
                        fill: 'start'

                    }
                ]
            },
            // tslint:disable-next-line: max-line-length
            labels: ['12am', '1am', '2am', '3am', '4am', '5am', '6am', '7am', '8am', '9am', '10am', '11am', '12pm', '1pm', '2pm', '3pm', '4pm', '5pm', '6pm', '7pm', '8pm', '9pm', '10pm', '11pm'],
            colors: [

                {
                    borderColor: 'rgba(244, 67, 54, 0.87)',
                    backgroundColor: 'transparent',
                    pointBackgroundColor: 'rgba(244, 67, 54, 0.87)',
                    pointHoverBackgroundColor: 'rgba(244, 67, 54, 0.87)',
                    pointBorderColor: '#ffffff',
                    pointHoverBorderColor: '#ffffff'
                }
            ],
            options: {
                spanGaps: false,
                legend: {
                    display: false
                },
                maintainAspectRatio: false,
                tooltips: {
                    position: 'nearest',
                    mode: 'index',
                    intersect: false
                },
                layout: {
                    padding: {
                        left: 24,
                        right: 32
                    }
                },
                elements: {
                    point: {
                        radius: 4,
                        borderWidth: 2,
                        hoverRadius: 4,
                        hoverBorderWidth: 2
                    }
                },
                scales: {
                    xAxes: [
                        {
                            gridLines: {
                                display: false
                            },
                            ticks: {
                                fontColor: 'rgba(0,0,0,0.54)'
                            }
                        }
                    ],
                    yAxes: [
                        {
                            gridLines: {
                                tickMarkLength: 16
                            },
                            ticks: {
                                stepSize: 1000
                            }
                        }
                    ]
                },
                plugins: {
                    filler: {
                        propagate: false
                    }
                }
            }
        };

        if (this.arrDocumentosIngresados7dias) {
            if (this.arrDocumentosIngresados7dias.length > 0) {
                this.arrCreacionGrafica7dias = [
                    this.arrDocumentosIngresados7dias.filter((d) => d['fecha'] === dia1 && d['movimiento'] === 'Creación').length,
                    this.arrDocumentosIngresados7dias.filter((d) => d['fecha'] === dia2 && d['movimiento'] === 'Creación').length,
                    this.arrDocumentosIngresados7dias.filter((d) => d['fecha'] === dia3 && d['movimiento'] === 'Creación').length,
                    this.arrDocumentosIngresados7dias.filter((d) => d['fecha'] === dia4 && d['movimiento'] === 'Creación').length,
                    this.arrDocumentosIngresados7dias.filter((d) => d['fecha'] === dia5 && d['movimiento'] === 'Creación').length,
                    this.arrDocumentosIngresados7dias.filter((d) => d['fecha'] === dia6 && d['movimiento'] === 'Creación').length,
                    this.arrDocumentosIngresados7dias.filter((d) => d['fecha'] === dia7 && d['movimiento'] === 'Creación').length,
                ];


                this.arrConsultaGrafica7dias = [
                    this.arrDocumentosIngresados7dias.filter((d) => d['fecha'] === dia1 && d['movimiento'] === 'Consulto').length,
                    this.arrDocumentosIngresados7dias.filter((d) => d['fecha'] === dia2 && d['movimiento'] === 'Consulto').length,
                    this.arrDocumentosIngresados7dias.filter((d) => d['fecha'] === dia3 && d['movimiento'] === 'Consulto').length,
                    this.arrDocumentosIngresados7dias.filter((d) => d['fecha'] === dia4 && d['movimiento'] === 'Consulto').length,
                    this.arrDocumentosIngresadosAyer.filter((d) => d['fecha'] === dia5 && d['movimiento'] === 'Consulto').length,
                    this.arrDocumentosIngresados7dias.filter((d) => d['fecha'] === dia6 && d['movimiento'] === 'Consulto').length,
                    this.arrDocumentosIngresados7dias.filter((d) => d['fecha'] === dia7 && d['movimiento'] === 'Consulto').length,
                ];


                this.arrEliminadosGrafica7dias = [
                    // tslint:disable-next-line: max-line-length
                    this.arrDocumentosIngresados7dias.filter((d) => d['fecha'] === dia1 && d['movimiento'] === 'Borro' || d['movimiento'] === 'Cancelo' && d['fecha'] === dia1).length,
                    // tslint:disable-next-line: max-line-length
                    this.arrDocumentosIngresados7dias.filter((d) => d['fecha'] === dia2 && d['movimiento'] === 'Borro' || d['movimiento'] === 'Cancelo' && d['fecha'] === dia2).length,
                    // tslint:disable-next-line: max-line-length
                    this.arrDocumentosIngresados7dias.filter((d) => d['fecha'] === dia3 && d['movimiento'] === 'Borro' || d['movimiento'] === 'Cancelo' && d['fecha'] === dia3).length,
                    // tslint:disable-next-line: max-line-length
                    this.arrDocumentosIngresados7dias.filter((d) => d['fecha'] === dia4 && d['movimiento'] === 'Borro' || d['movimiento'] === 'Cancelo' && d['fecha'] === dia4).length,
                    // tslint:disable-next-line: max-line-length
                    this.arrDocumentosIngresados7dias.filter((d) => d['fecha'] === dia5 && d['movimiento'] === 'Borro' || d['movimiento'] === 'Cancelo' && d['fecha'] === dia5).length,
                    // tslint:disable-next-line: max-line-length
                    this.arrDocumentosIngresados7dias.filter((d) => d['fecha'] === dia6 && d['movimiento'] === 'Borro' || d['movimiento'] === 'Cancelo' && d['fecha'] === dia6).length,
                    // tslint:disable-next-line: max-line-length
                    this.arrDocumentosIngresados7dias.filter((d) => d['fecha'] === dia7 && d['movimiento'] === 'Borro' || d['movimiento'] === 'Cancelo' && d['fecha'] === dia7).length,
                ];

            }
        }
        this.grafica7dias = {
            chartType: 'line',
            datasets: {
                cargados: [

                    {
                        label: 'Documentos',
                        data: this.arrCreacionGrafica7dias,
                        fill: 'start'
                    }
                ],
                consultados: [

                    {
                        label: 'Documentos',
                        data: this.arrConsultaGrafica7dias,
                        fill: 'start'

                    }
                ],

                eliminados: [

                    {
                        label: 'Documentos',
                        data: this.arrEliminadosGrafica7dias,
                        fill: 'start'

                    }
                ]
            },
            // tslint:disable-next-line: max-line-length
            labels: [dia1, dia2, dia3, dia4, dia5, dia6, dia7],
            colors: [

                {
                    borderColor: 'rgba(244, 67, 54, 0.87)',
                    backgroundColor: 'transparent',
                    pointBackgroundColor: 'rgba(244, 67, 54, 0.87)',
                    pointHoverBackgroundColor: 'rgba(244, 67, 54, 0.87)',
                    pointBorderColor: '#ffffff',
                    pointHoverBorderColor: '#ffffff'
                }
            ],
            options: {
                spanGaps: false,
                legend: {
                    display: false
                },
                maintainAspectRatio: false,
                tooltips: {
                    position: 'nearest',
                    mode: 'index',
                    intersect: false
                },
                layout: {
                    padding: {
                        left: 24,
                        right: 32
                    }
                },
                elements: {
                    point: {
                        radius: 4,
                        borderWidth: 2,
                        hoverRadius: 4,
                        hoverBorderWidth: 2
                    }
                },
                scales: {
                    xAxes: [
                        {
                            gridLines: {
                                display: false
                            },
                            ticks: {
                                fontColor: 'rgba(0,0,0,0.54)'
                            }
                        }
                    ],
                    yAxes: [
                        {
                            gridLines: {
                                tickMarkLength: 16
                            },
                            ticks: {
                                stepSize: 1000
                            }
                        }
                    ]
                },
                plugins: {
                    filler: {
                        propagate: false
                    }
                }
            }
        };


        primerDiaRango = primerDia.getDate() - 1;
        ultimoDiaRango = ultimoDia.getDate();


        while (primerDiaRango < ultimoDiaRango) {
            date = new Date(date.getFullYear(), date.getMonth(), 1);
            date.setDate(date.getDate() + primerDiaRango);
            this.arrDiasMes.push([this.datePipe.transform(date, 'dd-MM-yyyy')]);
            primerDiaRango++;
        }


        this.graficaMes = {
            chartType: 'line',
            datasets: {
                cargados: [

                    {
                        label: 'Documentos',
                        data: this.arrCreacionGraficaMes,
                        fill: 'start'
                    }
                ],
                consultados: [

                    {
                        label: 'Documentos',
                        data: this.arrConsultaGraficaMes,
                        fill: 'start'

                    }
                ],

                eliminados: [

                    {
                        label: 'Documentos',
                        data: this.arrEliminadosGraficaMes,
                        fill: 'start'

                    }
                ]
            },
            // tslint:disable-next-line: max-line-length
            labels: this.arrDiasMes,
            colors: [

                {
                    borderColor: 'rgba(244, 67, 54, 0.87)',
                    backgroundColor: 'transparent',
                    pointBackgroundColor: 'rgba(244, 67, 54, 0.87)',
                    pointHoverBackgroundColor: 'rgba(244, 67, 54, 0.87)',
                    pointBorderColor: '#ffffff',
                    pointHoverBorderColor: '#ffffff'
                }
            ],
            options: {
                spanGaps: false,
                legend: {
                    display: false
                },
                maintainAspectRatio: false,
                tooltips: {
                    position: 'nearest',
                    mode: 'index',
                    intersect: false
                },
                layout: {
                    padding: {
                        left: 24,
                        right: 32
                    }
                },
                elements: {
                    point: {
                        radius: 4,
                        borderWidth: 2,
                        hoverRadius: 4,
                        hoverBorderWidth: 2
                    }
                },
                scales: {
                    xAxes: [
                        {
                            gridLines: {
                                display: false
                            },
                            ticks: {
                                fontColor: 'rgba(0,0,0,0.54)'
                            }
                        }
                    ],
                    yAxes: [
                        {
                            gridLines: {
                                tickMarkLength: 16
                            },
                            ticks: {
                                stepSize: 1000
                            }
                        }
                    ]
                },
                plugins: {
                    filler: {
                        propagate: false
                    }
                }
            }
        };



    }


    configurarGraficaFechas(): void {
        this.graficaFechas = {
            chartType: 'line',
            datasets: {
                cargados: [

                    {
                        label: 'Documentos',
                        data: this.arrCreacionGraficaFechas,
                        fill: 'start'
                    }
                ],
                consultados: [

                    {
                        label: 'Documentos',
                        data: this.arrConsultaGraficaFechas,
                        fill: 'start'

                    }
                ],

                eliminados: [

                    {
                        label: 'Documentos',
                        data: this.arrEliminadosGraficaFechas,
                        fill: 'start'

                    }
                ]
            },
            // tslint:disable-next-line: max-line-length
            labels: this.arrDiasRango,
            colors: [

                {
                    borderColor: 'rgba(244, 67, 54, 0.87)',
                    backgroundColor: 'transparent',
                    pointBackgroundColor: 'rgba(244, 67, 54, 0.87)',
                    pointHoverBackgroundColor: 'rgba(244, 67, 54, 0.87)',
                    pointBorderColor: '#ffffff',
                    pointHoverBorderColor: '#ffffff'
                }
            ],
            options: {
                spanGaps: false,
                legend: {
                    display: false
                },
                maintainAspectRatio: false,
                tooltips: {
                    position: 'nearest',
                    mode: 'index',
                    intersect: false
                },
                layout: {
                    padding: {
                        left: 24,
                        right: 32
                    }
                },
                elements: {
                    point: {
                        radius: 4,
                        borderWidth: 2,
                        hoverRadius: 4,
                        hoverBorderWidth: 2
                    }
                },
                scales: {
                    xAxes: [
                        {
                            gridLines: {
                                display: false
                            },
                            ticks: {
                                fontColor: 'rgba(0,0,0,0.54)'
                            }
                        }
                    ],
                    yAxes: [
                        {
                            gridLines: {
                                tickMarkLength: 16
                            },
                            ticks: {
                                stepSize: 1000
                            }
                        }
                    ]
                },
                plugins: {
                    filler: {
                        propagate: false
                    }
                }
            }
        };
    }
    configurarFechas(): void {
        let inicial: string;
        let final: string;
        let primerDiaRango = 0;
        const fIni = new Date(this.fechaIni);
        const fMesIni = fIni.getMonth() + 1;
        this.arrDiasRango = [];
        this.arrCreacionGraficaFechas = [];
        this.arrConsultaGraficaFechas = [];
        this.arrEliminadosGraficaFechas = [];
        let arrDocumentosIngresadosFechasFiltrado = [];
        this.arrDocumentosIngresadosFechas = [];
        let ini = new Date(this.fechaIni);
        const fin = new Date(this.fechaFin);
        const fMesFin = fin.getMonth() + 1;
        let inicialFiltro = this.datePipe.transform(this.fechaIni, 'MM-dd-yyyy');
        inicial = this.datePipe.transform(this.fechaIni, 'dd-MM-yyyy');
        final = this.datePipe.transform(this.fechaFin, 'MM-dd-yyyy');
        this.spinner.show();

        if (ini > fin) {
            Swal.fire('Error', 'La fecha inicial no puede ser mayor a la final.', 'error');
        } else if (this.fechaIni === '' || this.fechaFin === '') {
            Swal.fire('Error', 'Las fechas son obligatorias.', 'error');
            this.spinner.hide();
        }
        else {

            if (inicial === final) {
                const date = new Date(this.fechaIni);
                this.arrDiasRango.push([this.datePipe.transform(date, 'dd-MM-yyyy')]);

            }
            else {

                while (ini < fin) {

                    const date = new Date(this.fechaIni);
                    date.setDate(date.getDate() + primerDiaRango);
                    inicial = this.datePipe.transform(date, 'dd-MM-yyyy');
                    ini = new Date(date);
                    this.arrDiasRango.push([this.datePipe.transform(date, 'dd-MM-yyyy')]);
                    primerDiaRango++;
                }
            }
            let filtroReporte = '';
            if (this.vigenteBusqueda !== undefined && this.vigenteBusqueda !== '') {
                filtroReporte = 'documento.bActivo=' + this.vigenteBusqueda + '&';
            }
            if (this.selectedInformacion !== undefined && this.selectedInformacion !== '') {
                if (filtroReporte === '') {
                    filtroReporte = 'documento.visibilidade.cDescripcionVisibilidad=' + this.selectedInformacion;
                } else {
                    filtroReporte = filtroReporte + '&documento.visibilidade.cDescripcionVisibilidad=' + this.selectedInformacion;
                }
            }

            if (this.selectTipoDocumento !== undefined && this.selectTipoDocumento !== '') {
                if (filtroReporte === '') {
                    filtroReporte = 'documento.tipo_de_documento.id=' + this.selectTipoDocumento;
                } else {
                    filtroReporte = filtroReporte + '&documento.tipo_de_documento.id=' + this.selectTipoDocumento;
                }
            }

            if (this.selectedExpediente !== undefined && this.selectedExpediente !== '') {
                if (filtroReporte === '') {
                    filtroReporte = 'documento.tipo_de_expediente.id=' + this.selectedExpediente;
                } else {
                    filtroReporte = filtroReporte + '&documento.tipo_de_expediente.id=' + this.selectedExpediente;
                }
            }

            if (filtroReporte === '') {
                // tslint:disable-next-line: max-line-length
                filtroReporte = 'createdAt_gte=' + fIni.getFullYear() + '-' + ('0000' + fMesIni).slice(-2) + '-' + ('0000' + fIni.getDate()).slice(-2) + 'T01:00:00.000Z&createdAt_lte=' + fin.getFullYear() + '-' + ('0000' + fMesFin).slice(-2) + '-' + ('0000' + fin.getDate()).slice(-2) + 'T24:00:00.000Z&_limit=-1';
            } else {
                // tslint:disable-next-line: max-line-length
                filtroReporte = filtroReporte + '&createdAt_gte=' + fIni.getFullYear() + '-' + ('0000' + fMesIni).slice(-2) + '-' + ('0000' + fIni.getDate()).slice(-2) + 'T01:00:00.000Z&createdAt_lte=' + fin.getFullYear() + '-' + ('0000' + fMesFin).slice(-2) + '-' + ('0000' + fin.getDate()).slice(-2) + 'T24:00:00.000Z&_limit=-1';
            }
            // Obtenemos los entes

            this.trazabilidad.obtenerTrazabilidadFiltrado(filtroReporte).subscribe((resp: any) => {
                let fechaInicial = new Date(inicialFiltro);
                let fechaFinal = new Date(final);
                arrDocumentosIngresadosFechasFiltrado = resp.ultimoMes;
                arrDocumentosIngresadosFechasFiltrado.forEach(element => {
                    let fecha = new Date(element.fechaFiltro);
        
                    if (fecha.getTime() >= fechaInicial.getTime()) {
                        if (fecha.getTime() <= fechaFinal.getTime()) {
                            this.arrDocumentosIngresadosFechas.push(element)
                        }
                    }

                });

                console.log(this.arrDocumentosIngresadosFechas);

                this.docCargadosFechas = this.arrDocumentosIngresadosFechas.filter((d) => d['movimiento'] === 'Creación').length;
                console.log(this.docCargadosFechas);
                this.docExpedientesFechas = this.arrDocumentosIngresadosFechas.filter((d) => d['movimiento'] === 'Creación' && d['folioExpediente'] !== '').length;
                this.docConsultadosFechas = this.arrDocumentosIngresadosFechas.filter((d) => d['movimiento'] === 'Consulto').length;
                // tslint:disable-next-line: max-line-length
                this.docEliminadosFechas = this.arrDocumentosIngresadosFechas.filter((d) => (d['movimiento'] === 'Borro' || d['movimiento'] === 'Cancelo')).length;

                this.arrDiasRango.forEach(element => {
                    this.arrCreacionGraficaFechas.push(this.arrDocumentosIngresadosFechas.filter((d) => d['movimiento'] === 'Creación' && element[0] === d['fecha']).length);
                    this.arrConsultaGraficaFechas.push(this.arrDocumentosIngresadosFechas.filter((d) => d['movimiento'] === 'Consulto' && element[0] === d['fecha']).length);

                    this.arrEliminadosGraficaFechas.push(this.arrDocumentosIngresadosFechas.filter((d) => element[0] === d['fecha'] && d['movimiento'] === 'Borro'
                        || element[0] === d['fecha'] && d['movimiento'] === 'Cancelo').length);
                });


                console.log(this.arrEliminadosGraficaFechas);
                this.configurarGraficaFechas();
                this.spinner.hide();

            }, err => {

            });
        }

    }
}



