import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {
    MatDialog,
    MatDialogRef,
    MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { MesasDirectivasModel } from "models/mesas-directivas.models";
import { MesasDirectivasService } from "services/mesas-directivas.service";
import { DetalleMesaService } from "services/detalle-mesa-directiva.service";
import Swal from "sweetalert2";
import { MesasDirectivasComponent } from "../mesas-directivas.component";
import { NgxSpinnerService } from "ngx-spinner";
import { LegislaturaService } from "services/legislaturas.service";
import { MenuService } from "services/menu.service";
import { Router } from "@angular/router";
import { RxwebValidators } from "@rxweb/reactive-form-validators";
import { DetalleMesaModels } from "models/detalle-mesa-directiva.models";
import { PartidosPoliticosService } from "services/partidos-politicos.service";
import { GuardarParticipantesComponent } from "./guardar-participantes/guardar-participantes.component";
@Component({
    selector: "app-guardar-mesa",
    templateUrl: "./guardar-mesa.component.html",
    styleUrls: ["./guardar-mesa.component.scss"],
})
export class GuardarMesaComponent implements OnInit {
    loadingIndicator: boolean;
    reorderable: boolean;
    detalles: any = [];
    detallesTemp: any = [];
    arrPartidos: any = [];
    form: FormGroup;
    searchText: string;
    selectedLegislatura: any;
    arrLegislaturas: [];
    optAgregar: boolean;
    optConsultar: boolean;
    optEditar: boolean;
    optEliminar: boolean;
    detalleMesa: DetalleMesaModels;
    valueBuscador = "";
    constructor(
        public dialog: MatDialog,
        private formBuilder: FormBuilder,
        private spinner: NgxSpinnerService,
        private legislaturasService: LegislaturaService,
        private dialogRef: MatDialogRef<MesasDirectivasComponent>,
        private mesasDirectivasService: MesasDirectivasService,
        private detalleMesaService: DetalleMesaService,
        private menuService: MenuService,
        private router: Router,
        private partidoPoliticoService: PartidosPoliticosService,
        @Inject(MAT_DIALOG_DATA) public mesas: MesasDirectivasModel
    ) {}

    async ngOnInit(): Promise<void> {
        console.log("mesas");
        console.log(this.mesas);
        await this.obtenerPartidos();
        await this.obtenerLegislaturas();
        await this.obtenerDetallesMesa();

        if (this.mesas.id === undefined) {
            this.mesas.activo = true;
        }

        if (this.mesas.legislatura) {
            this.selectedLegislatura = this.mesas.legislatura.id;
        }

        // Form reactivo
        this.form = this.formBuilder.group({
            descripcion: [
                this.mesas.descripcion,
                [
                    Validators.required,
                    Validators.minLength(3),
                    Validators.maxLength(100),
                ],
            ],
            legislatura: [
                { value: this.arrLegislaturas },
                [Validators.required],
            ],
            estatus: this.mesas.activo,
        });
    }

    async guardar(): Promise<void> {
        this.spinner.show();
        // Asignamos valores a objeto
        this.mesas.activo = this.form.get("estatus").value;
        this.mesas.descripcion = this.form.get("descripcion").value;
        this.mesas.legislatura = this.selectedLegislatura;
        console.log(this.detalles);
        let presidente = this.detalles.find(
            (meta) => meta.cargo == "Presidente"
        );
        let vicepresidentes = this.detalles.find(
            (meta) => meta.cargo == "Vice presidente"
        );
        let secretario = this.detalles.find(
            (meta) => meta.cargo == "Secretario"
        );
        let secretario_auxiliar = this.detalles.find(
            (meta) => meta.cargo == "Secretario Auxiliar"
        );
        let vocals = this.detalles.find((meta) => meta.cargo == "Vocal");
        let vocal_auxiliars = this.detalles.find(
            (meta) => meta.cargo == "Vocal Auxiliar"
        );

        if (this.mesas.id) {
            if (this.mesas.detalle_participantes_mesa_directivas) {
                // Actualizamos el mesa directiva
                this.detalleMesaService
                    .actualizarDetalleMesa({
                        id: this.mesas.detalle_participantes_mesa_directivas[0]
                            .id,
                        mesas_directiva: this.mesas.id,
                        presidentes: [presidente.idParticipante],
                        vicepresidentes: [vicepresidentes.idParticipante],
                        secretario: [secretario.idParticipante],
                        secretario_auxiliar: [
                            secretario_auxiliar.idParticipante,
                        ],
                        vocals: [vocals.idParticipante],
                        vocal_auxiliars: [vocal_auxiliars.idParticipante],
                        activo: true,
                    })
                    .subscribe(
                        (resp: any) => {
                            if (resp) {
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
                this.detalleMesaService
                    .guardarDetalleMesa({
                        id: this.mesas.detalle_participantes_mesa_directivas[0]
                            .id,
                        mesas_directiva: this.mesas.id,
                        presidentes: [presidente.idParticipante],
                        vicepresidentes: [vicepresidentes.idParticipante],
                        secretario: [secretario.idParticipante],
                        secretario_auxiliar: [
                            secretario_auxiliar.idParticipante,
                        ],
                        vocals: [vocals.idParticipante],
                        vocal_auxiliars: [vocal_auxiliars.idParticipante],
                        activo: true,
                    })
                    .subscribe(
                        (resp: any) => {
                            if (resp) {
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

            // Actualizamos el mesa directiva
            this.mesasDirectivasService.actualizarMesa(this.mesas).subscribe(
                (resp: any) => {
                    if (resp) {
                        this.spinner.hide();
                        Swal.fire(
                            "Éxito",
                            "Mesa directiva actualizada correctamente.",
                            "success"
                        );
                        this.mesas = resp.data;

                        this.cerrar(this.mesas);
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
                    Swal.fire(
                        "Error",
                        "Ocurrió un error al guardar." + err.error.data,
                        "error"
                    );
                }
            );
        } else {
            // Guardamos el mesa directiva

            this.detalleMesaService
                .guardarDetalleMesa({
                    presidentes: [presidente.idParticipante],
                    vicepresidentes: [vicepresidentes.idParticipante],
                    secretario: [secretario.idParticipante],
                    secretario_auxiliar: [secretario_auxiliar.idParticipante],
                    vocals: [vocals.idParticipante],
                    vocal_auxiliars: [vocal_auxiliars.idParticipante],
                    activo: true,
                })
                .subscribe(
                    (resp: any) => {
                        if (resp) {
                            this.mesas.detalle_participantes_mesa_directivas = [
                                resp.data.id,
                            ];
                            this.mesasDirectivasService
                                .guardarMesa(this.mesas)
                                .subscribe(
                                    (resp: any) => {
                                        if (resp) {
                                            this.spinner.hide();
                                            Swal.fire(
                                                "Éxito",
                                                "Mesa directiva guardada correctamente.",
                                                "success"
                                            );
                                            this.cerrar(this.mesas);
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
                                            "Ocurrió un error al guardar." +
                                                err.error.data,
                                            "error"
                                        );
                                    }
                                );
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

    async obtenerLegislaturas(): Promise<void> {
        // Obtenemos Legislaturas
        this.spinner.show();
        await this.legislaturasService.obtenerLegislatura().subscribe(
            (resp: any) => {
                this.arrLegislaturas = resp.filter(
                    (item) => item["bActivo"] === true
                );
                console.log(this.arrLegislaturas);
                this.spinner.hide();
            },
            (err) => {
                Swal.fire(
                    "Error",
                    "Ocurrió un error obtener las legislaturas." + err,
                    "error"
                );
                this.spinner.hide();
            }
        );
    }

    async obtenerDetallesMesa(): Promise<void> {
        this.spinner.show();
        this.valueBuscador = "";
        const detallesMesasTemp: any[] = [];
        this.loadingIndicator = true;
        // let secretariaId = '';
        // Obtenemos los documentos
        await this.detalleMesaService.obtenerDetalleMesa().subscribe(
            (resp: any) => {
                // Buscamos permisos
                const opciones = this.menuService.opcionesPerfil.find(
                    (opcion: { cUrl: string }) =>
                        opcion.cUrl ===
                        this.router.routerState.snapshot.url.replace("/", "")
                );

                this.optAgregar = opciones.Agregar;
                this.optEditar = opciones.Editar;
                this.optConsultar = opciones.Consultar;
                this.optEliminar = opciones.Eliminar;

                // Si tiene permisos para consultar
                if (this.optConsultar) {
                    for (const detalleMesa of resp) {
                        // secretariaId = '';
                        if (detalleMesa.mesas_directiva === this.mesas.id) {
                            const partido = this.arrPartidos.find(
                                (meta) =>
                                    meta.id ==
                                    detalleMesa.presidentes[0].partidos_politico
                            );

                            if (detalleMesa.presidentes[0]) {
                                detallesMesasTemp.push({
                                    cargo: "Presidente",
                                    idParticipante:
                                        detalleMesa.presidentes[0].id,
                                    participante:
                                        detalleMesa.presidentes[0].nombre,
                                    partido: partido.cNomenclatura,
                                });
                            }

                            if (detalleMesa.vicepresidentes[0]) {
                                detallesMesasTemp.push({
                                    cargo: "Vice presidente",
                                    idParticipante:
                                        detalleMesa.vicepresidentes[0].id,
                                    participante:
                                        detalleMesa.vicepresidentes[0].nombre,
                                    partido: partido.cNomenclatura,
                                });
                            }

                            if (detalleMesa.secretario[0]) {
                                detallesMesasTemp.push({
                                    cargo: "Secretario",
                                    idParticipante:
                                        detalleMesa.secretario[0].id,
                                    participante:
                                        detalleMesa.secretario[0].nombre,
                                    partido: partido.cNomenclatura,
                                });
                            }

                            if (detalleMesa.secretario_auxiliar[0]) {
                                detallesMesasTemp.push({
                                    cargo: "Secretario Auxiliar",
                                    idParticipante:
                                        detalleMesa.secretario_auxiliar[0].id,
                                    participante:
                                        detalleMesa.secretario_auxiliar[0]
                                            .nombre,
                                    partido: partido.cNomenclatura,
                                });
                            }

                            if (detalleMesa.vocals[0]) {
                                detallesMesasTemp.push({
                                    cargo: "Vocal",
                                    idParticipante: detalleMesa.vocals[0].id,
                                    participante: detalleMesa.vocals[0].nombre,
                                    partido: partido.cNomenclatura,
                                });
                            }

                            if (detalleMesa.vocal_auxiliars[0]) {
                                detallesMesasTemp.push({
                                    cargo: "Vocal Auxiliar",
                                    idParticipante:
                                        detalleMesa.vocal_auxiliars[0].id,
                                    participante:
                                        detalleMesa.vocal_auxiliars[0].nombre,
                                    partido: partido.cNomenclatura,
                                });
                            }
                        }
                    }
                    this.detalles = detallesMesasTemp;

                    console.log(this.detalles);
                    this.detallesTemp = this.detalles;
                    this.spinner.hide();
                }
                this.loadingIndicator = false;
                this.spinner.hide();
            },
            (err) => {
                this.spinner.hide();
                this.loadingIndicator = false;
            }
        );
    }

    cerrar(ent): void {
        if (ent) {
            this.dialogRef.close(ent);
        } else {
            this.dialogRef.close();
        }
    }

    filterDatatable(value): void {
        // Filtramos tabla
        if (value.target.value === "") {
            this.detalles = this.detallesTemp;
        } else {
            const val = value.target.value.toLowerCase();
            const temp = this.detalles.filter(
                (d) =>
                    d.participante.toLowerCase().indexOf(val) !== -1 ||
                    !val ||
                    d.partido.toLowerCase().indexOf(val) !== -1 ||
                    d.cargo.toLowerCase().indexOf(val) !== -1
            );
            this.detalles = temp;
        }
    }

    async obtenerPartidos(): Promise<void> {
        // Obtenemos Partidos Politicos
        this.spinner.show();
        await this.partidoPoliticoService.obtenerPartidoPolitico().subscribe(
            (resp: any) => {
                this.arrPartidos = resp;
                this.spinner.hide();
            },
            (err) => {
                Swal.fire(
                    "Error",
                    "Ocurrió un error obtener los partidos politicos." + err,
                    "error"
                );
                this.spinner.hide();
            }
        );
    }

    configurarParticipantes(): void {
        const dialogRef = this.dialog.open(GuardarParticipantesComponent, {
            width: "50%",
            height: "80%",
            disableClose: true,
            data: this.mesas,
        });

        dialogRef.afterClosed().subscribe((result) => {
            this.valueBuscador = "";
            if (result) {
                this.detalles = result;
                this.detallesTemp = this.detalles;
            } else {
                this.detalles = this.detallesTemp;
            }
        });
    }
}
