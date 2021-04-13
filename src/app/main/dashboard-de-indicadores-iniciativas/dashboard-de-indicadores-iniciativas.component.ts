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
    fechaIniciativaAcumulada = '';
    fechaArchivadas = '';
    fechaPublicados = '';
    fechaDecretoConcluida = '';
    fechaDecretoSolicitud = '';
    fechaIni = '';
    fechaFin = '';
    arrTipo = [];
    selectTipo: any;
    arrComisiones = []
    selectedComision: any;
    selectable = true;
    removable = true;
    addOnBlur = true;
    readonly separatorKeysCodes: number[] = [ENTER, COMMA];
    autores: Autores[] = [];
    
    arrCreacionGraficaIniciativaAcumulada = [];
    arrcreacionGraficaComisionesAsignadas = [];
    arrcreacionGraficaComisionesAsignadasSorted = [];
    arrcreacionGraficaComisionesAsignadasValor = [];
    arrIniciativasAcumuladas = [];
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
    tablaComisiones = [];
    tablaComisionesMostrar = [];
    tablaDictamen = [];
    tablaDictamenMostrar = [];
    arrReporteAcumulado = [];
    arrReportePublicado = [];
    arrReporteEstatusDecreto = [];
    arrReporteComision = [];
    arrReporteEstatusIniciativa = [];
    arrReporteDictamenes = [];
    arrReporteIniciativaAcumulada = [];
    arrReporteArchivado = [];
    arrCreacionGraficaIniciativasAcumuladas = [];
    arrCreacionGraficaIniciativasAcumuladasN = [];
    arrCreacionGraficaAnioArchivada = [];
    arrEliminadosGraficaMes = [];
    activarDescarga: boolean = true;

    decretosAcumuladosMes: number;
    dictamenesTotales: number;
    decretosPublicadosMes: number;
    decretosPublicadosAnio: number;
    decretosSolicitudPublicacionMes: number;
    decretosSolicitudPublicacionAnio: number;
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
    graficaAutor: any;
    graficaDictamen: any;
    graficaPublicada: any;
    graficaEstatusDecreto: any;
    graficaComisiones: any;
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
        private iniciativaService: IniciativasService,
        private comisionesService: ComisionesService,
        private sanitizer: DomSanitizer) {
        // Obtenemos documentos
        // this.obtenerDocumentos();
        this.configuragraficas();
        this.configurarGraficaFechas();
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
        }
    }

    async obtenerMovimientos(): Promise<void> {

        this.spinner.show();

        moment.locale('es');
        let meses = 0;
        let inicial: string;
        let final: string;
        this.arrCreacionGraficaIniciativaAcumulada = [];
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
        this.fechaPublicados = moment(this.fechaIni).format('YYYY-MM');
        this.fechaAcumulada = moment(this.fechaIni).format('YYYY-MM');
        this.fechaAcumulada = moment(this.fechaIni).format('YYYY-MM');
        this.fechaAcumulada = moment(this.fechaIni).format('YYYY-MM');

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
            

            if (this.selectedLegislatura !== undefined && this.selectedLegislatura !== '') {
                if (filtroReporte === '') {
                    filtroReporte = 'actasSesion.legislatura=' + this.selectedLegislatura;
                } else {
                    filtroReporte = filtroReporte + '&actasSesion.legislatura=' + this.selectedLegislatura;
                }
            }

            if (this.selectTipo !== undefined && this.selectTipo !== '') {
                if (filtroReporte === '') {
                    filtroReporte = 'tipo_de_iniciativa.id=' + this.selectTipo;
                } else {
                    filtroReporte = filtroReporte + '&tipo_de_iniciativa.id=' + this.selectTipo;
                }
            }

            if (this.selectedComision !== undefined && this.selectedComision !== '') {
                if (filtroReporte === '') {
                    filtroReporte = 'comisiones.id=' + this.selectedComision;
                } else {
                    filtroReporte = filtroReporte + '&comisiones.id=' + this.selectedComision;
                }
            }

            if (filtroReporte === '') {
                // tslint:disable-next-line: max-line-length
                filtroReporte = 'createdAt_gte=' + fechaIni + 'T01:00:00.000Z&createdAt_lte=' + fechaFin + 'T24:00:00.000Z&_limit=-1';
            } else {
                // tslint:disable-next-line: max-line-length
                filtroReporte = filtroReporte + '&createdAt_gte=' + fechaIni + 'T01:00:00.000Z&createdAt_lte=' + fechaFin + 'T24:00:00.000Z&_limit=-1';
            }
            // Obtenemos los entes

            console.log('filtro');
            console.log(filtroReporte);
            
            await this.iniciativaService.obtenerIniciativasFiltrado(filtroReporte).subscribe((resp: any) => {
                this.arrCreacionGraficaIniciativaAcumulada = resp.anioTotal;

                console.log(this.arrCreacionGraficaIniciativaAcumulada);

                console.log(moment(this.arrCreacionGraficaIniciativaAcumulada[0].fechaFiltro).format('YYYY'));

                
                while (i <= this.arrCreacionGraficaIniciativaAcumulada.length - 1) {
                    this.arrCreacionGraficaIniciativaAcumulada[i].cTiempo = moment(this.arrCreacionGraficaIniciativaAcumulada[i].fechaFiltro).format('MMMM');
                    this.arrCreacionGraficaIniciativaAcumulada[i].fecha = moment(this.arrCreacionGraficaIniciativaAcumulada[i].fechaFiltro).format('YYYY');
                    i++
                }
                
                this.decretosAcumuladosMes = this.arrCreacionGraficaIniciativaAcumulada.filter((d) => d['cTiempo'] === 'enero').length;

                this.sesionesAcumuladasAnio = this.arrCreacionGraficaIniciativaAcumulada.filter((d) => d['fecha'] === '2021').length;

                this.arrCreacionGraficaAnio.push(this.arrCreacionGraficaIniciativaAcumulada.filter((d) => d['cTiempo'] === 'enero' && d['fecha'] === moment(this.fechaIni).format('YYYY')).length);
                this.arrCreacionGraficaAnio.push(this.arrCreacionGraficaAnio[0] + this.arrCreacionGraficaIniciativaAcumulada.filter((d) => d['cTiempo'] === 'febrero' && d['fecha'] === moment(this.fechaIni).format('YYYY')).length);
                this.arrCreacionGraficaAnio.push(this.arrCreacionGraficaAnio[1] + this.arrCreacionGraficaIniciativaAcumulada.filter((d) => d['cTiempo'] === 'marzo' && d['fecha'] === moment(this.fechaIni).format('YYYY')).length);
                this.arrCreacionGraficaAnio.push(this.arrCreacionGraficaAnio[2] + this.arrCreacionGraficaIniciativaAcumulada.filter((d) => d['cTiempo'] === 'abril' && d['fecha'] === moment(this.fechaIni).format('YYYY')).length);
                this.arrCreacionGraficaAnio.push(this.arrCreacionGraficaAnio[3] + this.arrCreacionGraficaIniciativaAcumulada.filter((d) => d['cTiempo'] === 'mayo' && d['fecha'] === moment(this.fechaIni).format('YYYY')).length);
                this.arrCreacionGraficaAnio.push(this.arrCreacionGraficaAnio[4] + this.arrCreacionGraficaIniciativaAcumulada.filter((d) => d['cTiempo'] === 'junio' && d['fecha'] === moment(this.fechaIni).format('YYYY')).length);
                this.arrCreacionGraficaAnio.push(this.arrCreacionGraficaAnio[5] + this.arrCreacionGraficaIniciativaAcumulada.filter((d) => d['cTiempo'] === 'julio' && d['fecha'] === moment(this.fechaIni).format('YYYY')).length);
                this.arrCreacionGraficaAnio.push(this.arrCreacionGraficaAnio[6] + this.arrCreacionGraficaIniciativaAcumulada.filter((d) => d['cTiempo'] === 'agosto' && d['fecha'] === moment(this.fechaIni).format('YYYY')).length);
                this.arrCreacionGraficaAnio.push(this.arrCreacionGraficaAnio[7] + this.arrCreacionGraficaIniciativaAcumulada.filter((d) => d['cTiempo'] === 'septiembre' && d['fecha'] === moment(this.fechaIni).format('YYYY')).length);
                this.arrCreacionGraficaAnio.push(this.arrCreacionGraficaAnio[8] + this.arrCreacionGraficaIniciativaAcumulada.filter((d) => d['cTiempo'] === 'octubre' && d['fecha'] === moment(this.fechaIni).format('YYYY')).length);
                this.arrCreacionGraficaAnio.push(this.arrCreacionGraficaAnio[9] + this.arrCreacionGraficaIniciativaAcumulada.filter((d) => d['cTiempo'] === 'noviembre' && d['fecha'] === moment(this.fechaIni).format('YYYY')).length);
                this.arrCreacionGraficaAnio.push(this.arrCreacionGraficaAnio[10] + this.arrCreacionGraficaIniciativaAcumulada.filter((d) => d['cTiempo'] === 'diciembre' && d['fecha'] === moment(this.fechaIni).format('YYYY')).length);

                this.arrCreacionGraficaEstatusIniciativas.push(this.arrCreacionGraficaIniciativaAcumulada.filter((d) => d['estatus'] === 'Turnar dictamen a secretaría de servicios parlamentarios' || d['dictamenDeIniciativa'] === 'Turnada a publicación').length);
                this.arrCreacionGraficaEstatusIniciativas.push(this.arrCreacionGraficaIniciativaAcumulada.filter((d) => d['estatus'] === 'Turnar iniciativa a CIEL' || d['dictamenDeIniciativa'] === 'Turnar dictamen a Secretaria General').length);
                this.arrCreacionGraficaEstatusIniciativas.push(this.arrCreacionGraficaIniciativaAcumulada.filter((d) => d['estatus'] === 'Turnar dictamen a Mesa Directiva').length);

                this.arrReporteEstatusIniciativa = [[ 'Departamento', 'Cantidad total']];

                this.tablaEstatusIniciativa.push({departamento: 'Secretaría General', valor: this.arrCreacionGraficaEstatusIniciativas[0]});
                this.tablaEstatusIniciativa.push({departamento: 'Centro de Investigación y Estudios Legislativos', valor: this.arrCreacionGraficaEstatusIniciativas[1]});
                this.tablaEstatusIniciativa.push({departamento: 'Mesa directiva', valor: this.arrCreacionGraficaEstatusIniciativas[2]});

                this.arrReporteEstatusIniciativa.push(['Secretaría General', this.arrCreacionGraficaEstatusIniciativas[0]]);
                this.arrReporteEstatusIniciativa.push(['Centro de Investigación y Estudios Legislativos', this.arrCreacionGraficaEstatusIniciativas[1]]);
                this.arrReporteEstatusIniciativa.push(['Mesa directiva', this.arrCreacionGraficaEstatusIniciativas[2]]);

                this.tablaEstatusIniciativaMostrar = this.tablaEstatusIniciativa;

                this.arrReporteAcumulado = [[ 'Folio', 'Fecha de iniciativa', 'Fecha de estatus', 'Estatus', 'Autores', 'Tema']];

                for (let i = 0, max = this.arrCreacionGraficaIniciativaAcumulada.length; i < max; i += 1) {

                    if(!this.arrCreacionGraficaIniciativaAcumulada[i].legislatura){
                        this.arrCreacionGraficaIniciativaAcumulada[i].legislatura = 'Sin asignar';
                    }
                    this.arrReporteAcumulado.push([this.arrCreacionGraficaIniciativaAcumulada[i].id, this.arrCreacionGraficaIniciativaAcumulada[i].fechaIniciativa, 
                    this.arrCreacionGraficaIniciativaAcumulada[i].fechaFiltro, this.arrCreacionGraficaIniciativaAcumulada[i].estatus, 
                    'Autor(s)', 'Tema(s)']);
                }

                /* DICTAMENES DE INICIATIVA */
                this.arrCreacionGraficaDictamenes.push(this.arrCreacionGraficaIniciativaAcumulada.filter((d) => d['dictamenDeIniciativa'] === 'Aprobada').length);
                this.arrCreacionGraficaDictamenes.push(this.arrCreacionGraficaIniciativaAcumulada.filter((d) => d['dictamenDeIniciativa'] === 'No aprobada').length);
                this.arrCreacionGraficaDictamenes.push(this.arrCreacionGraficaIniciativaAcumulada.filter((d) => d['dictamenDeIniciativa'] === 'Modificación').length);

                this.tablaDictamen.push({dictamen: 'Aprobado', valor: this.arrCreacionGraficaDictamenes[0]});
                this.tablaDictamen.push({dictamen: 'No aprobado', valor: this.arrCreacionGraficaDictamenes[1]});
                this.tablaDictamen.push({dictamen: 'Modificación', valor: this.arrCreacionGraficaDictamenes[2]});

                this.arrReporteDictamenes = [['Dictamenes', 'Cantidad total']];

                this.arrReporteDictamenes.push(['Aprobados', this.arrCreacionGraficaDictamenes[0]]);
                this.arrReporteDictamenes.push(['No aprobados', this.arrCreacionGraficaDictamenes[1]]);
                this.arrReporteDictamenes.push(['Cantidad total', this.arrCreacionGraficaDictamenes[2]]);

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

                for (let i = 0, max = this.arrCreacionGraficaIniciativaAcumulada.length; i < max; i += 1) {
                    if(this.arrCreacionGraficaIniciativaAcumulada[i].estatus === 'Publicada'){
                        if(!this.arrCreacionGraficaIniciativaAcumulada[i].legislatura){
                            this.arrCreacionGraficaIniciativaAcumulada[i].legislatura = 'Sin asignar';
                        }
                        this.arrReportePublicado.push([this.arrCreacionGraficaIniciativaAcumulada[i].id, this.arrCreacionGraficaIniciativaAcumulada[i].fechaIniciativa, 
                        this.arrCreacionGraficaIniciativaAcumulada[i].fechaFiltro, this.arrCreacionGraficaIniciativaAcumulada[i].estatus, 
                        'Autor(s)', 'Tema(s)']);
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

                for (let i = 0, max = this.arrCreacionGraficaIniciativaAcumulada.length; i < max; i += 1) {
                    if(this.arrCreacionGraficaIniciativaAcumulada[i].estatus === 'Publicada'){
                        if(!this.arrCreacionGraficaIniciativaAcumulada[i].legislatura){
                            this.arrCreacionGraficaIniciativaAcumulada[i].legislatura = 'Sin asignar';
                        }
                        this.arrReporteEstatusDecreto.push([this.arrCreacionGraficaIniciativaAcumulada[i].id, this.arrCreacionGraficaIniciativaAcumulada[i].fechaIniciativa, 
                        this.arrCreacionGraficaIniciativaAcumulada[i].fechaFiltro, this.arrCreacionGraficaIniciativaAcumulada[i].estatus, 
                        'Autor(s)', 'Tema(s)']);
                    }else if(this.arrCreacionGraficaIniciativaAcumulada[i].estatus === 'Turnada a publicación'){
                        if(!this.arrCreacionGraficaIniciativaAcumulada[i].legislatura){
                            this.arrCreacionGraficaIniciativaAcumulada[i].legislatura = 'Sin asignar';
                        }
                        this.arrReporteEstatusDecreto.push([this.arrCreacionGraficaIniciativaAcumulada[i].id, this.arrCreacionGraficaIniciativaAcumulada[i].fechaIniciativa, 
                        this.arrCreacionGraficaIniciativaAcumulada[i].fechaFiltro, this.arrCreacionGraficaIniciativaAcumulada[i].estatus, 
                        'Autor(s)', 'Tema(s)']);
                    }else{

                    }
                }

                /************************/
                /* Comisiones asignadas */
                /************************/

                this.arrReporteComision = [[ 'Comisión', 'Cantidad total']];

                while (a <= this.arrComisiones.length - 1) {
                    let comision: string = this.arrComisiones[a].descripcion;

                    this.arrcreacionGraficaComisionesAsignadas.push({"valor": this.arrCreacionGraficaIniciativaAcumulada.filter((d) => d['comisiones'] === comision).length, "comision": comision});
                    a++
                }

                this.arrcreacionGraficaComisionesAsignadas.sort((a, b) => b.valor - a.valor);

                this.arrcreacionGraficaComisionesAsignadas.forEach(element =>{
                    this.arrcreacionGraficaComisionesAsignadasSorted.push(element.comision);
                    this.arrcreacionGraficaComisionesAsignadasValor.push(element.valor);
                    this.tablaComisiones.push({"valor": element.valor, "comision": element.comision});
                    this.arrReporteComision.push([element.comision,  element.valor]);
                });

                console.log('Comisiones');

                this.tablaComisionesMostrar = this.tablaComisiones;

                console.log(this.arrcreacionGraficaComisionesAsignadasValor);
                console.log(this.arrcreacionGraficaComisionesAsignadasSorted);

                this.activarDescarga = false;

                this.configuragraficas();
                this.spinner.hide();
            }, err => {
                this.spinner.hide();
            });

            let filtroIniciativasAcumuladas = '';

            filtroIniciativasAcumuladas = 'dictamenDeIniciativa=Aprobada&dictamenDeIniciativa=No aprobada';

            if (this.selectedLegislatura !== undefined && this.selectedLegislatura !== '') {
                if (filtroIniciativasAcumuladas === '') {
                    filtroIniciativasAcumuladas = 'actasSesion.legislatura=' + this.selectedLegislatura;
                } else {
                    filtroIniciativasAcumuladas = filtroIniciativasAcumuladas + '&actasSesion.legislatura=' + this.selectedLegislatura;
                }
            }

            if (this.selectTipo !== undefined && this.selectTipo !== '') {
                if (filtroIniciativasAcumuladas === '') {
                    filtroIniciativasAcumuladas = 'tipo_de_iniciativa.id=' + this.selectTipo;
                } else {
                    filtroIniciativasAcumuladas = filtroIniciativasAcumuladas + '&tipo_de_iniciativa.id=' + this.selectTipo;
                }
            }

            if (this.selectedComision !== undefined && this.selectedComision !== '') {
                if (filtroIniciativasAcumuladas === '') {
                    filtroIniciativasAcumuladas = 'comisiones.id=' + this.selectedComision;
                } else {
                    filtroIniciativasAcumuladas = filtroIniciativasAcumuladas + '&comisiones.id=' + this.selectedComision;
                }
            }

            if (filtroIniciativasAcumuladas === '') {
                // tslint:disable-next-line: max-line-length
                filtroIniciativasAcumuladas = 'createdAt_gte=' + fechaIni + 'T01:00:00.000Z&createdAt_lte=' + fechaFin + 'T24:00:00.000Z&_limit=-1';
            } else {
                // tslint:disable-next-line: max-line-length
                filtroIniciativasAcumuladas = filtroIniciativasAcumuladas + '&createdAt_gte=' + fechaIni + 'T01:00:00.000Z&createdAt_lte=' + fechaFin + 'T24:00:00.000Z&_limit=-1';
            }
            // Obtenemos los entes

            console.log('filtro');
            console.log(filtroIniciativasAcumuladas);

            await this.iniciativaService.obtenerIniciativasFiltrado(filtroIniciativasAcumuladas).subscribe((resp: any) => {
                this.arrIniciativasAcumuladas = resp.anioTotal;

                //console.log(moment(this.arrDocumentosIngresadosAyer[0].fechaFiltro).format('MMMM'));

                while (p <= this.arrIniciativasAcumuladas.length - 1) {
                    this.arrIniciativasAcumuladas[p].cTiempo = moment(this.arrIniciativasAcumuladas[p].fechaFiltro).format('MMMM');
                    this.arrIniciativasAcumuladas[p].fecha = moment(this.arrIniciativasAcumuladas[p].fechaFiltro).format('YYYY');
                    p++
                }

                this.sesionesProcesoMes = this.arrIniciativasAcumuladas.filter((d) => d['cTiempo'] === 'enero').length;

                this.sesionesProcesoAnio = this.arrIniciativasAcumuladas.filter((d) => d['fecha'] === '2021').length;

                console.log(this.arrIniciativasAcumuladas);

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

                console.log('iniciativasacumuladas');
                console.log(this.arrCreacionGraficaIniciativasAcumuladasN);
                console.log(this.arrCreacionGraficaIniciativasAcumuladas);

                this.arrReporteIniciativaAcumulada = [[ 'Folio', 'Fecha de iniciativa', 'Fecha de estatus', 'Estatus', 'Autores', 'Tema']];

                for (let i = 0, max = this.arrIniciativasAcumuladas.length; i < max; i += 1) {

                    if(!this.arrIniciativasAcumuladas[i].legislatura){
                        this.arrIniciativasAcumuladas[i].legislatura = 'Sin asignar';
                    }
                    this.arrReporteIniciativaAcumulada.push([this.arrIniciativasAcumuladas[i].id, this.arrIniciativasAcumuladas[i].fechaIniciativa, 
                    this.arrIniciativasAcumuladas[i].fechaFiltro, this.arrIniciativasAcumuladas[i].estatus, 
                    'Autor(s)', 'Tema(s)']);
                
                }

                console.log(this.arrReporteIniciativaAcumulada);

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
        this.selectedTipoSesion = '';

    }


    valorMesAnio(event: any): void {

        moment.locale('es');

        console.log(this.fechaAcumulada);
        console.log(moment(this.fechaAcumulada).format('MMMM'))

        let filtroMes = '';
        filtroMes = moment(this.fechaAcumulada).format('MMMM');
        this.decretosAcumuladosMes = this.arrCreacionGraficaIniciativaAcumulada.filter((d) => d['cTiempo'] === filtroMes).length;

        let filtroAnio = '';
        filtroAnio = moment(this.fechaAcumulada).format('YYYY');
        this.sesionesAcumuladasAnio = this.arrCreacionGraficaIniciativaAcumulada.filter((d) => d['fecha'] === filtroAnio).length;
    }

    valorMesAnioProcesada(event: any): void {

        moment.locale('es');

        let filtroMes = '';
        filtroMes = moment(this.fechaIniciativaAcumulada).format('MMMM');
        this.sesionesProcesoMes = this.arrIniciativasAcumuladas.filter((d) => d['cTiempo'] === filtroMes).length;

        let filtroAnio = '';
        filtroAnio = moment(this.fechaIniciativaAcumulada).format('YYYY');
        this.sesionesProcesoAnio = this.arrIniciativasAcumuladas.filter((d) => d['fecha'] === filtroAnio).length;
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
        filtroMes = moment(this.fechaPublicados).format('MMMM');
        this.decretosSolicitudPublicacionMes = this.arrCreacionGraficaIniciativaAcumulada.filter((d) => d['cTiempo'] === filtroMes && d['estatus'] === 'Publicada').length;

        let filtroAnio = '';
        filtroAnio = moment(this.fechaPublicados).format('YYYY');
        this.decretosSolicitudPublicacionAnio = this.arrCreacionGraficaIniciativaAcumulada.filter((d) => d['fecha'] === filtroAnio && d['estatus'] === 'Publicada').length;
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
                    borderColor: 'rgba(77,83,96,0.2)',
                    backgroundColor: 'transparent',
                    pointBackgroundColor: 'rgba(77,83,96,0.2)',
                    pointHoverBackgroundColor: 'rgba(77,83,96,0.2)',
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
                autor: [

                    {
                        label: 'archivada',
                        data: this.arrCreacionGraficaEstatusIniciativas,
                        fill: 'start'
                    }
                ],
            },
            // tslint:disable-next-line: max-line-length
            labels: ['Secretara general', 'CIEL', 'Mesa directiva'],
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
                        data: this.arrCreacionGraficaEstatusIniciativas,
                        fill: 'start'
                    }
                ],
            },
            // tslint:disable-next-line: max-line-length
            labels: ['Secretara general', 'CIEL', 'Mesa directiva'],
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
                        formatter: (value, ctx) => {
                          const label = ctx.chart.data.labels[ctx.dataIndex];
                          return label;
                        },
                      },
                    filler: {
                        propagate: false
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
                    borderColor: 'rgba(77,83,96,0.2)',
                    backgroundColor: 'transparent',
                    pointBackgroundColor: 'rgba(77,83,96,0.2)',
                    pointHoverBackgroundColor: 'rgba(77,83,96,0.2)',
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
                        label: 'archivada',
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


    configurarGraficaFechas(): void {
        this.graficaFechas = {
            chartType: 'line',
            datasets: {
                acumuladas: [

                    {
                        label: 'Acumuladas',
                        data: this.arrCreacionGraficaFechas,
                        fill: 'start'
                    }
                ],
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

            presente.push({
                text: ["Total sesiones mes: ", { text: this.decretosAcumuladosMes, bold: true }, 
                "      Total sesiones año ", { text: this.sesionesAcumuladasAnio, bold: true },],
                fontSize: 12,
                alignment: "center",
                margin: [0, 10, 0, 0],
            });

            presente.push({
                text: "Gráfica total de decretos acumulados",
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
                text: "Listado de decretos acumulados",
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
                text: "Listado de iniciativas",
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
          
                  body: this.arrReporteEstatusIniciativa,
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
                text: "Gráfica de estatus de dictamenes",
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
                text: "Listado de dictamenes",
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
            text: "Reporte de total de decretos acumulados",
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
            text: ["Fecha inicio: ", { text: moment(this.fechaFin).format('DD-MM-YYYY'), bold: true }],
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
            text: "Reporte de dictamenes",
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
            text: ["Fecha inicio: ", { text: moment(this.fechaFin).format('DD-MM-YYYY'), bold: true }],
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
            text: ["Fecha inicio: ", { text: moment(this.fechaFin).format('DD-MM-YYYY'), bold: true }],
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
            text: ["Fecha inicio: ", { text: moment(this.fechaFin).format('DD-MM-YYYY'), bold: true }],
            nodeName: "H4",
            fontSize: 12,
            bold: false,
            alignment: "center",
        });

        return { stack };
    }
}



