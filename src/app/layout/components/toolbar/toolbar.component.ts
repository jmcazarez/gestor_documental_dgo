import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';

import { FuseConfigService } from '@fuse/services/config.service';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';

import { navigation } from 'app/navigation/navigation';
import { UsuarioLoginService } from 'services/usuario-login.service';
import { MenuService } from 'services/menu.service';
import { Router } from '@angular/router';
import { UsuarioLoginModel } from 'models/usuario-login.model';
import { DocumentosService } from 'services/documentos.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'toolbar',
    templateUrl: './toolbar.component.html',
    styleUrls: ['./toolbar.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class ToolbarComponent implements OnInit, OnDestroy {
    @ViewChild('imagenLogo', { static: false }) imagenLogo;
    srcImagenLogo;
    horizontalNavbar: boolean;
    rightNavbar: boolean;
    hiddenNavbar: boolean;
    languages: any;
    navigation: any;
    selectedLanguage: any;
    userStatusOptions: any[];
    usuario: UsuarioLoginModel;
    usr: any;
    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     * @param {FuseSidebarService} _fuseSidebarService
     * @param {TranslateService} _translateService
     * @param {UsuarioLoginService} _usuarioLoginService
     * @param {MenuService} _menuService
     * @param {Router} _router
     */
    constructor(
        private _fuseConfigService: FuseConfigService,
        private _fuseSidebarService: FuseSidebarService,
        private _translateService: TranslateService,
        private _usuarioLoginService: UsuarioLoginService,
        private _menuService: MenuService,
        private documentoService: DocumentosService,
        private _router: Router
    ) {
        // Set the defaults
        this.userStatusOptions = [
            {
                title: 'Online',
                icon: 'icon-checkbox-marked-circle',
                color: '#4CAF50'
            },
            {
                title: 'Away',
                icon: 'icon-clock',
                color: '#FFC107'
            },
            {
                title: 'Do not Disturb',
                icon: 'icon-minus-circle',
                color: '#F44336'
            },
            {
                title: 'Invisible',
                icon: 'icon-checkbox-blank-circle-outline',
                color: '#BDBDBD'
            },
            {
                title: 'Offline',
                icon: 'icon-checkbox-blank-circle-outline',
                color: '#616161'
            }
        ];

        this.languages = [
            {
                id: 'es',
                title: 'Español',
                flag: 'us'
            },
            {
                id: 'tr',
                title: 'Turkish',
                flag: 'tr'
            }
        ];

        this.navigation = navigation;

        // Set the private defaults
        this._unsubscribeAll = new Subject();


    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    async ngOnInit(): Promise<void> {
        this.srcImagenLogo = 'assets/images/avatars/profile.jpg';
        // Obtiene el usuario
        this.usuario = this._usuarioLoginService.obtenerUsuario();

        this.usr = JSON.parse(localStorage.getItem('usr'));

        //console.log(this.usr);
        if (this.usr) {
            await this.descargarUsuarioLogo();
        }
        // Subscribe to the config changes
        this._fuseConfigService.config
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((settings) => {
                this.horizontalNavbar = settings.layout.navbar.position === 'top';
                this.rightNavbar = settings.layout.navbar.position === 'right';
                this.hiddenNavbar = settings.layout.navbar.hidden === true;
            });



    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Toggle sidebar open
     *
     * @param key
     */
    toggleSidebarOpen(key): void {
        this._fuseSidebarService.getSidebar(key).toggleOpen();
    }

    /**
     * Search
     *
     * @param value
     */
    search(value): void {
        // Do your search here...
        console.log(value);
    }

    /**
     * Set the language
     *
     * @param lang
     */
    setLanguage(lang): void {
        // Set the selected language for the toolbar
        this.selectedLanguage = lang;

        // Use the selected language for translations
        this._translateService.use(lang.id);
    }

    async logout(): Promise<void> {
        this._usuarioLoginService.eliminarUsuario();
        // Borra el menú
        await this._menuService.limpiarMenu();
        // Redireccionar a login
        this._router.navigate(['login']);
    }


    async descargarUsuarioLogo(): Promise<void> {
        // Descargamos el documento
        
        if (this.usr) {
            if (this.usr[0].data.token) {
                const token = this.usr[0].data.token;
                localStorage.setItem('token', token);
                if (this.usr[0].data.imagen.length > 0) {
                    await this.documentoService.dowloadDocument(this.usr[0].data.imagen, '', '', '').subscribe((resp: any) => {

                        const linkSource = 'data:application/octet-stream;base64,' + resp.data;
                        this.srcImagenLogo = linkSource;
                    }, err => {
                        console.log(err);
                        this.srcImagenLogo = 'assets/images/avatars/profile.jpg';
                    });
                }
            }
        } else {
            this.srcImagenLogo = 'assets/images/avatars/profile.jpg';
        }
    }


    convertFile(buf: any): string {
        // Convertimos el resultado en binstring
        const binstr = Array.prototype.map.call(buf, (ch: number) => String.fromCharCode(ch)).join('');
        return btoa(binstr);
    }
}
