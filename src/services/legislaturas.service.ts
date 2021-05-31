import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';
import { LegislaturaModel } from 'models/legislaturas.models';

@Injectable({
    providedIn: 'root'
})
export class LegislaturaService {

    private baseUrl: string;
    private urlLegislatura = 'legislaturas';
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

    obtenerLegislatura(): any {
         this.TOKEN = localStorage.getItem("token");

         let httpOptions = {
             headers: new HttpHeaders({
                 Authorization: this.TOKEN,
             }),
         };
        return this.http.get(this.baseUrl + this.urlLegislatura, httpOptions);
    }

    actualizarLegislatura(legislatura: LegislaturaModel): any {
         this.TOKEN = localStorage.getItem("token");

         let httpOptions = {
             headers: new HttpHeaders({
                 Authorization: this.TOKEN,
             }),
         };
        return this.http.put(
            this.baseUrl + this.urlLegislatura + "/" + legislatura.id,
            legislatura,
            httpOptions
        );
    }

    guardarLegislatura(legislatura: LegislaturaModel): any {
         this.TOKEN = localStorage.getItem("token");

         let httpOptions = {
             headers: new HttpHeaders({
                 Authorization: this.TOKEN,
             }),
         };
        return this.http.post(
            this.baseUrl + this.urlLegislatura,
            legislatura,
            httpOptions
        );
    }

    eliminarLegislatura(id: string): any {
         this.TOKEN = localStorage.getItem("token");

         let httpOptions = {
             headers: new HttpHeaders({
                 Authorization: this.TOKEN,
             }),
         };
        return this.http.delete(
            this.baseUrl + this.urlLegislatura + "/" + id,
            httpOptions
        );
    }
}