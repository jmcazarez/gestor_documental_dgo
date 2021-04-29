import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TipoExpedientesModel } from 'models/tipo-expedientes.models';
import { TipoDocumentoModel } from 'models/tipos-documentos.models';
import { MenuService } from 'services/menu.service';
import { TipoDocumentosService } from 'services/tipo-documentos.service';
import { TipoExpedientesService } from 'services/tipo-expedientes.service';
import { UsuarioLoginService } from 'services/usuario-login.service';
import Swal from 'sweetalert2';
import { GuardarTipoDeDocumentosComponent } from '../guardar-tipo-de-documentos/guardar-tipo-de-documentos.component';
import { TipoDeExpedientesComponent } from '../tipo-de-expedientes.component';

@Component({
    selector: 'app-guardar-tipo-de-expedientes',
    templateUrl: './guardar-tipo-de-expedientes.component.html',
    styleUrls: ['./guardar-tipo-de-expedientes.component.scss']
})
export class GuardarTipoDeExpedientesComponent implements OnInit {
    form: FormGroup;
    loadingIndicator: boolean;
    reorderable: boolean;
    cargando: boolean;
    busqueda: string;
    searchText: string;
    rows = [];
    rowsTemp = [];
    selectedTipoDocumento: boolean;
    optAgregar: boolean;
    optConsultar: boolean;
    optEditar: boolean;
    optEliminar: boolean;
    tipoDocumentos: TipoDocumentoModel[];
    documentosPerfil: TipoDocumentoModel[];
    selecteds: boolean;
    constructor(
        public dialog: MatDialog,
        private formBuilder: FormBuilder,
        private dialogRef: MatDialogRef<TipoDeExpedientesComponent>,
        private expedientesService: TipoExpedientesService,
        private tipoDocumentosService: TipoDocumentosService,
        private menuService: MenuService,
        private loginService: UsuarioLoginService,
        @Inject(MAT_DIALOG_DATA) public expediente: TipoExpedientesModel
    ) { }

    ngOnInit(): void {

        // Form reactivo

        this.form = this.formBuilder.group({
            cDescripcionTipoExpediente: [{
                value: this.expediente.cDescripcionTipoExpediente,
                disabled: this.expediente.disabled
            }, [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
            estatus: { value: this.expediente.bActivo, disabled: this.expediente.disabled },
        });
        this.rows = [];

        this.documentosPerfil = this.menuService.tipoDocumentos;


        // tslint:disable-next-line: forin      
        for (const i in this.documentosPerfil) {
            this.documentosPerfil[i].selected = false;
        }
        this.obtenerTipoDocumentos();
    }

    cerrar(ent): void {
        if (ent) {
            this.dialogRef.close(ent);
        } else {
            this.dialogRef.close();
        }
    }

    async guardar(): Promise<void> {

        // Guardamos tipo de expediente

        // Asignamos valores a objeto
        this.expediente.bActivo = this.form.get('estatus').value;
        this.expediente.cDescripcionTipoExpediente = this.form.get('cDescripcionTipoExpediente').value;


        this.expediente.tipo_de_documentos = [];
        // LLenamos las opciones
        // tslint:disable-next-line: forin
        for (const i in this.rows) {

            if (this.rows[i].selected) {
                // Agregamos los elementos al objeto
                this.expediente.tipo_de_documentos.push(this.rows[i].id);
            }
        }

        if (this.expediente.id) {
            // Actualizamos la expediente
            this.expedientesService.actualizarTipoExpedientes(this.expediente).subscribe((resp: any) => {
                if (resp) {
                    Swal.fire('Éxito', 'Tipo de expediente actualizado correctamente.', 'success');
                    this.expediente = resp.data;
                    this.cerrar(this.expediente);
                } else {
                    Swal.fire('Error', 'Ocurrió un error al guardar. ', 'error');
                }
            }, err => {
                Swal.fire('Error', 'Ocurrió un error al guardar.' + err.error.data, 'error');
            });

        } else {
            // Guardamos la entidad
            this.expedientesService.guardarTipoExpedientes(this.expediente).subscribe((resp: any) => {
                if (resp) {
                    Swal.fire('Éxito', 'Tipo de expediente guardado correctamente.', 'success');
                    this.cerrar(this.expediente);
                } else {
                    Swal.fire('Error', 'Ocurrió un error al guardar. ' + resp.error.data, 'error');
                }
            }, err => {
                Swal.fire('Error', 'Ocurrió un error al guardar.' + err.error.data, 'error');
            });
        }
    }


    seleccionarTipoDocumentos(): void {
        this.rows.forEach(element => {
            if (!this.selectedTipoDocumento) {
                element.selected = true;
            } else {
                element.selected = false;
            }
        });

    }


    seleccionarTipoDocumento(row): void {
        this.rows = [...this.rows];
        this.selecteds = this.rows.find((tipo: { selected: boolean; }) => tipo.selected === true);
    }


    filterTiposDocumentos(value): void {
        // Filtramos tabla
        this.rows = this.rowsTemp;
        if (value.target.value === '') {
            this.rows = this.rowsTemp;
        } else {
            const val = value.target.value.toLowerCase();
            const temp = this.rows.filter((d) => d.cDescripcionTipoDocumento.toLowerCase().indexOf(val) !== -1 || !val);
            this.rows = temp;
        }
    }

    nuevoTipoDocumento(): void {
        // Abrimos modal de guardar expediente
        const dialogRef = this.dialog.open(GuardarTipoDeDocumentosComponent, {
            width: '50%',
            height: '98%',
            disableClose: true,
            data: new TipoDocumentoModel(),

        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.searchText = '';
                setTimeout(() => {

                    this.rows.push({
                        Agregar: true,
                        Consultar: true,
                        Editar: true,
                        Eliminar: true,
                        bObligatorio: result.bObligatorio,
                        cDescripcionTipoDocumento: result.cDescripcionTipoDocumento,
                        id: result.id,
                        metacatalogos: result.metacatalogos,
                        tipos_de_formato: result.tipos_de_formato.id,
                        selected: false,
                        visibilidade: result.visibilidade.id,

                    });
                    this.rows = [...this.rows];

                }, 100);

                //   this.obtenerTipoDocumentos();
            }

        });
    }

    consultarTipoDocumento(row: TipoDocumentoModel): void {
        row.disabled = true;
        const dialogRef = this.dialog.open(GuardarTipoDeDocumentosComponent, {
            width: '50%',
            height: '98%',
            disableClose: true,
            data: row,

        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {

                //   this.obtenerTipoDocumentos();
            }

        });
    }
    guardarTipoDocumento(row: TipoDocumentoModel): void {
        // Abrimos modal de guardar expediente
        const dialogRef = this.dialog.open(GuardarTipoDeDocumentosComponent, {
            width: '50%',
            height: '98%',
            disableClose: true,
            data: row,

        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                if (this.expediente.id) {
                    this.expedientesService
                        .actualizarTipoExpedientes(this.expediente)
                        .subscribe(
                            (resp: any) => {
                                if (resp) {

                                    this.expediente = resp.data;

                                } else {
                                    Swal.fire(
                                        "Error",
                                        "Ocurrió un error al guardar. ",
                                        "error"
                                    );
                                }
                            },
                            (err) => {
                                Swal.fire(
                                    "Error",
                                    "Ocurrió un error al guardar." +
                                    err.error.data,
                                    "error"
                                );
                            }
                        );
                }
                setTimeout(() => {
                    this.searchText = '';
                    this.documentosPerfil = this.menuService.tipoDocumentos;
                    this.rows = [...this.documentosPerfil];
                    this.rowsTemp = this.rows;
                }, 100);

                //   this.obtenerTipoDocumentos();
            }

        });
    }

