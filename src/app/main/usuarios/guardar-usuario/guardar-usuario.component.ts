import { Component, OnDestroy, OnInit, Input, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { Subject } from 'rxjs';
import { UsuarioModel } from 'models/usuario.models';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UsuariosComponent } from '../usuarios.component';
import { UsuariosService } from 'services/usuarios.service';
import Swal from 'sweetalert2';

@Component({
    selector   : 'guardar-usuario',
    templateUrl: './guardar-usuario.component.html',
    styleUrls  : ['./guardar-usuario.component.scss']
})
export class GuardarUsuarioComponent implements OnInit, OnDestroy
{
    form: FormGroup;
    passwordConfirm: string;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        private _formBuilder: FormBuilder,
        private _dialogRef: MatDialogRef<UsuariosComponent>,
        private _usuariosService: UsuariosService,
        @Inject(MAT_DIALOG_DATA) public usuario: UsuarioModel
    )
    {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
        this.passwordConfirm = usuario.cPassword;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        // Reactive Form
        this.form = this._formBuilder.group({
            nombre          : [this.usuario.cNombre, Validators.required],
            primerApellido  : [this.usuario.cApellidoPaterno, Validators.required],
            segundoApellido : [this.usuario.cApellidoMaterno],
            usuario         : [this.usuario.cLogin, Validators.required],
            password        : [this.usuario.cPassword, Validators.required],
            passwordConfirm : [this.passwordConfirm, [Validators.required, confirmPasswordValidator]]
        });

        
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    cerrar(guardado: boolean): void {
        this._dialogRef.close(guardado);
    }

    guardar(): void {

        // actualiza los campos del usuario
        this.usuario.cNombre = this.form.get('nombre').value;
        this.usuario.cApellidoPaterno = this.form.get('primerApellido').value;
        this.usuario.cApellidoMaterno = this.form.get('segundoApellido').value;
        this.usuario.cLogin = this.form.get('usuario').value;
        this.usuario.cPassword = this.form.get('password').value;

        if (this.usuario.nIdUsuario && this.usuario.nIdUsuario > 0) {
            this._usuariosService.actualizarUsuario(this.usuario).subscribe( (resp: any) => {
                if (resp.affectedRows && resp.affectedRows > 0){
                    Swal.fire('Exito', 'El usuario se ha actualizado correctamente.', 'success');
                    this.cerrar(true);
                } else {
                    Swal.fire('Error', 'Ocurrió un error al actualizar.', 'error');
                }
            }, err => {
                Swal.fire('Error', 'Ocurrió un error al actualizar.', 'error');
            });
        } else {
            this._usuariosService.guardarUsuario(this.usuario).subscribe( (resp: any) => {
                if (resp.affectedRows && resp.affectedRows > 0){
                    Swal.fire('Exito', 'El usuario se ha guardado correctamente.', 'success');
                    this.cerrar(true);
                } else {
                    Swal.fire('Error', 'Ocurrió un error al guardar.', 'error');
                }
            }, err => {
                Swal.fire('Error', 'Ocurrió un error al guardar.', 'error');
            });
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

    if ( !control.parent || !control )
    {
        return null;
    }

    const password = control.parent.get('password');
    const passwordConfirm = control.parent.get('passwordConfirm');

    if ( !password || !passwordConfirm )
    {
        return null;
    }

    if ( passwordConfirm.value === '' )
    {
        return null;
    }

    if ( password.value === passwordConfirm.value )
    {
        return null;
    }

    return {passwordsNotMatching: true};
};
