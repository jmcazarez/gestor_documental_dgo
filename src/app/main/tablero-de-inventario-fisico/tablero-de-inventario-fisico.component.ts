import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MenuService } from "services/menu.service";
import { Router } from "@angular/router";
import { DatePipe } from "@angular/common";
import { DomSanitizer } from "@angular/platform-browser";
import Swal from "sweetalert2";
import { NgxSpinnerService } from "ngx-spinner";
import { InventarioFisicoService } from "services/inventario-fisico.service";
import { InventarioFisicoModels } from "models/inventario-fisico.models";
import * as moment from "moment";
import { GuardarInventarioFisicoComponent } from "./guardar-inventario-fisico/guardar-inventario-fisico.component";

@Component({
    selector: "app-tablero-de-inventario-fisico",
    templateUrl: "./tablero-de-inventario-fisico.component.html",
    styleUrls: ["./tablero-de-inventario-fisico.component.scss"],
    providers: [DatePipe],
})
export class TableroDeInventarioFisicoComponent implements OnInit {
    valueBuscador: string;
    loadingIndicator: boolean;
    reorderable: boolean;
    cargando: boolean;
    inventario = [];
    inventarioTemp = [];
    optAgregar: boolean;
    optConsultar: boolean;
    optEditar: boolean;
    optEliminar: boolean;

    constructor(
        private spinner: NgxSpinnerService,
        private datePipe: DatePipe,
        public dialog: MatDialog,
        private inventarioFisicoService: InventarioFisicoService,
        private menuService: MenuService
    ) {
        // Obtenemos recepcion de actas
        this.obtenerPrestamosDeDocumentos();
    }

    ngOnInit(): void { }

    obtenerPrestamosDeDocumentos(): void {
        this.spinner.show();
        this.valueBuscador = "";
        this.loadingIndicator = true;
        const inventariosTemp: any[] = [];

        // Obtenemos los iniciativas
        this.inventarioFisicoService.obtenerInventario().subscribe(
            (resp: any) => {
                // Buscamos permisos
                const opciones = this.menuService.opcionesPerfil.find(
                    (opcion: { cUrl: string }) =>
                        opcion.cUrl === "tablero-de-inventario-físico"
                );

                this.optAgregar = opciones.Agregar;
                this.optEditar = opciones.Editar;
                this.optConsultar = opciones.Consultar;
                this.optEliminar = opciones.Eliminar;
                // Si tiene permisos para consultar
                if (this.optConsultar) {
                    if (resp) {
                        for (const inventario of resp) {
                            let cLegislatura = "";
                            let cDescripcionTipoExpediente = "";
                            if (inventario.legislatura) {
                                cLegislatura =
                                    inventario.legislatura.cLegislatura;
                            }

                            if (inventario.tipo_de_expediente) {
                                cDescripcionTipoExpediente =
                                    inventario.tipo_de_expediente.cDescripcionTipoExpediente;
                            }
                            inventariosTemp.push({
                                id: inventario.id,
                                legislatura: inventario.legislatura,
                                cLegislatura: cLegislatura,
                                tipo_de_expediente:
                                    inventario.tipo_de_expediente,
                                cTipoExpediente: cDescripcionTipoExpediente,
                                cIdExpedienteIni: inventario.cIdExpedienteIni,
                                cIdExpedienteFin: inventario.cIdExpedienteFin,
                                dFechaAuditoria: inventario.dFechaAuditoria,
                                notas: inventario.notas,
                                dFechaAuditoriaText: this.datePipe.transform(
                                    inventario.dFechaAuditoria,
                                    "dd-MM-yyyy"
                                ),
                            });
                        }
                    }
                    this.inventario = inventariosTemp;
                    this.inventarioTemp = this.inventario;

                    this.spinner.hide();
                }
                this.loadingIndicator = false;
                this.spinner.hide();
            },
            (err) => {
                this.loadingIndicator = false;
                this.spinner.hide();
            }
        );
    }

    nuevoPrestamo(): void {
        // Abrimos modal de guardar recepcion de actas
        const dialogRef = this.dialog.open(GuardarInventarioFisicoComponent, {
            width: "50%",
            height: "90%",
            disableClose: true,
            data: new InventarioFisicoModels(),
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.obtenerPrestamosDeDocumentos();
            }
        });
    }

    editarPrestamo(prestamo: InventarioFisicoModels): void {
        // Abrimos modal de guardar inventario fisico
        const dialogRef = this.dialog.open(GuardarInventarioFisicoComponent, {
            width: "60%",
            height: "80%",
            disableClose: true,
            data: prestamo,
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.obtenerPrestamosDeDocumentos();
            }
        });
    }

    eliminarPrestamo(row): void {
        Swal.fire({
            title: "¿Está seguro que desea eliminar el prestamo de documentos?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Si",
            cancelButtonText: "No",
        }).then((result) => {
            if (result.value) {
                // realizamos delete
                this.inventarioFisicoService.eliminarInventario(row).subscribe(
                    (resp: any) => {
                        Swal.fire(
                            "Eliminado",
                            "El prestamo de documentos ha sido eliminado.",
                            "success"
                        );
                        this.obtenerPrestamosDeDocumentos();
                        this.limpiar();
                    },
                    (err) => {
                        this.cargando = false;
                        Swal.fire(
                            "Error",
                            "Ocurrió un error al eliminar el libro de actas." +
                            err,
                            "error"
                        );
                    }
                );
            }
        });
    }

    filterDatatable(value): void {
        // Filtramos tabla
        if (value.target.value === "") {
            this.inventario = this.inventarioTemp;
        } else {
            const val = value.target.value.toLowerCase();
            const temp = this.inventario.filter(
                (d) =>
                    d.id.toLowerCase().indexOf(val) !== -1 ||
                    !val ||
                    d.cLegislatura.toLowerCase().indexOf(val) !== -1 ||
                    !val ||
                    d.cTipoExpediente.toLowerCase().indexOf(val) !== -1 ||
                    !val ||
                    d.cIdExpedienteIni.toLowerCase().indexOf(val) !== -1 ||
                    !val ||
                    d.cIdExpedienteFin.toLowerCase().indexOf(val) !== -1 ||
                    !val ||
                    d.dFechaAuditoria.toLowerCase().indexOf(val) !== -1
            );

            this.inventario = temp;
        }
    }

    limpiar(): void {
        //Limpiamos buscador
        this.valueBuscador = "";
        //console.log('buscador' + this.valueBuscador);
    }
}
