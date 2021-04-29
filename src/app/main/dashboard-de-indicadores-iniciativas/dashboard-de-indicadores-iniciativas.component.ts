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
import { IniciativasService } from "services/iniciativas.service";
import { ComisionesService } from 'services/comisiones.service';
import * as moment from 'moment';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import * as Chart from 'chart.js';
pdfMake.vfs = pdfFonts.pdfMake.vfs; // fonts provided for pdfmake
import { Ng2ImgMaxService } from 'ng2-img-max';
import { MatChipInputEvent } from "@angular/material/chips";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { ChartOptions, ChartType } from 'chart.js';
import { Label } from 'ng2-charts';
import 'chartjs-plugin-labels';
import { normalize } from 'path';

export interface Estado {
  id: string;
  descripcion: string;
}

export interface Autores {
    name: string;
}

@Component({
  selector: 'app-dashboard-de-indicadores-iniciativas',
  templateUrl: './dashboard-de-indicadores-iniciativas.component.html',
  styleUrls: ['./dashboard-de-indicadores-iniciativas.component.scss'],
  providers: [DatePipe]
})

export class DashboardDeIndicadoresIniciativasComponent implements OnInit {

    vigenteBusqueda: string;
    fileUrl: any;
    loadingIndicator: boolean;
    reorderable: boolean;
    cargando: boolean;
    tipoSesion: Estado[] = [];
    selectedTipoSesion: string;
    arrLegislaturas: any[] = [];
    selectedLegislatura: any = undefined;
    optAgregar: boolean;
    optConsultar: boolean;
    optEditar: boolean;
    optEliminar: boolean;
    fileBase64: any;
    isLinear = false;
    firstFormGroup: FormGroup;
    secondFormGroup: FormGroup;
    arrInformacion = [];
    maxDate = new Date();
    anio = '';
    fechaAcumulada = '';
    fechaIniciativaAcumulada = '';
    fechaIniciativaAcumuladaAprobada = '';
    fechaIniciativaAcumuladaNoAprobada = '';
    fechaArchivadas = '';
    fechaPublicados = '';
    fechaDecretoConcluida = '';
    fechaDecretoSolicitud = '';
    fechaIni = '';
    fechaFin = '';
    arrTipo = [];
    selectTipo: any = undefined;
    arrComisiones = []
    selectedComision: any = undefined;
    selectable = true;
    removable = true;
    addOnBlur = true;
    readonly separatorKeysCodes: number[] = [ENTER, COMMA];
    autores: Autores[] = [];
    
    arrCreacionGraficaIniciativaAcumulada = [];
    arrCreacionGraficaIniciativaAut = [];
    arrCreacionGraficaIniciativaAutAcum = [];
    arrcreacionGraficaComisionesAsignadas = [];
    arrcreacionGraficaComisionesAsignadasSorted = [];
    arrcreacionGraficaComisionesAsignadasValor = [];
    arrcreacionGraficaAutoresSorted = [];
    arrcreacionGraficaAutoresValor = [];
    arrIniciativasAcumuladas = [];
    arrIniciativasEstatus = [];
    arrSesionesArchivadas = [];
    
    arrCreacionGraficaAyer = [];
    arrConsultaGraficaAyer = [];
    arrEliminadosGraficaAyer = [];

    //Variables usadas
    cantidadTotalMes: number;
    cantidadTotalAnio: number;

    arrCreacionGraficaAnio = [];
    arrCreacionGraficaEstatusIniciativas = [];
    arrCreacionGraficaDictamenes = [];
    arrCreacionGraficaDecretosPublicados = [];
    arrCreacionGraficaDecretosSolicitudPublicacion = [];
    tablaAutores = [];
    tablaAutoresMostrar = [];
    tablaEstatusIniciativa = [];
    tablaEstatusIniciativaMostrar = [];
    tablaEstatusIniciativaInicial = [];
    tablaEstatusIniciativaInicialMostrar = [];
    tablaAutors = [];
    tablaAutorsMostrar = [];
    tablaAdicions = [];
    tablaAdicionsMostrar = [];
    tablaComisiones = [];
    tablaComisionesMostrar = [];
    tablaDictamen = [];
    tablaDictamenMostrar = [];
    arrReporteAcumulado = [];
    arrReportePublicado = [];
    arrReporteEstatusDecreto = [];
    arrReporteComision = [];
    arrReporteAutor = [];
    arrReporteAdicion = []
    arrReporteEstatusIniciativa = [];
    arrReporteEstatusIniciativaInicial = [];
    arrReporteDictamenes = [];
    arrReporteIniciativaAcumulada = [];
    arrReporteArchivado = [];
    arrCreacionGraficaIniciativasAcumuladas = [];
    arrCreacionGraficaIniciativasAcumuladasN = [];
    arrCreacionGraficaAnioArchivada = [];
    arrEliminadosGraficaMes = [];
    activarDescarga: boolean = true;

    decretosAcumuladosMes: number;
    decretosAcumuladosAnio: number;
    dictamenesTotales: number;
    decretosPublicadosMes: number;
    decretosPublicadosAnio: number;
    decretosSolicitudPublicacionMes: number;
    decretosSolicitudPublicacionAnio: number;
    iniciativasAcumuladasMes: number;
    iniciativasAcumuladasAnio: number;
    iniciativasAcumuladasMesAprobada: number;
    iniciativasAcumuladasAnioAprobada: number;
    iniciativasAcumuladasMesNoAprobada: number;
    iniciativasAcumuladasAnioNoAprobada: number;
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
    graficaAutor: any;
    graficaDictamen: any;
    graficaPublicada: any;
    graficaEstatusDecreto: any;
    graficaComisiones: any;
    graficaFechas: any;
    imageBase64: any;
    imageCanvas1: any;

