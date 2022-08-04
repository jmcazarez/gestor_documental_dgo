import { Component, OnDestroy, OnInit, Input, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { PerfilUsuariosModel } from '../../../../models/perfil-usuarios.model';
import { OpcionesSistemaModel } from '../../../../models/opciones-sistema.model';
import { PermisosUsuarioModel } from '../../../../models/permisos-usuarios.models';
import { TipoDocumentosModel } from '../../../../models/tipo-de-documentos.model';
import { VisibilidadModel } from '../../../../models/visibilidad.models';
import { Subject } from 'rxjs';
import { PerfilUsuariosService } from 'services/perfil-usuarios.service';
import { PermisosUsuarioService } from 'services/permisos-usuario.service';
import { PerfilUsuariosComponent } from '../perfil-usuarios.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { GuardarPermisosUsuariosComponent } from './guardar-permisos-usuarios/guardar-permisos-usuarios.component';
import { MatDialog } from '@angular/material/dialog';
import { UsuariosService } from 'services/usuarios.service';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
    selector: 'app-guardar-perfil-usuarios',
    templateUrl: './guardar-perfil-usuarios.component.html',
    styleUrls: ['./guardar-perfil-usuarios.component.scss']
})
export class GuardarPerfilUsuariosComponent implements OnInit {
    form: FormGroup;
    // Private
    private unsubscribeAll: Subject<any>;
    rows: OpcionesSistemaModel[] = [];
    rowsDocumentos = [];
    rowVisibilidad = [];
    rowUsuarios = [];
    rowsTemp = [];
    rowsDocumentosTemp = [];
    rowVisibilidadTemp = [];
    rowUsuariosTemp = [];
    loadingIndicator: boolean;
    reorderable: boolean;
    cargando: boolean;
    selectedDocumentos = false;
    selectedOpciones = false;
    selectedVisibilidad = false;
    selectedUsuarios = false;
    opcionesAgregar: any[] = [];
    public selected: any[] = [];
    buscadorOpciones = '';
    buscadorVisibilidad = '';
    buscadorUsuarios = '';
    buscadorDocumentos = '';
    /**
     * Constructor
     *
     * @param {FormBuilder} formBuilder
     */
    constructor(private formBuilder: FormBuilder,
        private dialogRef: MatDialogRef<PerfilUsuariosComponent>,
        private perfilUsuariosService: PerfilUsuariosService,
        private permisosUsuario: PermisosUsuarioService,
        private usuariosService: UsuariosService,
        private spinner: NgxSpinnerService,
        @Inject(MAT_DIALOG_DATA) public perfilUsuario: PerfilUsuariosModel,
        @Inject(MAT_DIALOG_DATA) public opcionesSistema: OpcionesSistemaModel[],
        @Inject(MAT_DIALOG_DATA) public tipoDocumentos: TipoDocumentosModel[],
        @Inject(MAT_DIALOG_DATA) public visibilidadModel: VisibilidadModel[],
        @Inject(MAT_DIALOG_DATA) public permisosUsuarios: PerfilUsuariosComponent[],
        public dialog2: MatDialog) { }

