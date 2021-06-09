import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TrazabilidadService } from 'services/trazabilidad.service';
import { MenuService } from 'services/menu.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuariosService } from 'services/usuarios.service';
import { TipoExpedientesService } from 'services/tipo-expedientes.service';
import { fuseAnimations } from '@fuse/animations';
import { environment } from '../../../environments/environment';
import { NgxSpinnerService } from 'ngx-spinner';
import { LegislaturaService } from 'services/legislaturas.service';
import { ActasSesionsService } from 'services/actas-sesions.service';
import { RecepcionDeActasService } from 'services/recepcion-de-actas.service';
import * as moment from 'moment';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import * as Chart from 'chart.js';
pdfMake.vfs = pdfFonts.pdfMake.vfs; // fonts provided for pdfmake
import { Ng2ImgMaxService } from 'ng2-img-max';

export interface Estado {
  id: string;
  descripcion: string;
}

@Component({
  selector: 'app-dashboard-de-indicadores-de-sesiones',
  templateUrl: './dashboard-de-indicadores-de-sesiones.component.html',
  styleUrls: ['./dashboard-de-indicadores-de-sesiones.component.scss'],
  providers: [DatePipe],
})

export class DashboardDeIndicadoresDeSesionesComponent implements OnInit {

    vigenteBusqueda: string;
    fileUrl: any;
    loadingIndicator: boolean;
    reorderable: boolean;
    cargando: boolean;
    tipoSesion: Estado[] = [];
    selectedTipoSesion: string;
    arrLegislaturas: any[] = [];
    selectedLegislatura: any;
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
    anio = '';
    fechaAcumulada = '';
    fechaProceso = '';
    fechaArchivadas = '';
    fechaIni = '';
    fechaFin = '';
    
    arrCreacionGraficaAcumulada = [];
    arrSesionesProceso = [];
    arrSesionesArchivadas = [];
    
    arrCreacionGraficaAyer = [];
    arrConsultaGraficaAyer = [];
    arrEliminadosGraficaAyer = [];

    //Variables usadas
    cantidadTotalMes: number;
    cantidadTotalAnio: number;


    arrDocumentosIngresadosMes: any[];
    arrCreacionGraficaAnio = [];
    arrReporteAcumulado = [];
    arrReporteProceso = [];
    arrReporteArchivado = [];
    arrCreacionGraficaAnioPendiente = [];
    arrCreacionGraficaAnioArchivada = [];
    arrEliminadosGraficaMes = [];
    activarDescarga: boolean = true;

    sesionesAcumuladasMes: number;
    sesionesAcumuladasAnio: number;
    sesionesProcesoMes: number;
    sesionesProcesoAnio: number;
    sesionesArchivadasMes: number;
    sesionesArchivadasAnio: number;
    sesionesAcumuladasRangoFechas: number;

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
    arrMeses = [];
    widget1SelectedYear = '2016';
    widget5SelectedDay = 'today';
    widgets: any;
    grafica: any;
    graficaProceso: any;
    graficaArchivada: any;
    graficaFechas: any;
    imageBase64: any;
    imageCanvas1: any;
    constructor(private _formBuilder: FormBuilder, private datePipe: DatePipe,
        private router: Router,
        public dialog: MatDialog,
        private spinner: NgxSpinnerService,
        private menuService: MenuService,
        private trazabilidad: TrazabilidadService,
        private tipoExpedientesService: TipoExpedientesService,
        private legislaturaService: LegislaturaService,
        private actasSesions: ActasSesionsService,
        private recepcionDeActas: RecepcionDeActasService,
        private ng2ImgMax: Ng2ImgMaxService,
        private sanitizer: DomSanitizer) {
        // Obtenemos documentos
        // this.obtenerDocumentos();
        this.configuragraficas();
        // this.obtenerMovimientos();
        this.widgets = environment.widgets;
        this._registerCustomChartJSPlugin();
        this.imageBase64 = environment.imageBase64;
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

      this.tipoSesion = [];
      this.tipoSesion.push({
          id: '001',
          descripcion: 'Ordinaria'
      });
      this.tipoSesion.push({
          id: '002',
          descripcion: 'Extraordinaria'
      });
      this.tipoSesion.push({
          id: '003',
          descripcion: 'Especial'
      });
      this.tipoSesion.push({
          id: '004',
          descripcion: 'Informativas'
      });
      this.tipoSesion.push({
          id: '005',
          descripcion: 'Asambleas legislativas'
      });

        this.obtenerLegislatura();

        this.arrInformacion = this.menuService.tipoInformacion;

        // Formulario reactivo
        this.firstFormGroup = this._formBuilder.group({
            legislatura: [''],
            tipoSesion: [''],
            fechaIni: [''],
            fechaFin: ['']
        });
        this.secondFormGroup = this._formBuilder.group({
            secondCtrl: ['', Validators.required],
            documento: ['', Validators.required],
            fechaIni: [''],
            fechaFin: [''],
        });
    }

    async obtenerLegislatura(): Promise<void> {
        return new Promise((resolve) => {
            {
                this.legislaturaService.obtenerLegislatura().subscribe(
                    (resp: any) => {
                        for (const legislatura of resp) {
                            if (legislatura.bActivo) {
                                this.arrLegislaturas.push(legislatura);
                            }
                        }
                        resolve(resp);

                        //seleccionamos legislatura por default
                        //this.selectedLegislatura = this.legislatura[0].id;
                    },
                    (err) => {
                        Swal.fire(
                            "Error",
                            "Ocurrió un error al obtener las legislatura." +
                            err,
                            "error"
                        );
                        resolve(err);
                    }
                );
            }
        });
    }

