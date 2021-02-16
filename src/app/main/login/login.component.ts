import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import { LoginService } from 'services/login.service';
import { UsuarioLoginModel } from 'models/usuario-login.model';
import { Router } from '@angular/router';
import { UsuarioLoginService } from 'services/usuario-login.service';
import { MenuService } from 'services/menu.service';
import Swal from 'sweetalert2';
@Component({
    selector     : 'login',
    templateUrl  : './login.component.html',
    styleUrls    : ['./login.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class LoginComponent implements OnInit
{
    loginForm: FormGroup;
    usuario: UsuarioLoginModel;
    error: any;
    cargando: boolean;

    /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     * @param {FormBuilder} _formBuilder
     * @param {LoginService} _loginService
     * @param {Router} _router
     * @param {UsuarioLoginService} _usuarioLoginService
     * @param {MenuService} _menuService
     */
    constructor(
        private _fuseConfigService: FuseConfigService,
        private _formBuilder: FormBuilder,
        private _loginService: LoginService,
        private _router: Router,
        private _usuarioLoginService: UsuarioLoginService,
        private _menuService: MenuService
    )
    {
        // Configure the layout
        this._fuseConfigService.config = {
            layout: {
                navbar   : {
                    hidden: true
                },
                toolbar  : {
                    hidden: true
                },
                footer   : {
                    hidden: true
                },
                sidepanel: {
                    hidden: true
                }
            }
        };
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        this.loginForm = this._formBuilder.group({
            usuario   : ['', [Validators.required]],
            password: ['', Validators.required]
        });
    }

    async login(): Promise<void> {

        const usuario = {
            cUsuario: this.loginForm.get('usuario').value,
            cPassword: this.loginForm.get('password').value
        };
    
        this.cargando = true;

      await  this._loginService.validarUsuario(usuario).subscribe( async (resp: any) => {
            // Guardar en storage
           await this._usuarioLoginService.guardarUsuario(resp);
    
            if (resp.perfiles_de_usuarios === 0) {
                // this.mostrarMensaje('No cuenta con permisos asignados. Favor de verificar con el área de sistemas.');
                console.log('No tiene permisos');
            }
            else{
                // Crear menú
               await this._menuService.crearMenu();
            }
            
            this.error = false;
            this._router.navigate(['home']);
            this.cargando = false;
        }, err => {
         
            Swal.fire('Eliminado', err.error.message, 'error');
            this.error = true;
            this.cargando = false;            
        });
    
    }
}
