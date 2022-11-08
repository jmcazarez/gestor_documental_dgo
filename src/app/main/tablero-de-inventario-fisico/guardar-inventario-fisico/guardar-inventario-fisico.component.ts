import {
    Component,
    OnInit,
    Inject,
    ViewChild,
    ElementRef,
} from "@angular/core";
import {
    FormBuilder,
    FormGroup,
    Validators,
    ValidatorFn,
    AbstractControl,
    ValidationErrors,
} from "@angular/forms";
import Swal from "sweetalert2";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { TableroDeInventarioFisicoComponent } from "../tablero-de-inventario-fisico.component";
import { MatDialog } from "@angular/material/dialog";
import { DatePipe } from "@angular/common";
import { NgxSpinnerService } from "ngx-spinner";
import { InventarioFisicoService } from "services/inventario-fisico.service";
import { EmpleadosDelCongresoService } from "services/empleados-del-congreso.service";
import { InventarioFisicoModels } from "models/inventario-fisico.models";
import { LegislaturaService } from "services/legislaturas.service";
import { TipoDocumentosService } from "services/tipo-documentos.service";
import { TipoExpedientesService } from "services/tipo-expedientes.service";

export interface Estado {
    id: string;
    descripcion: string;
}

@Component({
    selector: "guardar-inventario-fisico",
    templateUrl: "./guardar-inventario-fisico.component.html",
    styleUrls: ["./guardar-inventario-fisico.component.scss"],
    providers: [DatePipe],
})
export class GuardarInventarioFisicoComponent implements OnInit {
    form: FormGroup;

    selectLegislatura: any;
    arrLegislaturas: any[] = [];
    selectTipoExpediente: any;
    arrTipoExpediente: any[] = [];
    maxDate = new Date();

    constructor(
        private spinner: NgxSpinnerService,
        private datePipe: DatePipe,
        private formBuilder: FormBuilder,
        private dialogRef: MatDialogRef<TableroDeInventarioFisicoComponent>,
        public dialog: MatDialog,
        private tipoExpedientesService: TipoExpedientesService,
        private inventarioFisicoService: InventarioFisicoService,
        private legislaturasService: LegislaturaService,
        @Inject(MAT_DIALOG_DATA) public inventario: InventarioFisicoModels
    ) { }

    async ngOnInit(): Promise<void> {
        this.spinner.show();

       // await this.obtenerTiposLegislaturas();
        await this.obtenerTiposExpedientes();


        // Validamos si es un documento nuevo
        if (this.inventario.id) {
            if (this.inventario.legislatura) {
                this.selectLegislatura = this.inventario.legislatura.id;
            }
            if (this.inventario.tipo_de_expediente) {
                this.selectTipoExpediente = this.inventario.tipo_de_expediente.id;
            }
            this.inventario.dFechaAuditoria =
                this.inventario.dFechaAuditoria + "T06:00:00.000Z";
        } else {
            this.selectLegislatura = "";
            this.selectTipoExpediente = "";
        }

        // Form reativo
        this.form = this.formBuilder.group({
            id: [
                { value: this.inventario.id, disabled: true },
            ],
            legislatura: [
                { value: this.inventario.legislatura, disabled: false },
            ],
            tipoExpediente: [
                { value: this.inventario.tipo_de_expediente, disabled: false },
                Validators.required,
            ],
            fechaAuditoria: [
                { value: this.inventario.dFechaAuditoria, disabled: false },
                Validators.required,
            ],
            expedienteInicio: [
                { value: this.inventario.cIdExpedienteIni, disabled: false },
                [
                    Validators.required,
                    Validators.minLength(1),
                    Validators.maxLength(100),
                ],
            ],
            expedienteFin: [
                { value: this.inventario.cIdExpedienteFin, disabled: false },
                [
                    Validators.required,
                    Validators.minLength(1),
                    Validators.maxLength(100),
                ],
            ],
            notas: [{ value: this.inventario.notas, disabled: false }, [Validators.maxLength(500)]],
        });

        this.spinner.hide();
    }

    async guardar(): Promise<void> {
        this.spinner.show();

        // Asignamos valores a objeto
       /*  this.inventario.legislatura = this.selectLegislatura; */
        this.inventario.tipo_de_expediente = this.selectTipoExpediente;
        this.inventario.cIdExpedienteIni = this.form.get(
            "expedienteInicio"
        ).value;

        this.inventario.cIdExpedienteFin = this.form.get("expedienteFin").value;

        this.inventario.dFechaAuditoria = this.datePipe.transform(this.form.get("fechaAuditoria").value, 'yyyy-MM-dd');

        this.inventario.notas = this.form.get("notas").value;

        if (this.inventario.id) {
            // Actualizamos la recepcion de actas
            this.inventarioFisicoService
                .actualizarInventario(this.inventario)
                .subscribe(
                    (resp: any) => {
                        if (resp) {
                            Swal.fire(
                                "Éxito",
                                "Inventario fisico actualizado correctamente.",
                                "success"
                            );
                            this.inventario = resp.data;
                            this.spinner.hide();
                            this.cerrar(this.inventario);
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
        } else {
            // Guardamos el recepcion de actas
            this.inventarioFisicoService
                .guardarInventario(this.inventario)
                .subscribe(
                    (resp: any) => {
                        if (resp) {
                            this.spinner.hide();
                            Swal.fire(
                                "Éxito",
                                "Inventario fisico guardado correctamente.",
                                "success"
                            );
                            this.cerrar(this.inventario);
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
    }

    cerrar(doc: any): void {
        if (doc) {
            this.dialogRef.close(doc);
        } else {
            this.dialogRef.close();
        }
    }

    async obtenerTiposLegislaturas(): Promise<void> {
        // Obtenemos legislaturas

        await this.legislaturasService.obtenerLegislatura().subscribe(
            (resp: any) => {
                this.arrLegislaturas = resp;

            },
            (err) => {
                Swal.fire(
                    "Error",
                    "Ocurrió un error obtener las legislaturas." + err,
                    "error"
                );
            }
        );
    }

    async obtenerTiposExpedientes(): Promise<void> {
        // Obtenemos tipos de expedientes
        this.spinner.show();
        await this.tipoExpedientesService.obtenerTipoExpedientes().subscribe(
            (resp: any) => {
                this.arrTipoExpediente = resp;
            },
            (err) => {
                Swal.fire(
                    "Error",
                    "Ocurrió un error obtener los tipos de expedientes." + err,
                    "error"
                );
            }
        );
    }
}
