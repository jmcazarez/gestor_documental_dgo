import { Component, OnDestroy, OnInit, Input, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PermisosUsuarioModel } from '../../../../../models/permisos-usuarios.models';
import { TipoDocumentoGuardadModel } from '../../../../../models/tipo-de-documento-guardar.model';
import { VisibilidadGuardarModel } from '../../../../../models/visibilidad-guardar.model';
import { AreaModel } from '../../../../../models/area.models';
import { PermisosUsuarioOpcionModel } from '../../../../../models/permisos-usuarios-opcion.models';
import { PermisosUsuarioService } from 'services/permisos-usuario.service';
import { AreasService } from 'services/areas.service';
import Swal from 'sweetalert2';
@Component({
    selector: 'app-guardar-permisos-usuarios',
    templateUrl: './guardar-permisos-usuarios.component.html',
    styleUrls: ['./guardar-permisos-usuarios.component.scss']
})



export class GuardarPermisosUsuariosComponent implements OnInit {
    form: FormGroup;
    selectedValue: any;
    selectedArea: any;
    areas: any;
    cargando: boolean;
    tipoDisable: boolean;
    visibilidad: VisibilidadGuardarModel = new VisibilidadGuardarModel();
    tipoDocumentoGuardar: TipoDocumentoGuardadModel = new TipoDocumentoGuardadModel();
    permisosUsuarioOpcionModel: PermisosUsuarioOpcionModel = new PermisosUsuarioOpcionModel();
    tipos = [
        { value: '1', viewValue: 'Opcion del sistema' },
      //  { value: '2', viewValue: 'Tipo de documento' },
        { value: '3', viewValue: 'Tipo de información' }
    ];

    /**
     * Constructor
     *
     * @param {FormBuilder} formBuilder
     */
    constructor(private formBuilder: FormBuilder, private _dialogRef: MatDialogRef<GuardarPermisosUsuariosComponent>,
        private permisosService: PermisosUsuarioService,
        private areasService: AreasService,
        @Inject(MAT_DIALOG_DATA) public permisosUsuarios: PermisosUsuarioModel,
    ) { }

