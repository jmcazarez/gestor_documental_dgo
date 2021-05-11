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
import { TableroDeLibroDeActasComponent } from "../tablero-de-libro-de-actas.component";
import { MatDialog } from "@angular/material/dialog";
import { RxwebValidators } from "@rxweb/reactive-form-validators";
import { DatePipe } from "@angular/common";
import { NgxSpinnerService } from "ngx-spinner";
import { LegislaturaService } from "services/legislaturas.service";
import { EmpleadosDelCongresoService } from "services/empleados-del-congreso.service";
import { LibroDeActasModel } from "models/libro-de-actas.models";
import { LibroDeActasService } from "services/libro-de-actas.service";
import { RecepcionDeActasService } from "services/recepcion-de-actas.service";
import * as moment from "moment";

export interface Estado {
    id: string;
    descripcion: string;
}

@Component({
    selector: "guardar-libro-de-actas",
    templateUrl: "./guardar-libro-de-actas.component.html",
    styleUrls: ["./guardar-libro-de-actas.component.scss"],
    providers: [DatePipe],
})
export class GuardarlibroDeActasComponent implements OnInit {
    form: FormGroup;
    selectLegislatura: any;
    arrLegislaturas: any[] = [];
    recepcionDeActas = [];
    recepcionDeActasTemporal = [];
    fileName: string;
    cambioFecha: boolean;
    date = new Date(2020, 1, 1);
    fechaCreacion: any;
    maxDate = new Date();
    cambioDocumento = false;
    loadingIndicator: boolean;
    reorderable: boolean;
    constructor(
        private spinner: NgxSpinnerService,
        private datePipe: DatePipe,
        private formBuilder: FormBuilder,
        private recepcionDeActasService: RecepcionDeActasService,
        private dialogRef: MatDialogRef<TableroDeLibroDeActasComponent>,
        public dialog: MatDialog,
        private libroService: LibroDeActasService,
        private legislaturasService: LegislaturaService,
        @Inject(MAT_DIALOG_DATA) public libro: LibroDeActasModel
    ) { }

