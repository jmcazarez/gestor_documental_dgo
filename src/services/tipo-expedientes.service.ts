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
        this.TOKEN = localStorage.getItem('token');
        this.httpOptions = {
            headers: new HttpHeaders({
                Authorization: this.TOKEN,
            }),
        };
    }

    obtenerTipoExpedientes(): any {
        this.TOKEN = localStorage.getItem('token');

        let httpOptions = {
            headers: new HttpHeaders({
                Authorization: this.TOKEN,
            }),
        };
        return this.http.get(this.baseUrl + this.urlTipoExpedientes, httpOptions);
    }

    actualizarTipoExpedientes(tipoExpedientes: TipoExpedientesModel): any {
             this.TOKEN = localStorage.getItem("token");

             let httpOptions = {
                 headers: new HttpHeaders({
                     Authorization: this.TOKEN,
                 }),
             };
        return this.http.put(
            this.baseUrl + this.urlTipoExpedientes + "/" + tipoExpedientes.id,
            tipoExpedientes,
            httpOptions
        );
    }

    guardarTipoExpedientes(tipoExpedientes: TipoExpedientesModel): any {
             this.TOKEN = localStorage.getItem("token");

             let httpOptions = {
                 headers: new HttpHeaders({
                     Authorization: this.TOKEN,
                 }),
             };
        return this.http.post(
            this.baseUrl + this.urlTipoExpedientes,
            tipoExpedientes,
            httpOptions
        );
    }

    eliminarTipoExpedientes(ruta: string): any {
     this.TOKEN = localStorage.getItem("token");

     let httpOptions = {
         headers: new HttpHeaders({
             Authorization: this.TOKEN,
         }),
     };
        return this.http.delete(
            this.baseUrl + this.urlTipoExpedientes + "/" + ruta,
            httpOptions
        );
    }
}
