import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';
import { PermisosUsuarioOpcionModel } from 'models/permisos-usuarios-opcion.models';
import { TipoDocumentoGuardadModel } from 'models/tipo-de-documento-guardar.model';
import { VisibilidadGuardarModel } from 'models/visibilidad-guardar.model';

@Injectable({
    providedIn: 'root'
})


export class PermisosUsuarioService {

    private baseUrl: string;
    private urlOpcionesSistema = 'opcion-sistema-controller';
    private urlTipoDocumento = 'tipo-documento-controller';
    private urlVisibilidad = 'visibilidad-controller';
    private TOKEN = localStorage.getItem('token');

    private httpOptions = {
        headers: new HttpHeaders({
            Authorization: this.TOKEN,
        }),
    };
    constructor(private http: HttpClient) {
        this.baseUrl = environment.apiCms;
    }


    guardarOpcionSistema(permisoUsuarioOpcion: PermisosUsuarioOpcionModel): any {
        return this.http.post(this.baseUrl + this.urlOpcionesSistema, permisoUsuarioOpcion, this.httpOptions);
    }

    // tslint:disable-next-line: typedef
    actualizarOpcionSistema(permisoUsuarioOpcion: PermisosUsuarioOpcionModel) {

        return this.http.put(this.baseUrl + this.urlOpcionesSistema + '/' + permisoUsuarioOpcion.id, permisoUsuarioOpcion, this.httpOptions );
    }

    // tslint:disable-next-line: typedef
    actualizarTipoDocumento(tipoDocumento: TipoDocumentoGuardadModel) {

        return this.http.put(this.baseUrl + this.urlTipoDocumento + '/' + tipoDocumento.id, tipoDocumento, this.httpOptions );
    }

    // tslint:disable-next-line: typedef
    actualizarVisibilidad(visibilidad: VisibilidadGuardarModel) {

        return this.http.put(this.baseUrl + this.urlVisibilidad + '/' + visibilidad.id, visibilidad, this.httpOptions );
    }
    // tslint:disable-next-line: typedef
    eliminarOpcionSistema(id: string) {
        return this.http.delete(this.baseUrl + this.urlOpcionesSistema + '/' + id, this.httpOptions);
    }

    guardarTipoDocumento(tipoDocumento: TipoDocumentoGuardadModel): any {
        return this.http.post(this.baseUrl + this.urlTipoDocumento, tipoDocumento, this.httpOptions);
    }

    // tslint:disable-next-line: typedef
    eliminarTipoDocumento(id: string) {
        return this.http.delete(this.baseUrl + this.urlTipoDocumento + '/' + id, this.httpOptions);
    }

    guardarVisibilidad(visibilidad: VisibilidadGuardarModel): any {
        return this.http.post(this.baseUrl + this.urlVisibilidad, visibilidad, this.httpOptions);
    }

    // tslint:disable-next-line: typedef
    eliminarVisibilidad(id: string) {
        return this.http.delete(this.baseUrl + this.urlVisibilidad + '/' + id, this.httpOptions);
    }



}