    async ngOnInit(): Promise<void> {
        await this.obtenerTiposLegislaturas();
        await this.obtenerRecepcionesDeActas();

        this.fileName = "";
        const fecha = new Date(); // Fecha actual
        let mes: any = fecha.getMonth() + 1; // obteniendo mes
        let dia: any = fecha.getDate(); // obteniendo dia
        let hora: any = fecha.getHours() + ":" + fecha.getMinutes();
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

        // Form reativo
        this.form = this.formBuilder.group({
            cId: [{ value: this.libro.id, disabled: true }],
            legislatura: [
                { value: this.libro.legislatura, disabled: false },
                Validators.required,
            ],
            fechaDeInicio: [
                { value: this.libro.fechaDeInicio, disabled: false },
                Validators.required,
            ],
            fechaDeFin: [
                { value: this.libro.fechaDeFin, disabled: false },
                Validators.required,
            ],
            estatus: [
                { value: this.libro.estatus, disabled: false },
                Validators.required,
            ],
        });

        this.form.get("legislatura").valueChanges.subscribe((val) => {
            if (val.length > 0) {
                this.recepcionDeActas = this.recepcionDeActasTemporal;
                let legislatura = this.form.get("legislatura").value;
                let fecIni = this.datePipe.transform(
                    this.form.get("fechaDeInicio").value,
                    "yyyy-MM-dd"
                );
                let fecFin = this.datePipe.transform(
                    this.form.get("fechaDeFin").value,
                    "yyyy-MM-dd"
                );

                if (
                    fecIni !== null &&
                    fecFin !== null &&
                    legislatura.length > 0
                ) {
                    this.recepcionDeActas = this.recepcionDeActas.filter(
                        (d) => {
                            return (
                                d.fechaCreacionTextFiltro >= fecIni &&
                                d.fechaCreacionTextFiltro <= fecFin &&
                                d.idLegislatura == legislatura
                            );
                        }
                    );
                } else {
                    this.recepcionDeActas = this.recepcionDeActas.filter(
                        (d) => {
                            return d.idLegislatura == legislatura;
                        }
                    );
                }
            }
        });

        this.form.get("fechaDeInicio").valueChanges.subscribe((val) => {
            if (val) {
                if (val.getTime() > 0) {
                    this.recepcionDeActas = this.recepcionDeActasTemporal;
                    let legislatura = this.form.get("legislatura").value;
                    let fecIni = this.datePipe.transform(
                        this.form.get("fechaDeInicio").value,
                        "yyyy-MM-dd"
                    );
                    let fecFin = this.datePipe.transform(
                        this.form.get("fechaDeFin").value,
                        "yyyy-MM-dd"
                    );

                    if (fecIni !== null && fecFin !== null) {
                        if (fecIni > fecFin) {
                            Swal.fire(
                                "Error",
                                "La fecha de inicio no puede ser mayor a la fecha fin. ",
                                "error"
                            );
                            this.form.controls["fechaDeInicio"].setValue("");
                        } else {

                            if (legislatura.length > 0) {
                                console.log("filtro legis");
                                this.recepcionDeActas = this.recepcionDeActas.filter(
                                    (d) => {
                                        return (
                                            d.fechaCreacionTextFiltro >=
                                            fecIni &&
                                            d.fechaCreacionTextFiltro <=
                                            fecFin &&
                                            d.idLegislatura == legislatura
                                        );
                                    }
                                );
                            } else {

                                this.recepcionDeActas = this.recepcionDeActas.filter(
                                    (d) => {
                                        return (
                                            d.fechaCreacionTextFiltro >=
                                            fecIni &&
                                            d.fechaCreacionTextFiltro <= fecFin
                                        );
                                    }
                                );
                            }
                        }
                    } else if (fecIni !== null && fecFin === null) {
                        if (legislatura.length > 0) {

                            this.recepcionDeActas = this.recepcionDeActas.filter(
                                (d) => {
                                    return (
                                        d.fechaCreacionTextFiltro >= fecIni &&
                                        d.idLegislatura == legislatura
                                    );
                                }
                            );
                        } else {

                            this.recepcionDeActas = this.recepcionDeActas.filter(
                                (d) => {
                                    return d.fechaCreacionTextFiltro >= fecIni;
                                }
                            );
                        }
                    }
                }
            }
        });

        this.form.get("fechaDeFin").valueChanges.subscribe((val) => {
            if (val) {

                if (val.getTime() > 0) {
                    this.recepcionDeActas = this.recepcionDeActasTemporal;
                    let legislatura = this.form.get("legislatura").value;
                    let fecIni = this.datePipe.transform(
                        this.form.get("fechaDeInicio").value,
                        "yyyy-MM-dd"
                    );

                    let fecFin = this.datePipe.transform(
                        this.form.get("fechaDeFin").value,
                        "yyyy-MM-dd"
                    );

                    if (fecIni > fecFin) {
                        Swal.fire(
                            "Error",
                            "La fecha de inicio no puede ser mayor a la fecha fin. ",
                            "error"
                        );
                        this.form.controls["fechaDeFin"].setValue("");
                    } else {
                        if (legislatura.length > 0) {

                            this.recepcionDeActas = this.recepcionDeActas.filter(
                                (d) => {
                                    return (
                                        d.fechaCreacionTextFiltro >= fecIni &&
                                        d.fechaCreacionTextFiltro <= fecFin &&
                                        d.idLegislatura == legislatura
                                    );
                                }
                            );
                        } else {

                            this.recepcionDeActas = this.recepcionDeActas.filter(
                                (d) => {
                                    return (
                                        d.fechaCreacionTextFiltro >= fecIni &&
                                        d.fechaCreacionTextFiltro <= fecFin
                                    );
                                }
                            );
                        }
                    }
                }
            }
        });
        if (this.libro.id) {
            (this.libro.fechaDeInicio = this.datePipe.transform(
                this.libro.fechaDeInicio,
                "dd-MM-yyyy"
            )),
                (this.libro.fechaDeInicio = this.datePipe.transform(
                    this.libro.fechaDeFin,
                    "dd-MM-yyyy"
                )),
                (this.selectLegislatura = this.libro.legislatura.id);
        } else {
            // Seteamos la fecha de carga con la fecha actual

            //this.libro.fechaDeInicio = ano + '-' + mes + '-' + dia;
            //this.libro.fechaDeFin = ano + '-' + mes + '-' + dia;
            this.selectLegislatura = "";
        }
    }

