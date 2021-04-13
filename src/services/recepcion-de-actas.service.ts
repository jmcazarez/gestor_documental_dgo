import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';
import { RecepcionDeActasModel } from 'models/recepcion-de-actas.models';

@Injectable({
    providedIn: 'root'
})
export class RecepcionDeActasService {

    private baseUrl: string;
    private urlRecepcionDeActas = 'recepcion-de-actas';
    private urlRecepcionDeActasFiltrado = 'recepcion-de-actas-filtrado';
    private TOKEN = localStorage.getItem('token');

    private httpOptions = {
        headers: new HttpHeaders({
            Authorization: this.TOKEN,
        }),
    };
    constructor(private http: HttpClient) {
        this.baseUrl = environment.apiCms;
    }

    obtenerRecepcionesDeActas(): any {
        return this.http.get(this.baseUrl + this.urlRecepcionDeActas, this.httpOptions);
    }

    actualizarRecepcionDeActa(partidosPoliticos: RecepcionDeActasModel): any {
        return this.http.put(this.baseUrl + this.urlRecepcionDeActas + '/' + partidosPoliticos.id, partidosPoliticos, this.httpOptions);
    }

    guardarRecepcionDeActa(partidosPoliticos: RecepcionDeActasModel): any {
        return this.http.post(this.baseUrl + this.urlRecepcionDeActas, partidosPoliticos, this.httpOptions);
    }

    eliminarRecepcionDeActa(id: string): any {

        return this.http.delete(this.baseUrl + this.urlRecepcionDeActas + '/' + id, this.httpOptions);
    }

    obtenerRecepcionDeActasFiltrado(filtro: string): any {

        return this.http.get(this.baseUrl + this.urlRecepcionDeActasFiltrado + '/' + filtro, this.httpOptions);
    }
}