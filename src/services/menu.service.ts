import { Injectable } from '@angular/core';
import { GrupoMenuModel } from 'models/menu.models';
import { UsuarioLoginService } from './usuario-login.service';
import { ItemMenuModel } from './item-menu.model';
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'environments/environment';

@Injectable({
    providedIn: 'root'
})
export class MenuService {
    perfilUsuario: any[] = [];
    tipoDocumentos: any[] = [];
    opcionesPerfil: any[] = [];
    tipoInformacion: any[] = [];
    tipoOpciones: any[] = []
    usuario: any;
    private baseUrl: string;
    private urlTipoOpciones = 'tipo-opciones';
    private TOKEN = localStorage.getItem('token');

    private httpOptions = {
        headers: new HttpHeaders({
            Authorization: this.TOKEN,
        }),
    };

    constructor(private usuarioLoginService: UsuarioLoginService,
        private fuseNavigationService: FuseNavigationService,
        private http: HttpClient,
        private router: Router) {
        this.baseUrl = environment.apiCms;
    }

    async crearMenu(): Promise<void> {
        let usr = JSON.parse(localStorage.getItem('usr'));
        if (usr) {
            let token = usr[0].data.token

            if (token !== undefined && token !== null) {
                await this.obtenerTipoOpciones(token).subscribe(async (resp: any) => {
                    this.tipoOpciones = resp;
                    this.tipoDocumentos = [];
                    this.opcionesPerfil = [];
                    this.tipoInformacion = [];
                    let grupoMenu: GrupoMenuModel;
                    let grupoMenuReportes: GrupoMenuModel;
                    let grupoMenuCatalagos: GrupoMenuModel;

                    this.limpiarMenu();
                    let tipoFormato = '';
                    let visibilidade = '';
                    let metacatalogos = [];
                    let tipo: any;
                    const usuarioLogin = await this.usuarioLoginService.obtenerUsuario();

                    if (usuarioLogin) {
                        this.usuario = usuarioLogin[0].data.id;
                        grupoMenuCatalagos = {
                            id: 'grupo-' + 'Catalogos',
                            title: 'Catálogos',
                            type: 'group',
                            children: []
                        };
                        grupoMenu = {
                            id: 'grupo-' + 'Registros',
                            title: 'Registros',
                            type: 'group',
                            children: []
                        };
                        grupoMenuReportes = {
                            id: 'grupo-' + 'Reportes',
                            title: 'Reportes',
                            type: 'group',
                            children: []
                        };



                        /*  for (const opciones of usuarioLogin.Opciones) { */

                        for (const perfiles of usuarioLogin[0].data.perfiles_de_usuario) {
                            this.perfilUsuario.push({ id: perfiles.id });
                            for (const visibilidad of perfiles.Visibilidad) {

                                if (visibilidad.visibilidade.bActivo && visibilidad.Si) {
                                    this.tipoInformacion.push({
                                        id: visibilidad.visibilidade.id,
                                        cDescripcionVisibilidad: visibilidad.visibilidade.cDescripcionVisibilidad,
                                    });
                                }
                            }


                            // Agregamos permisos a tipos de documentos
                            for (const documentos of perfiles.Documentos) {
                                if (documentos.tipo_de_documento) {
                                    if (documentos.tipo_de_documento.bActivo) {
                                        const resultado = this.tipoDocumentos.find(tipoDocumento => tipoDocumento.id === documentos.tipo_de_documento.id);

                                        if (resultado) {
                                            // Si existen multiples permisos solo actualizamos los valores activos
                                            let index = this.tipoDocumentos.findIndex(tipoDocumento => tipoDocumento.id === documentos.tipo_de_documento.id);
                                            if (!index) {
                                                index = 0;
                                            }

                                            if (documentos.Agregar) {
                                                this.tipoDocumentos[index].Agregar = documentos.Agregar;
                                            }
                                            if (documentos.Consultar) {
                                                this.tipoDocumentos[index].Consultar = documentos.Consultar;
                                            }
                                            if (documentos.Editar) {
                                                this.tipoDocumentos[index].Editar = documentos.Editar;
                                            }
                                            if (documentos.Eliminar) {
                                                this.tipoDocumentos[index].Eliminar = documentos.Eliminar;
                                            }

                                        } else {
                                            // Si el permiso es unico lo agregamos

                                            if (documentos.tipo_de_documento.tipos_de_formato) {
                                                tipoFormato = documentos.tipo_de_documento.tipos_de_formato;
                                            }
                                            if (documentos.tipo_de_documento.metacatalogos) {
                                                metacatalogos = documentos.tipo_de_documento.metacatalogos;
                                            }

                                            if (documentos.tipo_de_documento.visibilidade) {
                                                visibilidade = documentos.tipo_de_documento.visibilidade;
                                            }


                                            this.tipoDocumentos.push({
                                                id: documentos.tipo_de_documento.id,
                                                cDescripcionTipoDocumento: documentos.tipo_de_documento.cDescripcionTipoDocumento,
                                                Agregar: documentos.Agregar,
                                                Consultar: documentos.Consultar,
                                                Editar: documentos.Editar,
                                                Eliminar: documentos.Eliminar,
                                                Obligatorio: documentos.tipo_de_documento.bObligatorio,
                                                tipos_de_formato: tipoFormato,
                                                metacatalogos,
                                                visibilidade
                                            });
                                        }

                                    }
                                }
                            }
                            // Agregamos permisos a opciones del sistema
                            for (const opciones of perfiles.Opciones) {

                                if (opciones) {
                                   
                                    if (opciones.opciones_del_sistema) {
                                        const resultado = this.opcionesPerfil.find(opcion => opcion.id === opciones.opciones_del_sistema.id);

                                        const cUrl = opciones.opciones_del_sistema.cNombreOpcion.toLowerCase().replace(/ /g, '-');

                                        if (!resultado) {

                                            // Agregamos la opcion al Menu
                                            const itemMenu: ItemMenuModel = {
                                                id: 'modulo-' + cUrl,
                                                title: opciones.opciones_del_sistema.cNombreOpcion,
                                                type: 'item',
                                                icon: 'blur_on',
                                                function: () => {
                                                    this.router.navigate([cUrl]);
                                                }
                                            };

                                            if (opciones.opciones_del_sistema.tipo_de_opcion_de_sistema) {

                                                tipo = this.tipoOpciones.find(tipoOpcion => tipoOpcion.id === opciones.opciones_del_sistema.tipo_de_opcion_de_sistema);
                                                //console.log(tipo);
                                                if (tipo) {
                                                    if (tipo.cDescripcionTipoOpcion === 'Reportes') {
                                                        grupoMenuReportes.children.push(itemMenu);
                                                    }
                                                    if (tipo.cDescripcionTipoOpcion === 'Registros') {
                                                        grupoMenu.children.push(itemMenu);
                                                    }
                                                    if (tipo.cDescripcionTipoOpcion === 'Catalogos') {
                                                        grupoMenuCatalagos.children.push(itemMenu);
                                                    }

                                                } else {


                                                    grupoMenu.children.push(itemMenu);
                                                }

                                            } else if (opciones.opciones_del_sistema.tipo_de_opcion_de_sistemas[0]) {
                                                tipo = this.tipoOpciones.find(tipoOpcion => tipoOpcion.id === opciones.opciones_del_sistema.tipo_de_opcion_de_sistemas[0]);
                                                //console.log(tipo);
                                                if (tipo) {
                                                    if (tipo.cDescripcionTipoOpcion === 'Reportes') {
                                                        grupoMenuReportes.children.push(itemMenu);
                                                    }
                                                    if (tipo.cDescripcionTipoOpcion === 'Registros') {
                                                        grupoMenu.children.push(itemMenu);
                                                    }
                                                    if (tipo.cDescripcionTipoOpcion === 'Catalogos') {
                                                        grupoMenuCatalagos.children.push(itemMenu);
                                                    }

                                                } else {


                                                    grupoMenu.children.push(itemMenu);
                                                }
                                            } else {

                                                grupoMenu.children.push(itemMenu);
                                            }




                                        }
                                        if (opciones.opciones_del_sistema.bActivo) {
                                            if (resultado) {
                                                // Si existen multiples permisos solo actualizamos los valores activos
                                                let index = this.opcionesPerfil.findIndex(opcion => opcion.id === opciones.opciones_del_sistema.id);
                                                if (!index) {
                                                    index = 0;
                                                }
                                                if (opciones.Agregar) {
                                                    this.opcionesPerfil[index].Agregar = opciones.Agregar;
                                                }
                                                if (opciones.Consultar) {
                                                    this.opcionesPerfil[index].Consultar = opciones.Consultar;
                                                }
                                                if (opciones.Editar) {
                                                    this.opcionesPerfil[index].Editar = opciones.Editar;
                                                }
                                                if (opciones.Eliminar) {
                                                    this.opcionesPerfil[index].Eliminar = opciones.Eliminar;
                                                }
                                            } else {
                                                // Si el permiso es unico lo agregamos
                                                this.opcionesPerfil.push({
                                                    id: opciones.opciones_del_sistema.id,
                                                    cNombreOpcion: opciones.opciones_del_sistema.cNombreOpcion,
                                                    Agregar: opciones.Agregar,
                                                    Eliminar: opciones.Eliminar,
                                                    Consultar: opciones.Consultar,
                                                    Editar: opciones.Editar,
                                                    cUrl: cUrl
                                                });
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        this.fuseNavigationService.addNavigationItem(grupoMenuCatalagos, 'end');
                        this.fuseNavigationService.addNavigationItem(grupoMenu, 'end');
                        this.fuseNavigationService.addNavigationItem(grupoMenuReportes, 'end');

                        // }
                    }
                }, err => {
                    console.log(err);
                    this.router.navigate(['login']);
                });
            }
        }

    }

    limpiarMenu(): void {
        const menuActual = this.fuseNavigationService.getCurrentNavigation();

        for (const itemMenu of menuActual) {
            this.fuseNavigationService.removeNavigationItem(itemMenu.id);
        }
    }

    obtenerTipoOpciones(token: string): any {

        let options = {
            headers: new HttpHeaders({
                Authorization: token,
            }),
        };
        return this.http.get(this.baseUrl + this.urlTipoOpciones, options);
    }

}