    obtenerTipoDocumentos(): void {
        // Obtenemos los tipos de documentos      
        this.loadingIndicator = true;
        if (this.expediente.id && this.expediente.id.length > 0) {
            // tslint:disable-next-line: forin
            for (const i in this.documentosPerfil) {
                for (const perfilDocumento of this.expediente.tipo_de_documentos) {

                    if (perfilDocumento) {
                        if (perfilDocumento.id === this.documentosPerfil[i].id) {
                            this.documentosPerfil[i].selected = true;
                        }
                    }
                }
            }

            setTimeout(() => {
                this.rows = [...this.documentosPerfil];
                this.rowsTemp = this.rows;
                this.selecteds = this.rows.find((tipo: { selected: boolean; }) => tipo.selected === true);
            }, 100);

            this.loadingIndicator = false;

        } else {
            // tslint:disable-next-line: forin

            setTimeout(() => {
                this.rows = [...this.documentosPerfil];
                this.rowsTemp = this.rows;
            }, 100);

            this.loadingIndicator = false;

        }
        this.cargando = false;
    }

    eliminarTipoDocumento(row: { id: string; }): void {
        // Eliminamos tipo de expediente
        Swal.fire({
            title: '¿Está seguro que desea eliminar este tipo de documento?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Si',
            cancelButtonText: 'No'
        }).then((result) => {
            if (result.value) {
                // realizamos delete
                this.tipoDocumentosService.eliminarTipoDocumentos(row.id).subscribe((resp: any) => {
                    const usuario = localStorage.getItem('usr');
                    if (usuario) {
                        const usr = JSON.parse(usuario);

                        // tslint:disable-next-line: forin
                        for (const index in usr[0].data.perfiles_de_usuario) {
                            const i = usr[0].data.perfiles_de_usuario[index].Documentos.findIndex((std: { id: string; }) => std.id === row.id);
                            usr[0].data.perfiles_de_usuario[index].Documentos.splice(i, 1);
                        }

                        this.loginService.eliminarUsuario();
                        this.loginService.guardarUsuario(usr);
                    }
                    Swal.fire('Eliminado', 'El tipo de documento ha sido eliminado.', 'success');


                    setTimeout(() => {
                        const i = this.menuService.tipoDocumentos.findIndex((std: { id: string; }) => std.id === row.id);
                        this.menuService.tipoDocumentos.splice(i, 1);

                        const x = this.rows.findIndex((std: { id: string; }) => std.id === row.id);
                        this.rows.splice(x, 1);
                        this.rowsTemp = this.rows;
                        this.rows = [...this.rows];
                    }, 200);

                    // this.obtenerTipoDocumentos();
                }, err => {
                    this.cargando = false;
                    Swal.fire(
                        'Error',
                        'Ocurrió un error al eliminar el tipo de documento.' + err,
                        'error'
                    );
                });

            }
        });
    }



}
