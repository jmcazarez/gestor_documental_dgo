import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';
import { PerfilUsuariosModel } from 'models/perfil-usuarios.model';

@Injectable({
    providedIn: 'root'
})


export class PerfilUsuariosService {

    private baseUrl: string;
    private urlPerfilUsuarios = 'perfil-usuarios';
    private urlActualizarPerfilUsuarios = 'update-perfil-usuarios';
    private urlOpcionesSistema = 'opciones-del-sistemas';
    private urlTipoDocumentos = 'tipo-de-documentos';
    private urlVisibilidad = 'visibilidad';
    private urlPermisosIniciativas = 'permisosDeIniciativas';
    private TOKEN = localStorage.getItem('token');

    private httpOptions = {
        headers: new HttpHeaders({
            Authorization: this.TOKEN,
        }),
    };
    constructor(private http: HttpClient) {
        this.baseUrl = environment.apiCms;
    }

    obtenerPerfilesUsuarios(): any {
        return this.http.get(this.baseUrl + this.urlPerfilUsuarios, this.httpOptions);
    }

    obtenerPerfilUsuarios(id: number): any {
        return this.http.get(this.baseUrl + this.urlPerfilUsuarios + '/' + id, this.httpOptions);
    }

    guardarPerfilUsuarios(perfilUsuarios: PerfilUsuariosModel): any {
        return this.http.post(this.baseUrl + this.urlPerfilUsuarios, perfilUsuarios, this.httpOptions);
    }

    actualizarPerfilUsuarios(perfilUsuarios: PerfilUsuariosModel): any {
        return this.http.put(this.baseUrl + this.urlActualizarPerfilUsuarios + '/' + perfilUsuarios.id, perfilUsuarios, this.httpOptions);
    }

    eliminarPerfilUsuarios(perfilUsuarios: PerfilUsuariosModel): any {
        return this.http.delete(this.baseUrl + this.urlPerfilUsuarios + '/' + perfilUsuarios.id, this.httpOptions);
    }

    obtenerOpcionesSistema(): any {
        return this.http.get(this.baseUrl + this.urlOpcionesSistema, this.httpOptions);
    }
    obtenerTipoDocumentos(): any {
        return this.http.get(this.baseUrl + this.urlTipoDocumentos, this.httpOptions);
    }

    obtenerVisibilidad(): any {
        return this.http.get(this.baseUrl + this.urlVisibilidad, this.httpOptions);
    }

    obtenerPermisosIniciativas(): any {
        return this.http.get(this.baseUrl + this.urlPermisosIniciativas, this.httpOptions);
    }

}