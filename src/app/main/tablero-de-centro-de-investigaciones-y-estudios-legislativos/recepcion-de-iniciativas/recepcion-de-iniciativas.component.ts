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

import { TableroDeCentroDeInvestigacionesYEstudiosLegislativosComponent } from "../tablero-de-centro-de-investigaciones-y-estudios-legislativos.component";
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
import { TableroDeCentroDeInvestigacionesYEstudiosLegislativosModule } from "../tablero-de-centro-de-investigaciones-y-estudios-legislativos.module";
import { EmpleadosDelCongresoService } from 'services/empleados-del-congreso.service';

export interface Autores {
  name: string;
}

export interface Temas {
  name: string;
}

export interface Clasificaciones {
  name: string;
}

export interface Estado {
  id: string;
  descripcion: string;
}

@Component({
  selector: 'app-recepcion-de-iniciativas',
  templateUrl: './recepcion-de-iniciativas.component.html',
  styleUrls: ['./recepcion-de-iniciativas.component.scss'],
  providers: [DatePipe],
})

export class RecepcionDeIniciativasComponent implements OnInit {
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
  cambioDocumento: boolean;
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
  removable = true;
  removable2 = true;
  addOnBlur = true;
  addOnBlur2 = true;
  addOnBlur3 = true;

  firstFormGroup: FormGroup;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  autores: Autores[] = [];
  temas: Temas[] = [];
  clasificaciones: Clasificaciones[] = [];
  legislatura: any[] = [];
  comisiones: any[] = [];
  empleados: any[] = [];
  tipoSesion: Estado[] = [];
  anexos: string[] = [];
  selectedComision: any;
  selectedLegislatura: any;
  selectedSesion: any;
  selectedEmpleado: any;
  imageBase64: any;
  documentos: DocumentosModel = new DocumentosModel();

  constructor(
      private spinner: NgxSpinnerService,
      private formBuilder: FormBuilder,
      private menu: MenuService,
      private datePipe: DatePipe,
      private dialogRef: MatDialogRef<TableroDeCentroDeInvestigacionesYEstudiosLegislativosModule>,
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
      private empleadosService: EmpleadosDelCongresoService,
      private atp: AmazingTimePickerService,
    
      @Inject(MAT_DIALOG_DATA) public iniciativa: IniciativasModel,

  ) {
      this.tipoSesion = [];
      this.obtenerTiposIniciativas();
      this.obtenerComisiones();
      this.obtenerEmpleados();
      this.obtenerLegislatura();
      console.log(this.iniciativa.formatosTipoIniciativa);
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
      if (this.iniciativa.documentos == undefined) {
          this.iniciativa.documentos = [];
      }
      if (this.iniciativa.formatosTipoIniciativa == undefined) {
          this.iniciativa.formatosTipoIniciativa = [];
      }
      this.imageBase64 = environment.imageBase64;
  }