    pieChartOptions: ChartOptions;
    pieChartLabels: Label[];
    pieChartData: number[];
    pieChartType: ChartType;
    pieChartLegend = true;
    pieChartPlugins = [];
    pieChartColors = [
        {
          backgroundColor: ['rgba(255,0,0,0.3)', 'rgba(0,255,0,0.3)', 'rgba(0,0,255,0.3)'],
        },
      ];
    autorCompare: string = '';
    adicionCompare: string = '';
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
        private iniciativaService: IniciativasService,
        private comisionesService: ComisionesService,
        private sanitizer: DomSanitizer) {
        // Obtenemos documentos
        // this.obtenerDocumentos();
        this.configuragraficas();
        this.obtenerTiposIniciativas();
        this.obtenerComisiones();
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
      
      this.selectedLegislatura = undefined;
      this.selectedComision = undefined;
      this.selectTipo = undefined;

        this.obtenerLegislatura();

        this.arrInformacion = this.menuService.tipoInformacion;

        // Formulario reactivo
        this.firstFormGroup = this._formBuilder.group({
            tipoRegistro: [''],
            legislatura: [''],
            comision: [''],
            autores: [''],
            etiquetasAutores: [{ value: "", disabled: false }],
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

    async obtenerComisiones(): Promise<void> {
        return new Promise((resolve) => {
            {
                this.comisionesService.obtenerComisiones().subscribe(
                    (resp: any) => {
                        for (const comisiones of resp) {
                            if (comisiones.activo) {
                                this.arrComisiones.push(comisiones);
                            }
                        }
                        console.log(this.arrComisiones);
                        resolve(resp);
                    },
                    (err) => {
                        Swal.fire(
                            "Error",
                            "Ocurrió un error al obtener las comisiones." +
                            err,
                            "error"
                        );
                        resolve(err);
                    }
                );
            }
        });
    }

    async obtenerTiposIniciativas(): Promise<void> {
        // Obtenemos Distritos
        this.spinner.show();
        await this.iniciativaService.obtenerTiposIniciativas().subscribe(
            (resp: any) => {
                this.arrTipo = resp;
                console.log(this.arrTipo);
                this.spinner.hide();
            },
            (err) => {
                Swal.fire(
                    "Error",
                    "Ocurrió un error obtener los tipos de iniciativas." + err,
                    "error"
                );
                this.spinner.hide();
            }
        );
    }

    async obtenerLegislatura(): Promise<void> {
        return new Promise((resolve) => {
            {
                this.legislaturaService.obtenerLegislatura().subscribe(
                    (resp: any) => {
                        for (const legislatura of resp) {
                            if (legislatura.bActual && legislatura.bActivo) {
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

    agregarAutor(event: MatChipInputEvent): void {
        const input = event.input;
        const value = event.value;

        if ((value || "").trim()) {
            this.autores.push({ name: value.trim() });
            console.log(this.autores);
        }

        // Reset the input value
        if (input) {
            input.value = "";
        }
    }

    eliminarAutor(autor: Autores): void {
        const index = this.autores.indexOf(autor);

        if (index >= 0) {
            this.autores.splice(index, 1);
            console.log(this.autores);
        }
    }

    async obtenerMovimientos(): Promise<void> {

        this.spinner.show();

        moment.locale('es');
        let meses = 0;
        let inicial: string;
        let final: string;
        this.arrCreacionGraficaIniciativaAcumulada = [];
        this.arrCreacionGraficaIniciativaAut = [];
        this.arrCreacionGraficaIniciativaAutAcum = [];
        this.arrIniciativasAcumuladas = [];
        this.arrSesionesArchivadas = [];
        this.arrCreacionGraficaAnio = [];
        this.arrCreacionGraficaEstatusIniciativas = [];
        this.arrCreacionGraficaDictamenes = [];
        this.arrCreacionGraficaDecretosPublicados = [];
        this.arrCreacionGraficaDecretosSolicitudPublicacion = [];
        this.arrcreacionGraficaComisionesAsignadas = [];
        this.arrCreacionGraficaIniciativasAcumuladas = [];
        this.arrCreacionGraficaIniciativasAcumuladasN = [];
        this.arrCreacionGraficaAnioArchivada = [];
        this.arrcreacionGraficaComisionesAsignadasSorted = [];
        this.arrcreacionGraficaComisionesAsignadasValor = [];
        this.arrcreacionGraficaAutoresValor = [];
        this.arrcreacionGraficaAutoresSorted = [];
        this.arrReporteAcumulado = [];
        this.arrReporteIniciativaAcumulada = [];
        this.tablaComisiones = [];
        this.tablaAutors = [];
        this.tablaAutorsMostrar = [];
        this.autorCompare = '';
        this.tablaDictamen = [];
        this.tablaEstatusIniciativa = [];
        this.tablaEstatusIniciativaMostrar = [];
        this.tablaEstatusIniciativaInicialMostrar = [];
        this.tablaEstatusIniciativaInicial = [];
        this.tablaDictamenMostrar = [];
        this.tablaDictamen = [];
        this.tablaAdicionsMostrar = [];
        this.tablaAdicions = [];
        this.arrMeses = [];
        let ini = new Date(this.fechaIni);
        const fin = new Date(this.fechaFin);
        const fechaIni = moment(this.firstFormGroup.get('fechaIni').value).format('YYYY-MM-DD');
        let mesIni = moment(this.fechaIni).format('YYYY-MM-DD');
        const fechaFin = moment(this.firstFormGroup.get('fechaFin').value).format('YYYY-MM-DD');
        inicial = moment(this.fechaIni).format('YYYY-MM-DD');
        final = moment(this.fechaFin).format('YYYY-MM-DD');
        let i: number = 0;
        let p: number = 0;
        let a: number = 0;

        this.fechaAcumulada = moment(this.fechaIni).format('YYYY-MM');
        this.fechaIniciativaAcumulada = moment(this.fechaIni).format('YYYY-MM');
        this.fechaIniciativaAcumuladaAprobada = moment(this.fechaIni).format('YYYY-MM');
        this.fechaIniciativaAcumuladaNoAprobada = moment(this.fechaIni).format('YYYY-MM');
        this.fechaPublicados = moment(this.fechaIni).format('YYYY-MM');
        this.fechaAcumulada = moment(this.fechaIni).format('YYYY-MM');
        this.fechaAcumulada = moment(this.fechaIni).format('YYYY-MM');
        this.fechaAcumulada = moment(this.fechaIni).format('YYYY-MM');

        if(this.selectTipo == '5ff5ebc2dacfb729306116b8'){
            this.selectedComision = '';
        }

        let filtroReporte = '';

        if (ini > fin) {
            Swal.fire('Error', 'La fecha inicial no puede ser mayor a la final.', 'error');
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

            console.log('meses');
            console.log(this.arrMeses);*/
            

            /*if (this.selectedLegislatura !== undefined && this.selectedLegislatura !== '') {
                if (filtroReporte === '') {
                    filtroReporte = 'actasSesion.legislatura=' + this.selectedLegislatura;
                } else {
                    filtroReporte = filtroReporte + '&actasSesion.legislatura=' + this.selectedLegislatura;
                }
            }*/

            /*if (this.selectTipo !== undefined && this.selectTipo !== '') {
                if (filtroReporte === '') {
                    filtroReporte = 'tipo_de_iniciativa.id=' + this.selectTipo;
                } else {
                    filtroReporte = filtroReporte + '&tipo_de_iniciativa.id=' + this.selectTipo;
                }
            }*/

            /*if (this.selectedComision !== undefined && this.selectedComision !== '') {
                if (filtroReporte === '') {
                    filtroReporte = 'comisiones.id=' + this.selectedComision;
                } else {
                    filtroReporte = filtroReporte + '&comisiones.id=' + this.selectedComision;
                }
            }*/

            /*if (filtroReporte === '') {
                // tslint:disable-next-line: max-line-length
                filtroReporte = 'createdAt_gte=' + fechaIni + 'T01:00:00.000Z&createdAt_lte=' + fechaFin + 'T24:00:00.000Z&_limit=-1';
            } else {
                // tslint:disable-next-line: max-line-length
                filtroReporte = filtroReporte + '&createdAt_gte=' + fechaIni + 'T01:00:00.000Z&createdAt_lte=' + fechaFin + 'T24:00:00.000Z&_limit=-1';
            }*/

            filtroReporte = '_limit=-1';

            // Obtenemos los entes

            //console.log(filtroReporte);
            
            await this.iniciativaService.obtenerIniciativasFiltrado(filtroReporte).subscribe((resp: any) => {
                this.arrCreacionGraficaIniciativaAcumulada = resp.anioTotal;

                //console.log(this.arrCreacionGraficaIniciativaAcumulada);

                //console.log(this.autores);

                let autores = '';

                this.autores.forEach(element => {
                    if(autores === ''){
                        autores = element.name;
                    }else{
                        autores = autores + ',' + element.name;
                    }
                });

                let separatedAutor = autores.split(",");

                let normalizedAutores = separatedAutor.map(el => el.toLowerCase());

                if(!Array.isArray(this.autores) || this.autores.length === 0){

                    /* No hay autores */
                    this.arrCreacionGraficaIniciativaAcumulada.forEach(element => {
                        if(moment(element.fechaFiltro).format('YYYY-MM-DD') >= fechaIni && moment(element.fechaFiltro).format('YYYY-MM-DD') <= fechaFin){
                            this.arrCreacionGraficaIniciativaAut.push(element);
                        }
                    })

                }else{
                    this.arrCreacionGraficaIniciativaAcumulada.forEach(element =>{
                        element.autores.forEach(ele => {
                            normalizedAutores.forEach(aut=>{
                                //console.log(aut.name);
                                if(ele.name.toLowerCase() == aut){
                                    //Comprobamos si el array ya existe.
                                    if(!this.arrCreacionGraficaIniciativaAut.includes(element)){
                                        if(moment(element.fechaFiltro).format('YYYY-MM-DD') >= fechaIni && moment(element.fechaFiltro).format('YYYY-MM-DD') <= fechaFin){
                                            this.arrCreacionGraficaIniciativaAut.push(element);
                                        }
                                    }else{
                                        console.log('el elemento ya existe');
                                    }
                                }
                            })
                        });
                    });
                    //let arrAutoresIniciativas = this.arrCreacionGraficaIniciativaAut;
                }

                console.log(this.arrCreacionGraficaIniciativaAut);

                //console.log(moment(this.arrCreacionGraficaIniciativaAcumulada[0].fechaFiltro).format('YYYY'));
                
                while (i <= this.arrCreacionGraficaIniciativaAcumulada.length - 1) {
                    this.arrCreacionGraficaIniciativaAcumulada[i].cTiempo = moment(this.arrCreacionGraficaIniciativaAcumulada[i].fechaFiltro).format('MMMM');
                    this.arrCreacionGraficaIniciativaAcumulada[i].fecha = moment(this.arrCreacionGraficaIniciativaAcumulada[i].fechaFiltro).format('YYYY');
                    i++
                }
                
                this.decretosAcumuladosMes = this.arrCreacionGraficaIniciativaAcumulada.filter((d) => d['cTiempo'] === 'enero' && d['estatus'] === 'Publicada').length;

                this.decretosAcumuladosAnio = this.arrCreacionGraficaIniciativaAcumulada.filter((d) => d['fecha'] === '2021' && d['estatus'] === 'Publicada').length;

                this.arrCreacionGraficaAnio.push(this.arrCreacionGraficaIniciativaAcumulada.filter((d) => d['cTiempo'] === 'enero' && d['fecha'] === moment(this.fechaIni).format('YYYY') && d['estatus'] === 'Publicada').length);
                this.arrCreacionGraficaAnio.push(this.arrCreacionGraficaAnio[0] + this.arrCreacionGraficaIniciativaAcumulada.filter((d) => d['cTiempo'] === 'febrero' && d['fecha'] === moment(this.fechaIni).format('YYYY') && d['estatus'] === 'Publicada').length);
                this.arrCreacionGraficaAnio.push(this.arrCreacionGraficaAnio[1] + this.arrCreacionGraficaIniciativaAcumulada.filter((d) => d['cTiempo'] === 'marzo' && d['fecha'] === moment(this.fechaIni).format('YYYY') && d['estatus'] === 'Publicada').length);
                this.arrCreacionGraficaAnio.push(this.arrCreacionGraficaAnio[2] + this.arrCreacionGraficaIniciativaAcumulada.filter((d) => d['cTiempo'] === 'abril' && d['fecha'] === moment(this.fechaIni).format('YYYY') && d['estatus'] === 'Publicada').length);
                this.arrCreacionGraficaAnio.push(this.arrCreacionGraficaAnio[3] + this.arrCreacionGraficaIniciativaAcumulada.filter((d) => d['cTiempo'] === 'mayo' && d['fecha'] === moment(this.fechaIni).format('YYYY') && d['estatus'] === 'Publicada').length);
                this.arrCreacionGraficaAnio.push(this.arrCreacionGraficaAnio[4] + this.arrCreacionGraficaIniciativaAcumulada.filter((d) => d['cTiempo'] === 'junio' && d['fecha'] === moment(this.fechaIni).format('YYYY') && d['estatus'] === 'Publicada').length);
                this.arrCreacionGraficaAnio.push(this.arrCreacionGraficaAnio[5] + this.arrCreacionGraficaIniciativaAcumulada.filter((d) => d['cTiempo'] === 'julio' && d['fecha'] === moment(this.fechaIni).format('YYYY') && d['estatus'] === 'Publicada').length);
                this.arrCreacionGraficaAnio.push(this.arrCreacionGraficaAnio[6] + this.arrCreacionGraficaIniciativaAcumulada.filter((d) => d['cTiempo'] === 'agosto' && d['fecha'] === moment(this.fechaIni).format('YYYY') && d['estatus'] === 'Publicada').length);
                this.arrCreacionGraficaAnio.push(this.arrCreacionGraficaAnio[7] + this.arrCreacionGraficaIniciativaAcumulada.filter((d) => d['cTiempo'] === 'septiembre' && d['fecha'] === moment(this.fechaIni).format('YYYY') && d['estatus'] === 'Publicada').length);
                this.arrCreacionGraficaAnio.push(this.arrCreacionGraficaAnio[8] + this.arrCreacionGraficaIniciativaAcumulada.filter((d) => d['cTiempo'] === 'octubre' && d['fecha'] === moment(this.fechaIni).format('YYYY') && d['estatus'] === 'Publicada').length);
                this.arrCreacionGraficaAnio.push(this.arrCreacionGraficaAnio[9] + this.arrCreacionGraficaIniciativaAcumulada.filter((d) => d['cTiempo'] === 'noviembre' && d['fecha'] === moment(this.fechaIni).format('YYYY') && d['estatus'] === 'Publicada').length);
                this.arrCreacionGraficaAnio.push(this.arrCreacionGraficaAnio[10] + this.arrCreacionGraficaIniciativaAcumulada.filter((d) => d['cTiempo'] === 'diciembre' && d['fecha'] === moment(this.fechaIni).format('YYYY') && d['estatus'] === 'Publicada').length);

                this.arrReporteAcumulado = [[ 'Folio', 'Fecha de iniciativa', 'Fecha de estatus', 'Estatus', 'Autores', 'Tema']];
                
                let reportAcumulado = [];
                let noData = false;

                if(this.selectTipo !== undefined && this.selectTipo !== ''){
                    console.log(this.selectTipo);
                    reportAcumulado = this.arrCreacionGraficaIniciativaAut.filter(element => element.tipoIniciativa.id === this.selectTipo);
                    if(reportAcumulado.length === 0){
                        noData = true;
                    }
                }

                console.log(reportAcumulado);
                if(noData == true){
                    reportAcumulado = [];
                } else if (reportAcumulado.length === 0){
                    if(this.selectedLegislatura !== undefined && this.selectedLegislatura !== ''){
                        console.log(this.selectedLegislatura);
                        reportAcumulado = this.arrCreacionGraficaIniciativaAut.filter(element => element.legislatura == this.selectedLegislatura);
                        if(reportAcumulado.length === 0){
                            noData = true;
                        }
                    }
                } else {
                    if(this.selectedLegislatura !== undefined && this.selectedLegislatura !== ''){
                        reportAcumulado = reportAcumulado.filter(element => element.legislatura == this.selectedLegislatura);
                        if(reportAcumulado.length === 0){
                            noData = true;
                        }
                    }
                }

                console.log(reportAcumulado);
                if(noData == true){
                    reportAcumulado = [];
                } else if (reportAcumulado.length === 0){
                    if(this.selectedComision !== undefined && this.selectedComision !== ''){
                        console.log(this.selectedComision);
                        reportAcumulado = this.arrCreacionGraficaIniciativaAut.filter(element => element.comisionesId == this.selectedComision);
                        if(reportAcumulado.length === 0){
                            noData = true;
                        }
                    }
                } else {
                    if(this.selectedComision !== undefined && this.selectedComision !== ''){
                        reportAcumulado = reportAcumulado.filter(element => element.comisionesId == this.selectedComision);
                        if(reportAcumulado.length === 0){
                            noData = true;
                        }
                    }
                }

                console.log(reportAcumulado);
                if (reportAcumulado.length === 0){
                    reportAcumulado = this.arrCreacionGraficaIniciativaAut;
                    if(reportAcumulado.length === 0){
                        noData = true;
                    }
                }

                if(noData == true){
                    reportAcumulado = [];
                }

                console.log(reportAcumulado);

                for (let i = 0, max = reportAcumulado.length; i < max; i += 1) {
                    if(moment(reportAcumulado[i].fechaFiltro).format('YYYY-MM-DD') >= fechaIni && moment(reportAcumulado[i].fechaFiltro).format('YYYY-MM-DD') <= fechaFin){
                        if(!reportAcumulado[i].legislatura){
                            reportAcumulado[i].legislatura = 'Sin asignar';
                        }

                        if(reportAcumulado[i].estatus === 'Publicada'){
                        this.arrReporteAcumulado.push([reportAcumulado[i].id, moment(reportAcumulado[i].fechaIniciativa).format('DD-MM-YYYY'), 
                            moment(reportAcumulado[i].fechaFiltro).format('DD-MM-YYYY'), reportAcumulado[i].estatus, 
                            reportAcumulado[i].autoresText, reportAcumulado[i].temaText]);
                        }
                    }
                }

                /*************************/
                /* Autores de iniciativa */
                /*************************/

                this.arrCreacionGraficaIniciativaAcumulada.forEach(element => {
                    if(this.autorCompare === ''){
                        this.autorCompare = element.autorCompare;
                    }else{
                        this.autorCompare = this.autorCompare + ',' + element.autorCompare;
                    }
                });

                let separatedAutors = this.autorCompare.split(",");
                let normalizedInputArray = separatedAutors.map(el => el.toLowerCase());
                let autorsValue = [];
                let autorsEqual = [];

                //console.log(separatedAutors);

                normalizedInputArray.forEach(value => {
                    autorsValue.push({"autor": value, "valor": normalizedInputArray.filter(el => el === value).length});
                });

                autorsValue.sort((a, b) => b.valor - a.valor);
                //console.log(autorsValue);

                autorsValue.forEach(autors => {
                    if (!autorsEqual.find(aut => aut.autor == autors.autor && aut.valor == autors.valor)) {
                        const { autor, valor } = autors;
                        autorsEqual.push({ autor, valor });
                    }
                });
                //console.log(autorsEqual);

                this.arrReporteAutor = [[ 'Autor', 'Cantidad total de iniciativas propuestas']];

                if(autorsEqual.length < 5){
                    for (let i = 0; i < autorsEqual.length; i++) {
                        this.arrcreacionGraficaAutoresSorted.push(autorsEqual[i].autor);
                        this.arrcreacionGraficaAutoresValor.push(autorsEqual[i].valor);
                        this.tablaAutors.push({"valor": autorsEqual[i].valor, "autor": autorsEqual[i].autor});
                        
                    }
                }else{
                    for (let i = 0; i < 5; i++) {
                        this.arrcreacionGraficaAutoresSorted.push(autorsEqual[i].autor);
                        this.arrcreacionGraficaAutoresValor.push(autorsEqual[i].valor);
                        this.tablaAutors.push({"valor": autorsEqual[i].valor, "autor": autorsEqual[i].autor});
                        
                    }
                }

                this.tablaAutorsMostrar = this.tablaAutors;

                //Reporte

                this.autorCompare = '';

                reportAcumulado.forEach(element => {
                    if(this.autorCompare === ''){
                        this.autorCompare = element.autorCompare;
                    }else{
                        this.autorCompare = this.autorCompare + ',' + element.autorCompare;
                    }
                });

                if(this.autorCompare === ''){
                    this.autorCompare = "No existen autores registrados de acuerdo al filtro de búsqueda.";
                }

                let separatedAutorsReport = this.autorCompare.split(",");
                let normalizedInputArrayReport = separatedAutorsReport.map(el => el.toLowerCase());
                let autorsValueReport = [];
                let autorsEqualReport = [];

                console.log(separatedAutorsReport);

                if(this.autorCompare == "No existen autores registrados de acuerdo al filtro de búsqueda."){
                    normalizedInputArrayReport.forEach(value => {
                        autorsValueReport.push({"autor": value, "valor": 'N/A'});
                    });
                } else {
                    normalizedInputArrayReport.forEach(value => {
                        autorsValueReport.push({"autor": value, "valor": normalizedInputArrayReport.filter(el => el === value).length});
                    });
                }

                autorsValueReport.sort((a, b) => b.valor - a.valor);
                console.log(autorsValueReport);

                autorsValueReport.forEach(autors => {
                    if (!autorsEqualReport.find(aut => aut.autor == autors.autor && aut.valor == autors.valor)) {
                        const { autor, valor } = autors;
                        autorsEqualReport.push({ autor, valor });
                    }
                });
                console.log(autorsEqualReport);

                let autoresFiltrados = [];
                let autorsObject = [];

                if(!Array.isArray(this.autores) || this.autores.length === 0){
                    autorsObject = autorsEqualReport;
                } else {
                    this.autores.forEach(ele => {
                        autoresFiltrados.push(autorsEqualReport.filter(element => element.autor == ele.name.toLowerCase()));
                    });

                    autoresFiltrados.forEach(element => {
                        element.forEach(ele => {
                            autorsObject.push({"autor": ele.autor, "valor": ele.valor});
                        });
                    });
                    console.log(autorsObject);
                }
                
                this.arrReporteAutor = [[ 'Autor', 'Cantidad total de iniciativas propuestas']];

                if(autorsObject.length < 5){
                    for (let i = 0; i < autorsObject.length; i++) {
                        this.arrReporteAutor.push([autorsObject[i].autor, autorsObject[i].valor]);
                    }
                }else{
                    for (let i = 0; i < 5; i++) {
                        this.arrReporteAutor.push([autorsObject[i].autor, autorsObject[i].valor]);
                    }
                }

                console.log(this.arrReporteAutor);
                //console.log(this.arrcreacionGraficaAutoresValor);

                this.arrCreacionGraficaIniciativaAcumulada.forEach(element => {
                    if(this.adicionCompare === ''){
                        this.adicionCompare = element.adicionText;
                    }else{
                        this.adicionCompare = this.adicionCompare + ',' + element.adicionText;
                    }
                });

                let separatedAdicions = this.adicionCompare.split(",");
                let normalizedInputArrayAdicion = separatedAdicions.map(el => el.toLowerCase());
                let adicionsValue = [];
                let adicionsEqual = [];

                //console.log(separatedAdicions);

                normalizedInputArrayAdicion.forEach(value => {
                    adicionsValue.push({"adicion": value, "valor": normalizedInputArrayAdicion.filter(el => el === value).length});
                });

                adicionsValue.sort((a, b) => b.valor - a.valor);
                //console.log(adicionsValue);

                adicionsValue.forEach(adicions => {
                    if(adicions.adicion !== ""){
                        if (!adicionsEqual.find(adi => adi.adicion == adicions.adicion && adi.valor == adicions.valor)) {
                            const { adicion, valor } = adicions;
                            adicionsEqual.push({ adicion, valor });
                        }
                    }
                });

                this.arrReporteAdicion = [[ 'Autor', 'Cantidad total de iniciativas propuestas']];

                //console.log(adicionsEqual);

                if(adicionsEqual.length < 5){
                    for (let i = 0; i < adicionsEqual.length; i++) {
                        this.tablaAdicions.push({"valor": adicionsEqual[i].valor, "adicion": adicionsEqual[i].adicion});
                    }
                }else{
                    for (let i = 0; i < 5; i++) {
                        this.tablaAdicions.push({"valor": adicionsEqual[i].valor, "adicion": adicionsEqual[i].adicion});
                    }
                }
                
                this.tablaAdicionsMostrar = this.tablaAdicions;

                // reporte adicion 

                this.adicionCompare = '';

                reportAcumulado.forEach(element => {
                    if(this.adicionCompare === ''){
                        this.adicionCompare = element.adicionText;
                    }else{
                        this.adicionCompare = this.adicionCompare + ',' + element.adicionText;
                    }
                });

                
                if(this.adicionCompare === ''){
                    this.adicionCompare = "No existen autores registrados de acuerdo al filtro de búsqueda.";
                }

                let separatedAdicionsReport = this.adicionCompare.split(",");
                let normalizedInputArrayAdicionReport = separatedAdicionsReport.map(el => el.toLowerCase());
                let adicionsValueReport = [];
                let adicionsEqualReport = [];

                //console.log(separatedAdicions);

                if(this.adicionCompare == "No existen autores registrados de acuerdo al filtro de búsqueda."){
                    normalizedInputArrayAdicionReport.forEach(value => {
                        adicionsValueReport.push({"adicion": value, "valor": 'N/A'});
                    });
                } else {
                    normalizedInputArrayAdicionReport.forEach(value => {
                        adicionsValueReport.push({"adicion": value, "valor": normalizedInputArrayAdicionReport.filter(el => el === value).length});
                    });
                }

                adicionsValueReport.sort((a, b) => b.valor - a.valor);
                //console.log(adicionsValue);

                adicionsValueReport.forEach(adicions => {
                    if(adicions.adicion !== ""){
                        if (!adicionsEqualReport.find(adi => adi.adicion == adicions.adicion && adi.valor == adicions.valor)) {
                            const { adicion, valor } = adicions;
                            adicionsEqualReport.push({ adicion, valor });
                        }
                    }
                });

                let adicionFiltrado = [];
                let adicionObject = [];

                if(!Array.isArray(this.autores) || this.autores.length === 0){
                    adicionObject = adicionsEqualReport;
                } else {
                    this.autores.forEach(ele => {
                        adicionFiltrado.push(adicionsEqualReport.filter(element => element.autor == ele.name.toLowerCase()));
                    });

                    adicionFiltrado.forEach(element => {
                        element.forEach(ele => {
                            adicionObject.push({"autor": ele.autor, "valor": ele.valor});
                        });
                    });
                    console.log(adicionObject);
                }

                this.arrReporteAdicion = [[ 'Autor', 'Cantidad total de iniciativas propuestas']];

                //console.log(adicionsEqual);

                if(adicionObject.length < 5){
                    for (let i = 0; i < adicionObject.length; i++) {
                        this.arrReporteAdicion.push([adicionObject[i].adicion, adicionObject[i].valor]);
                    }
                }else{
                    for (let i = 0; i < 5; i++) {
                        this.arrReporteAdicion.push([adicionObject[i].adicion, adicionObject[i].valor]);
                    }
                }
                
                //console.log(this.tablaAdicions);

                /************************/
                /* Dictamenes aprobados */
                /************************/

                this.arrCreacionGraficaDictamenes.push(this.arrCreacionGraficaIniciativaAcumulada.filter((d) => d['dictamenDeIniciativa'] === 'Aprobada' && d['estatus'] === 'Publicada').length);
                this.arrCreacionGraficaDictamenes.push(this.arrCreacionGraficaIniciativaAcumulada.filter((d) => d['dictamenDeIniciativa'] === 'No aprobada' && d['estatus'] === 'Suspendida').length);
                this.arrCreacionGraficaDictamenes.push(this.arrCreacionGraficaIniciativaAcumulada.filter((d) => d['dictamenDeIniciativa'] === 'Modificación' && d['estatus'] === 'Turnada a comisión para modificación').length);

                this.tablaDictamen.push({dictamen: 'Aprobado', valor: this.arrCreacionGraficaDictamenes[0]});
                this.tablaDictamen.push({dictamen: 'No aprobado', valor: this.arrCreacionGraficaDictamenes[1]});
                this.tablaDictamen.push({dictamen: 'Modificación', valor: this.arrCreacionGraficaDictamenes[2]});

                let reportDictamen = [];

                reportDictamen.push(reportAcumulado.filter((d) => d['dictamenDeIniciativa'] === 'Aprobada' && d['estatus'] === 'Publicada').length);
                reportDictamen.push(reportAcumulado.filter((d) => d['dictamenDeIniciativa'] === 'No aprobada' && d['estatus'] === 'Suspendida').length);
                reportDictamen.push(reportAcumulado.filter((d) => d['dictamenDeIniciativa'] === 'Modificación' && d['estatus'] === 'Turnada a comisión para modificación').length);

                this.arrReporteDictamenes = [['Dictámenes', 'Cantidad total']];

                let dictamenFiltrado = [];

                dictamenFiltrado.push({"dictamen": "Aprobado", "valor": reportDictamen[0]});
                dictamenFiltrado.push({"dictamen": "No aprobado", "valor": reportDictamen[1]});
                dictamenFiltrado.push({"dictamen": "Modificación", "valor": reportDictamen[2]});

                /*for (let i = 0, max = dictamenFiltrado.length; i < max; i += 1) {
                    let dictamen: string = '';
                    if(i = 0){
                        dictamen = 'Aprobados';
                    } else if (i = 1){
                        dictamen = 'No aprobados';
                    } else {
                        dictamen = 'Modificados';
                    }
                    if(dictamenFiltrado[i].valor > 0){
                        this.arrReporteDictamenes.push([dictamen, dictamenFiltrado[i].valor]);
                    }
                }*/

                for (let i = 0; i < 3; i++) {
                    if(dictamenFiltrado[i].valor > 0){
                        this.arrReporteDictamenes.push([dictamenFiltrado[i].dictamen, dictamenFiltrado[i].valor]);
                    }
                }
                
                /*this.arrReporteDictamenes.push(['Aprobados', reportDictamen[0]]);
                this.arrReporteDictamenes.push(['No aprobados', reportDictamen[1]]);
                this.arrReporteDictamenes.push(['Modificados', reportDictamen[2]]);*/

                this.tablaDictamenMostrar = this.tablaDictamen;

                this.dictamenesTotales = this.arrCreacionGraficaDictamenes[0] + this.arrCreacionGraficaDictamenes[1] + this.arrCreacionGraficaDictamenes[2];

                /***********************/
                /* Decretos publicados */
                /***********************/

                this.arrCreacionGraficaDecretosPublicados.push(this.arrCreacionGraficaIniciativaAcumulada.filter((d) => d['cTiempo'] === 'enero' && d['estatus'] === 'Publicada').length);
                this.arrCreacionGraficaDecretosPublicados.push(this.arrCreacionGraficaIniciativaAcumulada.filter((d) => d['cTiempo'] === 'febrero' && d['estatus'] === 'Publicada').length);
                this.arrCreacionGraficaDecretosPublicados.push(this.arrCreacionGraficaIniciativaAcumulada.filter((d) => d['cTiempo'] === 'marzo' && d['estatus'] === 'Publicada').length);
                this.arrCreacionGraficaDecretosPublicados.push(this.arrCreacionGraficaIniciativaAcumulada.filter((d) => d['cTiempo'] === 'abril' && d['estatus'] === 'Publicada').length);
                this.arrCreacionGraficaDecretosPublicados.push(this.arrCreacionGraficaIniciativaAcumulada.filter((d) => d['cTiempo'] === 'mayo' && d['estatus'] === 'Publicada').length);
                this.arrCreacionGraficaDecretosPublicados.push(this.arrCreacionGraficaIniciativaAcumulada.filter((d) => d['cTiempo'] === 'junio' && d['estatus'] === 'Publicada').length);
                this.arrCreacionGraficaDecretosPublicados.push(this.arrCreacionGraficaIniciativaAcumulada.filter((d) => d['cTiempo'] === 'julio' && d['estatus'] === 'Publicada').length);
                this.arrCreacionGraficaDecretosPublicados.push(this.arrCreacionGraficaIniciativaAcumulada.filter((d) => d['cTiempo'] === 'agosto' && d['estatus'] === 'Publicada').length);
                this.arrCreacionGraficaDecretosPublicados.push(this.arrCreacionGraficaIniciativaAcumulada.filter((d) => d['cTiempo'] === 'septiembre' && d['estatus'] === 'Publicada').length);
                this.arrCreacionGraficaDecretosPublicados.push(this.arrCreacionGraficaIniciativaAcumulada.filter((d) => d['cTiempo'] === 'octubre' && d['estatus'] === 'Publicada').length);
                this.arrCreacionGraficaDecretosPublicados.push(this.arrCreacionGraficaIniciativaAcumulada.filter((d) => d['cTiempo'] === 'noviembre' && d['estatus'] === 'Publicada').length);
                this.arrCreacionGraficaDecretosPublicados.push(this.arrCreacionGraficaIniciativaAcumulada.filter((d) => d['cTiempo'] === 'diciembre' && d['estatus'] === 'Publicada').length);

                this.decretosPublicadosMes = this.arrCreacionGraficaIniciativaAcumulada.filter((d) => d['cTiempo'] === 'enero' && d['estatus'] === 'Publicada').length;
                this.decretosPublicadosAnio = this.arrCreacionGraficaIniciativaAcumulada.filter((d) => d['fecha'] === '2021' && d['estatus'] === 'Publicada').length;

                this.arrReportePublicado = [[ 'Folio', 'Fecha de iniciativa', 'Fecha de estatus', 'Estatus', 'Autores', 'Tema']];

                for (let i = 0, max = reportAcumulado.length; i < max; i += 1) {
                    if(reportAcumulado[i].estatus === 'Publicada'){
                        if(!reportAcumulado[i].legislatura){
                            reportAcumulado[i].legislatura = 'Sin asignar';
                        }
                        this.arrReportePublicado.push([reportAcumulado[i].id, moment(reportAcumulado[i].fechaIniciativa).format('DD-MM-YYYY'), 
                        moment(reportAcumulado[i].fechaFiltro).format('DD-MM-YYYY'), reportAcumulado[i].estatus, 
                        reportAcumulado[i].autoresText, reportAcumulado[i].temaText]);
                    }else{

                    }
                }

                /***********************/
                /* Estatus del decreto */
                /***********************/

                this.arrCreacionGraficaDecretosSolicitudPublicacion.push(this.arrCreacionGraficaIniciativaAcumulada.filter((d) => d['cTiempo'] === 'enero' && d['estatus'] === 'Turnada a publicación').length);
                this.arrCreacionGraficaDecretosSolicitudPublicacion.push(this.arrCreacionGraficaIniciativaAcumulada.filter((d) => d['cTiempo'] === 'febrero' && d['estatus'] === 'Turnada a publicación').length);
                this.arrCreacionGraficaDecretosSolicitudPublicacion.push(this.arrCreacionGraficaIniciativaAcumulada.filter((d) => d['cTiempo'] === 'marzo' && d['estatus'] === 'Turnada a publicación').length);
                this.arrCreacionGraficaDecretosSolicitudPublicacion.push(this.arrCreacionGraficaIniciativaAcumulada.filter((d) => d['cTiempo'] === 'abril' && d['estatus'] === 'Turnada a publicación').length);
                this.arrCreacionGraficaDecretosSolicitudPublicacion.push(this.arrCreacionGraficaIniciativaAcumulada.filter((d) => d['cTiempo'] === 'mayo' && d['estatus'] === 'Turnada a publicación').length);
                this.arrCreacionGraficaDecretosSolicitudPublicacion.push(this.arrCreacionGraficaIniciativaAcumulada.filter((d) => d['cTiempo'] === 'junio' && d['estatus'] === 'Turnada a publicación').length);
                this.arrCreacionGraficaDecretosSolicitudPublicacion.push(this.arrCreacionGraficaIniciativaAcumulada.filter((d) => d['cTiempo'] === 'julio' && d['estatus'] === 'Turnada a publicación').length);
                this.arrCreacionGraficaDecretosSolicitudPublicacion.push(this.arrCreacionGraficaIniciativaAcumulada.filter((d) => d['cTiempo'] === 'agosto' && d['estatus'] === 'Turnada a publicación').length);
                this.arrCreacionGraficaDecretosSolicitudPublicacion.push(this.arrCreacionGraficaIniciativaAcumulada.filter((d) => d['cTiempo'] === 'septiembre' && d['estatus'] === 'Turnada a publicación').length);
                this.arrCreacionGraficaDecretosSolicitudPublicacion.push(this.arrCreacionGraficaIniciativaAcumulada.filter((d) => d['cTiempo'] === 'octubre' && d['estatus'] === 'Turnada a publicación').length);
                this.arrCreacionGraficaDecretosSolicitudPublicacion.push(this.arrCreacionGraficaIniciativaAcumulada.filter((d) => d['cTiempo'] === 'noviembre' && d['estatus'] === 'Turnada a publicación').length);
                this.arrCreacionGraficaDecretosSolicitudPublicacion.push(this.arrCreacionGraficaIniciativaAcumulada.filter((d) => d['cTiempo'] === 'diciembre' && d['estatus'] === 'Turnada a publicación').length);

                this.decretosSolicitudPublicacionMes = this.arrCreacionGraficaIniciativaAcumulada.filter((d) => d['cTiempo'] === 'enero' && d['estatus'] === 'Turnada a publicación').length;
                this.decretosSolicitudPublicacionAnio = this.arrCreacionGraficaIniciativaAcumulada.filter((d) => d['fecha'] === '2021' && d['estatus'] === 'Turnada a publicación').length;

                this.arrReporteEstatusDecreto = [[ 'Folio', 'Fecha de iniciativa', 'Fecha de estatus', 'Estatus', 'Autores', 'Tema']];

                console.log(reportAcumulado);

                for (let i = 0, max = reportAcumulado.length; i < max; i += 1) {
                    if(reportAcumulado[i].estatus === 'Publicada'){
                        if(!reportAcumulado[i].legislatura){
                            reportAcumulado[i].legislatura = 'Sin asignar';
                        }
                        this.arrReporteEstatusDecreto.push([reportAcumulado[i].id, moment(reportAcumulado[i].fechaIniciativa).format('DD-MM-YYYY'), 
                        moment(reportAcumulado[i].fechaFiltro).format('DD-MM-YYYY'), reportAcumulado[i].estatus, 
                        reportAcumulado[i].autoresText, reportAcumulado[i].temaText]);
                    }else{

                    }
                }
                
                for (let i = 0, max = reportAcumulado.length; i < max; i += 1) {
                    if(reportAcumulado[i].estatus === 'Turnada a publicación'){
                        if(!reportAcumulado[i].legislatura){
                            reportAcumulado[i].legislatura = 'Sin asignar';
                        }
                        this.arrReporteEstatusDecreto.push([reportAcumulado[i].id, moment(reportAcumulado[i].fechaIniciativa).format('DD-MM-YYYY'), 
                        moment(reportAcumulado[i].fechaFiltro).format('DD-MM-YYYY'), reportAcumulado[i].estatus, 
                        reportAcumulado[i].autoresText, reportAcumulado[i].temaText]);
                    }else{

                    }
                }

                /*************************/
                /* Estatus de iniciativa */
                /*************************/

                this.arrCreacionGraficaEstatusIniciativas.push(this.arrCreacionGraficaIniciativaAcumulada.filter((d) => d['estatus'] === 'Registrada').length);
                this.arrCreacionGraficaEstatusIniciativas.push(this.arrCreacionGraficaIniciativaAcumulada.filter((d) => d['estatus'] === 'Turnar dictamen a secretaría de servicios parlamentarios' || d['estatus'] === 'Turnada a publicación').length);
                this.arrCreacionGraficaEstatusIniciativas.push(this.arrCreacionGraficaIniciativaAcumulada.filter((d) => d['estatus'] === 'Turnar iniciativa a CIEL' || d['estatus'] === 'Turnar dictamen a Secretaría General').length);
                this.arrCreacionGraficaEstatusIniciativas.push(this.arrCreacionGraficaIniciativaAcumulada.filter((d) => d['estatus'] === 'Turnar dictamen a Mesa Directiva').length);

                //console.log(this.arrCreacionGraficaEstatusIniciativas);

                this.arrReporteEstatusIniciativa = [[ 'Departamento', 'Cantidad total', 'Etapa']];
                this.arrReporteEstatusIniciativaInicial = [[ 'Departamento', 'Cantidad total', 'Etapa']];

                this.tablaEstatusIniciativaInicial.push({departamento: 'Secretaría General', valor: this.arrCreacionGraficaEstatusIniciativas[0]});
                this.tablaEstatusIniciativa.push({departamento: 'Secretaría General', valor: this.arrCreacionGraficaEstatusIniciativas[1]});
                this.tablaEstatusIniciativa.push({departamento: 'Centro de Investigación y Estudios Legislativos', valor: this.arrCreacionGraficaEstatusIniciativas[2]});
                this.tablaEstatusIniciativa.push({departamento: 'Mesa directiva', valor: this.arrCreacionGraficaEstatusIniciativas[3]});

                this.tablaEstatusIniciativaMostrar = this.tablaEstatusIniciativa;
                this.tablaEstatusIniciativaInicialMostrar = this.tablaEstatusIniciativaInicial;

                let estatusIniciativa = []

                estatusIniciativa.push(reportAcumulado.filter((d) => d['estatus'] === 'Registrada').length);
                estatusIniciativa.push(reportAcumulado.filter((d) => d['estatus'] === 'Turnar dictamen a secretaría de servicios parlamentarios' || d['estatus'] === 'Turnada a publicación').length);
                estatusIniciativa.push(reportAcumulado.filter((d) => d['estatus'] === 'Turnar iniciativa a CIEL' || d['estatus'] === 'Turnar dictamen a Secretaría General').length);
                estatusIniciativa.push(reportAcumulado.filter((d) => d['estatus'] === 'Turnar dictamen a Mesa Directiva').length);

                for (let i = 0; i < 4; i++) {
                    let estatus: string = '';
                    let etapa: string = '';
                    if(i == 0){
                        estatus = 'Secretaría General';
                        etapa = 'Inicial';
                    } else if (i == 1){
                        estatus = 'Secretaría General';
                        etapa = 'En proceso';
                    } else if (i == 2){
                        estatus = 'Centro de Investigación y Estudios Legislativos';
                        etapa = 'En proceso';
                    } else {
                        estatus = 'Mesa directiva';
                        etapa = 'En proceso';
                    }
                    if(i == 0){
                        if(estatusIniciativa[i] > 0){
                            this.arrReporteEstatusIniciativaInicial.push([estatus, estatusIniciativa[i], etapa]);
                        }
                    } else {
                        if(estatusIniciativa[i] > 0){
                            this.arrReporteEstatusIniciativa.push([estatus, estatusIniciativa[i], etapa]);   
                        }
                    }
                }

                /************************/
                /* Comisiones asignadas */
                /************************/

                this.arrReporteComision = [[ 'Comisión', 'Cantidad total']];

                this.arrComisiones.forEach(element => {
                    this.arrcreacionGraficaComisionesAsignadas.push({"valor": this.arrCreacionGraficaIniciativaAcumulada.filter((d) => d['comisiones'] === element.descripcion).length, "comision": element.descripcion});
                });

                this.arrcreacionGraficaComisionesAsignadas.sort((a, b) => b.valor - a.valor);

                /*this.arrcreacionGraficaComisionesAsignadas.forEach(element =>{
                    this.arrcreacionGraficaComisionesAsignadasSorted.push(element.comision);
                    this.arrcreacionGraficaComisionesAsignadasValor.push(element.valor);
                    this.tablaComisiones.push({"valor": element.valor, "comision": element.comision});
                    this.arrReporteComision.push([element.comision,  element.valor]);
                });*/

                for (let i = 0; i < 5; i++) {
                    this.arrcreacionGraficaComisionesAsignadasSorted.push(this.arrcreacionGraficaComisionesAsignadas[i].comision);
                    this.arrcreacionGraficaComisionesAsignadasValor.push(this.arrcreacionGraficaComisionesAsignadas[i].valor);
                    this.tablaComisiones.push({"valor": this.arrcreacionGraficaComisionesAsignadas[i].valor, "comision": this.arrcreacionGraficaComisionesAsignadas[i].comision});
                    //this.arrReporteComision.push([this.arrcreacionGraficaComisionesAsignadas[i].comision, this.arrcreacionGraficaComisionesAsignadas[i].valor]);
                }

                //console.log('Comisiones');

                this.tablaComisionesMostrar = this.tablaComisiones;

                //console.log(this.arrcreacionGraficaComisionesAsignadasValor);
                //console.log(this.arrcreacionGraficaComisionesAsignadasSorted);

                let comisionesReport = [];

                this.arrComisiones.forEach(element => {
                    comisionesReport.push({"valor": reportAcumulado.filter((d) => d['comisiones'] === element.descripcion).length, "comision": element.descripcion});
                });

                comisionesReport.sort((a, b) => b.valor - a.valor);

                for (let i = 0; i < 5; i++) {
                    if(comisionesReport[i].valor > 0){
                        this.arrReporteComision.push([comisionesReport[i].comision, comisionesReport[i].valor]);
                    }
                }

                this.activarDescarga = false;

                this.configuragraficas();
                this.spinner.hide();
            }, err => {
                this.spinner.hide();
            });

            let filtroIniciativasAcumuladas = '';

            filtroIniciativasAcumuladas = 'dictamenDeIniciativa=Aprobada&dictamenDeIniciativa=No aprobada' + 
            '&estatus=Publicada&estatus=Suspendida&_limit=-1';

            /*if (this.selectedLegislatura !== undefined && this.selectedLegislatura !== '') {
                if (filtroIniciativasAcumuladas === '') {
                    filtroIniciativasAcumuladas = 'actasSesion.legislatura=' + this.selectedLegislatura;
                } else {
                    filtroIniciativasAcumuladas = filtroIniciativasAcumuladas + '&actasSesion.legislatura=' + this.selectedLegislatura;
                }
            }*/

            /*if (this.selectTipo !== undefined && this.selectTipo !== '') {
                if (filtroIniciativasAcumuladas === '') {
                    filtroIniciativasAcumuladas = 'tipo_de_iniciativa.id=' + this.selectTipo;
                } else {
                    filtroIniciativasAcumuladas = filtroIniciativasAcumuladas + '&tipo_de_iniciativa.id=' + this.selectTipo;
                }
            }*/

            /*if (this.selectedComision !== undefined && this.selectedComision !== '') {
                if (filtroIniciativasAcumuladas === '') {
                    filtroIniciativasAcumuladas = 'comisiones.id=' + this.selectedComision;
                } else {
                    filtroIniciativasAcumuladas = filtroIniciativasAcumuladas + '&comisiones.id=' + this.selectedComision;
                }
            }*/

            /*if (filtroIniciativasAcumuladas === '') {
                // tslint:disable-next-line: max-line-length
                filtroIniciativasAcumuladas = 'createdAt_gte=' + fechaIni + 'T01:00:00.000Z&createdAt_lte=' + fechaFin + 'T24:00:00.000Z&_limit=-1';
            } else {
                // tslint:disable-next-line: max-line-length
                filtroIniciativasAcumuladas = filtroIniciativasAcumuladas + '&createdAt_gte=' + fechaIni + 'T01:00:00.000Z&createdAt_lte=' + fechaFin + 'T24:00:00.000Z&_limit=-1';
            }*/
            // Obtenemos los entes

            //console.log('filtro');
            //console.log(filtroIniciativasAcumuladas);

            await this.iniciativaService.obtenerIniciativasFiltrado(filtroIniciativasAcumuladas).subscribe((resp: any) => {
                this.arrIniciativasAcumuladas = resp.anioTotal;

                //console.log(this.autores);

                let autores = '';

                this.autores.forEach(element => {
                    if(autores === ''){
                        autores = element.name;
                    }else{
                        autores = autores + ',' + element.name;
                    }
                });

                let separatedAutor = autores.split(",");

                let normalizedAutores = separatedAutor.map(el => el.toLowerCase());

                if(!Array.isArray(this.autores) || this.autores.length === 0){

                    /* No hay autores */
                    this.arrIniciativasAcumuladas.forEach(element => {
                        if(moment(element.fechaFiltro).format('YYYY-MM-DD') >= fechaIni && moment(element.fechaFiltro).format('YYYY-MM-DD') <= fechaFin){
                            this.arrCreacionGraficaIniciativaAutAcum.push(element);
                        }
                    })

                }else{
                    this.arrIniciativasAcumuladas.forEach(element =>{
                        element.autores.forEach(ele => {
                            normalizedAutores.forEach(aut=>{
                                //console.log(aut.name);
                                if(ele.name.toLowerCase() == aut){
                                    //Comprobamos si el array ya existe.
                                    if(!this.arrCreacionGraficaIniciativaAutAcum.includes(element)){
                                        if(moment(element.fechaFiltro).format('YYYY-MM-DD') >= fechaIni && moment(element.fechaFiltro).format('YYYY-MM-DD') <= fechaFin){
                                            this.arrCreacionGraficaIniciativaAutAcum.push(element);
                                        }
                                    }else{
                                        console.log('el elemento ya existe');
                                    }
                                }
                            })
                        });
                    });
                    //let arrAutoresIniciativas = this.arrCreacionGraficaIniciativaAut;
                }

                //console.log(this.arrCreacionGraficaIniciativaAutAcum);
                //console.log(moment(this.arrDocumentosIngresadosAyer[0].fechaFiltro).format('MMMM'));

                while (p <= this.arrIniciativasAcumuladas.length - 1) {
                    this.arrIniciativasAcumuladas[p].cTiempo = moment(this.arrIniciativasAcumuladas[p].fechaFiltro).format('MMMM');
                    this.arrIniciativasAcumuladas[p].fecha = moment(this.arrIniciativasAcumuladas[p].fechaFiltro).format('YYYY');
                    p++
                }

                //Total general
                this.iniciativasAcumuladasMes = this.arrIniciativasAcumuladas.filter((d) => d['cTiempo'] === 'enero').length;
                this.iniciativasAcumuladasAnio = this.arrIniciativasAcumuladas.filter((d) => d['fecha'] === '2021').length;
                //Aprobada
                this.iniciativasAcumuladasMesAprobada = this.arrIniciativasAcumuladas.filter((d) => d['cTiempo'] === 'enero' && d['dictamenDeIniciativa'] === 'Aprobada' && d['estatus'] === 'Publicada').length;
                this.iniciativasAcumuladasAnioAprobada = this.arrIniciativasAcumuladas.filter((d) => d['fecha'] === '2021' && d['dictamenDeIniciativa'] === 'Aprobada' && d['estatus'] === 'Publicada').length;
                //No aprobada
                this.iniciativasAcumuladasMesNoAprobada = this.arrIniciativasAcumuladas.filter((d) => d['cTiempo'] === 'enero' && d['dictamenDeIniciativa'] === 'No aprobada' && d['estatus'] === 'Suspendida').length;
                this.iniciativasAcumuladasAnioNoAprobada = this.arrIniciativasAcumuladas.filter((d) => d['fecha'] === '2021' && d['dictamenDeIniciativa'] === 'No aprobada' && d['estatus'] === 'Suspendida').length;

                //console.log(this.arrIniciativasAcumuladas);

                //this.sesionesAcumuladasMes = this.arrSesionesProceso.length;

                this.arrCreacionGraficaIniciativasAcumuladas.push(this.arrIniciativasAcumuladas.filter((d) => d['cTiempo'] === 'enero' && d['fecha'] === moment(this.fechaIni).format('YYYY') && d['dictamenDeIniciativa'] === 'Aprobada').length);
                this.arrCreacionGraficaIniciativasAcumuladas.push(this.arrCreacionGraficaIniciativasAcumuladas[0] + this.arrIniciativasAcumuladas.filter((d) => d['cTiempo'] === 'febrero' && d['fecha'] === moment(this.fechaIni).format('YYYY') && d['dictamenDeIniciativa'] === 'Aprobada').length);
                this.arrCreacionGraficaIniciativasAcumuladas.push(this.arrCreacionGraficaIniciativasAcumuladas[1] + this.arrIniciativasAcumuladas.filter((d) => d['cTiempo'] === 'marzo' && d['fecha'] === moment(this.fechaIni).format('YYYY') && d['dictamenDeIniciativa'] === 'Aprobada').length);
                this.arrCreacionGraficaIniciativasAcumuladas.push(this.arrCreacionGraficaIniciativasAcumuladas[2] + this.arrIniciativasAcumuladas.filter((d) => d['cTiempo'] === 'abril' && d['fecha'] === moment(this.fechaIni).format('YYYY') && d['dictamenDeIniciativa'] === 'Aprobada').length);
                this.arrCreacionGraficaIniciativasAcumuladas.push(this.arrCreacionGraficaIniciativasAcumuladas[3] + this.arrIniciativasAcumuladas.filter((d) => d['cTiempo'] === 'mayo' && d['fecha'] === moment(this.fechaIni).format('YYYY') && d['dictamenDeIniciativa'] === 'Aprobada').length);
                this.arrCreacionGraficaIniciativasAcumuladas.push(this.arrCreacionGraficaIniciativasAcumuladas[4] + this.arrIniciativasAcumuladas.filter((d) => d['cTiempo'] === 'junio' && d['fecha'] === moment(this.fechaIni).format('YYYY') && d['dictamenDeIniciativa'] === 'Aprobada').length);
                this.arrCreacionGraficaIniciativasAcumuladas.push(this.arrCreacionGraficaIniciativasAcumuladas[5] + this.arrIniciativasAcumuladas.filter((d) => d['cTiempo'] === 'julio' && d['fecha'] === moment(this.fechaIni).format('YYYY') && d['dictamenDeIniciativa'] === 'Aprobada').length);
                this.arrCreacionGraficaIniciativasAcumuladas.push(this.arrCreacionGraficaIniciativasAcumuladas[6] + this.arrIniciativasAcumuladas.filter((d) => d['cTiempo'] === 'agosto' && d['fecha'] === moment(this.fechaIni).format('YYYY') && d['dictamenDeIniciativa'] === 'Aprobada').length);
                this.arrCreacionGraficaIniciativasAcumuladas.push(this.arrCreacionGraficaIniciativasAcumuladas[7] + this.arrIniciativasAcumuladas.filter((d) => d['cTiempo'] === 'septiembre' && d['fecha'] === moment(this.fechaIni).format('YYYY') && d['dictamenDeIniciativa'] === 'Aprobada').length);
                this.arrCreacionGraficaIniciativasAcumuladas.push(this.arrCreacionGraficaIniciativasAcumuladas[8] + this.arrIniciativasAcumuladas.filter((d) => d['cTiempo'] === 'octubre' && d['fecha'] === moment(this.fechaIni).format('YYYY') && d['dictamenDeIniciativa'] === 'Aprobada').length);
                this.arrCreacionGraficaIniciativasAcumuladas.push(this.arrCreacionGraficaIniciativasAcumuladas[9] + this.arrIniciativasAcumuladas.filter((d) => d['cTiempo'] === 'noviembre' && d['fecha'] === moment(this.fechaIni).format('YYYY') && d['dictamenDeIniciativa'] === 'Aprobada').length);
                this.arrCreacionGraficaIniciativasAcumuladas.push(this.arrCreacionGraficaIniciativasAcumuladas[10] + this.arrIniciativasAcumuladas.filter((d) => d['cTiempo'] === 'diciembre' && d['fecha'] === moment(this.fechaIni).format('YYYY') && d['dictamenDeIniciativa'] === 'Aprobada').length);

                this.arrCreacionGraficaIniciativasAcumuladasN.push(this.arrIniciativasAcumuladas.filter((d) => d['cTiempo'] === 'enero' && d['fecha'] === moment(this.fechaIni).format('YYYY')  && d['dictamenDeIniciativa'] === 'No aprobada').length);
                this.arrCreacionGraficaIniciativasAcumuladasN.push(this.arrCreacionGraficaIniciativasAcumuladasN[0] + this.arrIniciativasAcumuladas.filter((d) => d['cTiempo'] === 'febrero' && d['fecha'] === moment(this.fechaIni).format('YYYY') && d['dictamenDeIniciativa'] === 'No aprobada').length);
                this.arrCreacionGraficaIniciativasAcumuladasN.push(this.arrCreacionGraficaIniciativasAcumuladasN[1] + this.arrIniciativasAcumuladas.filter((d) => d['cTiempo'] === 'marzo' && d['fecha'] === moment(this.fechaIni).format('YYYY') && d['dictamenDeIniciativa'] === 'No aprobada').length);
                this.arrCreacionGraficaIniciativasAcumuladasN.push(this.arrCreacionGraficaIniciativasAcumuladasN[2] + this.arrIniciativasAcumuladas.filter((d) => d['cTiempo'] === 'abril' && d['fecha'] === moment(this.fechaIni).format('YYYY') && d['dictamenDeIniciativa'] === 'No aprobada').length);
                this.arrCreacionGraficaIniciativasAcumuladasN.push(this.arrCreacionGraficaIniciativasAcumuladasN[3] + this.arrIniciativasAcumuladas.filter((d) => d['cTiempo'] === 'mayo' && d['fecha'] === moment(this.fechaIni).format('YYYY') && d['dictamenDeIniciativa'] === 'No aprobada').length);
                this.arrCreacionGraficaIniciativasAcumuladasN.push(this.arrCreacionGraficaIniciativasAcumuladasN[4] + this.arrIniciativasAcumuladas.filter((d) => d['cTiempo'] === 'junio' && d['fecha'] === moment(this.fechaIni).format('YYYY') && d['dictamenDeIniciativa'] === 'No aprobada').length);
                this.arrCreacionGraficaIniciativasAcumuladasN.push(this.arrCreacionGraficaIniciativasAcumuladasN[5] + this.arrIniciativasAcumuladas.filter((d) => d['cTiempo'] === 'julio' && d['fecha'] === moment(this.fechaIni).format('YYYY') && d['dictamenDeIniciativa'] === 'No aprobada').length);
                this.arrCreacionGraficaIniciativasAcumuladasN.push(this.arrCreacionGraficaIniciativasAcumuladasN[6] + this.arrIniciativasAcumuladas.filter((d) => d['cTiempo'] === 'agosto' && d['fecha'] === moment(this.fechaIni).format('YYYY') && d['dictamenDeIniciativa'] === 'No aprobada').length);
                this.arrCreacionGraficaIniciativasAcumuladasN.push(this.arrCreacionGraficaIniciativasAcumuladasN[7] + this.arrIniciativasAcumuladas.filter((d) => d['cTiempo'] === 'septiembre' && d['fecha'] === moment(this.fechaIni).format('YYYY') && d['dictamenDeIniciativa'] === 'No aprobada').length);
                this.arrCreacionGraficaIniciativasAcumuladasN.push(this.arrCreacionGraficaIniciativasAcumuladasN[8] + this.arrIniciativasAcumuladas.filter((d) => d['cTiempo'] === 'octubre' && d['fecha'] === moment(this.fechaIni).format('YYYY') && d['dictamenDeIniciativa'] === 'No aprobada').length);
                this.arrCreacionGraficaIniciativasAcumuladasN.push(this.arrCreacionGraficaIniciativasAcumuladasN[9] + this.arrIniciativasAcumuladas.filter((d) => d['cTiempo'] === 'noviembre' && d['fecha'] === moment(this.fechaIni).format('YYYY') && d['dictamenDeIniciativa'] === 'No aprobada').length);
                this.arrCreacionGraficaIniciativasAcumuladasN.push(this.arrCreacionGraficaIniciativasAcumuladasN[10] + this.arrIniciativasAcumuladas.filter((d) => d['cTiempo'] === 'diciembre' && d['fecha'] === moment(this.fechaIni).format('YYYY') && d['dictamenDeIniciativa'] === 'No aprobada').length);

                //console.log('iniciativasacumuladas');
                //console.log(this.arrCreacionGraficaIniciativasAcumuladasN);
                //console.log(this.arrCreacionGraficaIniciativasAcumuladas);

                this.arrReporteIniciativaAcumulada = [[ 'Folio', 'Fecha de iniciativa', 'Fecha de estatus', 'Estatus', 'Autores', 'Tema']];

                let reportIniciativaAcumulada = [];
                let noData = false;

                if(this.selectTipo !== undefined && this.selectTipo !== ''){
                    console.log(this.selectTipo);
                    reportIniciativaAcumulada = this.arrCreacionGraficaIniciativaAutAcum.filter(element => element.tipoIniciativa.id === this.selectTipo);
                    if(reportIniciativaAcumulada.length === 0){
                        noData = true;
                    }
                }

                if(noData == true){
                    reportIniciativaAcumulada = [];
                } else if (reportIniciativaAcumulada.length === 0){
                    if(this.selectedLegislatura !== undefined && this.selectedLegislatura !== ''){
                        console.log(this.selectedLegislatura);
                        reportIniciativaAcumulada = this.arrCreacionGraficaIniciativaAutAcum.filter(element => element.legislatura == this.selectedLegislatura);
                        if(reportIniciativaAcumulada.length === 0){
                            noData = true;
                        }
                    }
                } else {
                    if(this.selectedLegislatura !== undefined && this.selectedLegislatura !== ''){
                        reportIniciativaAcumulada = reportIniciativaAcumulada.filter(element => element.legislatura == this.selectedLegislatura);
                        if(reportIniciativaAcumulada.length === 0){
                            noData = true;
                        }
                    }
                }

                if(noData == true){
                    reportIniciativaAcumulada = [];
                } else if (reportIniciativaAcumulada.length === 0){
                    if(this.selectedComision !== undefined && this.selectedComision !== ''){
                        console.log(this.selectedComision);
                        reportIniciativaAcumulada = this.arrCreacionGraficaIniciativaAutAcum.filter(element => element.comisionesId == this.selectedComision);
                        if(reportIniciativaAcumulada.length === 0){
                            noData = true;
                        }
                    }
                } else {
                    if(this.selectedComision !== undefined && this.selectedComision !== ''){
                        reportIniciativaAcumulada = reportIniciativaAcumulada.filter(element => element.comisionesId == this.selectedComision);
                        if(reportIniciativaAcumulada.length === 0){
                            noData = true;
                        }
                    }
                }

                if (reportIniciativaAcumulada.length === 0){
                    reportIniciativaAcumulada = this.arrCreacionGraficaIniciativaAutAcum;
                    if(reportIniciativaAcumulada.length === 0){
                        noData = true;
                    }
                }

                if(noData == true){
                    reportIniciativaAcumulada = [];
                }

                console.log(reportIniciativaAcumulada);

                for (let i = 0, max = reportIniciativaAcumulada.length; i < max; i += 1) {

                    if(!reportIniciativaAcumulada[i].legislatura){
                        reportIniciativaAcumulada[i].legislatura = 'Sin asignar';
                    }

                    this.arrReporteIniciativaAcumulada.push([reportIniciativaAcumulada[i].id, moment(reportIniciativaAcumulada[i].fechaIniciativa).format('DD-MM-YYYY'), 
                    moment(reportIniciativaAcumulada[i].fechaFiltro).format('DD-MM-YYYY'), reportIniciativaAcumulada[i].estatus, 
                    reportIniciativaAcumulada[i].autoresText, reportIniciativaAcumulada[i].temaText]);
                }

                //console.log(this.arrReporteIniciativaAcumulada);

                this.configuragraficas();
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
        this.selectedComision = '';
        this.selectTipo = '';
        this.autores = [];

    }


    valorMesAnio(event: any): void {

        moment.locale('es');

        console.log(this.fechaAcumulada);
        console.log(moment(this.fechaAcumulada).format('MMMM'))

        let filtroMes = '';
        filtroMes = moment(this.fechaAcumulada).format('MMMM');
        this.decretosAcumuladosMes = this.arrCreacionGraficaIniciativaAcumulada.filter((d) => d['cTiempo'] === filtroMes && d['estatus'] === 'Publicada').length;

        let filtroAnio = '';
        filtroAnio = moment(this.fechaAcumulada).format('YYYY');
        this.decretosAcumuladosAnio = this.arrCreacionGraficaIniciativaAcumulada.filter((d) => d['fecha'] === filtroAnio && d['estatus'] === 'Publicada').length;
    }

    valorMesAnioAcumuladas(event: any): void {

        moment.locale('es');

        let filtroMes = '';
        filtroMes = moment(this.fechaIniciativaAcumulada).format('MMMM');
        this.iniciativasAcumuladasMes = this.arrIniciativasAcumuladas.filter((d) => d['cTiempo'] === filtroMes).length;

        let filtroAnio = '';
        filtroAnio = moment(this.fechaIniciativaAcumulada).format('YYYY');
        this.iniciativasAcumuladasAnio = this.arrIniciativasAcumuladas.filter((d) => d['fecha'] === filtroAnio).length;
    }

    
    valorMesAnioAcumuladasAprobadas(event: any): void {

        moment.locale('es');

        let filtroMes = '';
        filtroMes = moment(this.fechaIniciativaAcumuladaAprobada).format('MMMM');
        this.iniciativasAcumuladasMesAprobada = this.arrIniciativasAcumuladas.filter((d) => d['cTiempo'] === filtroMes && d['dictamenDeIniciativa'] === 'Aprobada').length;

        let filtroAnio = '';
        filtroAnio = moment(this.fechaIniciativaAcumuladaAprobada).format('YYYY');
        this.iniciativasAcumuladasAnioAprobada = this.arrIniciativasAcumuladas.filter((d) => d['fecha'] === filtroAnio && d['dictamenDeIniciativa'] === 'Aprobada').length;
    }

    
    valorMesAnioAcumuladasNoAprobadas(event: any): void {

        moment.locale('es');

        let filtroMes = '';
        filtroMes = moment(this.fechaIniciativaAcumuladaNoAprobada).format('MMMM');
        this.iniciativasAcumuladasMesNoAprobada = this.arrIniciativasAcumuladas.filter((d) => d['cTiempo'] === filtroMes && d['dictamenDeIniciativa'] === 'No aprobada').length;

        let filtroAnio = '';
        filtroAnio = moment(this.fechaIniciativaAcumuladaNoAprobada).format('YYYY');
        this.iniciativasAcumuladasAnioNoAprobada = this.arrIniciativasAcumuladas.filter((d) => d['fecha'] === filtroAnio && d['dictamenDeIniciativa'] === 'No aprobada').length;
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

    valorMesAnioPublicada(event: any): void {

        moment.locale('es');

        let filtroMes = '';
        filtroMes = moment(this.fechaPublicados).format('MMMM');
        this.decretosPublicadosMes = this.arrCreacionGraficaIniciativaAcumulada.filter((d) => d['cTiempo'] === filtroMes && d['estatus'] === 'Publicada').length;

        let filtroAnio = '';
        filtroAnio = moment(this.fechaPublicados).format('YYYY');
        this.decretosPublicadosAnio = this.arrCreacionGraficaIniciativaAcumulada.filter((d) => d['fecha'] === filtroAnio && d['estatus'] === 'Publicada').length;
    }

    valorMesAnioSolicitudPublicacion(event: any): void {

        moment.locale('es');

        let filtroMes = '';
        filtroMes = moment(this.fechaDecretoSolicitud).format('MMMM');
        this.decretosSolicitudPublicacionMes = this.arrCreacionGraficaIniciativaAcumulada.filter((d) => d['cTiempo'] === filtroMes && d['estatus'] === 'Turnada a publicación').length;

        let filtroAnio = '';
        filtroAnio = moment(this.fechaDecretoSolicitud).format('YYYY');
        this.decretosSolicitudPublicacionAnio = this.arrCreacionGraficaIniciativaAcumulada.filter((d) => d['fecha'] === filtroAnio && d['estatus'] === 'Turnada a publicación').length;
    }

    selectChange(event: any): void {

        if(this.selectTipo == '5ff5ebc2dacfb729306116b8'){
            this.selectedComision = undefined;
        }
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
            chartType: 'line',
            datasets: {
                pendientes: [

                    {
                        label: 'Aprobadas',
                        data: this.arrCreacionGraficaIniciativasAcumuladas,
                        fill: 'start'
                    },
                    {
                        label: 'No aprobadas',
                        data: this.arrCreacionGraficaIniciativasAcumuladasN,
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
                },
                {
                    borderColor: 'rgba(0,0,255,0.3)',
                    backgroundColor: 'transparent',
                    pointBackgroundColor: 'rgba(0,0,255,0.3)',
                    pointHoverBackgroundColor: 'rgba(0,0,255,0.3)',
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

        this.graficaAutor = {
            chartType: 'bar',
            datasets: {
                autors: [

                    {
                        label: 'autors',
                        data: this.arrcreacionGraficaAutoresValor,
                        fill: 'start'
                    }
                ],
            },
            // tslint:disable-next-line: max-line-length
            labels: this.arrcreacionGraficaAutoresSorted,
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
                plugins:{
                    labels: {
                    render: false,
                    fontSize: 0,
                    //fontStyle: 'bold',
                    fontColor: '#000',
                    fontFamily: '"Lucida Console", Monaco, monospace',
                    precision: 2,
                    arc: false,
                    },
                    filler: {
                        propagate: false
                    }
                }
            }
        };

        /*
        this.graficaDictamen = {
            chartType: 'pie',
            datasets: {
                dictamen: [

                    {
                        label: 'archivada',
                        data: this.arrCreacionGraficaDictamenes,
                        fill: 'start'
                    }
                ],
            },
            // tslint:disable-next-line: max-line-length
            labels: ['Aprobada', 'No aprobada', 'Modificación'],
            colors: [
                {
                    backgroundColor: ['rgba(255,0,0,0.3)', 'rgba(0,255,0,0.3)', 'rgba(0,0,255,0.3)'],
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
                plugins: {
                    datalabels: {
                        color: "white",
                        formatter: (value, ctx) => {
                         var perc = ((value * 100) / totalCount).toFixed(0) + "%";
                         return perc;
                        },
                       },
                    filler: {
                        propagate: false
                    }
                }
            }
        };*/

        this.pieChartOptions = {
            maintainAspectRatio: false,
            layout: {
                padding: {
                    left: 24,
                    right: 32
                }
            },
            legend: {
              position: 'top',
            },
            tooltips: {
                enabled: true,
                mode: 'single',
                /*callbacks: {
                  label: function (tooltipItems, data) {
                    return data.datasets[0].data[tooltipItems.index] + ' %';
                  }
                }*/
              },
              plugins:{
                labels: {
                render: 'percentage',
                fontSize: 12,
                //fontStyle: 'bold',
                fontColor: '#000',
                fontFamily: '"Lucida Console", Monaco, monospace',
                precision: 2,
                arc: false,
                }
            }
        };
        
          this.pieChartLabels = ['Aprobada', 'No aprobada', 'Modificación'];
        
          this.pieChartData = this.arrCreacionGraficaDictamenes;
        
          this.pieChartType= 'pie';
        
          this.pieChartLegend = true;
        
          this.pieChartPlugins = [];
        
          this.pieChartColors = [
            {
              backgroundColor: ['rgba(255,0,0,0.3)', 'rgba(0,255,0,0.3)', 'rgba(0,0,255,0.3)'],
            },
          ];

        this.graficaArchivada = {
            chartType: 'bar',
            datasets: {
                archivada: [

                    {
                        label: 'archivada',
                        data: this.arrCreacionGraficaEstatusIniciativas,
                        fill: 'start'
                    }
                ],
            },
            // tslint:disable-next-line: max-line-length
            labels: ['Secretaría general Inicial', 'Secretaría general', 'CIEL', 'Mesa directiva'],
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
                plugins:{
                    labels: {
                    render: false,
                    fontSize: 0,
                    //fontStyle: 'bold',
                    fontColor: '#000',
                    fontFamily: '"Lucida Console", Monaco, monospace',
                    precision: 2,
                    arc: false,
                    },
                    filler: {
                        propagate: false
                    }
                }
            }
        };
        
        this.graficaDictamen = {
            chartType: 'pie',
            datasets: {
                dictamen: [

                    {
                        labels: ['Aprobada', 'No aprobada', 'Modificación'],
                        data: this.arrCreacionGraficaDictamenes,
                        borderColor: "#fff",
                        backgroundColor: [
                            "#4b77a9",
                            "#5f255f",
                            "#d21243",
                            "#B27200"
                        ],
                    }
                ],
            },
            // tslint:disable-next-line: max-line-length
            labels: ['Aprobada', 'No aprobada', 'Modificación'],
            colors: [
                {
                    backgroundColor: ['rgba(255,0,0,0.3)', 'rgba(0,255,0,0.3)', 'rgba(0,0,255,0.3)'],
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
                plugins: {
                    datalabels: {
                        formatter: (value, ctx) => {
                            let sum = 0;
                            let dataArr = ctx.chart.data.datasets[0].dictamen;
                            dataArr.map(data => {
                                sum += data;
                            });
                            let percentage = (value*100 / sum).toFixed(2)+"%";
                            return percentage;
                        },
                        color: '#fff',
                    }
                }
            }
        };

        this.graficaPublicada = {
            chartType: 'line',
            datasets: {
                publicados: [

                    {
                        label: 'Acumuladas',
                        data: this.arrCreacionGraficaDecretosPublicados,
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

        this.graficaEstatusDecreto = {
            chartType: 'line',
            datasets: {
                decretos: [
                    {
                        label: 'Publicados',
                        data: this.arrCreacionGraficaDecretosPublicados,
                        fill: 'start'
                    },
                    {
                        label: 'Solicitud de publicación',
                        data: this.arrCreacionGraficaDecretosSolicitudPublicacion,
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
                },
                {
                    borderColor: 'rgba(0,0,255,0.3)',
                    backgroundColor: 'transparent',
                    pointBackgroundColor: 'rgba(0,0,255,0.3)',
                    pointHoverBackgroundColor: 'rgba(0,0,255,0.3)',
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

        this.graficaComisiones = {
            chartType: 'pie',
            datasets: {
                comisiones: [

                    {
                        label: 'comisiones',
                        data: this.arrcreacionGraficaComisionesAsignadasValor,
                        fill: 'start'
                    }
                ],
            },
            // tslint:disable-next-line: max-line-length
            labels: this.arrcreacionGraficaComisionesAsignadasSorted,
            colors: [
                {
                    backgroundColor: ['rgba(255,0,0,0.3)', 'rgba(0,255,0,0.3)', 'rgba(0,0,255,0.3)', 'rgba(71, 255, 255, 0.66)', 'rgba(255, 155, 56, 0.59)'],
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
            
            //console.log(canvas.width);
            //console.log(canvas.height);

            let fullQuality = canvas.toDataURL('image/png', 1);

            /*await this.imageService.imageRedimensionada({"image": fullQuality}).subscribe((resp: any) => {
                this.imageCanvas1 = resp;

                console.log(resp);
            }, err => {

            });*/

            // Creamos el reporte

            header = this.configuraHeaderReport();

            /*presente.push({
                text: ["Total sesiones mes: ", { text: this.decretosAcumuladosMes, bold: true }, 
                "      Total sesiones año ", { text: this.sesionesAcumuladasAnio, bold: true },],
                fontSize: 12,
                alignment: "center",
                margin: [0, 10, 0, 0],
            });*/

            presente.push({
                text: "Gráfica total de decretos concluidos acumulados",
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
                text: "Listado de decretos concluidos acumulados",
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
                  widths: [ 200, 70, 70, 100, 100, 100],
          
                  body: this.arrReporteAcumulado,
                  fillColor: "#d9d9d9",
                  fillOpacity: "#d9d9d9"
                }
            });

            if(this.arrReporteAcumulado.length < 2){
                presente.push({
                    text: "No existen iniciativas registradas de acuerdo al filtro de búsqueda.",
                    fontSize: 12,
                    bold: true,
                    alignment: "center",
                    margin: [0, 5, 0, 0],
                });
            }

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

            if(this.arrReporteAcumulado.length < 2){
                alert('No existen iniciativas registradas de acuerdo al filtro de búsqueda.');
            }
            pdfMake.createPdf(aa).open();

            resolve("ok");
        });
    }

    async generaReportIniciativaAcumulada (): Promise<string> {
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
                text: ["Total sesiones mes: ", { text: this.sesionesProcesoMes, bold: true }, 
                "      Total sesiones año ", { text: this.sesionesProcesoAnio, bold: true },],
                fontSize: 12,
                alignment: "center",
                margin: [0, 10, 0, 0],
            });*/

            presente.push({
                text: "Gráfica de iniciativas acumuladas",
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
                text: "Listado de iniciativas acumuladas",
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
                  widths: [ 200, 70, 70, 100, 100, 100],
          
                  body: this.arrReporteIniciativaAcumulada,
                  fillColor: "#d9d9d9",
                  fillOpacity: "#d9d9d9"
                }
            });

            if(this.arrReporteIniciativaAcumulada.length < 2){
                presente.push({
                    text: "No existen iniciativas registradas de acuerdo al filtro de búsqueda.",
                    fontSize: 12,
                    bold: true,
                    alignment: "center",
                    margin: [0, 5, 0, 0],
                });
            }

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

            if(this.arrReporteIniciativaAcumulada.length < 2){
                alert('No existen iniciativas registradas de acuerdo al filtro de búsqueda');
            }

            pdfMake.createPdf(aa).open();

            resolve("ok");
        });
    }

    async generaReportAutors (): Promise<string> {
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

            header = this.configuraHeaderReportAutors();

            /*presente.push({
                text: ["Total sesiones mes: ", { text: this.sesionesArchivadasMes, bold: true }, 
                "      Total sesiones año ", { text: this.sesionesArchivadasAnio, bold: true },],
                fontSize: 12,
                alignment: "center",
                margin: [0, 10, 0, 0],
            });*/

            presente.push({
                text: "Gráfica de autores de iniciativa",
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
                text: "Listado de autores iniciales",
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
                  widths: [ 400, 300],
          
                  body: this.arrReporteAutor,
                  fillColor: "#d9d9d9",
                  fillOpacity: "#d9d9d9"
                }
            });

            if(this.arrReporteAutor.length < 2){
                presente.push({
                    text: "No existen autores registrados de acuerdo al filtro de búsqueda.",
                    fontSize: 12,
                    bold: true,
                    alignment: "center",
                    margin: [0, 5, 0, 0],
                });
            }

            presente.push({
                text: "Listado de autores adheridos",
                fontSize: 12,
                bold: true,
                alignment: "center",
                margin: [0, 30, 0, 0],
            });
            

            //this.arrReporteAcumulado = [['hola', 'chao', 'efe', 'x', 'y']];

            await presente.push({
                //layout: 'lightHorizontalLines', // optional
                margin: [40, 20, 40, 50],
                table: {
                  // headers are automatically repeated if the table spans over multiple pages
                  // you can declare how many rows should be treated as headers

                  headerRows: 1,
                  widths: [ 400, 300],
          
                  body: this.arrReporteAdicion,
                  fillColor: "#d9d9d9",
                  fillOpacity: "#d9d9d9"
                }
            });

            if(this.arrReporteAdicion.length < 2){
                presente.push({
                    text: "No existen autores registrados de acuerdo al filtro de búsqueda.",
                    fontSize: 12,
                    bold: true,
                    alignment: "center",
                    margin: [0, 5, 0, 0],
                });
            }

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
            
            if(this.arrReporteAutor.length < 2){
                alert('No existen autores registrados de acuerdo al filtro de búsqueda.');
            }

            pdfMake.createPdf(aa).open();

            resolve("ok");
        });
    }

    async generaReportEstatusIniciativa (): Promise<string> {
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

            let canvas = <HTMLCanvasElement> document.getElementById('chart4');
            
            console.log(canvas.width);
            console.log(canvas.height);

            let fullQuality = canvas.toDataURL('image/png', 1);

            /*await this.imageService.imageRedimensionada({"image": fullQuality}).subscribe((resp: any) => {
                this.imageCanvas1 = resp;

                console.log(resp);
            }, err => {

            });*/

            // Creamos el reporte

            header = this.configuraHeaderReportEstatusDeIniciativa();

            /*presente.push({
                text: ["Total sesiones mes: ", { text: this.sesionesArchivadasMes, bold: true }, 
                "      Total sesiones año ", { text: this.sesionesArchivadasAnio, bold: true },],
                fontSize: 12,
                alignment: "center",
                margin: [0, 10, 0, 0],
            });*/

            presente.push({
                text: "Gráfica de estatus de iniciativa",
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
                text: "Listado de iniciativas iniciales",
                fontSize: 12,
                bold: true,
                alignment: "center",
                margin: [0, 30, 0, 0],
            });

            //this.arrReporteAcumulado = [['hola', 'chao', 'efe', 'x', 'y']];

            await presente.push({
                //layout: 'lightHorizontalLines', // optional
                margin: [40, 20, 40, 50],
                table: {
                  // headers are automatically repeated if the table spans over multiple pages
                  // you can declare how many rows should be treated as headers

                  headerRows: 1,
                  widths: [ 500, 100, 100],
          
                  body: this.arrReporteEstatusIniciativaInicial,
                  fillColor: "#d9d9d9",
                  fillOpacity: "#d9d9d9"
                }
            });

            if(this.arrReporteEstatusIniciativaInicial.length < 2){
                presente.push({
                    text: "No existen iniciativas registradas de acuerdo al filtro de búsqueda.",
                    fontSize: 12,
                    bold: true,
                    alignment: "center",
                    margin: [0, 5, 0, 0],
                });
            }

            presente.push({
                text: "Listado de iniciativas en proceso",
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
                  widths: [ 500, 100, 100],
          
                  body: this.arrReporteEstatusIniciativa,
                  fillColor: "#d9d9d9",
                  fillOpacity: "#d9d9d9"
                }
            });

            if(this.arrReporteEstatusIniciativa.length < 2){
                presente.push({
                    text: "No existen iniciativas registradas de acuerdo al filtro de búsqueda.",
                    fontSize: 12,
                    bold: true,
                    alignment: "center",
                    margin: [0, 5, 0, 0],
                });
            }

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

            if(this.arrReporteEstatusIniciativa.length < 2 && this.arrReporteEstatusIniciativaInicial.length < 2){
                alert('No existen iniciativas registradas de acuerdo al filtro de búsqueda.');
            }

            pdfMake.createPdf(aa).open();

            resolve("ok");
        });
    }

    async generaReportDictamen (): Promise<string> {
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

            let canvas = <HTMLCanvasElement> document.getElementById('chart5');
            
            console.log(canvas.width);
            console.log(canvas.height);

            let fullQuality = canvas.toDataURL('image/png', 1);

            /*await this.imageService.imageRedimensionada({"image": fullQuality}).subscribe((resp: any) => {
                this.imageCanvas1 = resp;

                console.log(resp);
            }, err => {

            });*/

            // Creamos el reporte

            header = this.configuraHeaderReportDictamen();

            /*presente.push({
                text: ["Total sesiones mes: ", { text: this.sesionesArchivadasMes, bold: true }, 
                "      Total sesiones año ", { text: this.sesionesArchivadasAnio, bold: true },],
                fontSize: 12,
                alignment: "center",
                margin: [0, 10, 0, 0],
            });*/

            presente.push({
                text: "Gráfica de estatus de dictámenes",
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
                text: "Listado de dictámenes",
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
                  widths: [500, 200],
          
                  body: this.arrReporteDictamenes,
                  fillColor: "#d9d9d9",
                  fillOpacity: "#d9d9d9"
                }
            });

            if(this.arrReporteDictamenes.length < 2){
                presente.push({
                    text: "No existen iniciativas registradas de acuerdo al filtro de búsqueda.",
                    fontSize: 12,
                    bold: true,
                    alignment: "center",
                    margin: [0, 5, 0, 0],
                });
            }

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

            if(this.arrReporteDictamenes.length < 2){
                alert('No existen iniciativas registradas de acuerdo al filtro de búsqueda.');
            }

            pdfMake.createPdf(aa).open();

            resolve("ok");
        });
    }

    async generaReportPublicada (): Promise<string> {
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

            let canvas = <HTMLCanvasElement> document.getElementById('chart6');
            
            console.log(canvas.width);
            console.log(canvas.height);

            let fullQuality = canvas.toDataURL('image/png', 1);

            /*await this.imageService.imageRedimensionada({"image": fullQuality}).subscribe((resp: any) => {
                this.imageCanvas1 = resp;

                console.log(resp);
            }, err => {

            });*/

            // Creamos el reporte

            header = this.configuraHeaderReportPublicada();

            /*presente.push({
                text: ["Total sesiones mes: ", { text: this.sesionesArchivadasMes, bold: true }, 
                "      Total sesiones año ", { text: this.sesionesArchivadasAnio, bold: true },],
                fontSize: 12,
                alignment: "center",
                margin: [0, 10, 0, 0],
            });*/

            presente.push({
                text: "Gráfica de decretos publicados",
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
                text: "Listado de decretos publicados",
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
                  widths: [ 200, 70, 70, 100, 100, 100],
          
                  body: this.arrReportePublicado,
                  fillColor: "#d9d9d9",
                  fillOpacity: "#d9d9d9"
                }
            });

            if(this.arrReportePublicado.length < 2){
                presente.push({
                    text: "No existen iniciativas registradas de acuerdo al filtro de búsqueda.",
                    fontSize: 12,
                    bold: true,
                    alignment: "center",
                    margin: [0, 5, 0, 0],
                });
            }

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

            if(this.arrReportePublicado.length < 2){
                alert('No existen iniciativas registradas de acuerdo al filtro de búsqueda.');
            }

            pdfMake.createPdf(aa).open();

            resolve("ok");
        });
    }

    async generaReportEstatusDecreto (): Promise<string> {
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

            let canvas = <HTMLCanvasElement> document.getElementById('chart7');
            
            //console.log(canvas.width);
            //console.log(canvas.height);

            let fullQuality = canvas.toDataURL('image/png', 1);

            /*await this.imageService.imageRedimensionada({"image": fullQuality}).subscribe((resp: any) => {
                this.imageCanvas1 = resp;

                console.log(resp);
            }, err => {

            });*/

            // Creamos el reporte

            header = this.configuraHeaderReportEstatusDecreto();

            /*presente.push({
                text: ["Total sesiones mes: ", { text: this.sesionesArchivadasMes, bold: true }, 
                "      Total sesiones año ", { text: this.sesionesArchivadasAnio, bold: true },],
                fontSize: 12,
                alignment: "center",
                margin: [0, 10, 0, 0],
            });*/

            presente.push({
                text: "Gráfica de estatus de decretos",
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
                text: "Listado de estatus de decretos",
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
                  widths: [ 200, 70, 70, 100, 100, 100],
          
                  body: this.arrReporteEstatusDecreto,
                  fillColor: "#d9d9d9",
                  fillOpacity: "#d9d9d9"
                }
            });

            if(this.arrReporteEstatusDecreto.length < 2){
                presente.push({
                    text: "No existen iniciativas registradas de acuerdo al filtro de búsqueda.",
                    fontSize: 12,
                    bold: true,
                    alignment: "center",
                    margin: [0, 5, 0, 0],
                });
            }

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

            if(this.arrReporteEstatusDecreto.length < 2){
                alert('No existen iniciativas registradas de acuerdo al filtro de búsqueda.');
            }

            pdfMake.createPdf(aa).open();

            resolve("ok");
        });
    }

    async generaReportComision (): Promise<string> {
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

            let canvas = <HTMLCanvasElement> document.getElementById('chart8');
            
            //console.log(canvas.width);
            //console.log(canvas.height);

            let fullQuality = canvas.toDataURL('image/png', 1);

            /*await this.imageService.imageRedimensionada({"image": fullQuality}).subscribe((resp: any) => {
                this.imageCanvas1 = resp;

                console.log(resp);
            }, err => {

            });*/

            // Creamos el reporte

            header = this.configuraHeaderReportComision();

            /*presente.push({
                text: ["Total sesiones mes: ", { text: this.sesionesArchivadasMes, bold: true }, 
                "      Total sesiones año ", { text: this.sesionesArchivadasAnio, bold: true },],
                fontSize: 12,
                alignment: "center",
                margin: [0, 10, 0, 0],
            });*/

            presente.push({
                text: "Gráfica de comisiones asignadas",
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
                text: "Listado de comisiones asignadas",
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
                  widths: [ 500, 200],
          
                  body: this.arrReporteComision,
                  fillColor: "#d9d9d9",
                  fillOpacity: "#d9d9d9"
                }
            });

            if(this.arrReporteComision.length < 2){
                presente.push({
                    text: "No existen iniciativas registradas de acuerdo al filtro de búsqueda.",
                    fontSize: 12,
                    bold: true,
                    alignment: "center",
                    margin: [0, 5, 0, 0],
                });
            }

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

            if(this.arrReporteComision.length < 2){
                alert('No existen iniciativas registradas de acuerdo al filtro de búsqueda.');
            }

            pdfMake.createPdf(aa).open();

            resolve("ok");
        });
    }

    configuraHeaderReport(): any {
        // Configuramos en encabezado
        const stack: any[] = [];

        stack.push({
            text: "Reporte de total de decretos concluidos acumulados",
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
            text: "Reporte del total de iniciativas acumuladas",
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

    configuraHeaderReportAutors(): any {
        // Configuramos en encabezado
        const stack: any[] = [];

        stack.push({
            text: "Reporte de autores de iniciativa",
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

    configuraHeaderReportEstatusDeIniciativa(): any {
        // Configuramos en encabezado
        const stack: any[] = [];

        stack.push({
            text: "Reporte de estatus de iniciativa",
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

    configuraHeaderReportDictamen(): any {
        // Configuramos en encabezado
        const stack: any[] = [];

        stack.push({
            text: "Reporte de dictámenes",
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

    configuraHeaderReportPublicada(): any {
        // Configuramos en encabezado
        const stack: any[] = [];

        stack.push({
            text: "Reporte de decretos publicados",
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

    configuraHeaderReportEstatusDecreto(): any {
        // Configuramos en encabezado
        const stack: any[] = [];

        stack.push({
            text: "Reporte de estatus de decretos",
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

    configuraHeaderReportComision(): any {
        // Configuramos en encabezado
        const stack: any[] = [];

        stack.push({
            text: "Reporte de comisiones asignadas",
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
}