    async ngOnInit(): Promise<void> {
        this.spinner.show();
        if (!this.perfilUsuario.id) {
            this.perfilUsuario.bActivo = true;
        }
        //  this.perfilUsuario.bActivo = true;
        // Reactive Form
        this.form = this.formBuilder.group({
            nombre: [this.perfilUsuario.cNombrePerfil, [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
            estatus: [this.perfilUsuario.bActivo]
        });

        this.loadingIndicator = true;
        // Obtenemos las opciones del sistema
        await this.obtenerOpciones();
        // Obtenemos los tipos de documentos
        await this.obtenerTipoDocumentos();
        // Obtenemos las opciones de visibilidad
        await this.obtenerVisibilidad();
        // Obtenemos los usuarios
        await this.obtenerUsuarios();

        await this.guardarUsuariosPerfil();

        this.loadingIndicator = false;
        this.spinner.hide();
    }

    guardar(): void {
        this.perfilUsuario.cNombrePerfil = this.form.get('nombre').value;
        this.perfilUsuario.bActivo = this.form.get('estatus').value;
        this.perfilUsuario.Opciones = [];
        this.perfilUsuario.Documentos = [];
        this.perfilUsuario.Visibilidad = [];
        // LLenamos las opciones
        // tslint:disable-next-line: forin
        for (const i in this.rows) {

            if (this.rows[i].Agregar || this.rows[i].Editar || this.rows[i].Consultar || this.rows[i].Eliminar) {


                const val = {
                    cNombreOpcion: '', Agregar: this.rows[i].Agregar, Consultar: this.rows[i].Consultar, Editar: this.rows[i].Editar,
                    Eliminar: this.rows[i].Eliminar, opciones_del_sistema: this.rows[i].id
                };
                // Agregamos los elementos al objeto
                this.perfilUsuario.Opciones.push(val);

            }
        }
        // LLenamos los tipos de documentos
        // tslint:disable-next-line: forin
        for (const li in this.rowsDocumentos) {

            if (this.rowsDocumentos[li].Agregar || this.rowsDocumentos[li].Editar || this.rowsDocumentos[li].Consultar || this.rowsDocumentos[li].Eliminar) {

                const val = {
                    Agregar: this.rowsDocumentos[li].Agregar, Consultar: this.rowsDocumentos[li].Consultar, Editar: this.rowsDocumentos[li].Editar,
                    Eliminar: this.rowsDocumentos[li].Eliminar, tipo_de_documento: this.rowsDocumentos[li].id
                };
                // Agregamos los elementos al objeto
                this.perfilUsuario.Documentos.push(val);

            }
        }

        // Llenamos las opciones de visibilidad
        // tslint:disable-next-line: forin
        for (const lv in this.rowVisibilidad) {

            if (this.rowVisibilidad[lv].Si) {
                const val = {
                    Si: this.rowVisibilidad[lv].Si, visibilidade: this.rowVisibilidad[lv].id
                };
                // Agregamos los elementos al objeto
                this.perfilUsuario.Visibilidad.push(val);

            }
        }

        let idUsuario: string;
        this.perfilUsuario.usuarios = [];
        if (this.perfilUsuario.bActivo) {
            // tslint:disable-next-line: forin
            for (const i in this.rowUsuarios) {
                idUsuario = this.rowUsuarios[i].id;
                if (this.rowUsuarios[i].Agregar) {
                    this.perfilUsuario.usuarios.push(
                        this.rowUsuarios[i].id
                    );
                }
            }
        }
        // Si trae id se hace el update si no el put
        if (this.perfilUsuario.id && this.perfilUsuario.id.length > 0) {


            this.perfilUsuariosService.actualizarPerfilUsuarios(this.perfilUsuario).subscribe((resp: any) => {

                if (resp) {
                    Swal.fire('Éxito', 'El perfil se ha guardado correctamente.', 'success');
                    this.cerrar(true);
                } else {
                    Swal.fire('Error', 'Ocurrió un error al guardar.', 'error');
                }
            }, err => {
                console.log(err);
                if (err.error.error) {
                    Swal.fire('Error', 'Ocurrió un error al guardar.' + err.error.error, 'error');
                } else {
                    Swal.fire('Error', 'Ocurrió un error al guardar.' + err.error, 'error');
                }
            });
        } else {

            this.perfilUsuariosService.guardarPerfilUsuarios(this.perfilUsuario).subscribe((resp: any) => {

                if (resp) {
                    Swal.fire('Éxito', 'El perfil se ha guardado correctamente.', 'success');
                    this.cerrar(true);
                } else {
                    Swal.fire('Error', 'Ocurrió un error al guardar.', 'error');
                }
            }, err => {
                if (err.error.error) {
                    Swal.fire('Error', 'Ocurrió un error al guardar.' + err.error.error, 'error');
                } else {
                    Swal.fire('Error', 'Ocurrió un error al guardar.' + err.error, 'error');
                }
            });
        }
    }

    cerrar(guardado: boolean): void {
        this.dialogRef.close(guardado);
    }


    async obtenerOpciones(): Promise<void> {
        return new Promise(async (resolve) => {
            {
                this.buscadorOpciones = '';
                // Obtenemos opciones del sistema
                this.cargando = true;
                let perfilOpciones = [];
                await this.perfilUsuariosService.obtenerOpcionesSistema().subscribe((resp: any) => {

                    this.opcionesSistema = resp;
                    perfilOpciones = this.perfilUsuario.Opciones;
                    if (this.perfilUsuario.id && this.perfilUsuario.id.length > 0) {
                        // tslint:disable-next-line: forin
                        for (const i in this.opcionesSistema) {

                            for (const perfilOpcion of perfilOpciones) {
                                if (perfilOpcion.opciones_del_sistema) {
                                    if (perfilOpcion.opciones_del_sistema.id === this.opcionesSistema[i].id) {
                                        this.opcionesSistema[i].Agregar = perfilOpcion.Agregar;
                                        this.opcionesSistema[i].Consultar = perfilOpcion.Consultar;
                                        this.opcionesSistema[i].Editar = perfilOpcion.Editar;
                                        this.opcionesSistema[i].Eliminar = perfilOpcion.Eliminar;
                                    }
                                }
                            }
                        }
                        this.rows = this.opcionesSistema;
                        this.rowsTemp = this.rows;

                        resolve(resp)
                    } else {
                        this.rows = this.opcionesSistema;
                        this.rowsTemp = this.rows;

                        resolve(resp)
                    }
                    this.cargando = false;
                }, err => {
                    this.cargando = false;

                    resolve(err)
                });
            }
        });
    }

    async obtenerTipoDocumentos(): Promise<void> {
        return new Promise(async (resolve) => {
            {

                // Obtenemos los tipos de documentos
                this.cargando = true;
                let perfilDocumentos = [];
                await this.perfilUsuariosService.obtenerTipoDocumentos().subscribe((resp: any) => {

                    this.tipoDocumentos = resp;
                    perfilDocumentos = this.perfilUsuario.Documentos;
                    if (this.perfilUsuario.id && this.perfilUsuario.id.length > 0) {
                        // tslint:disable-next-line: forin
                        for (const i in this.tipoDocumentos) {

                            for (const perfilDocumento of perfilDocumentos) {
                                if (perfilDocumento.tipo_de_documento) {
                                    if (perfilDocumento.tipo_de_documento.id === this.tipoDocumentos[i].id) {
                                        this.tipoDocumentos[i].Agregar = perfilDocumento.Agregar;
                                        this.tipoDocumentos[i].Consultar = perfilDocumento.Consultar;
                                        this.tipoDocumentos[i].Editar = perfilDocumento.Editar;
                                        this.tipoDocumentos[i].Eliminar = perfilDocumento.Eliminar;
                                    }
                                }
                            }
                        }
                        this.rowsDocumentos = this.tipoDocumentos;
                        this.rowsDocumentosTemp = this.rowsDocumentos;

                        resolve(resp)
                    } else {
                        this.rowsDocumentos = this.tipoDocumentos;
                        this.rowsDocumentosTemp = this.rowsDocumentos;

                        resolve(resp)
                    }
                    this.cargando = false;
                }, err => {
                    this.cargando = false;

                    resolve(err)
                });
            }
        });
    }

    async obtenerVisibilidad(): Promise<void> {
        return new Promise(async (resolve) => {
            {

                // Obtenemos opciones de visibilidad
                this.loadingIndicator = true;
                let visibilidad = [];
                await this.perfilUsuariosService.obtenerVisibilidad().subscribe((resp: any) => {

                    this.visibilidadModel = resp;
                    visibilidad = this.perfilUsuario.Visibilidad;
                    if (this.perfilUsuario.id && this.perfilUsuario.id.length > 0) {
                        // tslint:disable-next-line: forin
                        for (const i in this.visibilidadModel) {

                            for (const vis of visibilidad) {
                                if (vis.visibilidade) {
                                    if (vis.visibilidade.id === this.visibilidadModel[i].id) {
                                        this.visibilidadModel[i].Si = vis.Si;
                                    }
                                }
                            }
                        }
                        this.rowVisibilidad = this.visibilidadModel;
                        this.rowVisibilidadTemp = this.rowVisibilidad;
                      
                        resolve(resp)
                    } else {
                        this.rowVisibilidad = this.visibilidadModel;
                        this.rowVisibilidadTemp = this.rowVisibilidad;

                        resolve(resp)
                    }
                    this.loadingIndicator = false;
                }, err => {
                    this.loadingIndicator = false;

                    resolve(err)
                });
            }
        });
    }

    async obtenerUsuarios(): Promise<void> {
        return new Promise(async (resolve) => {
            {

                let idUsuario: string;
                this.cargando = true;
                let respuesta: any;
                // Obtenemos usuarios
                await this.usuariosService.obtenerUsuariosPerfil().subscribe((resp: any) => {
                   
                    respuesta = resp.data.filter((d) => d.bActivo === true);;
                    if (this.perfilUsuario.id && this.perfilUsuario.id.length > 0) {
                        // tslint:disable-next-line: forin
                        for (const i in respuesta) {
                            idUsuario = respuesta[i]['_id'];

                            const resultado = respuesta[i]['perfiles_de_usuarios'].find((perfil: { id: string; }) => perfil.id === this.perfilUsuario.id);
                            if (resultado) {
                                respuesta[i].Agregar = true;
                            } else {
                                respuesta[i].Agregar = false;
                            }

                        }
                    }


                    this.rowUsuarios = respuesta;
                    this.rowUsuariosTemp = this.rowUsuarios;
                    this.cargando = false;

                    resolve(resp)
                }, err => {
                    this.cargando = false;

                    resolve(err)
                });
            }
        });
    }
    async nuevoPermisoUsuario(): Promise<void> {

        // abrimos modal de permisos 
        const dialogRef = this.dialog2.open(GuardarPermisosUsuariosComponent, {
            width: '60%',
            // height: '75%',
            // height: '100%',
     
            disableClose: true,
            data: new PermisosUsuarioModel(),
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result === 1) {
                this.obtenerOpciones();
            } else if (result === 2) { this.obtenerTipoDocumentos(); } else if (result === 3) {
                this.obtenerVisibilidad();
            }
        });
    }

    guardarOpcion(permisosUsuario: PermisosUsuarioModel): void {
        // abrimos modal de permisos         
        permisosUsuario.idTipoPermiso = 'Opcion del sistema';
      
        const dialogRef = this.dialog2.open(GuardarPermisosUsuariosComponent, {
            width: '60%',
            // height: '75%',
            // height: '100%',
            disableClose: true,
            data: permisosUsuario,
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result === 1) {
                this.obtenerOpciones();
            } else if (result === 2) { this.obtenerTipoDocumentos(); } else if (result === 3) {
                this.obtenerVisibilidad();
            }
        });
    }

