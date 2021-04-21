import {
    Component,
    OnInit,
    Inject,
    ViewChild,
    ElementRef,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import Swal from "sweetalert2";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

import { TableroDeIniciativasComponent } from "../tablero-de-iniciativas.component";
import { Subject } from "rxjs";
import { MenuService } from "services/menu.service";
import { UploadFileService } from "services/upload.service";
import { MatDialog } from "@angular/material/dialog";
import { DatePipe } from "@angular/common";
import { NgxSpinnerService } from "ngx-spinner";
import { IniciativasService } from "services/iniciativas.service";
import { IniciativasModel } from "models/iniciativas.models";
import { MatChipInputEvent } from "@angular/material/chips";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs; // fonts provided for pdfmake
import { environment } from "../../../../environments/environment";
import { LegislaturaService } from "services/legislaturas.service";
import { ParametrosService } from "services/parametros.service";
import { MesasDirectivasService } from 'services/mesas-directivas.service';
import { DetalleMesaService } from 'services/detalle-mesa-directiva.service';
import { FirmasPorEtapaService } from "services/configuracion-de-firmas-por-etapa.service";
import { DocumentosModel } from "models/documento.models";
import { ClasficacionDeDocumentosComponent } from "app/main/tablero-de-documentos/clasficacion-de-documentos/clasficacion-de-documentos.component";
import { DocumentosService } from "services/documentos.service";
import { ComisionesService } from 'services/comisiones.service';
import { ActasSesionsService } from 'services/actas-sesions.service';
import { AmazingTimePickerService } from 'amazing-time-picker';
import * as moment from 'moment';
import { GuardarDocumentosComponent } from '../../tablero-de-documentos/guardar-documentos/guardar-documentos.component';
import { IniciativaModificadaSuspendidaComponent } from '../iniciativa-modificada-suspendida/iniciativa-modificada-suspendida.component';

export interface Autores {
    name: string;
}

export interface Temas {
    name: string;
}

export interface Clasificaciones {
    name: string;
}

export interface Adicion {
    name: string;
}

export interface Etiquetas {
    name: string;
}

export interface Estado {
    id: string;
    descripcion: string;
}

export interface DictamenDeSesion {
    id: string;
    descripcion: string;
}

export class Documentos{
    id: string;
}

@Component({
    selector: 'app-iniciativa-turnada-a-comision',
    templateUrl: './iniciativa-turnada-a-comision.component.html',
    styleUrls: ['./iniciativa-turnada-a-comision.component.scss'],
    providers: [DatePipe],
})

export class IniciativaTurnadaAComisionComponent implements OnInit {
    @ViewChild("fileOficio", { static: false }) fileOficio: ElementRef;
    @ViewChild("fileInforme", { static: false }) fileInforme: ElementRef;

    form: FormGroup;
    selectTipo: any;
    arrTipo: any[] = [];
    arrMesas: any[] = [];
    arrDetalleMesas: any[] = [];
    filesOficio = [];
    filesInforme = [];
    fileOficioName: string;
    fileInformeName: string;
    cambioFile: boolean;
    date = new Date(2020, 1, 1);
    cambioInforme: boolean;
    cambioOficio: boolean;
    base64: string;
    loadingIndicator: boolean;
    reorderable: boolean;
    // minDate = new Date(2000, 0, 1);
    maxDate = new Date();
    // Private
    private unsubscribeAll: Subject<any>;
    visible = true;
    selectable = true;
    selectable2 = true;
    selectable3 = true;
    selectable4 = true;
    selectable5 = true;
    removable = true;
    removable2 = true;
    removable3 = true;
    removable4 = true;
    removable5 = true;
    addOnBlur = true;
    addOnBlur2 = true;
    addOnBlur3 = true;
    addOnBlur4 = true;
    addOnBlur5 = true;

    firstFormGroup: FormGroup;
    readonly separatorKeysCodes: number[] = [ENTER, COMMA];
    autores: Autores[] = [];
    temas: Temas[] = [];
    clasificaciones: Clasificaciones[] = [];
    adicion: Adicion[] = [];
    etiquetas: Etiquetas[] = [];
    legislatura: any[] = [];
    comisiones: any[] = [];
    tipoSesion: Estado[] = [];
    dictamenDeSesion: DictamenDeSesion[] = [];
    anexos: string[] = [];
    selectedComision: any;
    selectedLegislatura: any;
    selectedSesion: any;
    selectedDictamenDeIniciativa: any;
    imageBase64: any;
    documentos: DocumentosModel = new DocumentosModel();
    documentosGuardar: DocumentosModel = new DocumentosModel();
    documentosTemp: DocumentosModel = new DocumentosModel();
    validarLargoClasificacion: number = 0;
    errorLargo: boolean = false;
    idDocumento: string = '';
    files = [];
    filesTemp = [];
    cargando: boolean;
    disable = false;
    constructor(
        private spinner: NgxSpinnerService,
        private formBuilder: FormBuilder,
        private menu: MenuService,
        private datePipe: DatePipe,
        private dialogRef: MatDialogRef<TableroDeIniciativasComponent>,
        private legislaturaService: LegislaturaService,
        private iniciativaService: IniciativasService,
        private comisionesService: ComisionesService,
        private actasSesionsService: ActasSesionsService,
        private parametros: ParametrosService,
        private firmas: FirmasPorEtapaService,
        private documentoService: DocumentosService,
        private mesasDirectivasService: MesasDirectivasService,
        private detalleMesaService: DetalleMesaService,
        public dialog: MatDialog,
        private uploadService: UploadFileService,
        private atp: AmazingTimePickerService,

        @Inject(MAT_DIALOG_DATA) public iniciativa: IniciativasModel,

    ) {
        this.tipoSesion = [];

        console.log(this.iniciativa.informeDeResultadosRevision);
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

        this.dictamenDeSesion.push({
            id: '001',
            descripcion: 'Aprobada'
        });
        this.dictamenDeSesion.push({
            id: '002',
            descripcion: 'No aprobada'
        });
        if(this.iniciativa.tipo_de_iniciativa.descripcion == 'Iniciativa'){
            this.dictamenDeSesion.push({
                id: '003',
                descripcion: 'Modificación'
            });
        }

    }

    async ngOnInit(): Promise<void> {

        if(this.iniciativa.estatus !== 'Turnar dictamen a secretaría de servicios parlamentarios'){
            await this.obtenerDocumento();
        }
        this.obtenerTiposIniciativas();
        this.obtenerComisiones();
        this.obtenerLegislatura();
        this.obtenerMesaDirectiva();
        this.obtenerDetalleMesa();

        if (this.iniciativa.documentos == undefined) {
            this.iniciativa.documentos = [];
        }
        if (this.iniciativa.formatosTipoIniciativa == undefined) {
            this.iniciativa.formatosTipoIniciativa = [];
        }
        this.imageBase64 = environment.imageBase64;

        console.log(this.iniciativa);
        if (this.iniciativa.actasSesion === undefined) {
            this.iniciativa.actasSesion = [];
        }
        if (this.iniciativa.anexosTipoIniciativa === undefined) {
            this.iniciativa.anexosTipoIniciativa = [];
        }
        if (this.iniciativa.comisiones === undefined || this.iniciativa.comisiones === null) {
            this.iniciativa.comisiones = "";
        }
        if (this.iniciativa.clasificaciones === undefined) {
            this.iniciativa.clasificaciones = "";
        }
        let validatos = [];

        let validatosMesaDirectiva = [];

        let validatosPublicacion = [];

        let validatosPublicacionText = [];

        if (this.iniciativa.oficioEnvioDeInforme !== undefined) {
            this.fileOficioName = this.iniciativa.oficioEnvioDeInforme.cNombreDocumento;
        } else {
            this.fileOficioName = "";

        }
        if (this.iniciativa.informeDeResultadosRevision !== undefined) {
            console.log(this.iniciativa.informeDeResultadosRevision)
            this.fileInformeName = this.iniciativa.informeDeResultadosRevision.cNombreDocumento;
        } else {
            this.fileInformeName = "";

        }

        if(this.iniciativa.estatus === 'Turnar dictamen a secretaría de servicios parlamentarios'){
            this.disable = true;
        }
        const fecha = new Date(); // Fecha actual
        let mes: any = fecha.getMonth() + 1; // obteniendo mes
        let dia: any = fecha.getDate(); // obteniendo dia
        dia = dia + 1;
        const ano = fecha.getFullYear(); // obteniendo año
        const fechaActual = ano + "-" + mes + "-" + dia;
        if (dia < 10) {
            dia = "0" + dia; // agrega cero si el menor de 10
        }
        if (mes < 10) {
            mes = "0" + mes; // agrega cero si el menor de 10
        }

        // Validamos si es un documento nuevo
        if (this.iniciativa.id) {
            this.selectTipo = this.iniciativa.tipo_de_iniciativa.id;
            this.autores = this.iniciativa.autores;
            this.temas = this.iniciativa.tema;
            if (this.iniciativa.clasificaciones) {
                this.clasificaciones = this.iniciativa.clasificaciones;
            } else {
                this.clasificaciones = [];
            }

            if (this.iniciativa.adicion) {
                this.adicion = this.iniciativa.adicion;
            } else {
                this.adicion = [];
            }

            if (this.iniciativa.etiquetas) {
                this.etiquetas = this.iniciativa.etiquetas;
            } else {
                this.etiquetas = [];
            }
            this.iniciativa.fechaCreacion =
                this.iniciativa.fechaCreacion + "T16:00:00.000Z";
            this.iniciativa.fechaIniciativa =
                this.iniciativa.fechaIniciativa + "T16:00:00.000Z";
            if(this.iniciativa.estatus == 'Turnar dictamen a Mesa Directiva'){
                this.selectedDictamenDeIniciativa = this.iniciativa.dictamenDeIniciativa;
            } if (this.iniciativa.estatus == 'Turnada a comisión para modificación'){
                this.selectedDictamenDeIniciativa = this.iniciativa.dictamenDeIniciativa;
            } if (this.iniciativa.estatus == 'Turnada a publicación'){
                this.selectedDictamenDeIniciativa = this.iniciativa.dictamenDeIniciativa;
            }
        } else {
            // Seteamos la fecha de carga con la fecha actual
            this.iniciativa.estatus = "Registrada";
            this.iniciativa.fechaCreacion = ano + "-" + mes + "-" + dia;
        }

        if (this.iniciativa.estatus === 'Turnar iniciativa a comisión') {
            validatos = [
                Validators.required
            ];
        }

        if (this.iniciativa.estatus === 'Turnar dictamen a Mesa Directiva') {
            validatosMesaDirectiva = [
                Validators.required
            ];
        }

        if (this.iniciativa.estatus === 'Turnada a publicación') {
            validatosPublicacion = [
                Validators.required
            ];

            validatosPublicacionText = [
                Validators.minLength(3), 
                Validators.maxLength(100),
                Validators.required
            ]
        }

        if (this.iniciativa.actasSesion[0] !== undefined) {

            this.iniciativa.actasSesion[0].fechaSesion =
                moment(this.iniciativa.actasSesion[0].fechaSesion).format('YYYY-MM-DD') + "T16:00:00.000Z";
            this.iniciativa.actasSesion[0].horaSesion =
                moment(this.iniciativa.actasSesion[0].horaSesion, 'h:mm').format('HH:mm');
            this.selectedComision = this.iniciativa.comisiones.id;

            this.selectedLegislatura = this.iniciativa.actasSesion[0].legislatura;
            this.selectedSesion = this.iniciativa.actasSesion[0].tipoSesion;
            // Form reativo
            this.form = this.formBuilder.group({
                id: [{ value: this.iniciativa.id, disabled: true }],
                tipo: [
                    { value: this.iniciativa.tipo_de_iniciativa, disabled: true },
                    Validators.required,
                ],
                fechaIniciativa: [
                    { value: this.iniciativa.fechaIniciativa, disabled: true },
                    Validators.required,
                ],
                fechaRegistro: [
                    { value: this.iniciativa.fechaCreacion, disabled: true },
                    Validators.required,
                ],
                estatus: [
                    { value: this.iniciativa.estatus, disabled: true },
                    Validators.required,
                ],

                autores: [{ value: "", disabled: true }],
                etiquetasAutores: [{ value: "", disabled: true }],
                tema: [{ value: "", disabled: true }],
                etiquetasTema: [{ value: "", disabled: true }],
                clasificaciones: [{ value: "", disabled: false }, validatos],
                adicion: [{ value: "", disabled: false }],
                etiquetasAdicion: [{ value: "", disabled: false }],
                etiquetas: [{ value: "", disabled: false }],
                etiquetasEtiquetas: [{ value: "", disabled: false }],
                etiquetasClasificaciones: [{ value: "", disabled: false }],
                comision: [{ value: this.comisiones, disabled: false }, validatos],
                dictamenDeIniciativa: [{ value: this.selectedDictamenDeIniciativa, disabled: false }, validatosMesaDirectiva],
                legislatura: [{ value: this.selectedLegislatura }, [Validators.required]],
                tipoSesion: [{ value: this.selectedSesion }, [Validators.required]],
                sustentoDeModificacion: [this.iniciativa.sustentoDeModificacion, [Validators.minLength(1), Validators.maxLength(500)]],
                motivoDeSuspension: [this.iniciativa.motivoDeSuspension, [Validators.minLength(3), Validators.maxLength(500)]],
                fechaSesion: [{ value: this.iniciativa.actasSesion[0].fechaSesion, disabled: false }, [Validators.required]],
                horaSesion: [{ value: this.iniciativa.actasSesion[0].horaSesion, disabled: this.disable }, [Validators.required]],
                periodicoOficial: [this.iniciativa.periodicoOficial, validatosPublicacion],
                fechaPublicacion: [{ value: this.iniciativa.fechaPublicacion, disabled: false }, validatosPublicacion],
            });
        } else {
            // Form reativo
            this.form = this.formBuilder.group({
                id: [{ value: this.iniciativa.id, disabled: true }],
                tipo: [
                    { value: this.iniciativa.tipo_de_iniciativa, disabled: true },
                    Validators.required,
                ],
                fechaIniciativa: [
                    { value: this.iniciativa.fechaIniciativa, disabled: true },
                    Validators.required,
                ],
                fechaRegistro: [
                    { value: this.iniciativa.fechaCreacion, disabled: true },
                    Validators.required,
                ],
                estatus: [
                    { value: this.iniciativa.estatus, disabled: true },
                    Validators.required,
                ],

                autores: [{ value: "", disabled: true }],
                etiquetasAutores: [{ value: "", disabled: true }],
                tema: [{ value: "", disabled: true }],
                etiquetasTema: [{ value: "", disabled: true }],
                clasificaciones: [{ value: "", disabled: false }, validatos],
                etiquetasClasificaciones: [{ value: "", disabled: false }],
                adicion: [{ value: "", disabled: false }],
                etiquetasAdicion: [{ value: "", disabled: false }],
                etiquetas: [{ value: "", disabled: false }],
                etiquetasEtiquetas: [{ value: "", disabled: false }],
                comision: [{ value: this.comisiones, disabled: false }, validatos],
                legislatura: [{ value: this.selectedLegislatura }, [Validators.required]],
                tipoSesion: [{ value: this.selectedSesion }, [Validators.required]],
                fechaSesion: [{ value: '', disabled: false }, [Validators.required]],
                horaSesion: [{ value: '', disabled: false }, [Validators.required]],
                dictamenDeIniciativa: [{ value: this.selectedDictamenDeIniciativa, disabled: false }, validatosMesaDirectiva],
                periodicoOficial: [this.iniciativa.periodicoOficial, [Validators.minLength(3), Validators.maxLength(100)]],
                fechaPublicacion: [{ value: this.iniciativa.fechaPublicacion, disabled: false }],
            });
        }
        if(this.iniciativa.estatus == 'Turnar dictamen a secretaría de servicios parlamentarios' 
        && this.iniciativa.formatosTipoIniciativa.length < 4 
        && this.iniciativa.tipo_de_iniciativa.descripcion == 'Iniciativa'
        || this.iniciativa.estatus == 'Turnar dictamen a secretaría de servicios parlamentarios' 
        && this.iniciativa.formatosTipoIniciativa.length < 3 
        && this.iniciativa.tipo_de_iniciativa.descripcion == 'Cuenta Pública'){
            await this.guardar();
        }
    }

    async guardar(): Promise<void> {

        let legislatura;
        let tipoSesion;
        let fechaSesion;
        let hora;
        let horaSesion;

        this.spinner.show();

        if (this.cambioInforme) {
            await this.subirAnexos(this.filesInforme);
        } else {
            if (this.iniciativa.anexosTipoCuentaPublica[0]) {
                this.anexos.push(this.iniciativa.anexosTipoCuentaPublica[0]);
            }
        }
        if (this.cambioOficio) {
            await this.subirAnexos(this.filesOficio);
        } else {
            if (this.iniciativa.anexosTipoCuentaPublica[1]) {
                this.anexos.push(this.iniciativa.anexosTipoCuentaPublica[1]);
            }
        }

        this.iniciativa.anexosTipoCuentaPublica = this.anexos;

        this.iniciativa.clasificaciones = this.clasificaciones;

        if(this.selectedComision){
            console.log('se seleccionó comisión');
            this.iniciativa.comisiones = this.selectedComision;
        }

        if (this.iniciativa.informeDeResultadosRevision !== undefined) {
            this.iniciativa.informeDeResultadosRevision = this.iniciativa.informeDeResultadosRevision.id;
        }

        if (this.iniciativa.oficioEnvioDeInforme !== undefined) {
            this.iniciativa.oficioEnvioDeInforme = this.iniciativa.oficioEnvioDeInforme.id;
        }
        legislatura = this.selectedLegislatura;
        tipoSesion = this.form.get('tipoSesion').value;;
        fechaSesion = moment(this.form.get('fechaSesion').value).format('YYYY-MM-DD');
        hora = this.form.get('horaSesion').value;
        horaSesion = hora + ':00.000';
        
        if (this.iniciativa.id) {
            if(this.iniciativa.estatus == 'Turnada a comisión para modificación'){
                console.log('Turnada a comisión para modificación Crea report');
                await this.generaReport();
            }else if(this.iniciativa.estatus == 'Turnar dictamen a Mesa Directiva' && this.selectedDictamenDeIniciativa == 'No aprobada'){
                //this.iniciativa.estatus = 'Suspendida';
                this.iniciativa.motivoDeSuspension = this.form.get('motivoDeSuspension').value;
                this.iniciativa.dictamenDeIniciativa = this.selectedDictamenDeIniciativa;
            }else if(this.iniciativa.estatus == 'Turnar dictamen a Mesa Directiva' && this.selectedDictamenDeIniciativa == 'Modificación'){
                console.log('Turnada a comisión para modificación cValor');
                //this.iniciativa.estatus = 'Turnada a comisión para modificación';
                this.iniciativa.sustentoDeModificacion = this.form.get('sustentoDeModificacion').value;
                this.iniciativa.dictamenDeIniciativa = this.selectedDictamenDeIniciativa;
            }else if(this.iniciativa.estatus == 'Turnada a publicación'){
                this.iniciativa.periodicoOficial = this.form.get('periodicoOficial').value;
                this.iniciativa.fechaPublicacion = moment(this.form.get('fechaPublicacion').value).format('YYYY-MM-DD');
                this.iniciativa.fechaCreacion = moment().format('YYYY-MM-DD');
                this.iniciativa.estatus = 'Publicada';
            }else if(this.iniciativa.estatus == 'Turnar dictamen a Mesa Directiva' && this.iniciativa.tipo_de_iniciativa.descripcion == 'Iniciativa' &&
            this.selectedDictamenDeIniciativa == 'Aprobada'){
                this.iniciativa.adicion = this.adicion;
                this.iniciativa.etiquetas = this.etiquetas;
                this.iniciativa.dictamenDeIniciativa = this.selectedDictamenDeIniciativa;
                await this.generaReport();
            }else if(this.iniciativa.estatus == 'Turnar dictamen a Mesa Directiva' && this.iniciativa.tipo_de_iniciativa.descripcion == 'Cuenta Pública' &&
            this.selectedDictamenDeIniciativa == 'Aprobada'){
                console.log('aprobada');
                this.iniciativa.dictamenDeIniciativa = this.selectedDictamenDeIniciativa;
                await this.generaReport();
            }else{
                console.log('Else');
                await this.generaReport();
            }
            if(this.iniciativa.estatus === 'Turnar dictamen a secretaría de servicios parlamentarios'){
                legislatura = this.selectedLegislatura;
                tipoSesion = this.form.get('tipoSesion').value;;
                fechaSesion = moment(this.form.get('fechaSesion').value).format('YYYY-MM-DD');
                hora = this.form.get('horaSesion').value;
                horaSesion = hora + ':00.000';
            }
            console.log(this.iniciativa);
            if (this.iniciativa.actasSesion.length > 0) {
                // Actualizamos la comision 
                this.actasSesionsService.actualizarActasSesions({
                    id: this.iniciativa.actasSesion[0].id,
                    legislatura: legislatura,
                    tipoSesion: tipoSesion,
                    fechaSesion: fechaSesion,
                    horaSesion: horaSesion
                }).subscribe((resp: any) => {
                    if (resp) {
                        this.iniciativa.actasSesion = [resp.data.id];

                        this.iniciativaService.actualizarIniciativa(this.iniciativa).subscribe((resp: any) => {
                            if (resp) {
                                this.spinner.hide();
                                if (this.iniciativa.estatus === 'Turnar dictamen a secretaría de servicios parlamentarios') {
                                    this.spinner.hide();
                                    Swal.fire('Éxito', 'Documento generado correctamente.', 'success');
                                    this.iniciativa = resp.data;
                                } else {
                                    Swal.fire('Éxito', 'Iniciativa actualizada correctamente.', 'success');
                                    this.iniciativa = resp.data;
                                    this.cerrar(this.iniciativa);
                                }
                            } else {
                                this.spinner.hide();
                                Swal.fire('Error', 'Ocurrió un error al actualizar. ' + resp.error.data, 'error');
                            }
                        }, err => {
                            this.spinner.hide();
                            Swal.fire('Error', 'Ocurrió un error al actualizar.' + err.error.data, 'error');
                        });

                    } else {
                        this.spinner.hide();
                        Swal.fire('Error', 'Ocurrió un error al guardar. ' + resp.error.data, 'error');
                    }
                }, err => {
                    this.spinner.hide();
                    Swal.fire('Error', 'Ocurrió un error al guardar.' + err.error.data, 'error');
                });
            } else {

                this.actasSesionsService.guardarActasSesions({
                    legislatura: legislatura,
                    tipoSesion: tipoSesion,
                    fechaSesion: fechaSesion,
                    horaSesion: horaSesion
                }).subscribe((resp: any) => {
                    if (resp) {
                        this.iniciativa.actasSesion = [resp.data.id];

                        this.iniciativaService.actualizarIniciativa(this.iniciativa).subscribe((resp: any) => {
                            if (resp) {
                                this.spinner.hide();
                                Swal.fire('Éxito', 'Iniciativa actualizada correctamente.', 'success');
                                this.iniciativa = resp.data;

                                if (this.iniciativa.estatus === 'Turnar dictamen a secretaría de servicios parlamentarios' && this.iniciativa.formatosTipoIniciativa.length == 3) {

                                } else {
                                    this.cerrar(this.iniciativa);
                                }
                            } else {
                                this.spinner.hide();
                                Swal.fire('Error', 'Ocurrió un error al actualizar. ' + resp.error.data, 'error');
                            }
                        }, err => {
                            this.spinner.hide();
                            Swal.fire('Error', 'Ocurrió un error al actualizar.' + err.error.data, 'error');
                        });

                    } else {
                        this.spinner.hide();
                        Swal.fire('Error', 'Ocurrió un error al guardar. ' + resp.error.data, 'error');
                    }
                }, err => {
                    this.spinner.hide();
                    Swal.fire('Error', 'Ocurrió un error al guardar.' + err.error.data, 'error');
                });
            }
        }
    }

    async guardarAnexos(): Promise<void> {
        let resultado: any;
        this.spinner.show();
        if (this.cambioInforme) {
            await this.subirAnexos(this.filesInforme);
        } else {
            if (this.iniciativa.anexosTipoCuentaPublica[0]) {
                this.anexos.push(this.iniciativa.anexosTipoCuentaPublica[0]);
            }
        }
        if (this.cambioOficio) {
            await this.subirAnexos(this.filesOficio);
        } else {
            if (this.iniciativa.anexosTipoCuentaPublica[1]) {
                this.anexos.push(this.iniciativa.anexosTipoCuentaPublica[1]);
            }
        }


        this.iniciativa.anexosTipoCuentaPublica = this.anexos;

        this.iniciativaService
            .actualizarIniciativa({ id: this.iniciativa.id, anexosTipoCuentaPublica: this.iniciativa.anexosTipoCuentaPublica })
            .subscribe(
                (resp: any) => {
                    if (resp.data) {
                        Swal.fire(
                            "Éxito",
                            "Iniciativa actualizada correctamente.",
                            "success"
                        );
                        this.iniciativa = resp.data;

                        this.spinner.hide();
                        this.cerrar(this.iniciativa);
                    } else {
                        this.spinner.hide();
                        Swal.fire(
                            "Error",
                            "Ocurrió un error al guardar. " +
                            resp.error.data,
                            "error"
                        );
                    }
                },
                (err) => {
                    this.spinner.hide();
                    Swal.fire(
                        "Error",
                        "Ocurrió un error al guardar." + err.error.data,
                        "error"
                    );
                }
            );

    }


    subirAnexos(elemento: any): Promise<void> {
        return new Promise(async (resolve) => {
            {
                let resultado: any;
                let id: string;
                elemento.forEach(async (element) => {
                    resultado = await this.uploadService.subirArchivo(element.data, element.base64);
                    id = resultado.data[0].id
                    this.anexos.push(id);
                    resolve(resultado)
                });

            }
        });
    }

    cerrar(doc: any): void {
        if (doc) {
            this.dialogRef.close(doc);
        } else {
            this.dialogRef.close();
        }
    }

    async obtenerTiposIniciativas(): Promise<void> {
        return new Promise(async (resolve) => {
            {
                // Obtenemos los tipos de iniciativas
                await this.iniciativaService.obtenerTiposIniciativas().subscribe(
                    (resp: any) => {
                        this.arrTipo = resp;
                        resolve(resp);
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

    agregarTema(event: MatChipInputEvent): void {
        const input = event.input;
        const value = event.value;

        if ((value || "").trim()) {
            this.temas.push({ name: value.trim() });
        }

        // Reset the input value
        if (input) {
            input.value = "";
        }
    }

    eliminarTema(tema: Temas): void {
        const index = this.temas.indexOf(tema);

        if (index >= 0) {
            this.temas.splice(index, 1);
        }
    }

    agregarClasificacion(event: MatChipInputEvent): void {
        const input = event.input;
        const value = event.value;
        this.validarLargoClasificacion = 0;
        let i = 0;

        if ((value || "").trim()) {
            this.clasificaciones.push({ name: value.trim() });
        }

        while (i <= this.clasificaciones.length - 1) {
            this.validarLargoClasificacion = this.validarLargoClasificacion + this.clasificaciones[i].name.length;
            i++;
        }

        if (this.validarLargoClasificacion < 3 || this.validarLargoClasificacion > 100) {
            this.errorLargo = true;
        } else {
            this.errorLargo = false;
        }


        // Reset the input value
        if (input) {
            input.value = "";
        }
    }

    eliminarClasificacion(clasificacion: Clasificaciones): void {
        const index = this.clasificaciones.indexOf(clasificacion);


        if (index >= 0) {
            this.clasificaciones.splice(index, 1);
        }
    }

    agregarAdicion(event: MatChipInputEvent): void {
        const input = event.input;
        const value = event.value;

        if ((value || "").trim()) {
            this.adicion.push({ name: value.trim() });
        }

        // Reset the input value
        if (input) {
            input.value = "";
        }
    }

    eliminarAdicion(adicion: Adicion): void {
        const index = this.adicion.indexOf(adicion);

        if (index >= 0) {
            this.adicion.splice(index, 1);
        }
    }

    agregarEtiquetas(event: MatChipInputEvent): void {
        const input = event.input;
        const value = event.value;

        if ((value || "").trim()) {
            this.etiquetas.push({ name: value.trim() });
        }

        // Reset the input value
        if (input) {
            input.value = "";
        }
    }

    eliminarEtiquetas(etiquetas: Etiquetas): void {
        const index = this.etiquetas.indexOf(etiquetas);

        if (index >= 0) {
            this.etiquetas.splice(index, 1);
        }
    }


    addOficio(): void {
        // Agregamos elemento file

        let base64Result: string;
        this.filesOficio = [];
        const fileInput = this.fileOficio.nativeElement;
        fileInput.onchange = () => {
            this.cambioOficio = true;
            // tslint:disable-next-line: prefer-for-of
            for (let index = 0; index < fileInput.files.length; index++) {
                const file = fileInput.files[index];
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onloadend = () => {
                    this.fileOficioName = file.name;
                    this.filesOficio.push({
                        data: file,
                        base64: reader.result.toString(),
                        filename: file.name,
                        inProgress: false,
                        progress: 0,
                    });
                    this.filesOficio = [...this.filesOficio];
                };

            }

            //  this.upload();
        };
        fileInput.click();
    }
    addInforme(): void {
        // Agregamos elemento file
        let base64Result: string;
        this.filesInforme = [];
        const fileInputInforme = this.fileOficio.nativeElement;
        fileInputInforme.onchange = () => {
            this.cambioInforme = true;
            // tslint:disable-next-line: prefer-for-of
            for (let index = 0; index < fileInputInforme.files.length; index++) {
                const file = fileInputInforme.files[index];
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onloadend = () => {

                    this.fileInformeName = file.name;
                    this.filesInforme.push({
                        data: file,
                        base64: reader.result.toString(),
                        filename: file.name,
                        inProgress: false,
                        progress: 0,
                    });
                    this.filesInforme = [...this.filesInforme];
                };

            }

            //  this.upload();
        };


        fileInputInforme.click();
    }
    getNumbersInString(string: string): string {
        const tmp = string.split("");
        // tslint:disable-next-line: only-arrow-functions
        const map = tmp.map((current) => {
            // tslint:disable-next-line: radix
            if (!isNaN(parseInt(current))) {
                return current;
            }
        });

        // tslint:disable-next-line: only-arrow-functions
        // tslint:disable-next-line: triple-equals
        const numbers = map.filter((value) => value != undefined);

        return numbers.join("");
    }

    filterDatatable(value): void {
        // Filtramos tabla
    }

    async obtenerLegislatura(): Promise<void> {
        return new Promise((resolve) => {
            {
                this.legislaturaService.obtenerLegislatura().subscribe(
                    (resp: any) => {
                        for (const legislatura of resp) {
                            if (legislatura.bActual && legislatura.bActivo) {
                                this.legislatura.push(legislatura);
                            }
                        }
                        resolve(resp);

                        //seleccionamos legislatura por default
                        this.selectedLegislatura = this.legislatura[0].id;
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

    async obtenerMesaDirectiva(): Promise<void> {
        return new Promise((resolve) => {
            {
                this.mesasDirectivasService.obtenerMesas().subscribe(
                    (resp: any) => {
                        for (const mesa_directiva of resp) {
                            if (mesa_directiva.activo) {
                                this.arrMesas.push(mesa_directiva);
                            }
                        }
                        resolve(resp);

                    },
                    (err) => {
                        Swal.fire(
                            "Error",
                            "Ocurrió un error al obtener las mesas directivas." +
                            err,
                            "error"
                        );
                        resolve(err);
                    }
                );
            }
        });
    }

    async obtenerDetalleMesa(): Promise<void> {
        return new Promise((resolve) => {
            {
                this.detalleMesaService.obtenerDetalleMesa().subscribe(
                    (resp: any) => {
                        for (const detalle_mesa of resp) {
                            if (detalle_mesa.activo) {
                                this.arrDetalleMesas.push(detalle_mesa);
                            }
                        }
                        resolve(resp);

                    },
                    (err) => {
                        Swal.fire(
                            "Error",
                            "Ocurrió un error al obtener las el detalle de las mesas directivas." +
                            err,
                            "error"
                        );
                        resolve(err);
                    }
                );
            }
        });
    }

    async obtenerComisiones(): Promise<void> {
        return new Promise((resolve) => {
            {
                this.comisionesService.obtenerComisiones().subscribe(
                    (resp: any) => {
                        for (const comisiones of resp) {
                            if (comisiones.activo) {
                                this.comisiones.push(comisiones);
                            }
                        }
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

    async obtenerFirma(id: string): Promise<void> {
        return new Promise((resolve) => {
            {
                this.firmas.obtenerFirmaPorEtapa(id).subscribe(
                    (resp: any) => {
                        resolve(resp);
                    },
                    (err) => {
                        Swal.fire(
                            "Error",
                            "Ocurrió un error al obtener las firmas por etapas." +
                            err,
                            "error"
                        );
                        resolve(err);
                    }
                );
            }
        });
    }

    async obtenerParametros(parametro: string): Promise<[]> {

        return new Promise((resolve) => {
            {
                this.parametros.obtenerParametros(parametro).subscribe(
                    (resp: any) => {
                        resolve(resp);

                    },
                    (err) => {
                        Swal.fire(
                            "Error",
                            "Ocurrió un error al obtener los parametros." +
                            err,
                            "error"
                        );
                        resolve(err);
                    }
                );
            }
        });
    }

    async generaReport(): Promise<string> {
        console.log('generando reporte');
        this.documentos = new DocumentosModel();
        //Seteamos la libreria de moment en español.
        moment.locale('es');

        return new Promise(async (resolve) => {


            const fecha = new Date(); // Fecha actual
            let mes: any = fecha.getMonth() + 1; // obteniendo mes
            let dia: any = fecha.getDate(); // obteniendo dia
            dia = dia + 1;
            const anio = fecha.getFullYear(); // obteniendo año
            let cAutores = '';
            let cTemas = '';
            let header: any[] = [];
            let presente: any[] = [];
            let idPuesto: any[] = [];
            let idFirmasPorEtapas: any;
            if (dia < 10) {
                dia = '0' + dia; // agrega cero si el menor de 10
            }
            if (mes < 10) {
                mes = '0' + mes; // agrega cero si el menor de 10
            }
            const fechaActual = moment().format('DD/MM/YYYY');
            let puestoSecretarioGeneral: any[];
            let legislaturas = await this.obtenerLegislatura();

            let parametrosSSP001 = await this.obtenerParametros('SSP-001');
            let parametrosSSP004 = await this.obtenerParametros('SSP-004');
            console.log(parametrosSSP004)
            let parametrosCIEL008 = await this.obtenerParametros('CIEL-008');
            let parametrosSSP005 = await this.obtenerParametros('SSP-005');
            let parametrosSSP008 = await this.obtenerParametros('SSP-008');
            //console.log('parametros08')
            //console.log(parametrosSSP008);
            puestoSecretarioGeneral = await this.obtenerParametros('Id-Puesto-Secretario-General');

            if(this.iniciativa.estatus  == 'Turnar dictamen a Mesa Directiva'){
                idFirmasPorEtapas = parametrosSSP008.filter((d) => d['cParametroAdministrado'] === 'SSP-008-Firmas');
            } else {
                idFirmasPorEtapas = parametrosSSP004.filter((d) => d['cParametroAdministrado'] === 'SSP-004-Firmas');
            }

            if (this.iniciativa.estatus === 'Turnar iniciativa a comisión' || 
            this.iniciativa.estatus === 'Turnada a comisión para modificación' ) {
                idPuesto = parametrosSSP004.filter((d) => d['cParametroAdministrado'] === 'SSP-004-Iniciativa-Puesto');
            } if (this.iniciativa.estatus === 'Turnar cuenta pública a EASE') {
                idPuesto = parametrosSSP004.filter((d) => d['cParametroAdministrado'] === 'SSP-004-EASE-Puesto');
            } if (this.iniciativa.estatus === 'Turnar dictamen a Secretaría General') {
                idPuesto = parametrosCIEL008.filter((d) => d['cParametroAdministrado'] === 'CIEL-008-Secretaría-General-Puesto');
            } if (this.iniciativa.estatus === 'Turnar dictamen a secretaría de servicios parlamentarios') {
                idPuesto = parametrosSSP005.filter((d) => d['cParametroAdministrado'] === 'SSP-005-Servicios-Parlamentarios-Puesto');
            } if (this.iniciativa.estatus === 'Turnar dictamen a Mesa Directiva'){
                idPuesto = parametrosSSP008.filter((d) => d['cParametroAdministrado'] === 'SSP-008-Mesa-Directiva-Puesto');
                console.log('idPuesto');
                console.log(idPuesto);
            }

            let firmasPorEtapas = await this.obtenerFirma(idFirmasPorEtapas[0]['cValor']);
            console.log('firmas por etapas');
            console.log(firmasPorEtapas);
            let puesto = firmasPorEtapas[0].participantes.filter((d) => d['puesto'] === idPuesto[0]['cValor']);
            console.log(puesto);

            let puestoSecretario = firmasPorEtapas[0].participantes.filter((d) => d['puesto'] === puestoSecretarioGeneral[0].cValor);
            console.log('puesto secretario');
            console.log(puestoSecretario);
            let tipoIniciativa = this.arrTipo.filter((d) => d['id'] === this.selectTipo);
            let comision: any = this.comisiones.filter(d => d.id === this.selectedComision);

            //console.log(this.arrMesas);
            let mesa_directiva: any = this.arrMesas.filter(meta => meta.legislatura.id === this.selectedLegislatura);
            let legislaturaDoc: any = this.legislatura.filter(meta => meta.id === this.selectedLegislatura);

            let detalle_mesa: any = this.arrDetalleMesas.filter(meta => meta.mesas_directiva === mesa_directiva[0].id);
            console.log('detalleMesa');
            console.log(detalle_mesa);
            let tipoSesion = this.selectedSesion;
            let fechaSesion = moment(this.form.get('fechaSesion').value).format('LL');
            let diaSesion = moment(this.form.get('fechaSesion').value).format('DD');
            console.log(diaSesion);
            let mesSesion = moment(this.form.get('fechaSesion').value).format('MMMM');
            console.log(mesSesion);
            let anioSesion = moment(this.form.get('fechaSesion').value).format('YYYY');
            console.log(anioSesion);
            let tipoDocumento = parametrosSSP001.filter((d) => d['cParametroAdministrado'] === 'SSP-001-Tipo-de-Documento');
            let tipoExpediente = parametrosSSP001.filter((d) => d['cParametroAdministrado'] === 'SSP-001-Tipo-de-Expediente');
            let tipoInformacion = parametrosSSP001.filter((d) => d['cParametroAdministrado'] === 'SSP-001-Tipo-de-Informacion');

            this.temas.forEach(element => {
                if (cTemas === '') {
                    cTemas = element.name;
                } else {
                    cTemas = cTemas + ', ' + element.name;
                }

            });

            this.autores.forEach(element => {
                if (cAutores === '') {
                    cAutores = element.name;
                } else {
                    cAutores = cAutores + ', ' + element.name;
                }

            });

            // Creamos el reporte

            header = this.configuraHeaderReport(legislaturas[0]["cLegislatura"] + ' LEGISLATURA');

            presente.push({
                text: "Lic. " + puesto[0]['nombre'] + ' ' + puesto[0]['apellidoMaterno'] + ' ' + puesto[0]['apellidoPaterno'],
                fontSize: 14,
                bold: true,
                alignment: "left",
                margin: [0, 10, 0, 0],
            });
            if (this.iniciativa.estatus === 'Turnar iniciativa a comisión' || this.iniciativa.estatus === '') {
                presente.push({
                    text: "Director del Centro de Investigación y",
                    fontSize: 14,
                    bold: true,
                    alignment: "left",
                });
                presente.push({
                    text: "Estudios Legislativos",
                    fontSize: 14,
                    bold: true,
                    alignment: "left",
                });
                presente.push({
                    text: "PRESENTE",
                    fontSize: 14,
                    bold: true,
                    alignment: "left",
                })
            } if (this.iniciativa.estatus === 'Turnar cuenta pública a EASE') {
                presente.push({
                    text: "Auditor Superior del Estado de Durango",
                    fontSize: 14,
                    bold: true,
                    alignment: "left",
                });
                presente.push({
                    text: "PRESENTE",
                    fontSize: 14,
                    bold: true,
                    alignment: "left",
                })
            } if (this.iniciativa.estatus === 'Turnar dictamen a Secretaría General') {
                presente.push({
                    text: "SECRETARIO GENERAL DEL H.",
                    fontSize: 14,
                    bold: true,
                    alignment: "left",
                });
                presente.push({
                    text: "CONGRESO DEL ESTADO",
                    fontSize: 14,
                    bold: true,
                    alignment: "left",
                });
                presente.push({
                    text: "PRESENTE",
                    fontSize: 14,
                    bold: true,
                    alignment: "left",
                })
            } if(this.iniciativa.estatus == 'Turnar dictamen a secretaría de servicios parlamentarios'){
                presente.push({
                    text: "SECRETARIA DE SERVICIOS",
                    fontSize: 14,
                    bold: true,
                    alignment: "left",
                });
                presente.push({
                    text: "PARLAMENTARIOS DEL",
                    fontSize: 14,
                    bold: true,
                    alignment: "left",
                });
                presente.push({
                    text: "H. CONGRESO DEL ESTADO",
                    fontSize: 14,
                    bold: true,
                    alignment: "left",
                })
                presente.push({
                    text: "PRESENTE",
                    fontSize: 14,
                    bold: true,
                    alignment: "left",
                })
            }if(this.iniciativa.estatus === 'Turnar dictamen a Mesa Directiva'){
                presente.push({
                    text: "GOBERNADOR DEL ESTADO",
                    fontSize: 14,
                    bold: true,
                    alignment: "left",
                });
                presente.push({
                    text: "DE DURANGO",
                    fontSize: 14,
                    bold: true,
                    alignment: "left",
                });
                presente.push({
                    text: "PRESENTE",
                    fontSize: 14,
                    bold: true,
                    alignment: "left",
                })
            }

            if (this.iniciativa.estatus === 'Turnar iniciativa a comisión' ||
            this.iniciativa.estatus === 'Turnada a comisión para modificación' && this.iniciativa.tipo_de_iniciativa == 'Iniciativa') {
                //verificamos si es uno o varios autores.
                //console.log(this.autores.length);
                if (this.autores.length <= 1) {
                    presente.push({
                        text:
                            [
                                'Por instrucciones del C. ',
                                { text: detalle_mesa[0].presidentes[0].nombre, bold: true },
                                ', presidente de la mesa directiva, en sesión ',
                                { text: tipoSesion, bold: true },
                                ' verificada el ',
                                { text: diaSesion + ' de ' + mesSesion + ' del año ' + anioSesion, bold: true },
                                ' se acordó turnar a la comisión de ',
                                { text: comision[0].descripcion, bold: true },
                                ', iniciativa, presentada por el C. ',
                                { text: cAutores, bold: true },
                                ', que contiene ',
                                { text: cTemas, bold: true },
                                '.'
                            ],
                        fontSize: 12,
                        bold: false,
                        alignment: "justify",
                        margin: [0, 50, 5, 5],
                    });
                } if (this.autores.length >= 2) {

                    presente.push({
                        text:
                            [
                                'Por instrucciones del C. ',
                                { text: detalle_mesa[0].presidentes[0].nombre, bold: true },
                                ', presidente de la mesa directiva, en sesión ',
                                { text: tipoSesion, bold: true },
                                ' verificada el ',
                                { text: diaSesion + ' de ' + mesSesion + ' del año ' + anioSesion, bold: true },
                                ' se acordó turnar a la comisión de ',
                                { text: comision[0].descripcion, bold: true },
                                ', iniciativa, presentada por los CC. ',
                                { text: cAutores, bold: true },
                                ', que contiene ',
                                { text: cTemas, bold: true },
                                '.'
                            ],
                        fontSize: 12,
                        bold: false,
                        alignment: "justify",
                        margin: [0, 50, 5, 5],
                    });
                }
            } if (this.iniciativa.estatus === 'Turnar cuenta pública a EASE' ||
            this.iniciativa.estatus === 'Turnada a comisión para modificación' && this.iniciativa.tipo_de_iniciativa == 'Cuenta Pública') {

                if (this.autores.length <= 1) {
                    presente.push({
                        text:
                            [
                                'Por instrucciones del C. ',
                                { text: detalle_mesa[0].presidentes[0].nombre, bold: true },
                                ', presidente de la mesa directiva, en sesión ',
                                { text: tipoSesion, bold: true },
                                ' verificada el ',
                                { text: diaSesion + ' de ' + mesSesion + ' del año ' + anioSesion, bold: true },
                                ' se acordó turnar a la Entidad de Auditoria Superior del Estado de Durango, Cuenta pública, presentada por el C. ',
                                { text: cAutores, bold: true },
                                ', que contiene ',
                                { text: cTemas, bold: true },
                                '.'
                            ],
                        fontSize: 12,
                        bold: false,
                        alignment: "justify",
                        margin: [0, 50, 5, 5],
                    });
                } if (this.autores.length >= 2) {

                    presente.push({
                        text:
                            [
                                'Por instrucciones del C. ',
                                { text: detalle_mesa[0].presidentes[0].nombre, bold: true },
                                ', presidente de la mesa directiva, en sesión ',
                                { text: tipoSesion, bold: true },
                                ' verificada el ',
                                { text: diaSesion + ' de ' + mesSesion + ' del año ' + anioSesion, bold: true },
                                ' se acordó turnar a la Entidad de Auditoria Superior del Estado de Durango, Cuenta pública, presentada por los CC. ',
                                { text: cAutores, bold: true },
                                ', que contiene ',
                                { text: cTemas, bold: true },
                                '.'
                            ],
                        fontSize: 12,
                        bold: false,
                        alignment: "justify",
                        margin: [0, 50, 5, 5],
                    });
                }
            } if (this.iniciativa.estatus === 'Turnar dictamen a Secretaría General') {

                presente.push({
                    text:
                        [
                            'Por instrucciones del presidente de la comisión ',
                            { text: comision[0].descripcion, bold: true },
                            ', de este H. Congreso del Estado y con fundamento en lo dispuesto en la Ley Orgánica del Estado de Durango, me permito remitirle dictamen para su trámite legislativo el siguiente:',
                        ],
                    fontSize: 12,
                    bold: false,
                    alignment: "justify",
                    margin: [0, 50, 5, 5],
                });
                presente.push({
                    text:
                        [
                            { text: 'Dictamen: ', bold: true },
                            'respecto de la iniciativa con proyecto de decreto, enviada por el o los ',
                            { text: 'C. ', bold: true },
                            { text: cAutores, bold: true },
                            ' de la legislatura ',
                            { text: legislaturaDoc[0].cLegislatura, bold: true },
                            ' Legislatura del Congreso del Estado, que contiene ',
                            { text: cTemas, bold: true },
                            '.'
                        ],
                    fontSize: 12,
                    bold: false,
                    alignment: "justify",
                    margin: [0, 10, 5, 5],
                });
            } if (this.iniciativa.estatus === 'Turnar dictamen a secretaría de servicios parlamentarios') {

                presente.push({
                    text:
                        [
                            'Con fundamento en lo dispuesto por los artículos de la Ley Orgánica del Congreso del Estado de Durango, me permito remitirle el dictamen presentado por el o los C. ',
                            { text: cAutores, bold: true },
                            ', que contiene ',
                            { text: cTemas, bold: true },
                            ', siga su trámite legislativo correspondiente ante el Pleno Legislativo.'
                        ],
                    fontSize: 12,
                    bold: false,
                    alignment: "justify",
                    margin: [0, 50, 5, 5],
                });
            } if (this.iniciativa.estatus === 'Turnar dictamen a Mesa Directiva') {
                presente.push({
                    text:
                        [
                            'Con objetivo de dar cumplimiento a lo dispuesto en los artículos de la Ley Orgánica del Congreso del Estado de Durango, me permito anexar un ejemplar original del decreto No. ',
                            { text: Number(legislaturas[0].documentos + 1), bold: true },
                            ', que contiene ',
                            { text: cTemas, bold: true },
                            ', lo anterior para solicitarle su publicación en el periódico oficial del Gobierno del Estado de Durango.'
                        ],
                    fontSize: 12,
                    bold: false,
                    alignment: "justify",
                    margin: [0, 50, 5, 5],
                });
            }

            presente.push({
                text: "ATENTAMENTE",
                fontSize: 12,
                bold: true,
                alignment: "center",
                margin: [0, 100, 0, 0],
            });

            presente.push({
                text: "SUFRAGIO EFECTIVO, NO REELECCIÓN",
                fontSize: 12,
                bold: true,
                alignment: "center",
            });

            presente.push({
                text: "Durango, Dgo., " + fechaActual,
                fontSize: 12,
                bold: true,
                alignment: "center",
            });

            presente.push({
                text: "Lic. " + puestoSecretario[0]['nombre'] + ' ' + puestoSecretario[0]['apellidoMaterno'] + ' ' + puestoSecretario[0]['apellidoPaterno'],
                fontSize: 12,
                bold: true,
                alignment: "center",
                margin: [0, 80, 0, 0],
            });

            if(this.iniciativa.estatus === 'Turnar dictamen a Secretaría General'){
            presente.push({
                text: "DIRECTOR DEL CENTRO DE INVESTIGACIONES Y",
                fontSize: 12,
                bold: true,
                alignment: "center",
            });
            presente.push({
                text: "ESTUDIOS LEGISLATIVOS",
                fontSize: 12,
                bold: true,
                alignment: "center",
            });
        } else {
            presente.push({
                text: "SECRETARIO GENERAL DEL H. CONGRESO DEL ESTADO",
                fontSize: 12,
                bold: true,
                alignment: "center",
            });
        }

        if(this.iniciativa.estatus=='Turnar dictamen a Mesa Directiva'){
            presente.push({
                text: "Lic. " + puestoSecretario[1]['nombre'] + ' ' + puestoSecretario[1]['apellidoMaterno'] + ' ' + puestoSecretario[1]['apellidoPaterno'],
                fontSize: 12,
                bold: true,
                alignment: "center",
                margin: [0, 70, 0, 0],
            });

            presente.push({
                text: "SECRETARIO GENERAL DEL H. CONGRESO DEL ESTADO",
                fontSize: 12,
                bold: true,
                alignment: "center",
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
                pageOrientation: "portrait",
                pageSize: "A4",
                fontSize: 8,
                pageMargins: [40, 100, 40, 50],
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

            //pdfMake.createPdf(aa).open();
        
            let pdfDocGenerator = pdfMake.createPdf(aa);
            let base64 = await this.pdfBase64(pdfDocGenerator);

            if (this.iniciativa.estatus === 'Turnar iniciativa a comisión' || this.iniciativa.estatus === 'Turnar cuenta pública a EASE' ||
            this.iniciativa.estatus === 'Turnada a comisión para modificación') {
                await this.uploadSP04(base64, 'SSP 04.pdf');
                await this.guardarDocumento(cTemas, tipoDocumento[0]['cValor'], tipoExpediente[0]['cValor'], tipoInformacion[0]['cValor'], legislaturas[0]);
            } if (this.iniciativa.estatus === 'Turnar dictamen a Secretaría General') {
                await this.upload(base64, 'Formato CIEL 08.pdf');
                await this.guardarDocumentoCiel(cTemas, tipoDocumento[0]['cValor'], tipoExpediente[0]['cValor'], tipoInformacion[0]['cValor'], legislaturas[0]);
            } if (this.iniciativa.estatus === 'Turnar dictamen a secretaría de servicios parlamentarios') {
                await this.upload(base64, 'SSP 005.pdf');
                await this.guardarSSP05(cTemas, tipoDocumento[0]['cValor'], tipoExpediente[0]['cValor'], tipoInformacion[0]['cValor'], legislaturas[0]);
            } if (this.iniciativa.estatus == 'Turnar dictamen a Mesa Directiva'){
                await this.upload(base64, 'SSP 008.pdf');
                await this.guardarSSP08(cTemas, tipoDocumento[0]['cValor'], tipoExpediente[0]['cValor'], tipoInformacion[0]['cValor'], legislaturas[0]);
            }

            const dd = {
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
                footer: {
                    columns: [
                        '',
                        {
                            alignment: 'right',
                            text: 'Id. Documento: ' + this.idDocumento
                        }
                    ],
                    margin: [10, 0]
                },
                pageOrientation: "portrait",
                pageSize: "A4",
                fontSize: 8,
                pageMargins: [40, 100, 40, 50],
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

            // pdfMake.createPdf(dd).open();

            pdfDocGenerator = pdfMake.createPdf(dd);
            base64 = await this.pdfBase64(pdfDocGenerator);

            if (this.iniciativa.estatus === 'Turnar iniciativa a comisión' || this.iniciativa.estatus === 'Turnar cuenta pública a EASE') {
                await this.uploadSP04(base64, 'SSP 04.pdf');
                await this.guardarDocumento(cTemas, tipoDocumento[0]['cValor'], tipoExpediente[0]['cValor'], tipoInformacion[0]['cValor'], legislaturas[0]);
            } if (this.iniciativa.estatus === 'Turnar dictamen a Secretaría General') {
                await this.upload(base64, 'Formato CIEL 08.pdf');
                await this.guardarDocumentoCiel(cTemas, tipoDocumento[0]['cValor'], tipoExpediente[0]['cValor'], tipoInformacion[0]['cValor'], legislaturas[0]);
            } if (this.iniciativa.estatus == 'Turnar dictamen a Mesa Directiva'){
                await this.upload(base64, 'SSP 005.pdf');
                await this.guardarSSP08(cTemas, tipoDocumento[0]['cValor'], tipoExpediente[0]['cValor'], tipoInformacion[0]['cValor'], legislaturas[0]);
            }
            resolve('ok');
        });
    }

    configuraHeaderReport(legislatura: string): any {
        // Configuramos en encabezado
        const stack: any[] = [];

        stack.push({
            text: "H. CONGRESO DEL ESTADO DE DURANGO",
            nodeName: "H1",
            fontSize: 14,
            bold: true,
            alignment: "center",
            margin: [0, 20, 0, 0],
        });
        stack.push({
            text: legislatura,
            nodeName: "H4",
            fontSize: 12,
            bold: false,
            alignment: "center",
        });

        return { stack };
    }

    async upload(base64: any, nombre: string): Promise<void> {

        // Subimos documento
        // const resp = await this.uploadService.uploadFile(this.files[0].data);
        const data = {
            name: nombre
        };
        const resp = await this.uploadService.subirArchivo(data, base64);

        if (resp.error) {
            Swal.fire('Error', 'Ocurrió un error al subir el documento. ' + resp.error.error, 'error');

        } else {
            // La peticion nos retorna el id del documento y lo seteamos al usuario
            if (resp.data) {
                this.documentos.documento = resp.data[0].id;
                this.documentos.textoOcr = resp.text;
            } else {
                //  this.documentos.documento = '';
            }
        }
    }

    async uploadSP04(base64: any, nombre: string): Promise<void> {

        // Subimos documento
        // const resp = await this.uploadService.uploadFile(this.files[0].data);
        const data = {
            name: nombre
        };
        const resp = await this.uploadService.subirArchivo(data, base64);

        if (resp.error) {
            Swal.fire('Error', 'Ocurrió un error al subir el documento. ' + resp.error.error, 'error');

        } else {
            // La peticion nos retorna el id del documento y lo seteamos al usuario
            if (resp.data) {
                this.documentosGuardar.documento = resp.data[0].id;
                this.documentosGuardar.textoOcr = resp.text;
            } else {
                //  this.documentos.documento = '';
            }
        }
    }

    async uploadSP05(base64: any, nombre: string): Promise<void> {

        // Subimos documento
        // const resp = await this.uploadService.uploadFile(this.files[0].data);
        const data = {
            name: nombre
        };
        const resp = await this.uploadService.subirArchivo(data, base64);

        if (resp.error) {
            Swal.fire('Error', 'Ocurrió un error al subir el documento. ' + resp.error.error, 'error');

        } else {
            // La peticion nos retorna el id del documento y lo seteamos al usuario
            if (resp.data) {
                this.documentosGuardar.documento = resp.data[0].id;
                this.documentosGuardar.textoOcr = resp.text;
            } else {
                //  this.documentos.documento = '';
            }
        }
    }

    async pdfBase64(pdf: any): Promise<[]> {
        return new Promise((resolve) => {
            {
                pdf.getBase64((data) => {
                    resolve(data);
                });
            }
        });
    }

    async guardarDocumento(tema: string, tipoDocumento: string, tipoExpediente: string, tipoInformacion: string, legislatura: any): Promise<string> {
        return new Promise(async (resolve) => {
            const fecha = new Date(); // Fecha actual
            let mes: any = fecha.getMonth() + 1; // obteniendo mes
            let dia: any = fecha.getDate(); // obteniendo dia

            const ano = fecha.getFullYear(); // obteniendo año

            if (dia < 10) {
                dia = '0' + dia; // agrega cero si el menor de 10
            }
            if (mes < 10) {
                mes = '0' + mes; // agrega cero si el menor de 10
            }

            const fechaActual = ano + '-' + mes + '-' + dia;
            this.documentosGuardar.bActivo = true;
            this.documentosGuardar.cNombreDocumento = 'Formato SSP 04 de ' + tema;
            this.documentosGuardar.fechaCreacion = fechaActual + 'T16:00:00.000Z';
            this.documentosGuardar.fechaCarga = fechaActual + 'T16:00:00.000Z';
            this.documentosGuardar.version = 1;
            this.documentosGuardar.paginas = 1;
            this.documentosGuardar.usuario = this.menu.usuario;
            this.documentosGuardar.tipo_de_documento = tipoDocumento;
            this.documentosGuardar.tipo_de_expediente = tipoExpediente;
            this.documentosGuardar.visibilidade = tipoInformacion;
            if (this.documentosGuardar.iniciativaOficioEnvioDeInforme !== undefined) {
                this.documentosGuardar.iniciativaOficioEnvioDeInforme = this.documentosGuardar.iniciativaOficioEnvioDeInforme.id
            }

            if (this.documentosGuardar.iniciativa !== undefined) {
                this.documentosGuardar.iniciativa = this.documentosGuardar.iniciativa.id
            }
            if (this.documentosGuardar.legislatura != legislatura.id) {
                this.documentosGuardar.legislatura = legislatura.id;
                //Cambiado legislatura.documentosGuardar por legislatura.documentos para que muestre el numero del folio.
                this.documentosGuardar.folioExpediente = legislatura.cLegislatura + '-' + Number(legislatura.documentos + 1);
            }
            console.log('guardando documento');
            console.log(this.documentosGuardar);
            if (this.iniciativa.formatosTipoIniciativa.length > 1) {

                this.documentosGuardar.id = this.iniciativa.formatosTipoIniciativa[1].id
                if (this.idDocumento.length > 5) {

                    this.documentosGuardar.id = this.idDocumento;

                }
                this.documentoService.actualizarDocumentos(this.documentosGuardar).subscribe((resp: any) => {

                    if (resp) {
                        this.documentosGuardar = resp.data;
                        this.idDocumento = resp.data._id;
                        this.documentosGuardar.fechaCarga = this.datePipe.transform(this.documentosGuardar.fechaCarga, 'yyyy-MM-dd');
                        this.documentosGuardar.fechaCreacion = this.datePipe.transform(this.documentosGuardar.fechaCreacion, 'yyyy-MM-dd');

                        this.iniciativa.formatosTipoIniciativa = [this.iniciativa.formatosTipoIniciativa[1], this.documentosGuardar.id];
                        resolve(this.documentosGuardar.id);
                    } else {
                        this.spinner.hide();
                        Swal.fire('Error', 'Ocurrió un error al guardar. ' + JSON.stringify(resp.error.data), 'error');
                    }
                }, (err: any) => {
                    this.spinner.hide();
                    console.log(err);
                    Swal.fire('Error', 'Ocurrió un error al guardar.' + JSON.stringify(err.error.data), 'error');
                });
            } else {

                this.documentoService.guardarDocumentos(this.documentosGuardar).subscribe((resp: any) => {
                    if (resp) {

                        this.documentosGuardar = resp.data;

                        this.idDocumento = resp.data._id;
                        this.documentosGuardar.fechaCarga = this.datePipe.transform(this.documentosGuardar.fechaCarga, 'yyyy-MM-dd');
                        this.documentosGuardar.fechaCreacion = this.datePipe.transform(this.documentosGuardar.fechaCreacion, 'yyyy-MM-dd');


                        this.iniciativa.formatosTipoIniciativa = [this.iniciativa.formatosTipoIniciativa[1], this.documentosGuardar.id];
                        // Swal.fire('Éxito', 'Documento guardado correctamente.', 'success');

                        resolve(this.documentosGuardar.id);
                        // this.clasificarDocumento(this.documentos)
                    } else {
                        this.spinner.hide();
                        Swal.fire('Error', 'Ocurrió un error al guardar. ' + JSON.stringify(resp.error.data), 'error');
                    }
                }, (err: any) => {
                    this.spinner.hide();
                    console.log(err);
                    Swal.fire('Error', 'Ocurrió un error al guardar.' + JSON.stringify(err.error.data), 'error');
                });
            }
        });
    }

    async guardarDocumentoCiel(tema: string, tipoDocumento: string, tipoExpediente: string, tipoInformacion: string, legislatura: any): Promise<string> {
        return new Promise(async (resolve) => {
            const fecha = new Date(); // Fecha actual
            let mes: any = fecha.getMonth() + 1; // obteniendo mes
            let dia: any = fecha.getDate(); // obteniendo dia

            const ano = fecha.getFullYear(); // obteniendo año

            if (dia < 10) {
                dia = '0' + dia; // agrega cero si el menor de 10
            }
            if (mes < 10) {
                mes = '0' + mes; // agrega cero si el menor de 10
            }

            const fechaActual = ano + '-' + mes + '-' + dia;
            this.documentos.bActivo = true;
            this.documentos.cNombreDocumento = 'Formato CIEL 08 de ' + tema;
            this.documentos.fechaCreacion = fechaActual + 'T16:00:00.000Z';
            this.documentos.fechaCarga = fechaActual + 'T16:00:00.000Z';
            this.documentos.version = 1;
            this.documentos.paginas = 1;
            this.documentos.usuario = this.menu.usuario;
            this.documentos.tipo_de_documento = tipoDocumento;
            this.documentos.tipo_de_expediente = tipoExpediente;
            this.documentos.visibilidade = tipoInformacion;

            if (this.documentos.legislatura != legislatura.id) {
                this.documentos.legislatura = legislatura.id;
                this.documentos.folioExpediente = legislatura.cLegislatura + '-' + Number(legislatura.documentos + 1);
            }

            if (this.iniciativa.formatosTipoIniciativa.length > 2) {

                this.documentos.id = this.iniciativa.formatosTipoIniciativa[2].id

                if (this.idDocumento.length > 5) {

                    this.documentos.id = this.idDocumento;

                }
                this.documentoService.actualizarDocumentos(this.documentos).subscribe((resp: any) => {

                    if (resp) {
                        this.documentos = resp.data;
                        this.idDocumento = resp.data._id;
                        this.documentos.fechaCarga = this.datePipe.transform(this.documentos.fechaCarga, 'yyyy-MM-dd');
                        this.documentos.fechaCreacion = this.datePipe.transform(this.documentos.fechaCreacion, 'yyyy-MM-dd');

                        this.iniciativa.formatosTipoIniciativa = [this.iniciativa.formatosTipoIniciativa[0], this.iniciativa.formatosTipoIniciativa[1], this.documentos.id];
                        resolve(this.documentos.id);
                    } else {
                        this.spinner.hide();
                        Swal.fire('Error', 'Ocurrió un error al guardar. ' + JSON.stringify(resp.error.data), 'error');
                    }
                }, (err: any) => {
                    this.spinner.hide();
                    console.log(err);
                    Swal.fire('Error', 'Ocurrió un error al guardar.' + JSON.stringify(err.error.data), 'error');
                });
            } else {
                this.documentoService.guardarDocumentos(this.documentos).subscribe((resp: any) => {

                    if (resp) {

                        this.documentos = resp.data;

                        this.idDocumento = resp.data._id;
                        this.documentos.fechaCarga = this.datePipe.transform(this.documentos.fechaCarga, 'yyyy-MM-dd');
                        this.documentos.fechaCreacion = this.datePipe.transform(this.documentos.fechaCreacion, 'yyyy-MM-dd');

                        this.iniciativa.formatosTipoIniciativa = [this.iniciativa.formatosTipoIniciativa[0], this.iniciativa.formatosTipoIniciativa[1], this.documentos.id];
                        // Swal.fire('Éxito', 'Documento guardado correctamente.', 'success');

                        resolve(this.documentos.id);
                        // this.clasificarDocumento(this.documentos)
                    } else {
                        this.spinner.hide();
                        Swal.fire('Error', 'Ocurrió un error al guardar. ' + JSON.stringify(resp.error.data), 'error');
                    }
                }, (err: any) => {
                    this.spinner.hide();
                    console.log(err);
                    Swal.fire('Error', 'Ocurrió un error al guardar.' + JSON.stringify(err.error.data), 'error');
                });
            }
        });
    }

    async guardarSSP05(tema: string, tipoDocumento: string, tipoExpediente: string, tipoInformacion: string, legislatura: any): Promise<string> {
        return new Promise(async (resolve) => {
            const fecha = new Date(); // Fecha actual
            let mes: any = fecha.getMonth() + 1; // obteniendo mes
            let dia: any = fecha.getDate(); // obteniendo dia

            const ano = fecha.getFullYear(); // obteniendo año

            if (dia < 10) {
                dia = '0' + dia; // agrega cero si el menor de 10
            }
            if (mes < 10) {
                mes = '0' + mes; // agrega cero si el menor de 10
            }

            const fechaActual = ano + '-' + mes + '-' + dia;
            this.documentos.bActivo = true;
            this.documentos.cNombreDocumento = 'Formato SSP 05 de ' + tema;
            this.documentos.fechaCreacion = fechaActual + 'T16:00:00.000Z';
            this.documentos.fechaCarga = fechaActual + 'T16:00:00.000Z';
            this.documentos.version = 1;
            this.documentos.paginas = 1;
            this.documentos.usuario = this.menu.usuario;
            this.documentos.tipo_de_documento = tipoDocumento;
            this.documentos.tipo_de_expediente = tipoExpediente;
            this.documentos.visibilidade = tipoInformacion;

            if (this.documentos.legislatura != legislatura.id) {
                this.documentos.legislatura = legislatura.id;
                this.documentos.folioExpediente = legislatura.cLegislatura + '-' + Number(legislatura.documentos + 1);
            }

            if(this.iniciativa.tipo_de_iniciativa.descripcion == 'Iniciativa'){
                if (this.iniciativa.formatosTipoIniciativa.length > 3) {

                    this.documentos.id = this.iniciativa.formatosTipoIniciativa[3].id


                    if (this.idDocumento.length > 5) {

                        this.documentos.id = this.idDocumento;

                    }
                    this.documentoService.actualizarDocumentos(this.documentos).subscribe((resp: any) => {

                        if (resp) {
                            this.documentos = resp.data;

                            this.idDocumento = resp.data._id;

                            this.documentos.fechaCarga = this.datePipe.transform(this.documentos.fechaCarga, 'yyyy-MM-dd');
                            this.documentos.fechaCreacion = this.datePipe.transform(this.documentos.fechaCreacion, 'yyyy-MM-dd');

                            this.iniciativa.formatosTipoIniciativa = [this.iniciativa.formatosTipoIniciativa[0], this.iniciativa.formatosTipoIniciativa[1], this.iniciativa.formatosTipoIniciativa[2], this.documentos.id];
                            resolve(this.documentos.id);
                        } else {
                            this.spinner.hide();
                            Swal.fire('Error', 'Ocurrió un error al guardar. ' + JSON.stringify(resp.error.data), 'error');
                        }
                    }, (err: any) => {
                        this.spinner.hide();
                        console.log(err);
                        Swal.fire('Error', 'Ocurrió un error al guardar.' + JSON.stringify(err.error.data), 'error');
                    });
                } else {
                    this.documentoService.guardarDocumentos(this.documentos).subscribe((resp: any) => {

                        if (resp) {

                            this.documentos = resp.data;

                            this.idDocumento = resp.data._id;
                            this.documentos.fechaCarga = this.datePipe.transform(this.documentos.fechaCarga, 'yyyy-MM-dd');
                            this.documentos.fechaCreacion = this.datePipe.transform(this.documentos.fechaCreacion, 'yyyy-MM-dd');


                            this.iniciativa.formatosTipoIniciativa = [this.iniciativa.formatosTipoIniciativa[0], this.iniciativa.formatosTipoIniciativa[1], this.iniciativa.formatosTipoIniciativa[2], this.documentos.id];
                            // Swal.fire('Éxito', 'Documento guardado correctamente.', 'success');

                            resolve(this.documentos.id);
                            // this.clasificarDocumento(this.documentos)
                        } else {
                            this.spinner.hide();
                            Swal.fire('Error', 'Ocurrió un error al guardar. ' + JSON.stringify(resp.error.data), 'error');
                        }
                    }, (err: any) => {
                        this.spinner.hide();
                        console.log(err);
                        Swal.fire('Error', 'Ocurrió un error al guardar.' + JSON.stringify(err.error.data), 'error');
                    });
                }
            }else{
                if (this.iniciativa.formatosTipoIniciativa.length > 2) {

                    this.documentos.id = this.iniciativa.formatosTipoIniciativa[2].id


                    if (this.idDocumento.length > 5) {

                        this.documentos.id = this.idDocumento;

                    }
                    this.documentoService.actualizarDocumentos(this.documentos).subscribe((resp: any) => {

                        if (resp) {
                            this.documentos = resp.data;

                            this.idDocumento = resp.data._id;

                            this.documentos.fechaCarga = this.datePipe.transform(this.documentos.fechaCarga, 'yyyy-MM-dd');
                            this.documentos.fechaCreacion = this.datePipe.transform(this.documentos.fechaCreacion, 'yyyy-MM-dd');

                            this.iniciativa.formatosTipoIniciativa = [this.iniciativa.formatosTipoIniciativa[0], this.iniciativa.formatosTipoIniciativa[1], this.documentos.id];
                            resolve(this.documentos.id);
                        } else {
                            this.spinner.hide();
                            Swal.fire('Error', 'Ocurrió un error al guardar. ' + JSON.stringify(resp.error.data), 'error');
                        }
                    }, (err: any) => {
                        this.spinner.hide();
                        console.log(err);
                        Swal.fire('Error', 'Ocurrió un error al guardar.' + JSON.stringify(err.error.data), 'error');
                    });
                } else {
                    this.documentoService.guardarDocumentos(this.documentos).subscribe((resp: any) => {

                        if (resp) {

                            this.documentos = resp.data;

                            this.idDocumento = resp.data._id;
                            this.documentos.fechaCarga = this.datePipe.transform(this.documentos.fechaCarga, 'yyyy-MM-dd');
                            this.documentos.fechaCreacion = this.datePipe.transform(this.documentos.fechaCreacion, 'yyyy-MM-dd');


                            this.iniciativa.formatosTipoIniciativa = [this.iniciativa.formatosTipoIniciativa[0], this.iniciativa.formatosTipoIniciativa[1], this.documentos.id];
                            // Swal.fire('Éxito', 'Documento guardado correctamente.', 'success');

                            resolve(this.documentos.id);
                            // this.clasificarDocumento(this.documentos)
                        } else {
                            this.spinner.hide();
                            Swal.fire('Error', 'Ocurrió un error al guardar. ' + JSON.stringify(resp.error.data), 'error');
                        }
                    }, (err: any) => {
                        this.spinner.hide();
                        console.log(err);
                        Swal.fire('Error', 'Ocurrió un error al guardar.' + JSON.stringify(err.error.data), 'error');
                    });
                }
            }
        });
    }

    async guardarSSP08(tema: string, tipoDocumento: string, tipoExpediente: string, tipoInformacion: string, legislatura: any): Promise<string> {
        return new Promise(async (resolve) => {
            const fecha = new Date(); // Fecha actual
            let mes: any = fecha.getMonth() + 1; // obteniendo mes
            let dia: any = fecha.getDate(); // obteniendo dia

            const ano = fecha.getFullYear(); // obteniendo año

            if (dia < 10) {
                dia = '0' + dia; // agrega cero si el menor de 10
            }
            if (mes < 10) {
                mes = '0' + mes; // agrega cero si el menor de 10
            }

            const fechaActual = ano + '-' + mes + '-' + dia;
            this.documentos.bActivo = true;
            this.documentos.cNombreDocumento = 'Formato SSP 08 de ' + tema;
            this.documentos.fechaCreacion = fechaActual + 'T16:00:00.000Z';
            this.documentos.fechaCarga = fechaActual + 'T16:00:00.000Z';
            this.documentos.version = 1;
            this.documentos.paginas = 1;
            this.documentos.usuario = this.menu.usuario;
            this.documentos.tipo_de_documento = tipoDocumento;
            this.documentos.tipo_de_expediente = tipoExpediente;
            this.documentos.visibilidade = tipoInformacion;

            if (this.documentos.legislatura != legislatura.id) {
                this.documentos.legislatura = legislatura.id;
                this.documentos.folioExpediente = legislatura.cLegislatura + '-' + Number(legislatura.documentos + 1);
            }

            if(this.iniciativa.tipo_de_iniciativa.descripcion == 'Iniciativa'){
                if (this.iniciativa.formatosTipoIniciativa.length > 4) {

                    this.documentos.id = this.iniciativa.formatosTipoIniciativa[4].id


                    if (this.idDocumento.length > 5) {

                        this.documentos.id = this.idDocumento;

                    }
                    this.documentoService.actualizarDocumentos(this.documentos).subscribe((resp: any) => {

                        if (resp) {
                            this.documentos = resp.data;

                            this.idDocumento = resp.data._id;

                            this.documentos.fechaCarga = this.datePipe.transform(this.documentos.fechaCarga, 'yyyy-MM-dd');
                            this.documentos.fechaCreacion = this.datePipe.transform(this.documentos.fechaCreacion, 'yyyy-MM-dd');

                            this.iniciativa.formatosTipoIniciativa = [this.iniciativa.formatosTipoIniciativa[0], 
                            this.iniciativa.formatosTipoIniciativa[1], this.iniciativa.formatosTipoIniciativa[2], 
                            this.iniciativa.formatosTipoIniciativa[3], this.documentos.id];
                            resolve(this.documentos.id);
                        } else {
                            this.spinner.hide();
                            Swal.fire('Error', 'Ocurrió un error al guardar. ' + JSON.stringify(resp.error.data), 'error');
                        }
                    }, (err: any) => {
                        this.spinner.hide();
                        console.log(err);
                        Swal.fire('Error', 'Ocurrió un error al guardar.' + JSON.stringify(err.error.data), 'error');
                    });
                } else {
                    this.documentoService.guardarDocumentos(this.documentos).subscribe((resp: any) => {

                        if (resp) {

                            this.documentos = resp.data;

                            this.idDocumento = resp.data._id;
                            this.documentos.fechaCarga = this.datePipe.transform(this.documentos.fechaCarga, 'yyyy-MM-dd');
                            this.documentos.fechaCreacion = this.datePipe.transform(this.documentos.fechaCreacion, 'yyyy-MM-dd');


                            this.iniciativa.formatosTipoIniciativa = [this.iniciativa.formatosTipoIniciativa[0], 
                            this.iniciativa.formatosTipoIniciativa[1], this.iniciativa.formatosTipoIniciativa[2], 
                            this.iniciativa.formatosTipoIniciativa[3], this.documentos.id];
                            // Swal.fire('Éxito', 'Documento guardado correctamente.', 'success');

                            resolve(this.documentos.id);
                            // this.clasificarDocumento(this.documentos)
                        } else {
                            this.spinner.hide();
                            Swal.fire('Error', 'Ocurrió un error al guardar. ' + JSON.stringify(resp.error.data), 'error');
                        }
                    }, (err: any) => {
                        this.spinner.hide();
                        console.log(err);
                        Swal.fire('Error', 'Ocurrió un error al guardar.' + JSON.stringify(err.error.data), 'error');
                    });
                }
            }else{
                if (this.iniciativa.formatosTipoIniciativa.length > 3) {

                    this.documentos.id = this.iniciativa.formatosTipoIniciativa[3].id


                    if (this.idDocumento.length > 5) {

                        this.documentos.id = this.idDocumento;

                    }
                    this.documentoService.actualizarDocumentos(this.documentos).subscribe((resp: any) => {

                        if (resp) {
                            this.documentos = resp.data;

                            this.idDocumento = resp.data._id;

                            this.documentos.fechaCarga = this.datePipe.transform(this.documentos.fechaCarga, 'yyyy-MM-dd');
                            this.documentos.fechaCreacion = this.datePipe.transform(this.documentos.fechaCreacion, 'yyyy-MM-dd');

                            this.iniciativa.formatosTipoIniciativa = [this.iniciativa.formatosTipoIniciativa[0], this.iniciativa.formatosTipoIniciativa[1], 
                            this.iniciativa.formatosTipoIniciativa[2], this.documentos.id];
                            resolve(this.documentos.id);
                        } else {
                            this.spinner.hide();
                            Swal.fire('Error', 'Ocurrió un error al guardar. ' + JSON.stringify(resp.error.data), 'error');
                        }
                    }, (err: any) => {
                        this.spinner.hide();
                        console.log(err);
                        Swal.fire('Error', 'Ocurrió un error al guardar.' + JSON.stringify(err.error.data), 'error');
                    });
                } else {
                    this.documentoService.guardarDocumentos(this.documentos).subscribe((resp: any) => {

                        if (resp) {

                            this.documentos = resp.data;

                            this.idDocumento = resp.data._id;
                            this.documentos.fechaCarga = this.datePipe.transform(this.documentos.fechaCarga, 'yyyy-MM-dd');
                            this.documentos.fechaCreacion = this.datePipe.transform(this.documentos.fechaCreacion, 'yyyy-MM-dd');


                            this.iniciativa.formatosTipoIniciativa = [this.iniciativa.formatosTipoIniciativa[0], this.iniciativa.formatosTipoIniciativa[1], 
                            this.iniciativa.formatosTipoIniciativa[2], this.documentos.id];
                            // Swal.fire('Éxito', 'Documento guardado correctamente.', 'success');

                            resolve(this.documentos.id);
                            // this.clasificarDocumento(this.documentos)
                        } else {
                            this.spinner.hide();
                            Swal.fire('Error', 'Ocurrió un error al guardar. ' + JSON.stringify(resp.error.data), 'error');
                        }
                    }, (err: any) => {
                        this.spinner.hide();
                        console.log(err);
                        Swal.fire('Error', 'Ocurrió un error al guardar.' + JSON.stringify(err.error.data), 'error');
                    });
                }
            }
        });
    }

    clasificarDocumento(): void {
        if (this.iniciativa.estatus == 'Turnar cuenta pública a EASE' || this.iniciativa.estatus == 'Turnar iniciativa a comisión' ||
        this.iniciativa.estatus == 'Turnada a comisión para modificación') {
            this.spinner.show();
            const fecha = new Date(); // Fecha actual
            let mes: any = fecha.getMonth() + 1; // obteniendo mes
            let dia: any = fecha.getDate(); // obteniendo dia

            const ano = fecha.getFullYear(); // obteniendo año

            if (dia < 10) {
                dia = '0' + dia; // agrega cero si el menor de 10
            }
            if (mes < 10) {
                mes = '0' + mes; // agrega cero si el menor de 10
            }
            const fechaActual = ano + '-' + mes + '-' + dia;
            this.documentos.bActivo = true;

            this.documentos.fechaCreacion = fechaActual + 'T16:00:00.000Z';
            this.documentos.fechaCarga = fechaActual + 'T16:00:00.000Z';
            let cAutores = '';
            this.autores.forEach(element => {
                if (cAutores === '') {
                    cAutores = element.name;
                } else {
                    cAutores = cAutores + ', ' + element.name;
                }

            });

            this.documentos = this.iniciativa.formatosTipoIniciativa[1];
            console.log(this.documentos);
            this.documentos.metacatalogos = [

                {
                    "cDescripcionMetacatalogo": "Fecha",
                    "bOligatorio": true,
                    "cTipoMetacatalogo": "Fecha",
                    "text": this.documentos.fechaCarga
                },
                {
                    "cDescripcionMetacatalogo": "Documento",
                    "bOligatorio": true,
                    "cTipoMetacatalogo": "Texto",
                    "text": cAutores
                }
            ]
            this.documentoService.actualizarDocumentosSinVersion(this.documentos).subscribe((resp: any) => {
                if (resp) {

                    this.documentos = resp.data;
                    this.documentos.iniciativas = true;
                    this.documentos.iniciativa = this.iniciativa;
                    if (this.iniciativa.tipo_de_iniciativa.descripcion == 'Iniciativa') {
                        this.documentos.estatus = 'Turnar iniciativa a CIEL';
                    } else {
                        this.documentos.estatus = 'Turnar dictamen a secretaría de servicios parlamentarios';
                    }

                    this.documentosTemp.fechaCreacion = moment(this.documentos.fechaCreacion).format('YYYY/MM/DD') + 'T16:00:00.000Z';
                    this.documentosTemp.fechaCarga = moment(this.documentos.fechaCarga).format('YYYY/MM/DD') + 'T16:00:00.000Z';

                    this.spinner.hide();

                    const dialogRef = this.dialog.open(ClasficacionDeDocumentosComponent, {
                        width: '100%',
                        height: '90%',
                        disableClose: true,
                        data: this.documentos,
                    });

                    // tslint:disable-next-line: no-shadowed-variable
                    dialogRef.afterClosed().subscribe(result => {
                        console.log(result);
                        if (result == '0') {
                            this.cerrar('');
                            // this.obtenerDocumentos();
                        }
                    });
                } else {
                    this.spinner.hide();
                    Swal.fire('Error', 'Ocurrió un error al guardar. ' + resp.error.data, 'error');
                }
            }, err => {
                this.spinner.hide();
                console.log(err);
                Swal.fire('Error', 'Ocurrió un error al guardar.' + err.error.data, 'error');
            });
        } if (this.iniciativa.estatus == 'Turnar dictamen a Secretaría General') {
            this.spinner.show();
            const fecha = new Date(); // Fecha actual
            let mes: any = fecha.getMonth() + 1; // obteniendo mes
            let dia: any = fecha.getDate(); // obteniendo dia

            const ano = fecha.getFullYear(); // obteniendo año

            if (dia < 10) {
                dia = '0' + dia; // agrega cero si el menor de 10
            }
            if (mes < 10) {
                mes = '0' + mes; // agrega cero si el menor de 10
            }
            const fechaActual = ano + '-' + mes + '-' + dia;
            this.documentos.bActivo = true;

            this.documentos.fechaCreacion = fechaActual + 'T16:00:00.000Z';
            this.documentos.fechaCarga = fechaActual + 'T16:00:00.000Z';
            let cAutores = '';
            this.autores.forEach(element => {
                if (cAutores === '') {
                    cAutores = element.name;
                } else {
                    cAutores = cAutores + ', ' + element.name;
                }

            });

            this.documentos = this.iniciativa.formatosTipoIniciativa[2];
            console.log('turnada a secretaria general');
            console.log(this.documentos);
            this.documentos.metacatalogos = [

                {
                    "cDescripcionMetacatalogo": "Fecha",
                    "bOligatorio": true,
                    "cTipoMetacatalogo": "Fecha",
                    "text": this.documentos.fechaCarga
                },
                {
                    "cDescripcionMetacatalogo": "Documento",
                    "bOligatorio": true,
                    "cTipoMetacatalogo": "Texto",
                    "text": cAutores
                }
            ]
            this.documentoService.actualizarDocumentosSinVersion(this.documentos).subscribe((resp: any) => {
                if (resp) {

                    this.documentos = resp.data;
                    this.documentos.iniciativas = true;
                    this.documentos.iniciativa = this.iniciativa;
                    if (this.iniciativa.estatus == 'Turnar dictamen a Secretaría General') {
                        this.documentos.estatus = 'Turnar dictamen a secretaría de servicios parlamentarios';
                    }

                    this.documentosTemp.fechaCreacion = moment(this.documentos.fechaCreacion).format('YYYY/MM/DD') + 'T16:00:00.000Z';
                    this.documentosTemp.fechaCarga = moment(this.documentos.fechaCarga).format('YYYY/MM/DD') + 'T16:00:00.000Z';

                    this.spinner.hide();

                    const dialogRef = this.dialog.open(ClasficacionDeDocumentosComponent, {
                        width: '100%',
                        height: '90%',
                        disableClose: true,
                        data: this.documentos,

                    });

                    // tslint:disable-next-line: no-shadowed-variable
                    dialogRef.afterClosed().subscribe(result => {
                        console.log(result);
                        if (result == '0') {
                            this.cerrar('');
                            // this.obtenerDocumentos();
                        }
                    });
                } else {
                    this.spinner.hide();
                    Swal.fire('Error', 'Ocurrió un error al guardar. ' + resp.error.data, 'error');
                }
            }, err => {
                this.spinner.hide();
                console.log(err);
                Swal.fire('Error', 'Ocurrió un error al guardar.' + err.error.data, 'error');
            });
        } if (this.iniciativa.estatus == 'Turnar dictamen a secretaría de servicios parlamentarios' && this.iniciativa.tipo_de_iniciativa.descripcion == 'Iniciativa') {
            this.spinner.show();
            const fecha = new Date(); // Fecha actual
            let mes: any = fecha.getMonth() + 1; // obteniendo mes
            let dia: any = fecha.getDate(); // obteniendo dia

            const ano = fecha.getFullYear(); // obteniendo año

            if (dia < 10) {
                dia = '0' + dia; // agrega cero si el menor de 10
            }
            if (mes < 10) {
                mes = '0' + mes; // agrega cero si el menor de 10
            }
            const fechaActual = ano + '-' + mes + '-' + dia;
            this.documentos.bActivo = true;

            this.documentos.fechaCreacion = fechaActual + 'T16:00:00.000Z';
            this.documentos.fechaCarga = fechaActual + 'T16:00:00.000Z';
            let cAutores = '';
            this.autores.forEach(element => {
                if (cAutores === '') {
                    cAutores = element.name;
                } else {
                    cAutores = cAutores + ', ' + element.name;
                }

            });

            this.documentos = this.iniciativa.formatosTipoIniciativa[3];
            console.log('Turnar dictamen a secretaría de servicios parlamentarios');
            console.log(this.documentos);
            this.documentos.metacatalogos = [

                {
                    "cDescripcionMetacatalogo": "Fecha",
                    "bOligatorio": true,
                    "cTipoMetacatalogo": "Fecha",
                    "text": this.documentos.fechaCarga
                },
                {
                    "cDescripcionMetacatalogo": "Documento",
                    "bOligatorio": true,
                    "cTipoMetacatalogo": "Texto",
                    "text": cAutores
                }
            ]
            this.documentoService.actualizarDocumentosSinVersion(this.documentos).subscribe((resp: any) => {
                if (resp) {

                    this.documentos = resp.data;
                    this.documentos.iniciativas = true;
                    this.documentos.iniciativa = this.iniciativa;
                    if (this.iniciativa.estatus == 'Turnar dictamen a secretaría de servicios parlamentarios') {
                        this.documentos.estatus = 'Turnar dictamen a Mesa Directiva';
                    }
                    this.documentosTemp.fechaCreacion = moment(this.documentos.fechaCreacion).format('YYYY/MM/DD') + 'T16:00:00.000Z';
                    this.documentosTemp.fechaCarga = moment(this.documentos.fechaCarga).format('YYYY/MM/DD') + 'T16:00:00.000Z';

                    this.spinner.hide();

                    const dialogRef = this.dialog.open(ClasficacionDeDocumentosComponent, {
                        width: '100%',
                        height: '90%',
                        disableClose: true,
                        data: this.documentos,

                    });

                    // tslint:disable-next-line: no-shadowed-variable
                    dialogRef.afterClosed().subscribe(result => {
                        console.log(result);

                        if (result == '0') {
                            this.cerrar('');
                            // this.obtenerDocumentos();
                        }
                    });
                } else {
                    this.spinner.hide();
                    Swal.fire('Error', 'Ocurrió un error al guardar. ' + resp.error.data, 'error');
                }
            }, err => {
                this.spinner.hide();
                console.log(err);
                Swal.fire('Error', 'Ocurrió un error al guardar.' + err.error.data, 'error');
            });
        } if (this.iniciativa.estatus == 'Turnar dictamen a secretaría de servicios parlamentarios' && this.iniciativa.tipo_de_iniciativa.descripcion == 'Cuenta Pública'){
            this.spinner.show();
            console.log('cuenta publica');
            const fecha = new Date(); // Fecha actual
            let mes: any = fecha.getMonth() + 1; // obteniendo mes
            let dia: any = fecha.getDate(); // obteniendo dia

            const ano = fecha.getFullYear(); // obteniendo año

            if (dia < 10) {
                dia = '0' + dia; // agrega cero si el menor de 10
            }
            if (mes < 10) {
                mes = '0' + mes; // agrega cero si el menor de 10
            }
            const fechaActual = ano + '-' + mes + '-' + dia;
            this.documentos.bActivo = true;

            this.documentos.fechaCreacion = fechaActual + 'T16:00:00.000Z';
            this.documentos.fechaCarga = fechaActual + 'T16:00:00.000Z';
            let cAutores = '';
            this.autores.forEach(element => {
                if (cAutores === '') {
                    cAutores = element.name;
                } else {
                    cAutores = cAutores + ', ' + element.name;
                }

            });

            this.documentos = this.iniciativa.formatosTipoIniciativa[2];
            console.log('Turnar dictamen a secretaría de servicios parlamentarios');
            console.log(this.documentos);
            this.documentos.metacatalogos = [

                {
                    "cDescripcionMetacatalogo": "Fecha",
                    "bOligatorio": true,
                    "cTipoMetacatalogo": "Fecha",
                    "text": this.documentos.fechaCarga
                },
                {
                    "cDescripcionMetacatalogo": "Documento",
                    "bOligatorio": true,
                    "cTipoMetacatalogo": "Texto",
                    "text": cAutores
                }
            ]
            this.documentoService.actualizarDocumentosSinVersion(this.documentos).subscribe((resp: any) => {
                if (resp) {

                    this.documentos = resp.data;
                    this.documentos.iniciativas = true;
                    this.documentos.iniciativa = this.iniciativa;
                    if (this.iniciativa.estatus == 'Turnar dictamen a secretaría de servicios parlamentarios') {
                        this.documentos.estatus = 'Turnar dictamen a Mesa Directiva';
                    }

                    this.documentosTemp.fechaCreacion = moment(this.documentos.fechaCreacion).format('YYYY/MM/DD') + 'T16:00:00.000Z';
                    this.documentosTemp.fechaCarga = moment(this.documentos.fechaCarga).format('YYYY/MM/DD') + 'T16:00:00.000Z';

                    this.spinner.hide();

                    const dialogRef = this.dialog.open(ClasficacionDeDocumentosComponent, {
                        width: '100%',
                        height: '90%',
                        disableClose: true,
                        data: this.documentos,

                    });

                    // tslint:disable-next-line: no-shadowed-variable
                    dialogRef.afterClosed().subscribe(result => {
                        console.log(result);

                        if (result == '0') {
                            this.cerrar('');
                            // this.obtenerDocumentos();
                        }
                    });
                } else {
                    this.spinner.hide();
                    Swal.fire('Error', 'Ocurrió un error al guardar. ' + resp.error.data, 'error');
                }
            }, err => {
                this.spinner.hide();
                console.log(err);
                Swal.fire('Error', 'Ocurrió un error al guardar.' + err.error.data, 'error');
            });
        } if (this.iniciativa.estatus == 'Turnar dictamen a Mesa Directiva' && this.iniciativa.tipo_de_iniciativa.descripcion == 'Iniciativa') {
            this.spinner.show();
            const fecha = new Date(); // Fecha actual
            let mes: any = fecha.getMonth() + 1; // obteniendo mes
            let dia: any = fecha.getDate(); // obteniendo dia

            const ano = fecha.getFullYear(); // obteniendo año

            if (dia < 10) {
                dia = '0' + dia; // agrega cero si el menor de 10
            }
            if (mes < 10) {
                mes = '0' + mes; // agrega cero si el menor de 10
            }
            const fechaActual = ano + '-' + mes + '-' + dia;
            this.documentos.bActivo = true;

            this.documentos.fechaCreacion = fechaActual + 'T16:00:00.000Z';
            this.documentos.fechaCarga = fechaActual + 'T16:00:00.000Z';
            let cAutores = '';
            this.autores.forEach(element => {
                if (cAutores === '') {
                    cAutores = element.name;
                } else {
                    cAutores = cAutores + ', ' + element.name;
                }

            });

            this.documentos = this.iniciativa.formatosTipoIniciativa[4];
            console.log('Turnar dictamen a secretaría de servicios parlamentarios');
            console.log(this.documentos);
            this.documentos.metacatalogos = [

                {
                    "cDescripcionMetacatalogo": "Fecha",
                    "bOligatorio": true,
                    "cTipoMetacatalogo": "Fecha",
                    "text": this.documentos.fechaCarga
                },
                {
                    "cDescripcionMetacatalogo": "Documento",
                    "bOligatorio": true,
                    "cTipoMetacatalogo": "Texto",
                    "text": cAutores
                }
            ]
            this.documentoService.actualizarDocumentosSinVersion(this.documentos).subscribe((resp: any) => {
                if (resp) {

                    this.documentos = resp.data;
                    this.documentos.iniciativas = true;
                    this.documentos.iniciativa = this.iniciativa;
                    if (this.iniciativa.estatus == 'Turnar dictamen a Mesa Directiva') {
                        this.documentos.estatus = 'Turnada a publicación';
                    }

                    this.documentosTemp.fechaCreacion = moment(this.documentos.fechaCreacion).format('YYYY/MM/DD') + 'T16:00:00.000Z';
                    this.documentosTemp.fechaCarga = moment(this.documentos.fechaCarga).format('YYYY/MM/DD') + 'T16:00:00.000Z';

                    this.spinner.hide();

                    const dialogRef = this.dialog.open(ClasficacionDeDocumentosComponent, {
                        width: '100%',
                        height: '90%',
                        disableClose: true,
                        data: this.documentos,

                    });

                    // tslint:disable-next-line: no-shadowed-variable
                    dialogRef.afterClosed().subscribe(result => {
                        console.log(result);

                        if (result == '0') {
                            this.cerrar('');
                            // this.obtenerDocumentos();
                        }
                    });
                } else {
                    this.spinner.hide();
                    Swal.fire('Error', 'Ocurrió un error al guardar. ' + resp.error.data, 'error');
                }
            }, err => {
                this.spinner.hide();
                console.log(err);
                Swal.fire('Error', 'Ocurrió un error al guardar.' + err.error.data, 'error');
            });
        } if (this.iniciativa.estatus == 'Turnar dictamen a Mesa Directiva' && this.iniciativa.tipo_de_iniciativa.descripcion == 'Cuenta Pública'){
            this.spinner.show();
            console.log('cuenta publica');
            const fecha = new Date(); // Fecha actual
            let mes: any = fecha.getMonth() + 1; // obteniendo mes
            let dia: any = fecha.getDate(); // obteniendo dia

            const ano = fecha.getFullYear(); // obteniendo año

            if (dia < 10) {
                dia = '0' + dia; // agrega cero si el menor de 10
            }
            if (mes < 10) {
                mes = '0' + mes; // agrega cero si el menor de 10
            }
            const fechaActual = ano + '-' + mes + '-' + dia;
            this.documentos.bActivo = true;

            this.documentos.fechaCreacion = fechaActual + 'T16:00:00.000Z';
            this.documentos.fechaCarga = fechaActual + 'T16:00:00.000Z';
            let cAutores = '';
            this.autores.forEach(element => {
                if (cAutores === '') {
                    cAutores = element.name;
                } else {
                    cAutores = cAutores + ', ' + element.name;
                }

            });

            this.documentos = this.iniciativa.formatosTipoIniciativa[3];
            console.log('Turnar dictamen a secretaría de servicios parlamentarios');
            console.log(this.documentos);
            this.documentos.metacatalogos = [

                {
                    "cDescripcionMetacatalogo": "Fecha",
                    "bOligatorio": true,
                    "cTipoMetacatalogo": "Fecha",
                    "text": this.documentos.fechaCarga
                },
                {
                    "cDescripcionMetacatalogo": "Documento",
                    "bOligatorio": true,
                    "cTipoMetacatalogo": "Texto",
                    "text": cAutores
                }
            ]
            this.documentoService.actualizarDocumentosSinVersion(this.documentos).subscribe((resp: any) => {
                if (resp) {

                    this.documentos = resp.data;
                    this.documentos.iniciativas = true;
                    this.documentos.iniciativa = this.iniciativa;
                    if (this.iniciativa.estatus == 'Turnar dictamen a Mesa Directiva') {
                        this.documentos.estatus = 'Turnada a publicación';
                    }

                    this.documentosTemp.fechaCreacion = moment(this.documentos.fechaCreacion).format('YYYY/MM/DD') + 'T16:00:00.000Z';
                    this.documentosTemp.fechaCarga = moment(this.documentos.fechaCarga).format('YYYY/MM/DD') + 'T16:00:00.000Z';

                    this.spinner.hide();

                    const dialogRef = this.dialog.open(ClasficacionDeDocumentosComponent, {
                        width: '100%',
                        height: '90%',
                        disableClose: true,
                        data: this.documentos,

                    });

                    // tslint:disable-next-line: no-shadowed-variable
                    dialogRef.afterClosed().subscribe(result => {
                        console.log(result);

                        if (result == '0') {
                            this.cerrar('');
                            // this.obtenerDocumentos();
                        }
                    });
                } else {
                    this.spinner.hide();
                    Swal.fire('Error', 'Ocurrió un error al guardar. ' + resp.error.data, 'error');
                }
            }, err => {
                this.spinner.hide();
                console.log(err);
                Swal.fire('Error', 'Ocurrió un error al guardar.' + err.error.data, 'error');
            });
        }
    }

    open() {
        const amazingTimePicker = this.atp.open();
        amazingTimePicker.afterClose().subscribe(time => {

        })
    }


    changeOficio(): void {
        this.cambioOficio = true;
    }


    changeInforme(): void {
        this.cambioInforme = true;
    }

    async cargaClasificacionDocumento(tipo: string): Promise<void> {

        this.spinner.show();
        //Creamos nuevo modelo de documentos y asignamos parametros
        this.documentos = new DocumentosModel();
        let legislaturaFolio: any;
        this.documentos.bActivo = true;
        let parametrosSSP001 = await this.obtenerParametros("SSP-001");
        let tipoDocumento = parametrosSSP001.filter(
            (d) =>
                d["cParametroAdministrado"] === "SSP-001-Tipo-de-Documento"
        );
        let tipoExpediente = parametrosSSP001.filter(
            (d) =>
                d["cParametroAdministrado"] === "SSP-001-Tipo-de-Expediente"
        );
        let tipoInformacion = parametrosSSP001.filter(
            (d) =>
                d["cParametroAdministrado"] ===
                "SSP-001-Tipo-de-Informacion"
        );
        // this.documentos.tipo_de_documento = tipoDocumento[0]["cValor"];
        this.documentos.tipo_de_documento = '5f839b713ccdf563ac6ba096';
        this.documentos.tipo_de_expediente = tipoExpediente[0]["cValor"];

        this.documentos.visibilidade = tipoInformacion[0]["cValor"];
        this.documentos.iniciativa = this.iniciativa.id;
        if(this.iniciativa.estatus == 'Turnar cuenta pública a EASE'){
            this.documentos.formulario = 'Turnar cuenta pública a EASE';
        } else if (this.iniciativa.estatus == 'Turnar dictamen a Secretaría General') {
            this.documentos.formulario = 'Turnar dictamen a Secretaría General';
        } else if (this.iniciativa.estatus == 'Turnar dictamen a Mesa Directiva') {
            this.documentos.formulario = 'Turnar dictamen a Mesa Directiva';
        } else if (this.iniciativa.estatus == 'Turnada a comisión para modificación'){
            this.documentos.formulario = 'Turnada a comisión para modificación';
        }

        legislaturaFolio = this.legislatura.filter(d => d.id === this.selectedLegislatura);
        console.log(this.documentos);
        this.documentos.legislatura = legislaturaFolio[0].id;
        this.documentos.folioExpediente = legislaturaFolio[0].cLegislatura + '-' + Number(legislaturaFolio[0].documentos + 1);

        this.spinner.hide();

        const dialogRef = this.dialog.open(GuardarDocumentosComponent, {
            width: '60%',
            height: '80%',
            disableClose: true,
            data: this.documentos,
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                if (result.documento) {
                    this.clasificarDocAnex(result, tipo);
                }
            }
        });
    }

    async clasificarDocAnex(result: any, tipo: string): Promise<void> {
        this.spinner.show();
        console.log('cla');
        const fecha = new Date(); // Fecha actual
        let mes: any = fecha.getMonth() + 1; // obteniendo mes
        let dia: any = fecha.getDate(); // obteniendo dia

        const anio = fecha.getFullYear(); // obteniendo año

        if (dia < 10) {
            dia = "0" + dia; // agrega cero si el menor de 10
        }
        if (mes < 10) {
            mes = "0" + mes; // agrega cero si el menor de 10
        }
        const fechaActual = dia + "/" + mes + "/" + anio;
        this.documentos.bActivo = true;

        if(this.iniciativa.estatus==='Turnar dictamen a Secretaría General'){
            this.documentos.fechaCreacion =  this.documentos.fechaCreacion + 'T16:00:00.000Z';
            this.documentos.fechaCarga =  this.documentos.fechaCreacion + 'T16:00:00.000Z';
        }

        this.documentos = result;
        let cAutores = "";
        this.autores.forEach((element) => {
            if (cAutores === "") {
                cAutores = element.name;
            } else {
                cAutores = cAutores + ", " + element.name;
            }
        });
        this.documentos.metacatalogos = [
            {
                cDescripcionMetacatalogo: "Fecha",
                bOligatorio: true,
                cTipoMetacatalogo: "Fecha",
                text: this.documentos.fechaCarga,
            },
            {
                cDescripcionMetacatalogo: "Documento",
                bOligatorio: true,
                cTipoMetacatalogo: "Texto",
                text: cAutores,
            },
        ];

        if (tipo === '2') {
            this.documentos.iniciativaOficioEnvioDeInforme = this.iniciativa.id;
        } else if (tipo === '3') {
            this.documentos.iniciativaInformeDeResultadosRevision = this.iniciativa.id;
        } else if (tipo === '1') {

        }

        this.documentoService
            .actualizarDocumentosSinVersion(this.documentos)
            .subscribe(
                (resp: any) => {
                    if (resp.data) {
                        console.log(resp.data);
                        this.documentos = resp.data;

                        let documentoId: string = this.documentos.id;

                        this.documentos.iniciativas = true;
                        this.documentos.iniciativa = this.iniciativa;

                        if (
                            this.iniciativa.tipo_de_iniciativa.descripcion ==
                            "Iniciativa"
                        ) {
                            this.documentos.estatus =
                                "Turnar iniciativa a comisión";
                        } else {
                            this.documentos.estatus =
                                "Turnar cuenta pública a EASE";
                        }

                        this.documentosTemp.fechaCreacion = moment(this.documentos.fechaCreacion).format('YYYY/MM/DD') + 'T16:00:00.000Z';
                        this.documentosTemp.fechaCarga = moment(this.documentos.fechaCarga).format('YYYY/MM/DD') + 'T16:00:00.000Z';

                        //this.documentosTemp.fechaCreacion = fechaActual;
                        //this.documentosTemp.fechaCarga = fechaActual;

                        this.spinner.hide();

                        const dialogRef = this.dialog.open(
                            ClasficacionDeDocumentosComponent,
                            {
                                width: "100%",
                                height: "90%",
                                disableClose: true,
                                data: this.documentos,
                            }
                        );

                        // tslint:disable-next-line: no-shadowed-variable
                        dialogRef.afterClosed().subscribe((result) => {

                            if (tipo === '2') {
                                this.iniciativa.oficioEnvioDeInforme = this.documentos;
                                this.fileOficioName = this.iniciativa.oficioEnvioDeInforme.cNombreDocumento;
                            } else if (tipo === '3') {
                                this.iniciativa.informeDeResultadosRevision = this.documentos;
                                this.fileInformeName = this.iniciativa.informeDeResultadosRevision.cNombreDocumento;
                            }
                            if(this.iniciativa.estatus == 'Turnar dictamen a Secretaría General' || 
                            this.iniciativa.estatus == 'Turnar dictamen a Mesa Directiva' ||
                            this.iniciativa.estatus == 'Turnada a comisión para modificación'){

                            /*asignamos valores a iniciativa.documentos debido a que al
                            iniciar el componente inicia como [] y al guardar asi se desasignan
                            los documentos*/

                                //this.iniciativa.documentos.push(this.documentos);
                                this.iniciativa.documentos = [this.documentos.id];
                                console.log(this.iniciativa.documentos);
                                this.obtenerDocumento();
                            }
                            if (result == "0") {
                                this.cerrar("");
                            }
                        });
                    } else {
                        this.spinner.hide();
                        Swal.fire(
                            "Error",
                            "Ocurrió un error al guardar. " + resp.error.data,
                            "error"
                        );
                    }
                },
                (err) => {
                    this.spinner.hide();
                    console.log(err);
                    Swal.fire(
                        "Error",
                        "Ocurrió un error al guardar." + err.error.data,
                        "error"
                    );
                }
            );
    }


    obtenerDocumento() {
        this.spinner.show();
        const documentosTemp: any[] = [];
        let idDocumento: any;
        this.loadingIndicator = true;
        let meta = '';
        let visibilidad = '';
        let info: any;
        // Obtenemos los documentos
        this.documentoService.obtenerDocumentos().subscribe((resp: any) => {

            // Buscamos permisos


            for (const documento of resp.data) {
                //                console.log(documento.tipo_de_documento.bActivo);
                idDocumento = '';
                // Validamos permisos

                if (documento.tipo_de_documento) {
                    const encontro = this.menu.tipoDocumentos.find((tipo: { id: string; }) => tipo.id === documento.tipo_de_documento.id);

                    if (documento.visibilidade) {
                        info = this.menu.tipoInformacion.find((tipo: { id: string; }) => tipo.id === documento.visibilidade.id);
                    }
                    if (encontro) {
                        if (documento.tipo_de_documento.bActivo && encontro.Consultar && info) {

                            if (documento.documento) {

                                idDocumento = documento.documento.hash + documento.documento.ext;


                                if (documento.metacatalogos) {
                                    meta = '';
                                    if (documento.metacatalogos) {
                                        for (const x of documento.metacatalogos) {

                                            if (meta === '') {

                                                if (x.cTipoMetacatalogo === 'Fecha') {
                                                    if (x.text) {
                                                        meta = meta + x.cDescripcionMetacatalogo + ': ' + this.datePipe.transform(x.text, 'yyyy-MM-dd');
                                                    }
                                                } else {
                                                    if (x.text) {
                                                        meta = meta + x.cDescripcionMetacatalogo + ': ' + x.text;
                                                    }
                                                }
                                            } else {
                                                if (x.cTipoMetacatalogo === 'Fecha') {
                                                    if (x.text) {
                                                        meta = meta + ' , ' + x.cDescripcionMetacatalogo + ': ' + this.datePipe.transform(x.text, 'yyyy-MM-dd');
                                                    }
                                                } else {
                                                    if (x.text) {
                                                        meta = meta + ' , ' + x.cDescripcionMetacatalogo + ': ' + x.text;
                                                    }
                                                }

                                            }
                                        }
                                    }
                                }
                                visibilidad = '';
                                if (documento.visibilidade) {
                                    visibilidad = documento.visibilidade.cDescripcionVisibilidad;
                                }

                                if (documento.iniciativa === undefined || documento.iniciativa === null) {
                                    documento.iniciativa = '';
                                } else {
                                    if (documento.iniciativa.id == this.iniciativa.id) {
                                        // tslint:disable-next-line: no-unused-expression
                                        // Seteamos valores y permisos
                                        if (documento.formulario == this.iniciativa.estatus) {
                                            documentosTemp.push({
                                                id: documento.id,
                                                cNombreDocumento: documento.cNombreDocumento,
                                                tipoDocumento: documento.tipo_de_documento.cDescripcionTipoDocumento,
                                                tipo_de_documento: documento.tipo_de_documento.id,
                                                fechaCarga: moment(documento.fechaCarga).format('YYYY-MM-DD'),
                                                fechaCreacion: moment(documento.fechaCreacion).format('YYYY-MM-DD'),
                                                paginas: documento.paginas,
                                                bActivo: documento.bActivo,
                                                fechaModificacion: this.datePipe.transform(documento.updatedAt, 'yyyy-MM-dd'),
                                                Agregar: encontro.Agregar,
                                                Eliminar: encontro.Eliminar,
                                                Editar: encontro.Editar,
                                                Consultar: encontro.Consultar,
                                                idDocumento: idDocumento,
                                                version: parseFloat(documento.version).toFixed(1),
                                                documento: documento.documento,
                                                iniciativa: documento.iniciativa,
                                                //ente: documento.ente,
                                                // secretaria: documento.secretaria,
                                                // direccione: documento.direccione,
                                                // departamento: documento.departamento,
                                                folioExpediente: documento.folioExpediente,
                                                clasificacion: meta,
                                                metacatalogos: documento.metacatalogos,
                                                informacion: visibilidad,
                                                visibilidade: documento.visibilidade,
                                                tipo_de_expediente: documento.tipo_de_expediente,
                                                usuario: this.menu.usuario
                                            });
                                        }
                                    }
                                }
                                meta = '';
                            }
                        }
                    }
                }
            }
            this.files = documentosTemp;
            this.filesTemp = this.files;

            this.loadingIndicator = false;
            this.spinner.hide();
        }, err => {
            this.spinner.hide();
            this.loadingIndicator = false;
        });
    }

    async editarDocumento(documento: DocumentosModel, tipo: string): Promise<void> {
        console.log(documento);
        const fechaCreacion = new Date(documento.fechaCreacion);
        let mesCreacion: any = fechaCreacion.getMonth() + 1; // obteniendo mes
        let diaCreacion: any = fechaCreacion.getDate(); // obteniendo dia      
        const anoCreacion = fechaCreacion.getFullYear(); // obteniendo año
        diaCreacion = diaCreacion + 1;
        if (diaCreacion < 10) {
            diaCreacion = '0' + diaCreacion; // agrega cero si el menor de 10
        }
        if (mesCreacion < 10) {
            mesCreacion = '0' + mesCreacion; // agrega cero si el menor de 10
        }
        let parametrosSSP001 = await this.obtenerParametros("SSP-001");
        let tipoDocumento = parametrosSSP001.filter(
            (d) =>
                d["cParametroAdministrado"] === "SSP-001-Tipo-de-Documento"
        );
        let tipoExpediente = parametrosSSP001.filter(
            (d) =>
                d["cParametroAdministrado"] === "SSP-001-Tipo-de-Expediente"
        );
        let tipoInformacion = parametrosSSP001.filter(
            (d) =>
                d["cParametroAdministrado"] ===
                "SSP-001-Tipo-de-Informacion"
        );
        // documento.tipo_de_documento = tipoDocumento[0]["cValor"];
        documento.tipo_de_documento = '5f839b713ccdf563ac6ba096';
        documento.tipo_de_expediente = tipoExpediente[0]["cValor"];
        documento.visibilidade = tipoInformacion[0]["cValor"];
        documento.disabled = false;
        if (tipo === '2') {
            documento.iniciativa = this.iniciativa.id;
            documento.iniciativaOficioEnvioDeInforme = this.iniciativa.id;
        } else if (tipo === '3') {
            documento.iniciativa = this.iniciativa.id;
            documento.iniciativaInformeDeResultadosRevision = this.iniciativa.id;
        } else if (tipo === '1') {
            documento.iniciativa = this.iniciativa.id;
        }
        console.log('entro');
        //documento.fechaCreacion = anoCreacion + '-' + mesCreacion + '-' + diaCreacion + 'T16:00:00.000Z';

        console.log(documento);
        // Abrimos modal de guardar perfil
        const dialogRef = this.dialog.open(GuardarDocumentosComponent, {
            width: '60%',
            height: '80%',
            disableClose: true,
            data: documento,
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                if (result.documento) {
                    this.clasificarDocAnex(result, tipo);
                }
            }
        });
    }

    eliminarDocumento(row): void {
        // Eliminamos documento
        Swal.fire({
            title: '¿Está seguro que desea eliminar este documento?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Si',
            cancelButtonText: 'No'
        }).then((result) => {
            if (result.value) {
                row.documento = '';
                row.usuario = this.menu.usuario;
                // realizamos delete
                this.documentoService.borrarDocumentos(row).subscribe((resp: any) => {
                    Swal.fire('Eliminado', 'El documento ha sido eliminado.', 'success');
                    
                    this.obtenerDocumento();
                }, err => {
                    this.cargando = false;
                    Swal.fire(
                        'Error',
                        'Ocurrió un error al eliminar el documento.' + err,
                        'error'
                    );
                });

            }
        });
    }

    modificacionSuspension(): void {
        // Abrimos modal de iniciativa modificada o suspendida
        const dialogRef = this.dialog.open(IniciativaModificadaSuspendidaComponent, {
            width: '60%',
            height: '80%',
            disableClose: true,
            data: this.iniciativa,
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result == "0") {
                this.cerrar('');
            }
        });
    }

    visualizarSuspencion(): void {

        this.iniciativa.disabled = 'Modificación';

        // Abrimos modal de iniciativa modificada o suspendida
        const dialogRef = this.dialog.open(IniciativaModificadaSuspendidaComponent, {
            width: '60%',
            height: '80%',
            disableClose: true,
            data: this.iniciativa,
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result == "0") {
                this.cerrar('');
            }
        });
    }
}
