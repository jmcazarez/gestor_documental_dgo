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
import { DateFormat } from "app/main/tablero-de-documentos/guardar-documentos/date-format";
import { DateAdapter } from "@angular/material/core";


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

export class Documentos {
    id: string;
}

@Component({
    selector: 'app-iniciativa-modificada-suspendida',
    templateUrl: './iniciativa-modificada-suspendida.component.html',
    styleUrls: ['./iniciativa-modificada-suspendida.component.scss'],
    providers: [DatePipe, { provide: DateAdapter, useClass: DateFormat }],
})
export class IniciativaModificadaSuspendidaComponent implements OnInit {

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
    disabled = false;

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
        if (this.iniciativa.tipo_de_iniciativa.descripcion == 'Iniciativa') {
            this.dictamenDeSesion.push({
                id: '003',
                descripcion: 'Modificación'
            });
        }

        if (this.iniciativa.documentos == undefined) {
            this.iniciativa.documentos = [];
        }
        this.imageBase64 = environment.imageBase64;
    }

    async ngOnInit(): Promise<void> {
        if (this.iniciativa.dictamenDeIniciativa == 'Modificación') {
            this.iniciativa.estatus = 'Turnada a comisión para modificación';
        } else {
            this.iniciativa.estatus = 'Suspendida';
        }

        if (this.iniciativa.disabled == 'Modificación') {
            this.disabled = true;
        }

        this.iniciativa.actasSesion[0].fechaSesion =
            moment(this.iniciativa.actasSesion[0].fechaSesion).format('YYYY-MM-DD') + "T16:00:00.000Z";
        this.iniciativa.actasSesion[0].horaSesion =
            moment(this.iniciativa.actasSesion[0].horaSesion, 'h:mm').format('HH:mm');

        await this.obtenerDocumento();
        this.obtenerTiposIniciativas();
        this.obtenerComisiones();
        this.obtenerLegislatura();

        this.selectedComision = this.iniciativa.comisiones.id;
        this.selectedDictamenDeIniciativa = this.iniciativa.dictamenDeIniciativa;
        this.selectedSesion = this.iniciativa.actasSesion[0].tipoSesion;

        let validatos = [];
        let validatosSuspension = [];

        this.selectTipo = this.iniciativa.tipo_de_iniciativa.id;
        this.autores = this.iniciativa.autores;
        this.temas = this.iniciativa.tema;

        if (this.iniciativa.adicion) {
            this.adicion = this.iniciativa.adicion;
        } else {
            this.adicion = [];
        }

        if (this.iniciativa.clasificaciones) {
            this.clasificaciones = this.iniciativa.clasificaciones;
        } else {
            this.clasificaciones = [];
        }

        if (this.iniciativa.dictamenDeIniciativa == 'Modificación') {
            validatos = [Validators.minLength(3), Validators.maxLength(500), Validators.required]
        } else {
            validatos = [];
        }

        if (this.iniciativa.dictamenDeIniciativa == 'No aprobada') {
            validatosSuspension =
                [Validators.minLength(3),
                Validators.maxLength(500),
                Validators.required]
        } else {
            validatosSuspension = [];
        }

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
            clasificaciones: [{ value: "", disabled: false }],
            adicion: [{ value: "", disabled: false }],
            etiquetasAdicion: [{ value: "", disabled: false }],
            etiquetas: [{ value: "", disabled: false }],
            etiquetasEtiquetas: [{ value: "", disabled: false }],
            etiquetasClasificaciones: [{ value: "", disabled: false }],
            comision: [{ value: this.comisiones, disabled: false }, validatos],
            dictamenDeIniciativa: [{ value: this.selectedDictamenDeIniciativa, disabled: true }, [Validators.required]],
            legislatura: [{ value: this.selectedLegislatura, disabled: true }, [Validators.required]],
            tipoSesion: [{ value: this.selectedSesion, disabled: true }, [Validators.required]],
            fechaSesion: [{ value: this.iniciativa.actasSesion[0].fechaSesion, disabled: true }, [Validators.required]],
            horaSesion: [{ value: this.iniciativa.actasSesion[0].horaSesion, disabled: true }, [Validators.required]],
            sustentoDeModificacion: [this.iniciativa.sustentoDeModificacion, validatos],
            motivoDeSuspension: [this.iniciativa.motivoDeSuspension, validatosSuspension],
        });
    }

    async guardar(): Promise<void> {
        try {
            this.spinner.show();

            if (this.iniciativa.dictamenDeIniciativa == 'Modificación') {
                this.iniciativa.sustentoDeModificacion = this.form.get('sustentoDeModificacion').value;
                this.iniciativa.motivoDeSuspension = '';
                this.iniciativa.estatus = 'Turnada a comisión para modificación';
            } else {
                this.iniciativa.sustentoDeModificacion = '';
                this.iniciativa.motivoDeSuspension = this.form.get('motivoDeSuspension').value;
                this.iniciativa.estatus = 'Suspendida';
            }

            this.iniciativaService
                .actualizarIniciativa({
                    id: this.iniciativa.id,
                    motivoDeSuspension: this.iniciativa.motivoDeSuspension,
                    sustentoDeModificacion: this.iniciativa.sustentoDeModificacion,
                    estatus: this.iniciativa.estatus
                })
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
                            this.cerrar('0');
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
        } catch (err) {
            this.spinner.hide();
            Swal.fire(
                "Error",
                "Ocurrió un error al clasificar." + err,
                "error"
            );
        }
    }

    filterDatatable(value): void {
        // Filtramos tabla
    }

    change(): void {

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

    async cargaClasificacionDocumento(tipo: string): Promise<void> {
        try {
            this.spinner.show();
            //Creamos nuevo modelo de documentos y asignamos parametros
            this.documentos = new DocumentosModel();
            let legislaturaFolio: any;
            this.documentos.bActivo = true;
            let parametrosSSP001 = await this.obtenerParametros("SSP-001");
            let parametrosTipoDocumentos = await this.obtenerParametros("Tipo-de-documento-complementario");
         
            let tipoDocumento: any = parametrosTipoDocumentos;

            let tipoExpediente = parametrosSSP001.filter(
                (d) =>
                    d["cParametroAdministrado"] === "SSP-001-Tipo-de-Expediente"
            );
            let tipoInformacion = parametrosSSP001.filter(
                (d) =>
                    d["cParametroAdministrado"] ===
                    "SSP-001-Tipo-de-Informacion"
            );
            //parametro tipo documento
            this.documentos.tipo_de_documento = tipoDocumento[0]["cValor"];
            this.documentos.tipo_de_expediente = tipoExpediente[0]["cValor"];

            this.documentos.visibilidade = tipoInformacion[0]["cValor"];
            this.documentos.iniciativa = this.iniciativa.id;
            if (this.iniciativa.dictamenDeIniciativa == 'Modificación') {
                this.documentos.formulario = 'Turnada a comisión para modificación';
            } else {
                this.documentos.formulario = 'Suspendida';
            }

            legislaturaFolio = this.legislatura.filter(d => d.id === this.selectedLegislatura);

            this.documentos.legislatura = legislaturaFolio[0].id;
            this.documentos.folioExpediente = this.iniciativa.folioExpediente;

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
        } catch (err) {
            this.spinner.hide();
            Swal.fire(
                "Error",
                "Ocurrió un error al clasificar." + err,
                "error"
            );
        }
    }

    async clasificarDocAnex(result: any, tipo: string): Promise<void> {
        try {
            this.spinner.show();
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

            if (this.iniciativa.estatus === 'Turnar dictamen a Secretaría General') {
                this.documentos.fechaCreacion = this.documentos.fechaCreacion + 'T16:00:00.000Z';
                this.documentos.fechaCarga = this.documentos.fechaCreacion + 'T16:00:00.000Z';
            }

            this.documentos = result;
            let cAutores = "";
            let cTema = "";
            this.autores.forEach((element) => {
                if (cAutores === "") {
                    cAutores = element.name;
                } else {
                    cAutores = cAutores + ", " + element.name;
                }
            });
            this.temas.forEach((element) => {
                if (cTema === "") {
                    cTema = element.name;
                } else {
                    cTema = cTema + ", " + element.name;
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
                    cDescripcionMetacatalogo: "Autores",
                    bOligatorio: true,
                    cTipoMetacatalogo: "Texto",
                    text: cAutores,
                },

                {
                    cDescripcionMetacatalogo: "Temas",
                    bOligatorio: true,
                    cTipoMetacatalogo: "Texto",
                    text: cTema,
                },
            ];

            if (tipo === '2') {
                this.documentos.iniciativaOficioEnvioDeInforme = this.iniciativa.id;
            } else if (tipo === '3') {
                this.documentos.iniciativaInformeDeResultadosRevision = this.iniciativa.id;
            } else if (tipo === '1') {

            }

            this.documentos.folioExpediente = this.iniciativa.folioExpediente;

            this.documentoService
                .actualizarDocumentosSinVersion(this.documentos)
                .subscribe(
                    (resp: any) => {
                        if (resp.data) {
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
                                /*asignamos valores a iniciativa.documentos debido a que al
                                iniciar el componente inicia como [] y al guardar asi se desasignan
                                los documentos*/

                                //this.iniciativa.documentos.push(this.documentos);
                                this.iniciativa.documentos = [this.documentos.id];
                                this.obtenerDocumento();
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
        } catch (err) {
            this.spinner.hide();
            Swal.fire(
                "Error",
                "Ocurrió un error al clasificar." + err,
                "error"
            );
        }
    }

    async obtenerDocumento() {
        try {
            this.spinner.show();
            const documentosTemp: any[] = [];
            let idDocumento: any;
            this.loadingIndicator = true;
            let meta = '';
            let visibilidad = '';
            let countFecha = 0;
            let info: any;
            // Obtenemos los documentos
            this.documentoService.obtenerDocumentos().subscribe((resp: any) => {

                // Buscamos permisos


                for (const documento of resp.data) {
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
                                        countFecha = 0;
                                        if (documento.metacatalogos) {
                                            for (const x of documento.metacatalogos) {

                                                if (meta === '') {

                                                    if (x.cTipoMetacatalogo === 'Fecha') {
                                                        if (x.text) {
                                                            countFecha = x.text.split("T16:00:00.000Z").length - 1;

                                                            if (countFecha >= 2) {
                                                                x.text = x.text.replace('T16:00:00.000ZT16:00:00.000Z', 'T16:00:00.000Z')
                                                            }
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
        } catch (err) {
            this.spinner.hide();
            Swal.fire(
                "Error",
                "Ocurrió un error al clasificar." + err,
                "error"
            );
        }
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

    async obtenerTiposIniciativas(): Promise<void> {
        return new Promise(async (resolve) => {
            {
                // Obtenemos Distritos
                this.spinner.show();
                await this.iniciativaService.obtenerTiposIniciativas().subscribe(
                    (resp: any) => {
                        this.arrTipo = resp;
                        this.spinner.hide();
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

    async obtenerLegislatura(): Promise<any> {
        return new Promise((resolve) => {
            {
                this.legislaturaService.obtenerLegislatura().subscribe(
                    (resp: any) => {
                        for (const legislatura of resp) {
                            if (legislatura.bActual && legislatura.bActivo) {
                                this.legislatura.push(legislatura);
                            }
                        }
                        resolve( this.legislatura);

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

    cerrar(doc: any): void {
        if (doc) {
            this.dialogRef.close(doc);
        } else {
            this.dialogRef.close();
        }
    }

    async editarDocumento(documento: DocumentosModel): Promise<void> {

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

        documento.tipo_de_documento = tipoDocumento[0]["cValor"];
        documento.tipo_de_expediente = tipoExpediente[0]["cValor"];
        documento.visibilidade = tipoInformacion[0]["cValor"];
        documento.disabled = false;
        documento.iniciativa = this.iniciativa.id;
     
        //documento.fechaCreacion = anoCreacion + '-' + mesCreacion + '-' + diaCreacion + 'T16:00:00.000Z';

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
                    this.clasificarDocAnex(result, '1');
                }
            }
        });
    }

}
