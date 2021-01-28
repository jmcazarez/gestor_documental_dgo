import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';
import { TipoExpedientesModel } from 'models/tipo-expedientes.models';

@Injectable({
    providedIn: 'root'
})
export class TipoExpedientesService {

    private baseUrl: string;
    private urlTipoExpedientes = 'tipo-expedientes';
    private TOKEN = localStorage.getItem('token');

    private httpOptions = {
        headers: new HttpHeaders({
            Authorization: this.TOKEN,
        }),
    };
    constructor(private http: HttpClient) {
        this.baseUrl = environment.apiCms;
    }

    obtenerTipoExpedientes(): any {
        return this.http.get(this.baseUrl + this.urlTipoExpedientes, this.httpOptions);
    }

    actualizarTipoExpedientes(tipoExpedientes: TipoExpedientesModel): any {
        return this.http.put(this.baseUrl + this.urlTipoExpedientes + '/' + tipoExpedientes.id, tipoExpedientes, this.httpOptions);
    }

    guardarTipoExpedientes(tipoExpedientes: TipoExpedientesModel): any {
        return this.http.post(this.baseUrl + this.urlTipoExpedientes, tipoExpedientes, this.httpOptions);
    }

    eliminarTipoExpedientes(ruta: string): any {

        return this.http.delete(this.baseUrl + this.urlTipoExpedientes + '/' + ruta, this.httpOptions);
    }
}