  ngOnInit(): void {
      console.log(this.iniciativa);
      if (this.iniciativa.actasSesion === undefined) {
          this.iniciativa.actasSesion = [];
      }
      if (this.iniciativa.anexosTipoIniciativa === undefined) {
          this.iniciativa.anexosTipoIniciativa = [];
      }
      if (this.iniciativa.comisiones === undefined) {
          this.iniciativa.comisiones = "";
      }
      if (this.iniciativa.clasificaciones === undefined) {
          this.iniciativa.clasificaciones = "";
      }
      let validatos = [
      ];
    
      if (this.iniciativa.anexosTipoCuentaPublica !== undefined) {
          if (this.iniciativa.anexosTipoCuentaPublica.length > 0) {
              this.fileInformeName = this.iniciativa.anexosTipoCuentaPublica[0].name;
              this.fileOficioName = this.iniciativa.anexosTipoCuentaPublica[1].name;
          } else {
              this.fileInformeName = "";
              this.fileOficioName = "";
          }
      } else {
          this.iniciativa.anexosTipoCuentaPublica = [];
          this.fileInformeName = "";
          this.fileOficioName = "";
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
          this.iniciativa.fechaCreacion =
              this.iniciativa.fechaCreacion + "T16:00:00.000Z";
          this.iniciativa.fechaIniciativa =
              this.iniciativa.fechaIniciativa + "T16:00:00.000Z";
      } else {
          // Seteamos la fecha de carga con la fecha actual
          this.iniciativa.estatus = "Registrada";
          this.iniciativa.fechaCreacion = ano + "-" + mes + "-" + dia;
      }
   
      if (this.iniciativa.actasSesion[0] !== undefined) {
          console.log('haycomision');
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
          etiquetasClasificaciones: [{ value: "", disabled: false }],
          comision: [{ value: this.comisiones, disabled: true }, validatos],
          legislatura: [{ value: this.selectedLegislatura },  [ Validators.required]],
          tipoSesion: [{ value: this.selectedSesion },  [ Validators.required]],
          fechaSesion: [{ value: this.iniciativa.actasSesion[0].fechaSesion, disabled: false },  [ Validators.required]],
          horaSesion: [{ value: this.iniciativa.actasSesion[0].horaSesion, disabled: false },  [ Validators.required]],
          empleados: [{ value: this.selectedEmpleado },  [ Validators.required]],
          fechaRecepcion: [{ value: this.iniciativa.fechaRecepcion, disabled: false },  [ Validators.required]],
      });
      }else{
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
          comision: [{ value: this.comisiones, disabled: false }, validatos],
          legislatura: [{ value: this.selectedLegislatura },  [ Validators.required]],
          tipoSesion: [{ value: this.selectedSesion },  [ Validators.required]],
          fechaSesion: [{ value: '', disabled: false },  [ Validators.required]],
          horaSesion: [{ value: '', disabled: false },  [ Validators.required]],
      });
      }
      if (this.iniciativa.estatus === 'Turnado de iniciativa a comisión') {
          validatos = [
              Validators.required
          ];

      }
  }

  async guardar(): Promise<void> {

      let legislatura;
      let tipoSesion;
      let fechaSesion;
      let fechaRecepcion;
      let hora;
      let horaSesion;
      let receptor;

      this.spinner.show();

      if (this.cambioDocumento) {
          await this.subirAnexos(this.filesOficio);
      } else {
          if (this.iniciativa.anexosTipoCuentaPublica[2]) {
              this.anexos.push(this.iniciativa.anexosTipoCuentaPublica[2]);
          }
      }

      this.iniciativa.anexosTipoCuentaPublica = this.anexos;

      this.iniciativa.clasificaciones = this.clasificaciones;
      this.iniciativa.comisiones = this.selectedComision;
      legislatura = this.selectedLegislatura;
      receptor = this.selectedEmpleado;
      tipoSesion = this.form.get('tipoSesion').value;;
      fechaSesion = moment(this.form.get('fechaSesion').value).format('YYYY-MM-DD');
      fechaRecepcion = moment(this.form.get('fechaRecepcion').value).format('YYYY-MM-DD');
      hora = this.form.get('horaSesion').value;

      horaSesion = hora + ':00.000';


      if (this.iniciativa.id) {
          if (this.iniciativa.actasSesion.lenght > 0) {
              // Actualizamos la comision 
              this.actasSesionsService.actualizarActasSesions({
                  id: this.iniciativa.actasSesion[0].id,
                  legislatura: legislatura,
                  tipoSesion: tipoSesion,
                  fechaSesion: fechaSesion,
                  horaSesion: horaSesion,
                  receptor: receptor,
                  fechaRecepcion: fechaRecepcion
              }).subscribe((resp: any) => {
                  if (resp) {
                      this.iniciativa.actasSesion = [resp.data.id];

                      console.log('con acta de sesion');
                      console.log(this.iniciativa);
                      this.iniciativaService.actualizarIniciativa(this.iniciativa).subscribe((resp: any) => {
                          if (resp) {
                              this.spinner.hide();
                              Swal.fire('Éxito', 'Iniciativa actualizada correctamente.', 'success');
                              this.iniciativa = resp.data;

                              this.cerrar(this.iniciativa);
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
                  horaSesion: horaSesion,
                  receptor: receptor,
                  fechaRecepcion: fechaRecepcion
              }).subscribe((resp: any) => {
                  if (resp) {
                      this.iniciativa.actasSesion = [resp.data.id];
                      console.log('sin acta de sesion');
                      console.log(this.iniciativa);
                      this.iniciativaService.actualizarIniciativa(this.iniciativa).subscribe((resp: any) => {
                          if (resp) {
                              this.spinner.hide();
                              Swal.fire('Éxito', 'Iniciativa actualizada correctamente.', 'success');
                              this.iniciativa = resp.data;

                              this.cerrar(this.iniciativa);
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
      if (this.cambioDocumento) {
          await this.subirAnexos(this.filesOficio);
      } else {
          if (this.iniciativa.anexosTipoCuentaPublica[2]) {
              this.anexos.push(this.iniciativa.anexosTipoCuentaPublica[2]);
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
                      console.log(this.iniciativa);
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

      if ((value || "").trim()) {
          this.clasificaciones.push({ name: value.trim() });
      }

      // Reset the input value
      if (input) {
          input.value = "";
      }
  }

  eliminarClasificacion(clasificaciones: Clasificaciones): void {
      const index = this.clasificaciones.indexOf(clasificaciones);

      if (index >= 0) {
          this.clasificaciones.splice(index, 1);
      }
  }


  addDocumento(): void {
      // Agregamos elemento file

      let base64Result: string;
      this.filesOficio = [];
      const fileInput = this.fileOficio.nativeElement;
      fileInput.onchange = () => {
          this.cambioDocumento = true;
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
                      console.log(this.legislatura);
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

  async obtenerEmpleados(): Promise<void> {
    return new Promise((resolve) => {
        {
            this.empleadosService.obtenerEmpleados().subscribe(
                (resp: any) => {
                    for (const empleados of resp) {
                        if (empleados.activo) {
                            this.empleados.push(empleados);
                        }
                    }
                    resolve(resp);
                },
                (err) => {
                    Swal.fire(
                        "Error",
                        "Ocurrió un error al obtener los empleados." +
                        err,
                        "error"
                    );
                    resolve(err);
                }
            );
        }
    });
}

  open() {
      const amazingTimePicker = this.atp.open();
      amazingTimePicker.afterClose().subscribe(time => {
          console.log('hola');
          console.log(time);
      })
  }

  changeDocumento(): void {
      console.log('change');
      this.cambioDocumento = true;
  }
}