    async ngOnInit(): Promise<void> {
        this.selectedValue  = 'Tipo de información'
        this.permisosUsuarios.tipoPermiso = this.tipos;
        if (this.permisosUsuarios.id) {
            this.permisosUsuarios.bActivo = this.permisosUsuarios.bActivo;
        } else {
            this.permisosUsuarios.bActivo = true;
        }
        
        if (this.permisosUsuarios.idTipoPermiso) {
            this.selectedValue = this.permisosUsuarios.idTipoPermiso;
            this.tipoDisable = true;
        } else {
            this.tipoDisable = false;
        }
        if (this.permisosUsuarios.area) {
            this.selectedArea = this.permisosUsuarios.area.id;
        }
        // Reactive Form

        // inicializamos el form
        this.form = this.formBuilder.group({
            nombre: [this.permisosUsuarios.cNombreOpcion, [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
            estatus: [this.permisosUsuarios.bActivo, Validators.required],
            tipoPermiso: [{ value: this.permisosUsuarios.tipoPermiso, disabled: this.tipoDisable }, Validators.required],
            areas: [this.permisosUsuarios.area]
        });

        this.obtenerAreas();

    }

    cerrar(idOpcion: number): void {
        this._dialogRef.close(idOpcion);
    }

    obtenerAreas(): void {
        this.cargando = true;
        // Obtenemos las areas
        this.areasService.obtenerAreas().subscribe((resp: any) => {

            this.areas = resp;
            this.cargando = false;
        }, (err: any) => {
            console.log(err);
            this.cargando = false;
        });
    }

    guardar(): void {
        // Guardamos informacion depende de lo seleccinado
        if (this.selectedValue === 'Opcion del sistema') {
            this.permisosUsuarioOpcionModel.bActivo = this.form.get('estatus').value;
            this.permisosUsuarioOpcionModel.cNombreOpcion = this.form.get('nombre').value;
            this.permisosUsuarioOpcionModel.area = this.selectedArea;

            if (!this.selectedArea) {
                Swal.fire('Error', 'Es necesario seleccionar el area para las opciones del sistema.', 'error');
            } else {
                // Guardamos
                if (this.permisosUsuarios.id) {
                    this.permisosUsuarioOpcionModel.id = this.permisosUsuarios.id;
                    this.permisosService.actualizarOpcionSistema(this.permisosUsuarioOpcionModel).subscribe((resp: any) => {

                        if (resp) {
                            Swal.fire('Éxito', 'Opción del sistema guardada correctamente.', 'success');
                            this.cerrar(1);
                        } else {
                            Swal.fire('Error', 'Ocurrió un error al guardar.', 'error');
                        }
                    }, err => {
                        console.log(err);
                        Swal.fire('Error', 'Ocurrió un error al guardar.' + err.error.error, 'error');
                    });
                } else {
                    this.permisosService.guardarOpcionSistema(this.permisosUsuarioOpcionModel).subscribe((resp: any) => {
                        console.log(resp);
                        if (resp) {
                            Swal.fire('Éxito', 'Opción del sistema guardada correctamente.', 'success');
                            this.cerrar(1);
                        } else {
                            Swal.fire('Error', 'Ocurrió un error al guardar.', 'error');
                        }
                    }, (err: any) => {
                        console.log(err);
                        Swal.fire('Error', 'Ocurrió un error al guardar.' + err.error.error, 'error');
                    });
                }
            }
        } else if (this.selectedValue === 'Tipo de documento') {

            this.tipoDocumentoGuardar.bActivo = this.form.get('estatus').value;
            this.tipoDocumentoGuardar.cDescripcionTipoDocumento = this.form.get('nombre').value;
            
            if (this.permisosUsuarios.id) {
                // Guardamos
                this.tipoDocumentoGuardar.id = this.permisosUsuarios.id;
                this.permisosService.actualizarTipoDocumento(this.tipoDocumentoGuardar).subscribe((resp: any) => {

                    if (resp) {
                        Swal.fire('Éxito', 'Tipo de documento actualizado correctamente.', 'success');
                        this.cerrar(2);
                    } else {
                        Swal.fire('Error', 'Ocurrió un error al guardar.', 'error');
                    }
                }, (err: any) => {
                    console.log(err);
                    Swal.fire('Error', 'Ocurrió un error al guardar.' + err.error.error, 'error');
                });
            } else {
                // Guardamos
                this.permisosService.guardarTipoDocumento(this.tipoDocumentoGuardar).subscribe((resp: any) => {

                    if (resp) {
                        Swal.fire('Éxito', 'Tipo de documento guardado correctamente.', 'success');
                        this.cerrar(2);
                    } else {
                        Swal.fire('Error', 'Ocurrió un error al guardar.', 'error');
                    }
                }, (err: any) => {
                    console.log(err);
                    Swal.fire('Error', 'Ocurrió un error al guardar.' + err.error.error, 'error');
                });
            }
        } else {

            // Guardamos
            this.visibilidad.bActivo = this.form.get('estatus').value;
            this.visibilidad.cDescripcionVisibilidad = this.form.get('nombre').value;
            if (this.permisosUsuarios.id) {
                this.visibilidad.id = this.permisosUsuarios.id;
                this.permisosService.actualizarVisibilidad(this.visibilidad).subscribe((resp: any) => {

                    if (resp) {
                        Swal.fire('Éxito', 'Tipo de información guardada correctamente.', 'success');
                        this.cerrar(3);
                    } else {
                        Swal.fire('Error', 'Ocurrió un error al guardar.', 'error');
                    }
                }, err => {
                    console.log(err);
                    Swal.fire('Error', 'Ocurrió un error al guardar.' + err.error.error, 'error');
                });
            } else {
                this.permisosService.guardarVisibilidad(this.visibilidad).subscribe((resp: any) => {

                    if (resp) {
                        Swal.fire('Éxito', 'Tipo de información guardada correctamente.', 'success');
                        this.cerrar(3);
                    } else {
                        Swal.fire('Error', 'Ocurrió un error al guardar.', 'error');
                    }
                }, (err: any) => {
                    console.log(err);
                    Swal.fire('Error', 'Ocurrió un error al guardar.' + err.error.error, 'error');
                });
            }

        }

    }
}