    guardarTipoDocumento(row): void {

        const permisosUsuario: PermisosUsuarioModel = new PermisosUsuarioModel();
        permisosUsuario.idTipoPermiso = 'Tipo de documento';
        permisosUsuario.cNombreOpcion = row['cDescripcionTipoDocumento'];
        permisosUsuario.id = row['id'];
        permisosUsuario.bActivo = row['bActivo'];
        const dialogRef = this.dialog2.open(GuardarPermisosUsuariosComponent, {
            width: '60%',
            // height: '75%',
            // height: '100%',
            disableClose: true,
            data: permisosUsuario,
        });

        dialogRef.afterClosed().subscribe(result => {
            this.buscadorOpciones = '';
            this.buscadorVisibilidad = '';
            this.buscadorUsuarios = '';
            this.buscadorDocumentos = '';
            if (result === 1) {
                this.obtenerOpciones();
            } else if (result === 2) { this.obtenerTipoDocumentos(); } else if (result === 3) {
                this.obtenerVisibilidad();
            }
        });
    }

    guardarVisibilidad(row: any): void {
        // abrimos modal de permisos 


        const permisosUsuario: PermisosUsuarioModel = new PermisosUsuarioModel();
        permisosUsuario.id = row['id'];
        permisosUsuario.idTipoPermiso = 'Visibilidad';
        permisosUsuario.cNombreOpcion = row['cDescripcionVisibilidad'];
        permisosUsuario.bActivo = row['bActivo'];

        const dialogRef = this.dialog2.open(GuardarPermisosUsuariosComponent, {
            width: '60%',
            // height: '75%',
            // height: '100%',
            disableClose: true,
            data: permisosUsuario,
        });

        dialogRef.afterClosed().subscribe(result => {
            this.buscadorOpciones = '';
            this.buscadorVisibilidad = '';
            this.buscadorUsuarios = '';
            this.buscadorDocumentos = '';
            if (result === 1) {
                this.obtenerOpciones();
            } else if (result === 2) { this.obtenerTipoDocumentos(); } else if (result === 3) {
                this.obtenerVisibilidad();
            }
        });
    }