    async obtenerMovimientos(): Promise<void> {

        this.spinner.show();

        moment.locale('es');
        let meses = 0;
        let inicial: string;
        let final: string;
        this.arrCreacionGraficaAcumulada = [];
        this.arrSesionesProceso = [];
        this.arrSesionesArchivadas = [];
        this.arrCreacionGraficaAnio = [];
        this.arrCreacionGraficaAnioPendiente = [];
        this.arrCreacionGraficaAnioArchivada = [];
        this.arrMeses = [];
        let ini = new Date(this.fechaIni);
        const fin = new Date(this.fechaFin);
        const fechaIni = moment(this.firstFormGroup.get('fechaIni').value).format('YYYY-MM-DD');
        let mesIni = moment(this.firstFormGroup.get('fechaIni').value).format('YYYY-MM-DD');
        const fechaFin = moment(this.firstFormGroup.get('fechaFin').value).format('YYYY-MM-DD');
        inicial = moment(this.fechaIni).format('YYYY-MM-DD');
        final = moment(this.fechaFin).format('YYYY-MM-DD');

        this.fechaAcumulada = moment(this.fechaIni).format('YYYY-MM');
        this.fechaProceso = moment(this.fechaIni).format('YYYY-MM');
        this.fechaArchivadas = moment(this.fechaIni).format('YYYY-MM');

        let i: number = 0;
        let p: number = 0;
        let a: number = 0;

        let filtroReporte = '';

        if (ini > fin) {
            Swal.fire('Error', 'La fecha inicial no puede ser mayor a la final.', 'error');
            this.spinner.hide();
        } else if (this.fechaIni === '' || this.fechaFin === '') {
            Swal.fire('Error', 'Las fechas son obligatorias.', 'error');
            this.spinner.hide();
        }else {

              
            /*while (inicial < final) {

                const date = moment(mesIni).add(meses, 'month').format('YYYY-MM-DD');
                let mes = moment(date).format('MMMM');
                console.log('mes ini')
                console.log(date);
                console.log(mes);
                inicial = moment(inicial).add(meses, 'month').format('YYYY-MM-DD');
                this.arrMeses.push([mes]);
                meses++;
            }

            console.log('Meses graficados');
            console.log(this.arrMeses);*/
            

            if (this.selectedLegislatura !== undefined && this.selectedLegislatura !== '') {
                if (filtroReporte === '') {
                    filtroReporte = 'legislatura.id=' + this.selectedLegislatura;
                } else {
                    filtroReporte = filtroReporte + '&legislatura.id=' + this.selectedLegislatura;
                }
            }

            if (this.selectedTipoSesion !== undefined && this.selectedTipoSesion !== '') {
                if (filtroReporte === '') {
                    filtroReporte = 'tipoSesion=' + this.selectedTipoSesion;
                } else {
                    filtroReporte = filtroReporte + '&tipoSesion=' + this.selectedTipoSesion;
                }
            }

            if (filtroReporte === '') {
                // tslint:disable-next-line: max-line-length
                filtroReporte = 'createdAt_gte=' + moment(fechaIni).format('YYYY') + '-01-01' + 'T01:00:00.000Z&createdAt_lte=' + moment(fechaFin).format('YYYY') + '-12-31' + 'T24:00:00.000Z&_limit=-1';
            } else {
                // tslint:disable-next-line: max-line-length
                filtroReporte = filtroReporte + '&createdAt_gte=' + moment(fechaIni).format('YYYY') + '-01-01' + 'T01:00:00.000Z&createdAt_lte=' + moment(fechaFin).format('YYYY') + '-12-31' + 'T24:00:00.000Z&_limit=-1';
            }
            // Obtenemos los entes

            console.log('filtro');
            console.log(filtroReporte);
            
            await this.actasSesions.obtenerActasSesionsFiltrado(filtroReporte).subscribe((resp: any) => {
                this.arrCreacionGraficaAcumulada = resp.anioTotal;

                //console.log(moment(this.arrCreacionGraficaAcumulada[0].fechaFiltro).format('YYYY'));

                while (i <= this.arrCreacionGraficaAcumulada.length - 1) {
                    this.arrCreacionGraficaAcumulada[i].cTiempo = moment(this.arrCreacionGraficaAcumulada[i].fechaFiltro).format('MMMM');
                    this.arrCreacionGraficaAcumulada[i].fecha = moment(this.arrCreacionGraficaAcumulada[i].fechaFiltro).format('YYYY');
                    i++
                }

                console.log(this.arrCreacionGraficaAcumulada);

                this.sesionesAcumuladasMes = this.arrCreacionGraficaAcumulada.filter((d) => d['cTiempo'] === moment(this.fechaIni).format('MMMM')).length;

                this.sesionesAcumuladasAnio = this.arrCreacionGraficaAcumulada.filter((d) => d['fecha'] === moment(this.fechaIni).format('YYYY')).length;

                this.arrCreacionGraficaAnio.push(this.arrCreacionGraficaAcumulada.filter((d) => d['cTiempo'] === 'enero' && d['fecha'] === moment(this.fechaIni).format('YYYY')).length);
                this.arrCreacionGraficaAnio.push(this.arrCreacionGraficaAnio[0] + this.arrCreacionGraficaAcumulada.filter((d) => d['cTiempo'] === 'febrero' && d['fecha'] === moment(this.fechaIni).format('YYYY')).length);
                this.arrCreacionGraficaAnio.push(this.arrCreacionGraficaAnio[1] + this.arrCreacionGraficaAcumulada.filter((d) => d['cTiempo'] === 'marzo' && d['fecha'] === moment(this.fechaIni).format('YYYY')).length);
                this.arrCreacionGraficaAnio.push(this.arrCreacionGraficaAnio[2] + this.arrCreacionGraficaAcumulada.filter((d) => d['cTiempo'] === 'abril' && d['fecha'] === moment(this.fechaIni).format('YYYY')).length);
                this.arrCreacionGraficaAnio.push(this.arrCreacionGraficaAnio[3] + this.arrCreacionGraficaAcumulada.filter((d) => d['cTiempo'] === 'mayo' && d['fecha'] === moment(this.fechaIni).format('YYYY')).length);
                this.arrCreacionGraficaAnio.push(this.arrCreacionGraficaAnio[4] + this.arrCreacionGraficaAcumulada.filter((d) => d['cTiempo'] === 'junio' && d['fecha'] === moment(this.fechaIni).format('YYYY')).length);
                this.arrCreacionGraficaAnio.push(this.arrCreacionGraficaAnio[5] + this.arrCreacionGraficaAcumulada.filter((d) => d['cTiempo'] === 'julio' && d['fecha'] === moment(this.fechaIni).format('YYYY')).length);
                this.arrCreacionGraficaAnio.push(this.arrCreacionGraficaAnio[6] + this.arrCreacionGraficaAcumulada.filter((d) => d['cTiempo'] === 'agosto' && d['fecha'] === moment(this.fechaIni).format('YYYY')).length);
                this.arrCreacionGraficaAnio.push(this.arrCreacionGraficaAnio[7] + this.arrCreacionGraficaAcumulada.filter((d) => d['cTiempo'] === 'septiembre' && d['fecha'] === moment(this.fechaIni).format('YYYY')).length);
                this.arrCreacionGraficaAnio.push(this.arrCreacionGraficaAnio[8] + this.arrCreacionGraficaAcumulada.filter((d) => d['cTiempo'] === 'octubre' && d['fecha'] === moment(this.fechaIni).format('YYYY')).length);
                this.arrCreacionGraficaAnio.push(this.arrCreacionGraficaAnio[9] + this.arrCreacionGraficaAcumulada.filter((d) => d['cTiempo'] === 'noviembre' && d['fecha'] === moment(this.fechaIni).format('YYYY')).length);
                this.arrCreacionGraficaAnio.push(this.arrCreacionGraficaAnio[10] + this.arrCreacionGraficaAcumulada.filter((d) => d['cTiempo'] === 'diciembre' && d['fecha'] === moment(this.fechaIni).format('YYYY')).length);

                this.arrReporteAcumulado = [[ 'Id', 'Legislatura', 'Tipo de sesión', 'Fecha', 'Hora']];

                for (let i = 0, max = this.arrCreacionGraficaAcumulada.length; i < max; i += 1) {

                    if(moment(this.arrCreacionGraficaAcumulada[i].fechaFiltro).format('YYYY-MM-DD') >= fechaIni && moment(this.arrCreacionGraficaAcumulada[i].fechaFiltro).format('YYYY-MM-DD') <= fechaFin){
                        if(!this.arrCreacionGraficaAcumulada[i].legislatura){
                            this.arrCreacionGraficaAcumulada[i].legislatura = 'Sin asignar';
                        }
                        this.arrReporteAcumulado.push([this.arrCreacionGraficaAcumulada[i].id, this.arrCreacionGraficaAcumulada[i].legislatura, 
                        this.arrCreacionGraficaAcumulada[i].tipoSesion, moment(this.arrCreacionGraficaAcumulada[i].fechaFiltro).format('DD-MM-YYYY'), 
                        this.arrCreacionGraficaAcumulada[i].hora]);
                    }
                }

                //console.log(this.arrReporteAcumulado);
                //console.log(moment(this.arrCreacionGraficaAcumulada[0].fechaFiltro).format('YYYY-MM-DD'));
                console.log(this.arrReporteAcumulado);

                this.activarDescarga = false;

            }, err => {
                this.spinner.hide();
            });

            let filtroSesionesPendientes = '';

            filtroSesionesPendientes = 'estatus=pendiente';
            filtroSesionesPendientes = filtroSesionesPendientes + '&estatus=incompleto';

            if (this.selectedLegislatura !== undefined && this.selectedLegislatura !== '') {
                if (filtroSesionesPendientes === '') {
                    filtroSesionesPendientes = 'legislatura.id=' + this.selectedLegislatura;
                } else {
                    filtroSesionesPendientes = filtroSesionesPendientes + '&legislatura.id=' + this.selectedLegislatura;
                }
            }

            if (filtroSesionesPendientes === '') {
                // tslint:disable-next-line: max-line-length
                filtroSesionesPendientes = 'createdAt_gte=' + moment(fechaIni).format('YYYY') + '-01-01' + 'T01:00:00.000Z&createdAt_lte=' + moment(fechaFin).format('YYYY') + '-12-31' + 'T24:00:00.000Z&_limit=-1';
            } else {
                // tslint:disable-next-line: max-line-length
                filtroSesionesPendientes = filtroSesionesPendientes + '&createdAt_gte=' + moment(fechaIni).format('YYYY') + '-01-01' + 'T01:00:00.000Z&createdAt_lte=' + moment(fechaFin).format('YYYY') + '-12-31' + 'T24:00:00.000Z&_limit=-1';
            }

            console.log('pendientes');
            console.log(filtroSesionesPendientes);

            await this.recepcionDeActas.obtenerRecepcionDeActasFiltrado(filtroSesionesPendientes).subscribe((resp: any) => {
                this.arrSesionesProceso = resp.anioTotal;

                console.log('ref');
                console.log(this.arrSesionesProceso);

                //console.log(moment(this.arrDocumentosIngresadosAyer[0].fechaFiltro).format('MMMM'));

                if(this.arrSesionesProceso !== []){
                    while (p <= this.arrSesionesProceso.length - 1) {
                        this.arrSesionesProceso[p].cTiempo = moment(this.arrSesionesProceso[p].fechaFiltro).format('MMMM');
                        this.arrSesionesProceso[p].fecha = moment(this.arrSesionesProceso[p].fechaFiltro).format('YYYY');
                        p++
                    }
                }

                this.sesionesProcesoMes = this.arrSesionesProceso.filter((d) => d['cTiempo'] === moment(this.fechaIni).format('MMMM')).length;

                this.sesionesProcesoAnio = this.arrSesionesProceso.filter((d) => d['fecha'] === moment(this.fechaIni).format('YYYY')).length;

                console.log(this.arrSesionesProceso);

                //this.sesionesAcumuladasMes = this.arrSesionesProceso.length;

                this.arrCreacionGraficaAnioPendiente.push(this.arrSesionesProceso.filter((d) => d['cTiempo'] === 'enero').length);
                this.arrCreacionGraficaAnioPendiente.push(this.arrSesionesProceso.filter((d) => d['cTiempo'] === 'febrero').length);
                this.arrCreacionGraficaAnioPendiente.push(this.arrSesionesProceso.filter((d) => d['cTiempo'] === 'marzo').length);
                this.arrCreacionGraficaAnioPendiente.push(this.arrSesionesProceso.filter((d) => d['cTiempo'] === 'abril').length);
                this.arrCreacionGraficaAnioPendiente.push(this.arrSesionesProceso.filter((d) => d['cTiempo'] === 'mayo').length);
                this.arrCreacionGraficaAnioPendiente.push(this.arrSesionesProceso.filter((d) => d['cTiempo'] === 'junio').length);
                this.arrCreacionGraficaAnioPendiente.push(this.arrSesionesProceso.filter((d) => d['cTiempo'] === 'julio').length);
                this.arrCreacionGraficaAnioPendiente.push(this.arrSesionesProceso.filter((d) => d['cTiempo'] === 'agosto').length);
                this.arrCreacionGraficaAnioPendiente.push(this.arrSesionesProceso.filter((d) => d['cTiempo'] === 'septiembre').length);
                this.arrCreacionGraficaAnioPendiente.push(this.arrSesionesProceso.filter((d) => d['cTiempo'] === 'octubre').length);
                this.arrCreacionGraficaAnioPendiente.push(this.arrSesionesProceso.filter((d) => d['cTiempo'] === 'noviembre').length);
                this.arrCreacionGraficaAnioPendiente.push(this.arrSesionesProceso.filter((d) => d['cTiempo'] === 'diciembre').length);

                this.arrReporteProceso = [[ 'Id', 'Legislatura', 'Estatus', 'Fecha', 'Hora']];

                for (let i = 0, max = this.arrSesionesProceso.length; i < max; i += 1) {
                    if(moment(this.arrSesionesProceso[i].fechaFiltro).format('YYYY-MM-DD') >= fechaIni && moment(this.arrSesionesProceso[i].fechaFiltro).format('YYYY-MM-DD') <= fechaFin){
                        if(!this.arrSesionesProceso[i].legislatura){
                            this.arrSesionesProceso[i].legislatura = 'Sin asignar';
                        }
                        this.arrReporteProceso.push([this.arrSesionesProceso[i].id, this.arrSesionesProceso[i].legislatura, 
                        this.arrSesionesProceso[i].estatus, moment(this.arrSesionesProceso[i].fechaFiltro).format('DD-MM-YYYY'), 
                        this.arrSesionesProceso[i].hora]);
                    }
                }

                //console.log(this.arrReporteProceso);

            }, err => {
                this.spinner.hide();
            });

            let filtroSesionesArchivados = '';

            filtroSesionesArchivados = 'estatus=completo';

            if (this.selectedLegislatura !== undefined && this.selectedLegislatura !== '') {
                if (filtroSesionesArchivados === '') {
                    filtroSesionesArchivados = 'legislatura.id=' + this.selectedLegislatura;
                } else {
                    filtroSesionesArchivados = filtroSesionesArchivados + '&legislatura.id=' + this.selectedLegislatura;
                }
            }

            if (filtroSesionesArchivados === '') {
                // tslint:disable-next-line: max-line-length
                filtroSesionesArchivados = 'createdAt_gte=' + moment(fechaIni).format('YYYY') + '-01-01' + 'T01:00:00.000Z&createdAt_lte=' + moment(fechaFin).format('YYYY') + '-12-31' + 'T24:00:00.000Z&_limit=-1';
            } else {
                // tslint:disable-next-line: max-line-length
                filtroSesionesArchivados = filtroSesionesArchivados + '&createdAt_gte=' + moment(fechaIni).format('YYYY') + '-01-01' + 'T01:00:00.000Z&createdAt_lte=' + moment(fechaFin).format('YYYY') + '-12-31' + 'T24:00:00.000Z&_limit=-1';
            }

            await this.recepcionDeActas.obtenerRecepcionDeActasFiltrado(filtroSesionesArchivados).subscribe((resp: any) => {
                this.arrSesionesArchivadas = resp.anioTotal;
                console.log('ref');
                console.log(this.arrSesionesArchivadas);

                //console.log(moment(this.arrSesionesArchivadas[0].fechaFiltro).format('MMMM'));

                //this.sesionesAcumuladasMes = this.arrSesionesArchivadas.length;

                while (a <= this.arrSesionesArchivadas.length - 1) {
                    this.arrSesionesArchivadas[a].cTiempo = moment(this.arrSesionesArchivadas[a].fechaFiltro).format('MMMM');
                    this.arrSesionesArchivadas[a].fecha = moment(this.arrSesionesArchivadas[a].fechaFiltro).format('YYYY');
                    a++
                }

                this.sesionesArchivadasMes = this.arrSesionesArchivadas.filter((d) => d['cTiempo'] === moment(this.fechaIni).format('MMMM')).length;

                this.sesionesArchivadasAnio = this.arrSesionesArchivadas.filter((d) => d['fecha'] === moment(this.fechaIni).format('YYYY')).length;


                console.log(this.arrSesionesArchivadas);

                this.arrCreacionGraficaAnioArchivada.push(this.arrSesionesArchivadas.filter((d) => d['cTiempo'] === 'enero').length);
                this.arrCreacionGraficaAnioArchivada.push(this.arrSesionesArchivadas.filter((d) => d['cTiempo'] === 'febrero').length);
                this.arrCreacionGraficaAnioArchivada.push(this.arrSesionesArchivadas.filter((d) => d['cTiempo'] === 'marzo').length);
                this.arrCreacionGraficaAnioArchivada.push(this.arrSesionesArchivadas.filter((d) => d['cTiempo'] === 'abril').length);
                this.arrCreacionGraficaAnioArchivada.push(this.arrSesionesArchivadas.filter((d) => d['cTiempo'] === 'mayo').length);
                this.arrCreacionGraficaAnioArchivada.push(this.arrSesionesArchivadas.filter((d) => d['cTiempo'] === 'junio').length);
                this.arrCreacionGraficaAnioArchivada.push(this.arrSesionesArchivadas.filter((d) => d['cTiempo'] === 'julio').length);
                this.arrCreacionGraficaAnioArchivada.push(this.arrSesionesArchivadas.filter((d) => d['cTiempo'] === 'agosto').length);
                this.arrCreacionGraficaAnioArchivada.push(this.arrSesionesArchivadas.filter((d) => d['cTiempo'] === 'septiembre').length);
                this.arrCreacionGraficaAnioArchivada.push(this.arrSesionesArchivadas.filter((d) => d['cTiempo'] === 'octubre').length);
                this.arrCreacionGraficaAnioArchivada.push(this.arrSesionesArchivadas.filter((d) => d['cTiempo'] === 'noviembre').length);
                this.arrCreacionGraficaAnioArchivada.push(this.arrSesionesArchivadas.filter((d) => d['cTiempo'] === 'diciembre').length);


                this.arrReporteArchivado = [[ 'Id', 'Legislatura', 'Estatus', 'Fecha', 'Hora']];

                
                for (let i = 0, max = this.arrSesionesArchivadas.length; i < max; i += 1) {
                    if(moment(this.arrSesionesArchivadas[i].fechaFiltro).format('YYYY-MM-DD') >= fechaIni && moment(this.arrSesionesArchivadas[i].fechaFiltro).format('YYYY-MM-DD') <= fechaFin){
                        if(!this.arrSesionesArchivadas[i].legislatura){
                            this.arrSesionesArchivadas[i].legislatura = 'Sin asignar';
                        }
                        this.arrReporteArchivado.push([this.arrSesionesArchivadas[i].id, this.arrSesionesArchivadas[i].legislatura, 
                        this.arrSesionesArchivadas[i].estatus, moment(this.arrSesionesArchivadas[i].fechaFiltro).format('DD-MM-YYYY'), 
                        this.arrSesionesArchivadas[i].hora]);
                    }
                }

                console.log(this.arrReporteArchivado);

                console.log(this.arrCreacionGraficaAnioArchivada);

                this.configuragraficas();

                this.spinner.hide();
            }, err => {
                this.spinner.hide();
            });
        }
    }

