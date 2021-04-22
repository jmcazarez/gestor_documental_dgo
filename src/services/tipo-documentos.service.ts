import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from '../environments/environment';
import { TipoDeExpedientesModule } from 'app/main/tipo-de-expedientes/tipo-de-expedientes.module';
import { TipoDocumentoModel } from 'models/tipos-documentos.models';

@Injectable({
    providedIn: 'root'
})
export class TipoDocumentosService {

    private baseUrl: string;
    private urlTipoDocumentos = 'tipo-de-documentos';
    private urlTipoDocumentoController = 'tipo-documento-controller';
    private urlTipoDocumentoPermiso = 'update-perfil-usuarios';
   
    private urlTipoDocumentoPerfil = 'perfil-usuarios-documentos';
    private TOKEN = localStorage.getItem('token');

    private httpOptions = {
        headers: new HttpHeaders({
            Authorization: this.TOKEN,
        }),
    };
    constructor(private http: HttpClient) {
        this.baseUrl = environment.apiCms;
        this.TOKEN = localStorage.getItem('token');
        this.httpOptions = {
            headers: new HttpHeaders({
                Authorization: this.TOKEN,
            }),
        };
    }

    obtenerTipoDocumentos(): any {
        return this.http.get(this.baseUrl + this.urlTipoDocumentos, this.httpOptions);
    }

    obtenerTipoDocumentosPerfil(ruta: string): any {
        return this.http.get(this.baseUrl + this.urlTipoDocumentoPerfil + '/' + ruta, this.httpOptions);
    }

    actualizarTipoDocumentos(tipoDocumento: TipoDocumentoModel): any {
        return this.http.put(this.baseUrl + this.urlTipoDocumentoController + '/' + tipoDocumento.id, tipoDocumento, this.httpOptions);
    }

    guardarTipoDocumentos(tipoDocumento: TipoDeExpedientesModule): any {
        return this.http.post(this.baseUrl + this.urlTipoDocumentoController, tipoDocumento, this.httpOptions);
    }

    eliminarTipoDocumentos(ruta: string): any {

        return this.http.delete(this.baseUrl + this.urlTipoDocumentoController + '/' + ruta, this.httpOptions);
    }

    actualizarTipoDocumentosPerfil(tipoDocumento: any): any {
        return this.http.put(this.baseUrl + this.urlTipoDocumentoPermiso + '/' + tipoDocumento.id, tipoDocumento, this.httpOptions);
    }
}