    async guardarUsuariosPerfil(): Promise<string> {
        return new Promise(async (resolve) => {
            {


                let idUsuario: string;
                this.perfilUsuario.usuarios = [];
                // tslint:disable-next-line: forin
                for (const i in this.rowUsuarios) {
                    idUsuario = this.rowUsuarios[i].id;
                    if (this.rowUsuarios[i].Agregar) {
                        this.perfilUsuario.usuarios.push(
                            this.perfilUsuario.id
                        );
                    }
                }
                this.buscadorOpciones = '';
                this.buscadorVisibilidad = '';
                this.buscadorUsuarios = '';
                this.buscadorDocumentos = '';
                resolve(idUsuario)
            }
        });
    }

    eliminarOpcion(permisosUsuario: PermisosUsuarioModel): void {

        // Eliminamos perfil de usuario
        Swal.fire({
            title: '¿Está seguro que desea eliminar esta opción del sistema?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Si',
            cancelButtonText: 'No'
        }).then((result) => {
            if (result.value) {
                this.cargando = true;

                // realizamos delete
                this.permisosUsuario.eliminarOpcionSistema(permisosUsuario.id).subscribe((resp: any) => {
                    Swal.fire('Eliminado', 'La opcion del sistema ha sido eliminada.', 'success');
                    this.obtenerOpciones();
                }, err => {
                    this.cargando = false;
                    Swal.fire(
                        'Error',
                        'Ocurrió un error al eliminar la opcion del sistema.' + err,
                        'error'
                    );
                });

            }
        });

    }