    borrarFiltros(): void {
        // Limpiamos inputs

        this.fechaIni = '';
        this.fechaFin = '';
        this.selectedLegislatura = '';
        this.selectedTipoSesion = '';

    }


    valorMesAnio(event: any): void {

        moment.locale('es');

        console.log(this.fechaAcumulada);
        console.log(moment(this.fechaAcumulada).format('MMMM'))

        let filtroMes = '';
        filtroMes = moment(this.fechaAcumulada).format('MMMM');
        this.sesionesAcumuladasMes = this.arrCreacionGraficaAcumulada.filter((d) => d['cTiempo'] === filtroMes).length;

        let filtroAnio = '';
        filtroAnio = moment(this.fechaAcumulada).format('YYYY');
        this.sesionesAcumuladasAnio = this.arrCreacionGraficaAcumulada.filter((d) => d['fecha'] === filtroAnio).length;
    }

    valorMesAnioProcesada(event: any): void {

        moment.locale('es');

        let filtroMes = '';
        filtroMes = moment(this.fechaProceso).format('MMMM');
        this.sesionesProcesoMes = this.arrSesionesProceso.filter((d) => d['cTiempo'] === filtroMes).length;

        let filtroAnio = '';
        filtroAnio = moment(this.fechaProceso).format('YYYY');
        this.sesionesProcesoAnio = this.arrSesionesProceso.filter((d) => d['fecha'] === filtroAnio).length;
    }

