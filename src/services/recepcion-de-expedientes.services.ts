import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';
import { RecepcionDeExpedientesModels } from 'models/recepcion-de-expedientes.models';

@Injectable({
    providedIn: 'root'
})
export class RecepcionDeExpedientesService {

    private baseUrl: string;
    private urlRecepcionExpedientes = 'recepcion-de-expedientes';
    private TOKEN = localStorage.getItem('token');

    private httpOptions = {
        headers: new HttpHeaders({
            Authorization: this.TOKEN,
        }),
    };
    constructor(private http: HttpClient) {
        this.baseUrl = environment.apiCms;
    }

    obtenerRecepcionExpediente(): any {
        return this.http.get(this.baseUrl + this.urlRecepcionExpedientes, this.httpOptions);
    }

    actualizarRecepcionExpediente(recepcionExpedientes: RecepcionDeExpedientesModels): any {
        return this.http.put(this.baseUrl + this.urlRecepcionExpedientes + '/' + recepcionExpedientes.id, recepcionExpedientes, this.httpOptions);
    }

    guardarRecepcionExpediente(recepcionExpedientes: RecepcionDeExpedientesModels): any {
        return this.http.post(this.baseUrl + this.urlRecepcionExpedientes, recepcionExpedientes, this.httpOptions);
    }

    eliminarRecepcionExpediente(id: string): any {

        return this.http.delete(this.baseUrl + this.urlRecepcionExpedientes + '/' + id, this.httpOptions);
    }
}