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
        this.TOKEN = localStorage.getItem('token');
        this.httpOptions = {
            headers: new HttpHeaders({
                Authorization: this.TOKEN,
            }),
        };
    }

    obtenerRecepcionesDeActas(): any {
        this.TOKEN = localStorage.getItem('token');
        let httpOptions = {
            headers: new HttpHeaders({
                Authorization: this.TOKEN,
            }),
        };
        return this.http.get(this.baseUrl + this.urlRecepcionDeActas, httpOptions);
    }

    actualizarRecepcionDeActa(partidosPoliticos: RecepcionDeActasModel): any {
        this.TOKEN = localStorage.getItem('token');
        let httpOptions = {
            headers: new HttpHeaders({
                Authorization: this.TOKEN,
            }),
        }
        return this.http.put(this.baseUrl + this.urlRecepcionDeActas + '/' + partidosPoliticos.id, partidosPoliticos, httpOptions);
    }

    guardarRecepcionDeActa(partidosPoliticos: RecepcionDeActasModel): any {
        this.TOKEN = localStorage.getItem('token');
        let httpOptions = {
            headers: new HttpHeaders({
                Authorization: this.TOKEN,
            }),
        }
        return this.http.post(this.baseUrl + this.urlRecepcionDeActas, partidosPoliticos, httpOptions);
    }

    eliminarRecepcionDeActa(id: string): any {
        this.TOKEN = localStorage.getItem('token');
        let httpOptions = {
            headers: new HttpHeaders({
                Authorization: this.TOKEN,
            }),
        }
        return this.http.delete(this.baseUrl + this.urlRecepcionDeActas + '/' + id, httpOptions);
    }

    obtenerRecepcionDeActasFiltrado(filtro: string): any {
        this.TOKEN = localStorage.getItem('token');
        let httpOptions = {
            headers: new HttpHeaders({
                Authorization: this.TOKEN,
            }),
        }
        return this.http.get(this.baseUrl + this.urlRecepcionDeActasFiltrado + '/' + filtro, httpOptions);
    }
}