    valorMesAnioArchivada(event: any): void {

        moment.locale('es');

        console.log(this.fechaAcumulada);
        console.log(moment(this.fechaArchivadas).format('MMMM'))

        let filtroMes = '';
        filtroMes = moment(this.fechaArchivadas).format('MMMM');
        this.sesionesArchivadasMes = this.arrSesionesArchivadas.filter((d) => d['cTiempo'] === filtroMes).length;

        let filtroAnio = '';
        filtroAnio = moment(this.fechaArchivadas).format('YYYY');
        this.sesionesArchivadasAnio = this.arrSesionesArchivadas.filter((d) => d['fecha'] === filtroAnio).length;
    }

    configuragraficas(): void {
        this.grafica = {
            chartType: 'line',
            datasets: {
                acumuladas: [

                    {
                        label: 'Acumuladas',
                        data: this.arrCreacionGraficaAnio,
                        fill: 'start'
                    }
                ],
            },
            // tslint:disable-next-line: max-line-length
            labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
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

        this.graficaProceso = {
            chartType: 'bar',
            datasets: {
                pendientes: [

                    {
                        label: 'pendientes',
                        data: this.arrCreacionGraficaAnioPendiente,
                        fill: 'start'
                    }
                ],
            },
            // tslint:disable-next-line: max-line-length
            labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
            colors: [
                {
                    backgroundColor: '#0E599A',
                    pointBackgroundColor: 'rgba(220,220,220,1)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(220,220,220,1)'
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

        this.graficaArchivada = {
            chartType: 'bar',
            datasets: {
                archivada: [

                    {
                        label: 'archivada',
                        data: this.arrCreacionGraficaAnioArchivada,
                        fill: 'start'
                    }
                ],
            },
            // tslint:disable-next-line: max-line-length
            labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
            colors: [
                {
                    backgroundColor: '#0E599A',
                    pointBackgroundColor: 'rgba(220,220,220,1)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(220,220,220,1)'
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

    async generaReport(): Promise<string> {
        return new Promise(async (resolve) => {
            moment.locale('es');
            const fecha = new Date(); // Fecha actual
            let mes: any = fecha.getMonth() + 1; // obteniendo mes
            let dia: any = fecha.getDate(); // obteniendo dia
            const anio = fecha.getFullYear(); // obteniendo año
            let header: any[] = [];
            let presente: any[] = [];
            if (dia < 10) {
                dia = "0" + dia; // agrega cero si el menor de 10
            }
            if (mes < 10) {
                mes = "0" + mes; // agrega cero si el menor de 10
            }
            const fechaActual = dia + "/" + mes + "/" + anio;

            let canvas = <HTMLCanvasElement> document.getElementById('chart1');
            
            console.log(canvas.width);
            console.log(canvas.height);

            let fullQuality = canvas.toDataURL('image/png', 1);

            /*await this.imageService.imageRedimensionada({"image": fullQuality}).subscribe((resp: any) => {
                this.imageCanvas1 = resp;

                console.log(resp);
            }, err => {

            });*/

            // Creamos el reporte

            header = this.configuraHeaderReport();

            /*presente.push({
                text: ["Total sesiones mes (", { text: moment(this.fechaAcumulada).format('MMMM'), bold: true }, "): ", { text: this.sesionesAcumuladasMes, bold: true }, 
                "      Total sesiones año ", { text: this.sesionesAcumuladasAnio, bold: true },],
                fontSize: 12,
                alignment: "center",
                margin: [0, 10, 0, 0],
            });*/

            presente.push({
                text: "Gráfica de sesiones acumuladas",
                fontSize: 12,
                bold: true,
                alignment: "center",
                margin: [0, 10, 0, 0],
            });

            presente.push({
                image: fullQuality,
                fontSize: 12,
                bold: false,
                alignment: "justify",
                margin: [0, 50, 20, 5],
                width: 800,
                height: 184
            });

            presente.push({
                text: "Listado de sesiones acumuladas",
                fontSize: 12,
                bold: true,
                alignment: "center",
                margin: [0, 20, 0, 0],
            });

            //this.arrReporteAcumulado = [['hola', 'chao', 'efe', 'x', 'y']];

            await presente.push({
                //layout: 'lightHorizontalLines', // optional
                margin: [40, 20, 40, 50],
                table: {
                  // headers are automatically repeated if the table spans over multiple pages
                  // you can declare how many rows should be treated as headers

                  headerRows: 1,
                  widths: [ 200, 170, 130, 100, 100],
          
                  body: this.arrReporteAcumulado,
                  fillColor: "#d9d9d9",
                  fillOpacity: "#d9d9d9"
                }
              });


            const aa = {
                header: {
                    columns: [
                        {
                            image: "data:image/jpeg;base64," + this.imageBase64,
                            width: 120,
                            margin: [20, 20, 5, 5],
                        },
                        {
                            nodeName: "DIV",
                            stack: [header],
                        },
                    ],
                },
                pageOrientation: "landscape",
                pageSize: "A4",
                fontSize: 8,
                pageMargins: [10, 100, 40, 50],
                content: [presente],
                styles: {
                    header: {
                        fontSize: 8,
                        bold: true,
                        margin: 0,
                    },
                    subheader: {
                        fontSize: 8,
                        margin: 0,
                    },
                    tableExample: {
                        margin: 0,
                    },
                    tableOpacityExample: {
                        margin: [0, 5, 0, 15],
                        fillColor: "blue",
                        fillOpacity: 0.3,
                    },
                    tableHeader: {
                        bold: true,
                        fontSize: 9,
                        color: "black",
                    },
                },
                defaultStyle: {
                    // alignment: 'justify'
                },
            };

            pdfMake.tableLayouts = {
                exampleLayout: {
                  hLineWidth: function (i, node) {
                    if (i === 0 || i === node.table.body.length) {
                      return 0;
                    }
                    return (i === node.table.headerRows) ? 2 : 1;
                  },
                  vLineWidth: function (i, node) {
                    if (i === 0 || i === node.table.body.length) {
                        return 0;
                      }
                      return (i === node.table.headerRows) ? 2 : 1;
                  },
                  hLineColor: function (i) {
                    return i === 1 ? 'gray' : '#8c8c8c';
                  },
                  vLineColor: function (i) {
                    return i === 1 ? 'gray' : '#aaa';
                  },
                  paddingLeft: function (i) {
                    return i === 0 ? 0 : 8;
                  },
                  paddingRight: function (i, node) {
                    return (i === node.table.widths.length - 1) ? 0 : 8;
                  }
                }
              };

            pdfMake.createPdf(aa).open();

            resolve("ok");
        });
    }

    async generaReportProceso (): Promise<string> {
        return new Promise(async (resolve) => {
            const fecha = new Date(); // Fecha actual
            let mes: any = fecha.getMonth() + 1; // obteniendo mes
            let dia: any = fecha.getDate(); // obteniendo dia
            const anio = fecha.getFullYear(); // obteniendo año
            let header: any[] = [];
            let presente: any[] = [];
            if (dia < 10) {
                dia = "0" + dia; // agrega cero si el menor de 10
            }
            if (mes < 10) {
                mes = "0" + mes; // agrega cero si el menor de 10
            }
            const fechaActual = dia + "/" + mes + "/" + anio;

            let canvas = <HTMLCanvasElement> document.getElementById('chart2');
            
            console.log(canvas.width);
            console.log(canvas.height);

            let fullQuality = canvas.toDataURL('image/png', 1);

            /*await this.imageService.imageRedimensionada({"image": fullQuality}).subscribe((resp: any) => {
                this.imageCanvas1 = resp;

                console.log(resp);
            }, err => {

            });*/

            // Creamos el reporte

            header = this.configuraHeaderReportProcesado();

            /*presente.push({
                text: ["Total sesiones mes (", { text: moment(this.fechaProceso).format('MMMM'), bold: true }, "): ", { text: this.sesionesProcesoMes, bold: true }, 
                "      Total sesiones año ", { text: this.sesionesProcesoAnio, bold: true },],
                fontSize: 12,
                alignment: "center",
                margin: [0, 10, 0, 0],
            });*/

            presente.push({
                text: "Gráfica de sesiones en proceso",
                fontSize: 12,
                bold: true,
                alignment: "center",
                margin: [0, 10, 0, 0],
            });

            presente.push({
                image: fullQuality,
                fontSize: 12,
                bold: false,
                alignment: "justify",
                margin: [0, 50, 20, 5],
                width: 800,
                height: 184
            });

            presente.push({
                text: "Listado de sesiones en proceso",
                fontSize: 12,
                bold: true,
                alignment: "center",
                margin: [0, 20, 0, 0],
            });

            //this.arrReporteAcumulado = [['hola', 'chao', 'efe', 'x', 'y']];

            await presente.push({
                //layout: 'lightHorizontalLines', // optional
                margin: [40, 20, 40, 50],
                table: {
                  // headers are automatically repeated if the table spans over multiple pages
                  // you can declare how many rows should be treated as headers

                  headerRows: 1,
                  widths: [ 130, 170, 200, 100, 100],
          
                  body: this.arrReporteProceso,
                  fillColor: "#d9d9d9",
                  fillOpacity: "#d9d9d9"
                }
              });


            const aa = {
                header: {
                    columns: [
                        {
                            image: "data:image/jpeg;base64," + this.imageBase64,
                            width: 120,
                            margin: [20, 20, 5, 5],
                        },
                        {
                            nodeName: "DIV",
                            stack: [header],
                        },
                    ],
                },
                pageOrientation: "landscape",
                pageSize: "A4",
                fontSize: 8,
                pageMargins: [10, 100, 40, 50],
                content: [presente],
                styles: {
                    header: {
                        fontSize: 8,
                        bold: true,
                        margin: 0,
                    },
                    subheader: {
                        fontSize: 8,
                        margin: 0,
                    },
                    tableExample: {
                        margin: 0,
                    },
                    tableOpacityExample: {
                        margin: [0, 5, 0, 15],
                        fillColor: "blue",
                        fillOpacity: 0.3,
                    },
                    tableHeader: {
                        bold: true,
                        fontSize: 9,
                        color: "black",
                    },
                },
                defaultStyle: {
                    // alignment: 'justify'
                },
            };

            pdfMake.tableLayouts = {
                exampleLayout: {
                  hLineWidth: function (i, node) {
                    if (i === 0 || i === node.table.body.length) {
                      return 0;
                    }
                    return (i === node.table.headerRows) ? 2 : 1;
                  },
                  vLineWidth: function (i, node) {
                    if (i === 0 || i === node.table.body.length) {
                        return 0;
                      }
                      return (i === node.table.headerRows) ? 2 : 1;
                  },
                  hLineColor: function (i) {
                    return i === 1 ? 'gray' : '#8c8c8c';
                  },
                  vLineColor: function (i) {
                    return i === 1 ? 'gray' : '#aaa';
                  },
                  paddingLeft: function (i) {
                    return i === 0 ? 0 : 8;
                  },
                  paddingRight: function (i, node) {
                    return (i === node.table.widths.length - 1) ? 0 : 8;
                  }
                }
              };

            pdfMake.createPdf(aa).open();

            resolve("ok");
        });
    }

    async generaReportArchivada (): Promise<string> {
        return new Promise(async (resolve) => {
            const fecha = new Date(); // Fecha actual
            let mes: any = fecha.getMonth() + 1; // obteniendo mes
            let dia: any = fecha.getDate(); // obteniendo dia
            const anio = fecha.getFullYear(); // obteniendo año
            let header: any[] = [];
            let presente: any[] = [];
            if (dia < 10) {
                dia = "0" + dia; // agrega cero si el menor de 10
            }
            if (mes < 10) {
                mes = "0" + mes; // agrega cero si el menor de 10
            }
            const fechaActual = dia + "/" + mes + "/" + anio;

            let canvas = <HTMLCanvasElement> document.getElementById('chart3');
            
            console.log(canvas.width);
            console.log(canvas.height);

            let fullQuality = canvas.toDataURL('image/png', 1);

            /*await this.imageService.imageRedimensionada({"image": fullQuality}).subscribe((resp: any) => {
                this.imageCanvas1 = resp;

                console.log(resp);
            }, err => {

            });*/

            // Creamos el reporte

            header = this.configuraHeaderReportArchivado();

            /*presente.push({
                text: ["Total sesiones mes (", { text: moment(this.fechaArchivadas).format('MMMM'), bold: true }, "): ", { text: this.sesionesArchivadasMes, bold: true }, 
                "      Total sesiones año ", { text: this.sesionesArchivadasAnio, bold: true },],
                fontSize: 12,
                alignment: "center",
                margin: [0, 10, 0, 0],
            });*/

            presente.push({
                text: "Gráfica de sesiones archivadas",
                fontSize: 12,
                bold: true,
                alignment: "center",
                margin: [0, 10, 0, 0],
            });

            presente.push({
                image: fullQuality,
                fontSize: 12,
                bold: false,
                alignment: "justify",
                margin: [0, 50, 20, 5],
                width: 800,
                height: 184
            });

            presente.push({
                text: "Listado de sesiones archivadas",
                fontSize: 12,
                bold: true,
                alignment: "center",
                margin: [0, 20, 0, 0],
            });

            //this.arrReporteAcumulado = [['hola', 'chao', 'efe', 'x', 'y']];

            await presente.push({
                //layout: 'lightHorizontalLines', // optional
                margin: [40, 20, 40, 50],
                table: {
                  // headers are automatically repeated if the table spans over multiple pages
                  // you can declare how many rows should be treated as headers

                  headerRows: 1,
                  widths: [ 200, 170, 130, 100, 100],
          
                  body: this.arrReporteArchivado,
                  fillColor: "#d9d9d9",
                  fillOpacity: "#d9d9d9"
                }
              });


            const aa = {
                header: {
                    columns: [
                        {
                            image: "data:image/jpeg;base64," + this.imageBase64,
                            width: 120,
                            margin: [20, 20, 5, 5],
                        },
                        {
                            nodeName: "DIV",
                            stack: [header],
                        },
                    ],
                },
                pageOrientation: "landscape",
                pageSize: "A4",
                fontSize: 8,
                pageMargins: [10, 100, 40, 50],
                content: [presente],
                styles: {
                    header: {
                        fontSize: 8,
                        bold: true,
                        margin: 0,
                    },
                    subheader: {
                        fontSize: 8,
                        margin: 0,
                    },
                    tableExample: {
                        margin: 0,
                    },
                    tableOpacityExample: {
                        margin: [0, 5, 0, 15],
                        fillColor: "blue",
                        fillOpacity: 0.3,
                    },
                    tableHeader: {
                        bold: true,
                        fontSize: 9,
                        color: "black",
                    },
                },
                defaultStyle: {
                    // alignment: 'justify'
                },
            };

            pdfMake.tableLayouts = {
                exampleLayout: {
                  hLineWidth: function (i, node) {
                    if (i === 0 || i === node.table.body.length) {
                      return 0;
                    }
                    return (i === node.table.headerRows) ? 2 : 1;
                  },
                  vLineWidth: function (i, node) {
                    if (i === 0 || i === node.table.body.length) {
                        return 0;
                      }
                      return (i === node.table.headerRows) ? 2 : 1;
                  },
                  hLineColor: function (i) {
                    return i === 1 ? 'gray' : '#8c8c8c';
                  },
                  vLineColor: function (i) {
                    return i === 1 ? 'gray' : '#aaa';
                  },
                  paddingLeft: function (i) {
                    return i === 0 ? 0 : 8;
                  },
                  paddingRight: function (i, node) {
                    return (i === node.table.widths.length - 1) ? 0 : 8;
                  }
                }
              };

            pdfMake.createPdf(aa).open();

            resolve("ok");
        });
    }


    configuraHeaderReport(): any {
        // Configuramos en encabezado
        const stack: any[] = [];

        stack.push({
            text: "Reporte de total de sesiones acumuladas",
            nodeName: "H1",
            fontSize: 14,
            bold: true,
            alignment: "center",
            margin: [0, 20, 0, 0],
        });
        stack.push({
            text: ["Fecha inicio: ", { text: moment(this.fechaIni).format('DD-MM-YYYY'), bold: true }],
            nodeName: "H4",
            fontSize: 12,
            bold: false,
            alignment: "center",
        });
        stack.push({
            text: ["Fecha fin: ", { text: moment(this.fechaFin).format('DD-MM-YYYY'), bold: true }],
            nodeName: "H4",
            fontSize: 12,
            bold: false,
            alignment: "center",
        });

        return { stack };
    }

    configuraHeaderReportProcesado(): any {
        // Configuramos en encabezado
        const stack: any[] = [];

        stack.push({
            text: "Reporte de total de sesiones en proceso",
            nodeName: "H1",
            fontSize: 14,
            bold: true,
            alignment: "center",
            margin: [0, 20, 0, 0],
        });
        stack.push({
            text: ["Fecha inicio: ", { text: moment(this.fechaIni).format('DD-MM-YYYY'), bold: true }],
            nodeName: "H4",
            fontSize: 12,
            bold: false,
            alignment: "center",
        });
        stack.push({
            text: ["Fecha fin: ", { text: moment(this.fechaFin).format('DD-MM-YYYY'), bold: true }],
            nodeName: "H4",
            fontSize: 12,
            bold: false,
            alignment: "center",
        });

        return { stack };
    }

    configuraHeaderReportArchivado(): any {
        // Configuramos en encabezado
        const stack: any[] = [];

        stack.push({
            text: "Reporte de total de sesiones archivadas",
            nodeName: "H1",
            fontSize: 14,
            bold: true,
            alignment: "center",
            margin: [0, 20, 0, 0],
        });
        stack.push({
            text: ["Fecha inicio: ", { text: moment(this.fechaIni).format('DD-MM-YYYY'), bold: true }],
            nodeName: "H4",
            fontSize: 12,
            bold: false,
            alignment: "center",
        });
        stack.push({
            text: ["Fecha inicio: ", { text: moment(this.fechaFin).format('DD-MM-YYYY'), bold: true }],
            nodeName: "H4",
            fontSize: 12,
            bold: false,
            alignment: "center",
        });

        return { stack };
    }

}