    async guardar(): Promise<void> {
        this.spinner.show();
        let libros = [];
        // Asignamos valores a objeto
        this.libro.legislatura = this.selectLegislatura;
        this.libro.estatus = this.form.get('estatus').value;
        this.libro.fechaDeInicio =
            moment(this.form.get("fechaDeInicio").value).format("YYYY-MM-DD") +
            "T16:00:00.000Z";
        this.libro.fechaDeFin =
            moment(this.form.get("fechaDeFin").value).format("YYYY-MM-DD") +
            "T16:00:00.000Z";

        this.recepcionDeActas.forEach((row) => {
            if (row.selected) {
                libros.push(row.id);
            }
        });

        if (libros.length === 0) {
            this.spinner.hide();
            Swal.fire(
                "Error",
                "Es necesario capturar al menos un acta para guardar el libro de actas.",
                "error"
            );
        } else {
            this.libro.recepcion_de_actas_de_sesions = libros;

            if (this.libro.id) {
                // Actualizamos el libro de actas
                this.libroService.actualizarLibroDeActas(this.libro).subscribe(
                    (resp: any) => {
                        if (resp) {
                            Swal.fire(
                                "Éxito",
                                "Libro de actas actualizado correctamente.",
                                "success"
                            );
                            this.libro = resp.data;
                            this.spinner.hide();
                            this.cerrar(this.libro);
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
                // Guardamos el libro de actas
                this.libroService.guardarLibroDeActas(this.libro).subscribe(
                    (resp: any) => {
                        if (resp) {
                            this.spinner.hide();
                            Swal.fire(
                                "Éxito",
                                "Libro de actas guardado correctamente.",
                                "success"
                            );
                            this.cerrar(this.libro);
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
        this.spinner.show();
        await this.legislaturasService.obtenerLegislatura().subscribe(
            (resp: any) => {
                this.arrLegislaturas = resp.filter(
                    (item) => item["bActivo"] === true
                );
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

    async obtenerRecepcionesDeActas(): Promise<void> {
        this.spinner.show();

        const actasTemp: any[] = [];

        // Obtenemos los iniciativas
        this.recepcionDeActasService.obtenerRecepcionesDeActas().subscribe(
            (resp: any) => {
                // Buscamos permisos

                // Si tiene permisos para consultar

                if (resp) {
                    for (const ini of resp) {
                        console.log(this.datePipe.transform(
                            ini.fechaCreacion,
                            "yyyy-MM-dd"
                        ));
                        let dFecha = new Date( ini.fechaCreacion);

                        dFecha.setHours(0);
                        dFecha.setMinutes(0);
                        dFecha.setSeconds(0);
                        if (this.libro.id) {
                            if (ini.libro_de_actas_de_sesions.length == 0) {
                                let idLegislatura = "";

                                if (ini.legislatura) {
                                    idLegislatura = ini.legislatura.id;
                                }
                                actasTemp.push({
                                    id: ini.id,
                                    fechaCreacion: ini.fechaCreacion,
                                    fechaCreacionDate: dFecha.getTime(),
                                    fechaCreacionTextFiltro: this.datePipe.transform(
                                        ini.fechaCreacion,
                                        "yyyy-MM-dd"
                                    ),
                                    fechaCreacionText: this.datePipe.transform(
                                        ini.fechaCreacion,
                                        "dd-MM-yyyy"
                                    ),
                                    fechaRecepcion: ini.fechaRecepcion,
                                    legislatura: ini.legislatura,
                                    emisor: ini.emisor,
                                    receptor: ini.receptor,
                                    estatus: ini.estatus,
                                    hora: ini.hora,
                                    notas: ini.notas,
                                    selected: false,
                                    idLegislatura,
                                });
                            } else {
                                let idLegislatura = "";
                                if (ini.legislatura) {
                                    idLegislatura = ini.legislatura.id;
                                }
                                ini.libro_de_actas_de_sesions.forEach((row) => {
                                    if (row.id === this.libro.id) {
                                        actasTemp.push({
                                            id: ini.id,
                                            fechaCreacion: ini.fechaCreacion,
                                            fechaCreacionDate: dFecha.getTime(),
                                            fechaCreacionTextFiltro: this.datePipe.transform(
                                                ini.fechaCreacion,
                                                "yyyy-MM-dd"
                                            ),
                                            fechaCreacionText: this.datePipe.transform(
                                                ini.fechaCreacion,
                                                "dd-MM-yyyy"
                                            ),
                                            fechaRecepcion: ini.fechaRecepcion,
                                            legislatura: ini.legislatura,
                                            emisor: ini.emisor,
                                            receptor: ini.receptor,
                                            estatus: ini.estatus,
                                            hora: ini.hora,
                                            notas: ini.notas,
                                            selected: true,
                                            idLegislatura,
                                        });
                                    }
                                });
                            }
                        } else {
                            if (ini.libro_de_actas_de_sesions.length == 0) {
                                let idLegislatura = "";
                                if (ini.legislatura) {
                                    idLegislatura = ini.legislatura.id;
                                }
                                actasTemp.push({
                                    id: ini.id,
                                    fechaCreacion: ini.fechaCreacion,
                                    fechaCreacionDate: dFecha.getTime(),
                                    fechaCreacionTextFiltro: this.datePipe.transform(
                                        ini.fechaCreacion,
                                        "yyyy-MM-dd"
                                    ),
                                    fechaCreacionText: this.datePipe.transform(
                                        ini.fechaCreacion,
                                        "dd-MM-yyyy"
                                    ),
                                    fechaRecepcion: ini.fechaRecepcion,
                                    legislatura: ini.legislatura,
                                    emisor: ini.emisor,
                                    receptor: ini.receptor,
                                    estatus: ini.estatus,
                                    hora: ini.hora,
                                    notas: ini.notas,
                                    selected: false,
                                    idLegislatura,
                                });
                            }
                        }
                    }
                    console.log(actasTemp);
                    this.recepcionDeActas = [...actasTemp];
                    this.recepcionDeActasTemporal = [...actasTemp];

                    if (this.libro.id) {
                        this.filtrarTabla();
                    }
                }

                this.spinner.hide();
            },
            (err) => {
                this.spinner.hide();
            }
        );
    }

    filtrarTabla(): void {
        try {
            this.recepcionDeActas = this.recepcionDeActasTemporal;
            let legislatura = this.form.get("legislatura").value;
       
            let fecIni = new Date(this.form.get("fechaDeInicio").value);
            fecIni.setHours(0);
            fecIni.setMinutes(0);
            fecIni.setSeconds(0);
            console.log(fecIni);
            let fecFin = new Date(this.form.get("fechaDeFin").value);
            fecFin.setHours(23);
            fecFin.setMinutes(59);
            fecFin.setSeconds(59);

            let dFechaIni = new Date(
                fecIni
            ).getTime();
            let dFechaFin = new Date(fecFin).getTime();

            console.log(dFechaIni);
            console.log(dFechaFin);
            if (fecIni !== null && fecFin !== null) {
                if (legislatura.length > 0) {
                    this.recepcionDeActas = this.recepcionDeActas.filter((d) => {
                        return (
                            d.fechaCreacionDate >= dFechaIni &&
                            d.fechaCreacionDate <= dFechaFin &&
                            d.idLegislatura == legislatura
                        );
                    });
                } else {
                    this.recepcionDeActas = this.recepcionDeActas.filter((d) => {
                        return (
                            d.fechaCreacionDate >= dFechaIni &&
                            d.fechaCreacionDate <= dFechaFin
                        );
                    });
                }
            }
        }
        catch (err) {
            console.log(err);
        }
    }
}
