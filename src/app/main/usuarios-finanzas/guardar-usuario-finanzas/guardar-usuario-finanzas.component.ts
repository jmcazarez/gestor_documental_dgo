import { Component, OnDestroy, OnInit, Input, Inject, ɵConsole, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { Subject } from 'rxjs';
import { UsuarioModel } from 'models/usuario.models';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UsuariosFinanzasComponent } from '../usuarios-finanzas.component';
import { UsuariosService } from 'services/usuarios.service';
import { UploadFileService } from 'services/upload.service';
import Swal from 'sweetalert2';
import { PerfilUsuariosService } from 'services/perfil-usuarios.service';
import { OpcionesSistemaModel } from 'models/opciones-sistema.model';
import { environment } from '../../../../environments/environment';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { NgxSpinnerService } from 'ngx-spinner';
import { EmpleadosDelCongresoService } from 'services/empleados-del-congreso.service';
import { UsuarioFinanzasModel } from 'models/usuario-finanzas.models';
@Component({
    selector: 'guardar-usuario',
    templateUrl: './guardar-usuario-finanzas.component.html',
    styleUrls: ['./guardar-usuario-finanzas.component.scss']
})
export class GuardarUsuarioFinanzasComponent implements OnInit, OnDestroy {
    @ViewChild('fileInput', { static: false }) fileInput: ElementRef;
    form: FormGroup;
    passwordConfirm: string;
    activo: boolean;
    selectedSecretaria: any;
    selectedDireccion: any;
    selectedDepartamento: any;
    selectedEmpleado: any;
    arrSecretarias: any[] = [];;
    arrDirecciones: any[];
    arrDireccionesFilter: any[];
    arrDepartamentos: any[];
    arrDepartamentosFilter: any[];
    arrEmpleados: any[];
    rows: OpcionesSistemaModel[] = [];
    rowsTemp: OpcionesSistemaModel[] = [];
    rowsPermisos: any[] = [];
    rowsPermisosTemp: any[] = [];
    loadingIndicator: boolean;
    reorderable: boolean;
    cargando: boolean;
    busqueda: string;
    imageURL: any;
    urlCms: string;
    cambioImagen: boolean;
    selectedUsuarios: boolean;
    selectedPermiso: boolean;
    noIguales: boolean;
    passNoIgual: boolean;
    valueBuscador = '';
    type = '';
    // Private
    private unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {FormBuilder} formBuilder
     */
    constructor(
        private empleadosService: EmpleadosDelCongresoService,
        private formBuilder: FormBuilder,
        private dialogRef: MatDialogRef<UsuariosFinanzasComponent>,
        private usuariosService: UsuariosService,
        private perfilUsuariosService: PerfilUsuariosService,
        private uploadFile: UploadFileService,
        private spinner: NgxSpinnerService,
        @Inject(MAT_DIALOG_DATA) public usuario: UsuarioFinanzasModel
    ) {
        // Set the private defaults
        this.unsubscribeAll = new Subject();
        this.passwordConfirm = usuario.cPassword;
        this.urlCms = environment.apiStrapiMin;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    async ngOnInit(): Promise<void> {
        this.noIguales = false;
        this.passNoIgual = false;
        this.type = 'password';
        this.spinner.show();
        // Reactive Form
        this.arrSecretarias = [];
        this.arrDepartamentos = [];
        this.arrDirecciones = [];
        // this.arrDirecciones = [];
        this.selectedSecretaria = '';
        this.selectedDireccion = '';
        this.selectedDepartamento = '';
        this.rows = [];
        //this.imageURL = '';

        // Seteamos valores
        if (this.usuario.secretaria) {
            this.selectedSecretaria = this.usuario.secretaria.id;
        }
        // Seteamos valores
        if (this.usuario.departamento) {
            this.selectedDepartamento = this.usuario.departamento.id;
        }

        // Seteamos valores
        if (this.usuario.direccione) {
            this.selectedDireccion = this.usuario.direccione.id;
        }

        // Seteamos valores
        if (this.usuario.empleado) {
            this.selectedEmpleado = this.usuario.empleado.id;

        }
        // (?=^.{8,}$)((?=.*\\d)|(?=.*\\W+))(?![.\\n])(?=.*[A-Z])(?=.*[a-z]).*$"
        // (?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@#$%¡¿_:;=?&])[A-Za-z\d@$!%*?&*-¡¿_:;=].{8,}'
        // Form reativo
        this.form = this.formBuilder.group({
            nombre: [this.usuario.cNombre, [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
            primerApellido: [this.usuario.cApellidoPaterno, [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
            segundoApellido: [this.usuario.cApellidoMaterno],
            usuario: [this.usuario.cUsuario, [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
            password: [this.usuario.cPassword, [Validators.required, Validators.pattern("(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@#$%¡¿_:;=?&])[A-Za-z\d@$!%*?&*-¡¿_:;=].{8,}"), Validators.maxLength(100), confirmPasswordValidator]],
            passwordConfirm: [this.passwordConfirm, [Validators.required, Validators.pattern("(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@#$%¡¿_:;=?&])[A-Za-z\d@$!%*?&*-¡¿_:;=].{8,}"), Validators.maxLength(100), confirmPasswordValidator]],
            correo: [this.usuario.cCorreo, [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],

            telefono: [this.usuario.cTelefono, [RxwebValidators.mask({ mask: '(999)-999 9999' }), Validators.required]],
            estatus: [this.usuario.bActivo],
            secretarias: [this.usuario.secretaria, [Validators.required]],
            direcciones: [this.usuario.direccione, [Validators.required]],
            departamentos: [this.usuario.departamento, [Validators.required]],
            perfiles: [this.rows],
            avatar: [null],
            administrador: [this.usuario.administrador],
          /*   empleado: [this.usuario.empleado] */
            //   imagen        : [this.usuario.cPassword,[Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
        });

        // deshabilitamos selects
        this.form.controls['direcciones'].disable();
        this.form.controls['departamentos'].disable();
        if (this.usuario.id && this.usuario.id.length > 0) {
            // si vamos a editar traemos toda la informacion del usuario
            await this.obtenerUsuarioById();
            await this.descargarUsuarioLogo();
        }



        // Obtenemos los perfiles de usuarios
        await this.obtenerPerfiles();
        // Obtenemos las direcciones
        await this.obtenerDirecciones();
        // Obtenemos las secretarias
        await this.obtenerSecretarias();
        // Obtenemos los departamentos
        await this.obtenerDepartamentos();
        // Obtenermos los empleados
        await this.obtenerEmpleados();

        await this.obtenerPermisosIniciativas();

        if (this.arrDirecciones.length === 0) {
            this.form.get('direcciones').clearValidators();
            this.form.get('direcciones').updateValueAndValidity();
            this.form.get('departamentos').clearValidators();
            this.form.get('departamentos').updateValueAndValidity();
            this.arrDepartamentos = [];

            this.arrDepartamentos = [...this.arrDepartamentos];

            console.log('entro');
        } else {
            this.form.get('direcciones').setValidators([Validators.required]);
            this.form.get('direcciones').updateValueAndValidity();
        }

        if (this.arrDepartamentos.length === 0) {
            this.form.get('departamentos').clearValidators();
            this.form.get('departamentos').updateValueAndValidity();
        } else {
            this.form.get('departamentos').setValidators([Validators.required]);
            this.form.get('departamentos').updateValueAndValidity();
        }

        // Si el valor cambia filtramos el resultado
        this.form.get('secretarias').valueChanges.subscribe(val => {

            if (val.length > 0) {

                this.form.controls['direcciones'].enable();
                if (this.arrDireccionesFilter) {
                    this.arrDirecciones = this.arrDireccionesFilter.filter(item => item['secretariaId'] === val);

                    if (this.arrDirecciones.length === 0) {
                        this.form.get('direcciones').clearValidators();
                        this.form.get('direcciones').updateValueAndValidity();

                        this.form.get('departamentos').clearValidators();
                        this.form.get('departamentos').updateValueAndValidity();

                        this.arrDepartamentos = [];
                    } else {
                        this.form.get('direcciones').setValidators([Validators.required]);
                        this.form.get('direcciones').updateValueAndValidity();
                    }
                }
                this.selectedDepartamento = '';
            }
        });

        // Si el valor cambia filtramos el resultado
        this.form.get('direcciones').valueChanges.subscribe(val => {

            if (val.length > 0) {

                this.form.controls['departamentos'].enable();
                if (this.arrDepartamentosFilter) {
                    this.arrDepartamentos = this.arrDepartamentosFilter.filter(item => item['direccionId'] === val);
                    console.log(this.arrDepartamentos)

                    if (this.arrDirecciones.length === 0) {
                        this.arrDepartamentos = [];

                        this.arrDepartamentos = [...this.arrDepartamentos];

                    }
                    if (this.arrDepartamentos.length === 0) {
                        this.form.get('departamentos').clearValidators();
                        this.form.get('departamentos').updateValueAndValidity();
                    } else {
                        this.form.get('departamentos').setValidators([Validators.required]);
                        this.form.get('departamentos').updateValueAndValidity();
                    }
                }
            }
        });

        // Si el valor cambia filtramos el resultado
        this.form.get('passwordConfirm').valueChanges.subscribe(val => {

            if (val.length > 0) {


                if (val === this.form.get('password').value) {
                    if (this.form.controls['password'].hasError('passwordsNotMatching')) {
                        delete this.form.controls['password'].errors['passwordsNotMatching'];
                        this.form.controls['password'].updateValueAndValidity();
                    }
                }

                console.log(this.form.controls)

            }
        });

        // Si el valor cambia filtramos el resultado

        this.form.get('password').valueChanges.subscribe(val => {
            if (val.length > 0) {


                if (val === this.form.get('passwordConfirm').value) {
                    if (this.form.controls['passwordConfirm'].hasError('passwordsNotMatching')) {
                        delete this.form.controls['passwordConfirm'].errors['passwordsNotMatching'];
                        this.form.controls['passwordConfirm'].updateValueAndValidity();
                    }
                }


            }
        });

        // Si el usuario trae id entonces vamos a editar por lo que ponemos enabled los select
        if (this.usuario.id && this.usuario.id.length > 0) {

            if (this.selectedSecretaria.length > 0) {
                this.form.controls['direcciones'].enable();
            }

            if (this.selectedDepartamento.length > 0) {
                this.form.controls['departamentos'].enable();
            }
        }
        this.spinner.hide();
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this.unsubscribeAll.next();
        this.unsubscribeAll.complete();
    }

    cerrar(guardado: boolean): void {
        this.dialogRef.close(guardado);
    }

    async guardar(): Promise<void> {
        let arrPermisosIniciativas = [];
        this.spinner.show();
        this.cargando = true;

        if (this.form.get('password').value != this.form.get('passwordConfirm').value) {
            Swal.fire('Error', 'Ocurrió un error al guardar. La contraseña es diferente a su confirmación.', 'error');
            this.spinner.hide();
        } else {


            // actualiza los campos del usuario
            this.usuario.cUsuario = this.form.get('usuario').value;
            this.usuario.cNombre = this.form.get('nombre').value;
            this.usuario.cApellidoPaterno = this.form.get('primerApellido').value;
            this.usuario.cApellidoMaterno = this.form.get('segundoApellido').value;
            this.usuario.cPassword = this.form.get('password').value;
            this.usuario.cTelefono = this.form.get('telefono').value;
            this.usuario.cCorreo = this.form.get('correo').value;
            this.usuario.bActivo = this.form.get('estatus').value;
            this.usuario.administrador = this.form.get('administrador').value;
            this.usuario.secretaria = this.form.get('secretarias').value;
            this.usuario.direccione = this.form.get('direcciones').value;
            this.usuario.departamento = this.form.get('departamentos').value;
           /*  this.usuario.empleado = this.form.get('empleado').value; */
            this.usuario.perfiles_de_usuarios = [];
            let permisosIniciativas = this.rowsPermisos.filter( val => val.Agregar === true);
            if(permisosIniciativas.length > 0){
                permisosIniciativas.forEach(val =>{
                    arrPermisosIniciativas.push(val.id);
                });

                this.usuario.permisos_de_iniciativas = arrPermisosIniciativas;
            }else{
                this.usuario.permisos_de_iniciativas = [];
            }

           
            if (this.usuario.secretaria === "") {
                this.usuario.secretaria = null;
            }

            if (this.usuario.direccione === "") {
                this.usuario.direccione = null;
            }

            if (this.usuario.departamento === "") {
                this.usuario.departamento = null;
            }

            if (this.usuario.empleado === "") {
                this.usuario.empleado = null;
            }
            if (this.usuario.bActivo) {
                this.rows.forEach(element => {
                    if (element.Agregar) {
                        this.usuario.perfiles_de_usuarios.push(element.id);
                    }
                });
            }
            // Si el usuario capturo imagen realizamos el post de la imagen
            if (this.imageURL && this.cambioImagen) {
                const file = this.form.get('avatar').value;
                let base64 = await this.readAsDataURL(file);

                const resp = await this.uploadFile.subirArchivo(file, base64['data']);
                if (!resp) {
                    this.cargando = false;
                    Swal.fire('Error', 'Ocurrió un error al guardar el avatar.', 'error');
                    this.spinner.hide();
                } else {
                    // La peticion nos retorna el id de la imagen y lo seteamos al usuario

                    if (resp[0].id) {
                        this.usuario.cImagen = resp[0].id;
                    } else {
                        this.cargando = false;
                        this.spinner.hide();
                        Swal.fire('Error', 'Ocurrió un error al guardar el avatar.', 'error');
                    }


                }
            }

          

            delete this.usuario['cImagen']
            delete this.usuario['empleado']
            
            // Si el usuario trae id actualizamos de lo contrario guardamos uno nuevo
            if (this.usuario.id && this.usuario.id.length > 0) {

                this.usuariosService.actualizarUsuario(this.usuario).subscribe((resp: any) => {
                    this.cargando = false;
                    Swal.fire('Éxito', 'El usuario se ha actualizado correctamente.', 'success');
                    this.cerrar(true);
                    this.spinner.hide();
                }, err => {
                    this.cargando = false;
                    Swal.fire('Error', 'Ocurrió un error al actualizar.' + JSON.stringify(err.error.error), 'error');
                    this.spinner.hide();
                });
            } else {
                this.usuariosService.guardarUsuario(this.usuario).subscribe((resp: any) => {
                    this.cargando = false;
                    if (resp) {
                        Swal.fire('Éxito', 'El usuario se ha guardado correctamente.', 'success');
                        this.cerrar(true);
                        this.spinner.hide();
                    } else {
                        this.cargando = false;
                        Swal.fire('Error', 'Ocurrió un error al guardar.', 'error');
                        this.spinner.hide();
                    }
                }, err => {
                    this.cargando = false;
                    Swal.fire('Error', 'Ocurrió un error al guardar.' + JSON.stringify(err.error.error), 'error');
                    this.spinner.hide();
                });
            }
        }

    }

    async obtenerSecretarias(): Promise<void> {
        return new Promise(async (resolve) => {
            {
                // Obtenemos secretarias
                const secretariasTemp: any[] = [];
                this.cargando = true;
                await this.usuariosService.obtenerSecretarias().subscribe((resp: any) => {

                    for (const secretaria of resp) {

                        if (secretaria.bActivo) {
                            //    if (this.arrDireccionesFilter.filter(item => item['secretariaId'] === secretaria.id).length > 0) {
                            secretariasTemp.push({
                                id: secretaria.id,
                                cDescripcionSecretaria: secretaria.cDescripcionSecretaria,
                                direcciones: secretaria.direccionesActivas,
                                bActivo: secretaria.bActivo
                            });

                            // }

                        }

                    }
                    this.arrSecretarias = secretariasTemp;

                    this.cargando = false;
                    resolve(resp)
                }, err => {
                    this.cargando = false;
                    resolve(err)
                });
            }
        });
    }

    async obtenerDirecciones(): Promise<void> {
        return new Promise(async (resolve) => {
            {
                const direccionesTemp: any[] = [];
                this.cargando = true;
                // Obtenemos direcciones
                await this.usuariosService.obtenerDirecciones().subscribe((resp: any) => {

                    for (const direccion of resp) {
                        if (direccion.bActivo && direccion.secretariaId) {
                            //  if (direccion.departamentos.length > 0) {
                            direccionesTemp.push({
                                id: direccion.id,
                                cDescripcionDireccion: direccion.cDescripcionDireccion,
                                bActivo: direccion.bActivo,
                                secretariaId: direccion.secretariaId,
                                departamentos: direccion.departamentos
                            });
                            // }
                        }

                    }
                    this.arrDirecciones = direccionesTemp;
                    this.arrDireccionesFilter = direccionesTemp;

                    // Si tenemos informacion ya guardada filtramos
                    if (this.selectedSecretaria) {
                        this.arrDirecciones = this.arrDireccionesFilter.filter(item => item['secretariaId'] === this.selectedSecretaria);
                    }
                    this.cargando = false;
                    resolve(resp)
                }, err => {
                    this.cargando = false;
                    resolve(err)
                });
            }
        })
    }

    async obtenerEmpleados(): Promise<void> {
        return new Promise(async (resolve) => {
            {
                const direccionesTemp: any[] = [];
                this.cargando = true;
                // Obtenemos direcciones
                await this.empleadosService.obtenerEmpleados().subscribe((resp: any) => {
                    this.arrEmpleados = resp;
                    // this.arrEmpleados = resp;
                    this.cargando = false;
                    resolve(resp)
                }, err => {
                    this.cargando = false;
                    resolve(err)
                });
            }
        })
    }
    async obtenerDepartamentos(): Promise<void> {
        return new Promise(async (resolve) => {
            {
                this.cargando = true;
                // Obtenemos departamentos
                const departamentosTemp: any[] = [];
                this.usuariosService.obtenerDepartamentos().subscribe((resp: any) => {

                    for (const departamentos of resp) {

                        if (departamentos.bActivo && departamentos.direccionId) {
                            //  if (this.arrDireccionesFilter.filter(item => item['id'] === departamentos.direccionId).length > 0) {
                            departamentosTemp.push({
                                id: departamentos.id,
                                cDescripcionDepartamento: departamentos.cDescripcionDepartamento,
                                bActivo: departamentos.bActivo,
                                direccionId: departamentos.direccionId
                            });
                            // }
                        }

                    }
                    this.arrDepartamentos = departamentosTemp;
                    this.arrDepartamentosFilter = departamentosTemp;
                    // Si tenemos informacion ya guardada filtramos
                    if (this.selectedDireccion) {
                        this.arrDepartamentos = this.arrDepartamentosFilter.filter(item => item['direccionId'] === this.selectedDireccion);
                    }

                    this.cargando = false;
                    resolve(resp)
                }, err => {
                    this.cargando = false;
                    resolve(err)
                });
            }
        })
    }


    async obtenerUsuarioById(): Promise<void> {
        this.cargando = true;
        //let url: string;
        // Obtenemos usuarios por id
        this.usuariosService.obtenerUsuario(this.usuario.id).subscribe((resp: any) => {

            this.usuario = resp;

            // Setemos informacion
            if (this.usuario.departamento) {
                this.selectedDepartamento = this.usuario.departamento.id;
            }
            if (this.usuario.direccione) {
                this.selectedDireccion = this.usuario.direccione.id;

            }
            if (this.usuario.secretaria) {
                this.selectedSecretaria = this.usuario.secretaria.id;
            }

            if (this.usuario.cImagen) {

                // url = this.urlCms + this.usuario.cImagen['url'];

                // this.imageURL = url.replace('//', '/');
                // this.sanitizer.bypassSecurityTrustResourceUrl(this.urlCms + this.usuario.cImagen['url']);

                // this.imageURL = this.urlCms + this.usuario.cImagen['url'];
            }

            this.cargando = false;
        }, err => {
            this.cargando = false;
        });
    }

    async obtenerPerfiles(): Promise<void> {
        return new Promise(async (resolve) => {
            {
                this.cargando = true;
                // Obtenemos perfiles de usuario
                this.perfilUsuariosService.obtenerPerfilesUsuarios().subscribe((resp: any) => {

                    // tslint:disable-next-line: forin
                    for (const i in resp) {

                        if (this.usuario.id && this.usuario.id.length > 0) {
                            // Filtramos los perfiles si ya tiene informacion guardada
                            // tslint:disable-next-line: no-unused-expression
                            const resultado = this.usuario['perfiles_de_usuarios'].find((usuario: { id: string; }) => usuario.id === resp[i].id);
                            if (resultado) {
                                resp[i].Agregar = true;
                            } else {
                                resp[i].Agregar = false;
                            }

                        } else {
                            resp[i].Agregar = false;
                        }
                    }

                    resp.forEach(element => {
                        if (element.bActivo) {
                            this.rows.push(element);
                        }
                    });
                    this.rows = [...this.rows];
                    this.rowsTemp = this.rows;
                    this.cargando = false;
                    resolve(resp)
                }, err => {
                    this.cargando = false;
                    resolve(err)
                });
            }
        })
    }

    async obtenerPermisosIniciativas(): Promise<void> {
        return new Promise(async (resolve) => {
            {
                this.cargando = true;
                // Obtenemos perfiles de usuario
                this.perfilUsuariosService.obtenerPermisosIniciativas().subscribe((resp: any) => {


                    resp.data.forEach(element => {
                        let agregar: boolean = false;
                        let permisoAgregar = element.usuarios.filter(val => {
                            return val.id === this.usuario.id
                        }).length
                        if (permisoAgregar === 1) {
                            agregar = true;
                        }
                        this.rowsPermisos.push({
                            id: element.id,
                            permiso: element.permiso,
                            Agregar: agregar
                        });
                    });

                    this.rowsPermisos = [...this.rowsPermisos];
                    this.rowsPermisosTemp = this.rowsPermisos;
                    this.cargando = false;
                    resolve(resp)
                }, err => {
                    this.cargando = false;
                    resolve(err)
                });
            }
        })
    }

    showPreview(event: { target: HTMLInputElement; }): void {
        // Si selecciona una imagen realizamos el seteo
        this.cambioImagen = true;
        const file = (event.target as HTMLInputElement).files[0];
        this.form.patchValue({
            avatar: file
        });

        this.form.get('avatar').updateValueAndValidity();

        // Imagen Preview
        const reader = new FileReader();
        reader.onload = () => {
            this.imageURL = reader.result as string;
        };
        reader.readAsDataURL(file);
    }

    seleccionarUsuarios(): void {
        this.rows.forEach(element => {
            if (!this.selectedUsuarios) {
                element.Agregar = true;
            } else {
                element.Agregar = false;
            }
        });

    }

    seleccionaPermiso(): void {
        this.rowsPermisos.forEach(element => {
            if (!this.selectedPermiso) {
                element.Agregar = true;
            } else {
                element.Agregar = false;
            }
        });

    }
    filterUsuarios(value): void {
        this.rows = this.rowsTemp;
        // Filtramos tabla
        if (value.target.value === '') {
            this.rows = this.rowsTemp;
        } else {
            const val = value.target.value.toLowerCase();
            const temp = this.rows.filter((d) => d.cNombrePerfil.toLowerCase().indexOf(val) !== -1 || !val);
            this.rows = temp;
        }
    }
    filterPermiso(value): void {
        this.rowsPermisos = this.rowsPermisosTemp;
        // Filtramos tabla
        if (value.target.value === '') {
            this.rowsPermisos = this.rowsPermisosTemp;
        } else {
            const val = value.target.value.toLowerCase();
            const temp = this.rowsPermisos.filter((d) => d.permiso.toLowerCase().indexOf(val) !== -1 || !val);
            this.rowsPermisos = temp;
        }
    }
    async readAsDataURL(file) {
        return new Promise((resolve, reject) => {
            let fileReader = new FileReader();
            fileReader.onload = function () {
                return resolve({ data: fileReader.result.toString(), name: file.name, size: file.size, type: file.type });
            }
            fileReader.readAsDataURL(file);
        });
    }


    add(): void {

        // Agregamos elemento file
        let base64Result: string;

        const fileInput = this.fileInput.nativeElement;

        fileInput.onchange = () => {


        };
        fileInput.click();

    }

    async descargarUsuarioLogo(): Promise<void> {
        // Descargamos el documento


        if (this.usuario.cImagen) {

            await this.usuariosService.dowloadDocument(this.usuario.cImagen.hash + this.usuario.cImagen.ext, '', '', '').subscribe((resp: any) => {

                const linkSource = 'data:application/octet-stream;base64,' + resp.data;
                this.imageURL = linkSource;
            }, err => {
                console.log(err);
                this.imageURL = 'assets/images/avatars/profile.jpg';
            });

        } else {
            this.imageURL = 'assets/images/avatars/profile.jpg';
        }
    }
    viewPassword(): void {
        if (this.type === 'password') {
            this.type = 'text';
        } else {
            this.type = 'password';
        }

    }
    validaEstatus(): void {
        if (this.form.get('estatus').value) {
            this.usuario.bActivo = false;
            this.usuario.perfiles_de_usuarios = [];

        } else {
            this.usuario.bActivo = true;
        }

    }
}


/**
 * Confirm password validator
 *
 * @param {AbstractControl} control
 * @returns {ValidationErrors | null}
 */
export const confirmPasswordValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {

    // Validamos que las contraseñas coincidan
    if (!control.parent || !control) {
        return null;
    }

    const password = control.parent.get('password');
    const passwordConfirm = control.parent.get('passwordConfirm');

    if (!password || !passwordConfirm) {
        return null;
    }

    if (passwordConfirm.value === '') {
        return null;
    }

    if (password.value === passwordConfirm.value) {
        return null;
    }

    return { passwordsNotMatching: true };
};
