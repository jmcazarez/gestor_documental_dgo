import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import {
    MatDialog,
    MatDialogRef,
    MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { TipoExpedientesModel } from "models/tipo-expedientes.models";
import { TipoDocumentoModel } from "models/tipos-documentos.models";
import { MenuService } from "services/menu.service";
import { TipoDocumentosService } from "services/tipo-documentos.service";
import { TipoFormatosService } from "services/tipo-formatos.service";
import { UsuarioLoginService } from "services/usuario-login.service";
import Swal from "sweetalert2";
import { TipoDeExpedientesComponent } from "../tipo-de-expedientes.component";
import { TipoDeExpedientesModule } from "../tipo-de-expedientes.module";
import { GuardarTipoDeDocumentosModule } from "./guardar-tipo-de-documentos.module";
import { LoginService } from "services/login.service";

import { Router } from "@angular/router";

@Component({
    selector: "app-guardar-tipo-de-documentos",
    templateUrl: "./guardar-tipo-de-documentos.component.html",
    styleUrls: ["./guardar-tipo-de-documentos.component.scss"],
})
export class GuardarTipoDeDocumentosComponent implements OnInit {
    loadingIndicator: boolean;
    reorderable: boolean;
    cargando: boolean;
    busqueda: string;
    rows = [];
    rowsTemp = [];
    arrPerfilDocumentos: any;
    searchText: string;
    // Array definido en el CU -- Falta que se defina si sera un Catalogo
    arrTipo = [
        {
            id: "1",
            cDescripcionTipo: "Texto",
            Valor: "",
        },
        {
            id: "2",
            cDescripcionTipo: "Numérico",
            Valor: "",
        },
        {
            id: "3",
            cDescripcionTipo: "Fecha",
            Valor: "",
        },
        {
            id: "4",
            cDescripcionTipo: "Sí o no",
            Valor: "",
        },
    ];
    selectedTipoDocumento: boolean;
    selectedObligatorio: boolean;
    form: any;
    arrInformacion: any[];
    arrFormatos: any[];
    selectedInformacion: any;
    selectedFormato: any;
    selectedTipo: any;
    rowEditar: any;
    constructor(
        public dialog: MatDialog,
        private dialogRef: MatDialogRef<TipoDeExpedientesComponent>,
        private formBuilder: FormBuilder,
        private tipoDocumentosService: TipoDocumentosService,
        private tipoFormatosService: TipoFormatosService,
        private menuService: MenuService,
        private loginService: UsuarioLoginService,

        private _router: Router,
        private _usuarioLoginService: UsuarioLoginService,
        private usuarioService: LoginService,
        private _menuService: MenuService,
        @Inject(MAT_DIALOG_DATA) public documento: TipoDocumentoModel
    ) {}

    ngOnInit(): void {
        console.log(this.documento);
        // Seteamos valores
        if (this.documento.metacatalogos) {
            this.rows = this.documento.metacatalogos;
            this.rowsTemp = this.rows;
        }

        // Seteamos valores
        if (this.documento.tipos_de_formato) {
            this.selectedFormato = this.documento.tipos_de_formato.id;
        }

        this.arrInformacion = this.menuService.tipoInformacion;
        this.form = this.formBuilder.group({
            cDescripcionTipoDocumento: [
                {
                    value: this.documento.cDescripcionTipoDocumento,
                    disabled: this.documento.disabled,
                },
                [
                    Validators.required,
                    Validators.minLength(3),
                    Validators.maxLength(100),
                ],
            ],
            obligatorio: {
                value: this.documento.bObligatorio,
                disabled: this.documento.disabled,
            },
            tipoFormatos: [
                { value: this.arrFormatos, disabled: this.documento.disabled },
                [Validators.required],
            ],
            tipoInformacion: [
                {
                    value: this.arrInformacion,
                    disabled: this.documento.disabled,
                },
                [Validators.required],
            ],
            metacatalogo: [{ value: "", disabled: this.documento.disabled }],
            metacatalogoObligatorio: [
                { value: false, disabled: this.documento.disabled },
            ],
            metacatalogoTipo: [
                { value: this.arrTipo, disabled: this.documento.disabled },
            ],
        });

        this.obtenerFormatos();

        // Seteamos valores

        if (this.documento.visibilidade) {
            if (this.documento.visibilidade.id) {
                this.selectedInformacion = this.documento.visibilidade.id;
            } else {
                this.selectedInformacion = this.documento.visibilidade;
            }
        }
        if (this.documento.tipos_de_formato) {
            if (this.documento.tipos_de_formato.id) {
                this.selectedFormato = this.documento.tipos_de_formato.id;
            } else {
                this.selectedFormato = this.documento.tipos_de_formato;
            }
        }
        console.log(this.documento);
        // Seteamos valores

        this.selectedObligatorio = this.documento.bObligatorio;
    }

    cerrar(ent): void {
        if (ent) {
            this.dialogRef.close(ent);
        } else {
            this.dialogRef.close();
        }
    }

    async guardar(): Promise<void> {
        // Guardamos documento
        let tipoFormato = "";
        let visibilidade = "";
        let metacatalogos = [];
        this.rows = this.rowsTemp;
        // Asignamos valores a objeto
        this.documento.bActivo = true;
        this.documento.cDescripcionTipoDocumento = this.form.get(
            "cDescripcionTipoDocumento"
        ).value;
        this.documento.bObligatorio = this.selectedObligatorio;
        this.documento.tipos_de_formato = this.selectedFormato;
        this.documento.visibilidade = this.selectedInformacion;
        this.documento.metacatalogos = this.rows;
        const usuario = localStorage.getItem("usr");
        const usr = JSON.parse(usuario);

        console.log(this.documento);
        if (this.documento.id) {
            // Actualizamos la expediente
            this.tipoDocumentosService
                .actualizarTipoDocumentos(this.documento)
                .subscribe(
                    async (resp: any) => {
                        if (resp) {
                            Swal.fire(
                                "Éxito",
                                "Tipo de documento actualizado correctamente.",
                                "success"
                            );
                            // this.documento = resp.data;

                            // Actualizamos permisos al tipo de documento
                            for (const index in this.menuService
                                .tipoDocumentos) {
                                if (
                                    this.menuService.tipoDocumentos[index]
                                        .id === this.documento.id
                                ) {
                                    this.menuService.tipoDocumentos[
                                        index
                                    ].cDescripcionTipoDocumento = this.documento.cDescripcionTipoDocumento;
                                    this.menuService.tipoDocumentos[
                                        index
                                    ].bObligatorio = this.documento.bObligatorio;
                                    this.menuService.tipoDocumentos[
                                        index
                                    ].tipos_de_formato = this.documento.tipos_de_formato;
                                    this.menuService.tipoDocumentos[
                                        index
                                    ].metacatalogos = this.documento.metacatalogos;
                                    this.menuService.tipoDocumentos[
                                        index
                                    ].visibilidade = this.documento.visibilidade;
                                }
                            }
                            // tslint:disable-next-line: forin
                            for (const indexPerf in usr[0].data
                                .perfiles_de_usuario) {
                                // tslint:disable-next-line: forin
                                for (const indexDoc in usr[0].data
                                    .perfiles_de_usuario[indexPerf]
                                    .Documentos) {
                                    if (
                                        usr[0].data.perfiles_de_usuario[
                                            indexPerf
                                        ].Documentos[indexDoc].tipo_de_documento
                                    ) {
                                        if (
                                            usr[0].data.perfiles_de_usuario[
                                                indexPerf
                                            ].Documentos[indexDoc]
                                                .tipo_de_documento.id ===
                                            this.documento.id
                                        ) {
                                            // tslint:disable-next-line: max-line-length
                                            usr[0].data.perfiles_de_usuario[
                                                indexPerf
                                            ].Documentos[
                                                indexDoc
                                            ].tipo_de_documento.cDescripcionTipoDocumento = this.documento.cDescripcionTipoDocumento;
                                            usr[0].data.perfiles_de_usuario[
                                                indexPerf
                                            ].Documentos[
                                                indexDoc
                                            ].tipo_de_documento.bObligatorio = this.documento.bObligatorio;
                                            usr[0].data.perfiles_de_usuario[
                                                indexPerf
                                            ].Documentos[
                                                indexDoc
                                            ].tipo_de_documento.tipos_de_formato = this.documento.tipos_de_formato;
                                            usr[0].data.perfiles_de_usuario[
                                                indexPerf
                                            ].Documentos[
                                                indexDoc
                                            ].tipo_de_documento.metacatalogos = this.documento.metacatalogos;
                                            usr[0].data.perfiles_de_usuario[
                                                indexPerf
                                            ].Documentos[
                                                indexDoc
                                            ].tipo_de_documento.visibilidade = this.documento.visibilidade;
                                        }
                                    }
                                }
                            }
                            // Actualizamos localesorage
                            await this.login();
                            this.searchText = "";
                            this.cerrar(this.documento);
                        } else {
                            Swal.fire(
                                "Error",
                                "Ocurrió un error al guardar. ",
                                "error"
                            );
                            this.searchText = "";
                        }
                    },
                    (err) => {
                        console.log(err);
                        Swal.fire(
                            "Error",
                            "Ocurrió un error al guardar." + err.error.data,
                            "error"
                        );
                        this.searchText = "";
                    }
                );
        } else {
            // Guardamos la tipo de documento
            this.tipoDocumentosService
                .guardarTipoDocumentos(this.documento)
                .subscribe(
                    async (resp: any) => {
                        if (resp) {
                            // Swal.fire('Éxito', 'Tipo de documento guardado correctamente.', 'success');
                            this.documento = resp;

                            // Agregamos el permiso
                            if (usuario) {
                                // Agregamos actualizamos cadauno de los perfiles
                                for (const index in usr[0].data
                                    .perfiles_de_usuario) {
                                    this.tipoDocumentosService
                                        .obtenerTipoDocumentosPerfil(
                                            usr[0].data.perfiles_de_usuario[
                                                index
                                            ].id
                                        )
                                        .subscribe(
                                            (perfil: any) => {
                                                this.arrPerfilDocumentos = perfil;
                                                this.arrPerfilDocumentos.Documentos.push(
                                                    {
                                                        tipo_de_documento: this
                                                            .documento.id,
                                                        Agregar: true,
                                                        Consultar: true,
                                                        Editar: true,
                                                        Eliminar: true,
                                                    }
                                                );
                                                // Agregamos permisos al tipo de documento
                                                if (perfil) {
                                                    this.tipoDocumentosService
                                                        .actualizarTipoDocumentosPerfil(
                                                            this
                                                                .arrPerfilDocumentos
                                                        )
                                                        .subscribe(
                                                            () => {
                                                                if (
                                                                    this
                                                                        .documento
                                                                        .tipos_de_formato
                                                                ) {
                                                                    tipoFormato = this
                                                                        .documento
                                                                        .tipos_de_formato;
                                                                }
                                                                if (
                                                                    this
                                                                        .documento
                                                                        .metacatalogos
                                                                ) {
                                                                    metacatalogos = this
                                                                        .documento
                                                                        .metacatalogos;
                                                                }

                                                                if (
                                                                    this
                                                                        .documento
                                                                        .visibilidade
                                                                ) {
                                                                    visibilidade = this
                                                                        .documento
                                                                        .visibilidade;
                                                                }

                                                                this.menuService.tipoDocumentos.push(
                                                                    {
                                                                        id: this
                                                                            .documento
                                                                            .id,
                                                                        cDescripcionTipoDocumento: this
                                                                            .documento
                                                                            .cDescripcionTipoDocumento,
                                                                        Agregar: true,
                                                                        Consultar: true,
                                                                        Editar: true,
                                                                        Eliminar: true,
                                                                        bObligatorio: this
                                                                            .documento
                                                                            .bObligatorio,
                                                                        tipos_de_formato: tipoFormato,
                                                                        metacatalogos,
                                                                        visibilidade,
                                                                    }
                                                                );
                                                            },
                                                            (err) => {
                                                                Swal.fire(
                                                                    "Error",
                                                                    "Ocurrió un error al guardar.",
                                                                    "error"
                                                                );
                                                                this.searchText =
                                                                    "";
                                                            }
                                                        );
                                                } else {
                                                    Swal.fire(
                                                        "Error",
                                                        "Ocurrió un error al guardar.",
                                                        "error"
                                                    );
                                                    this.searchText = "";
                                                }
                                            },
                                            (err) => {
                                                Swal.fire(
                                                    "Error",
                                                    "Ocurrió un error al guardar.",
                                                    "error"
                                                );
                                                this.searchText = "";
                                            }
                                        );

                                    // tslint:disable-next-line: forin
                                    // Agregamos actualizamos cada uno de los perfiles
                                    usr[0].data.perfiles_de_usuario[
                                        index
                                    ].Documentos.push({
                                        Agregar: true,
                                        Consultar: true,
                                        Editar: true,
                                        Eliminar: true,
                                        tipo_de_documento: {
                                            bActivo: true,
                                            id: this.documento.id,
                                            bObligatorio: this.documento
                                                .bObligatorio,
                                            cDescripcionTipoDocumento: this
                                                .documento
                                                .cDescripcionTipoDocumento,
                                            tipos_de_formato: this.documento
                                                .tipos_de_formato,
                                            metacatalogos,
                                            visibilidade,
                                        },
                                    });
                                }

                                // Actualizamos localesorage

                                // this.loginService.guardarUsuario(usr);
                                await this.login();
                                Swal.fire(
                                    "Éxito",
                                    "Tipo de documento guardado correctamente.",
                                    "success"
                                );
                                this.searchText = "";
                                this.cerrar(this.documento);
                            }
                            //  this.cerrar(this.documento);
                        } else {
                            Swal.fire(
                                "Error",
                                "Ocurrió un error al guardar. " +
                                    resp.error.data,
                                "error"
                            );
                            this.searchText = "";
                        }
                    },
                    (err) => {
                        Swal.fire(
                            "Error",
                            "Ocurrió un error al guardar." + err.error.data,
                            "error"
                        );
                        this.searchText = "";
                    }
                );
        }
    }

    async obtenerFormatos(): Promise<void> {
        // Obtenemos Formatos
        this.tipoFormatosService.obtenerTipoFormatos().subscribe(
            (resp: any) => {
                this.arrFormatos = resp;
            },
            (err) => {}
        );
    }
    async login(): Promise<void> {
        await this.usuarioService.refrescUsuario().subscribe(
            async (resp: any) => {
                // Guardar en storage

                await this._usuarioLoginService.guardarUsuario(resp);

                if (resp[0].data.perfiles_de_usuario.length == 0) {
                    // this.mostrarMensaje('No cuenta con permisos asignados. Favor de verificar con el área de sistemas.');
                    Swal.fire("Error", "Usuario sin permisos.", "error");
                    this._router.navigate(["login"]);
                } else {
                    // Crear menú
                    // await this._menuService.limpiarMenu();
                    // await this._menuService.crearMenu();
                    /*
                    this.error = false;
                    this._router.navigate(["home"]);
                    this.cargando = false;
                    */
                }
            },
            (err) => {
                Swal.fire("Error", "Problema al refrescar permisos.", "error");
            }
        );
    }
    agregarMetacatalogo(): void {
        try {
            if (this.rowEditar === undefined) {
                this.rowEditar = [];
            }
            this.loadingIndicator = true;
            this.searchText = "";
            this.rows = this.rowsTemp;
            let metacatalogo: string;
            let metacatalogoObligatorio: boolean;
            let metacatalogoTipo: string;
            let i: string;
            let repetido = false;
            metacatalogoTipo = "";
            metacatalogo = "";
            metacatalogo = this.form.get("metacatalogo").value;
            metacatalogoObligatorio = this.form.get("metacatalogoObligatorio")
                .value;
            metacatalogoTipo = this.form.get("metacatalogoTipo").value;

            this.form.controls["metacatalogo"].setValue("");
            this.form.controls["metacatalogoObligatorio"].setValue(false);

            this.selectedTipo = "";

            if (
                metacatalogo === "" ||
                metacatalogoTipo === "" ||
                metacatalogo === undefined ||
                metacatalogoTipo === undefined
            ) {
                Swal.fire(
                    "Error",
                    "Es necesario capturar la descripción y el tipo para agregar metacatalogo. ",
                    "error"
                );
                this.loadingIndicator = false;
            } else {
                const temp = this.rows.filter(
                    (d) =>
                        d.cDescripcionMetacatalogo.toLowerCase() ===
                        metacatalogo.toLowerCase()
                );
                if (temp.length && !this.rowEditar) {
                    Swal.fire(
                        "Error",
                        "Ya existe un metacatalogo con esa descripción agregado. ",
                        "error"
                    );
                } else {
                    console.log(this.rowEditar.length);
                    if (this.rowEditar && this.rowEditar.length === undefined) {
                        const index = this.rows.findIndex(
                            (tipoDocumento) =>
                                tipoDocumento.cDescripcionMetacatalogo ===
                                this.rowEditar.cDescripcionMetacatalogo
                        );
                        if (index >= 0) {
                            for (i in this.rows) {
                                if (
                                    Number(i) !== index &&
                                    this.rows[
                                        i
                                    ].cDescripcionMetacatalogo.toLowerCase() ===
                                        metacatalogo.toLowerCase()
                                ) {
                                    Swal.fire(
                                        "Error",
                                        "Ya existe un metacatalogo con esa descripción agregado. ",
                                        "error"
                                    );
                                    repetido = true;
                                }
                            }

                            if (!repetido) {
                                this.rows[
                                    index
                                ].cDescripcionMetacatalogo = metacatalogo;
                                this.rows[
                                    index
                                ].bOligatorio = metacatalogoObligatorio;
                                this.rows[
                                    index
                                ].cTipoMetacatalogo = metacatalogoTipo;

                                this.form.controls["metacatalogo"].setValue("");
                                this.form.controls[
                                    "metacatalogoObligatorio"
                                ].setValue(false);
                                this.selectedTipo = "";
                                this.rowEditar = [];
                            }
                        }
                    } else {
                        console.log("push");
                        this.rows.push({
                            cDescripcionMetacatalogo: metacatalogo,
                            bOligatorio: metacatalogoObligatorio,
                            cTipoMetacatalogo: metacatalogoTipo,
                            text: "",
                        });
                    }
                }

                this.loadingIndicator = false;
                setTimeout(() => {
                    this.rows = [...this.rows];
                    this.rowsTemp = this.rows;
                }, 100);
            }
        } catch (err) {
            console.log(err);
            Swal.fire("Error", "Ocurrió un error al guardar. ", "error");
        }
    }

    eliminarMetacatalogo(row: any): void {
        const i = this.rows.indexOf(row);
        this.rows.splice(i, 1);

        setTimeout(() => {
            this.rows = [...this.rows];
            this.rowsTemp = this.rows;
        }, 100);
    }

    editarMetacatalogo(row: any): void {
        this.rowEditar = row;
        this.form.controls["metacatalogo"].setValue(
            row.cDescripcionMetacatalogo
        );
        this.form.controls["metacatalogoObligatorio"].setValue(row.bOligatorio);
        this.selectedTipo = row.cTipoMetacatalogo;
    }

    filterDatatable(value): void {
        // Filtramos tabla
        this.rows = this.rowsTemp;
        if (value.target.value === "") {
            this.rows = this.rowsTemp;
        } else {
            const val = value.target.value.toLowerCase();
            const temp = this.rows.filter(
                (d) =>
                    d.cDescripcionMetacatalogo.toLowerCase().indexOf(val) !==
                        -1 ||
                    !val ||
                    d.cTipoMetacatalogo.toLowerCase(val).indexOf(val) !== -1
            );
            this.rows = temp;
        }
    }
}