    eliminarTipoDocumento(permisosUsuario: PermisosUsuarioModel): void {
        // Eliminamos perfil de usuario
        Swal.fire({
            title: '¿Está seguro que desea eliminar este tipo de documento?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Si',
            cancelButtonText: 'No'
        }).then((result) => {
            if (result.value) {
                this.cargando = true;

                // realizamos delete
                this.permisosUsuario.eliminarTipoDocumento(permisosUsuario.id).subscribe((resp: any) => {
                    Swal.fire('Eliminado', 'El tipo de documento ha sido eliminada.', 'success');
                    this.obtenerTipoDocumentos();
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

    eliminarVisibilidad(permisosUsuario: PermisosUsuarioModel): void {
        // Eliminamos tipo de visibilidad
        Swal.fire({
            title: '¿Está seguro que desea eliminar este tipo de información?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Si',
            cancelButtonText: 'No'
        }).then((result) => {
            if (result.value) {
                this.cargando = true;

                // realizamos delete
                this.permisosUsuario.eliminarVisibilidad(permisosUsuario.id).subscribe((resp: any) => {
                    Swal.fire('Eliminado', 'El tipo de información ha sido eliminada.', 'success');
                    this.obtenerVisibilidad();
                }, err => {
                    this.cargando = false;
                    Swal.fire(
                        'Error',
                        'Ocurrió un error al eliminar el tipo de información.' + err,
                        'error'
                    );
                });

            }
        });

    }

    seleccionarTipoDocumento(): void {
        this.rowsDocumentos.forEach(element => {
            if (!this.selectedDocumentos) {
                element.Agregar = true;
                element.Editar = true;
                element.Consultar = true;
                element.Eliminar = true;
            } else {
                element.Agregar = false;
                element.Editar = false;
                element.Consultar = false;
                element.Eliminar = false;
            }
        });
    }


    seleccionarOpciones(): void {
        this.rows.forEach(element => {
            if (!this.selectedOpciones) {
                element.Agregar = true;
                element.Editar = true;
                element.Consultar = true;
                element.Eliminar = true;
            } else {
                element.Agregar = false;
                element.Editar = false;
                element.Consultar = false;
                element.Eliminar = false;
            }
        });
    }

    seleccionarVisibilidad(): void {
        this.rowVisibilidad.forEach(element => {
            if (!this.selectedVisibilidad) {
                element.Si = true;
            } else {
                element.Si = false;
            }
        });
    }

    seleccionarUsuarios(): void {
        this.rowUsuarios.forEach(element => {
            if (!this.selectedUsuarios) {
                element.Agregar = true;
            } else {
                element.Agregar = false;
            }
        });
    }

    filterVisibilidad(value): void {
        this.rowVisibilidad = this.rowVisibilidadTemp;
        // Filtramos tabla
        if (value.target.value === '') {
            this.rowVisibilidad = this.rowVisibilidadTemp;
        } else {
            const val = value.target.value.toLowerCase();
            const temp = this.rowVisibilidad.filter((d) => d.cDescripcionVisibilidad.toLowerCase().indexOf(val) !== -1 || !val);
            this.rowVisibilidad = temp;
        }
    }

    filterOpciones(value): void {
        this.rows = this.rowsTemp;
        // Filtramos tabla
        if (value.target.value === '') {
            this.rows = this.rowsTemp;
        } else {
            const val = value.target.value.toLowerCase();
            const temp = this.rows.filter((d) => d.cNombreOpcion.toLowerCase().indexOf(val) !== -1 || !val);
            this.rows = temp;
        }
    }


    filterDocumentos(value): void {
        this.rowsDocumentos = this.rowsDocumentosTemp;
        // Filtramos tabla
        if (value.target.value === '') {
            this.rowsDocumentos = this.rowsDocumentosTemp;
        } else {
            const val = value.target.value.toLowerCase();
            const temp = this.rowsDocumentos.filter((d) => d.cDescripcionTipoDocumento.toLowerCase().indexOf(val) !== -1 || !val);
            this.rowsDocumentos = temp;
        }
    }

    filterUsuarios(value): void {
        this.rowUsuarios = this.rowUsuariosTemp;
        // Filtramos tabla
        if (value.target.value === '') {
            this.rowUsuarios = this.rowUsuariosTemp;
        } else {
            const val = value.target.value.toLowerCase();
            const temp = this.rowUsuarios.filter((d) => d.cNombre.toLowerCase().indexOf(val) !== -1 || !val);
            this.rowUsuarios = temp;
        }
    }

    editarCheck(row: any): void {

        if (row.Editar || row.Eliminar) {
            const index = this.rowsDocumentos.findIndex(documento => documento.id === row.id);
            this.rowsDocumentos[index].Consultar = true;
        }
    }

    editarOpcionesCheck(row: any): void {

        if (row.Editar || row.Eliminar) {
            const index = this.rows.findIndex(opciones => opciones.id === row.id);
            this.rows[index].Consultar = true;
        }
    }

    clickOpcion(): void {

        this.rows = [...this.rows];
        this.rowsDocumentos = [...this.rowsDocumentos];
        this.rowVisibilidad = [...this.rowVisibilidad];
        this.rowUsuarios = [...this.rowUsuarios];
        this.rowsTemp = [...this.rowsTemp];
        this.rowsDocumentosTemp = [...this.rowsDocumentosTemp];
        this.rowVisibilidadTemp = [...this.rowVisibilidadTemp];
        this.rowUsuariosTemp = [...this.rowUsuariosTemp];
    }

    validaEstatus(): void {
        if (this.form.get('estatus').value) {
            this.perfilUsuario.bActivo = false;
            this.perfilUsuario.usuarios = [];

        } else {
            this.perfilUsuario.bActivo = true;
        }

    }
}
