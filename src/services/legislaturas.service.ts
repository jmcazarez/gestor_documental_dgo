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
        return this.http.get(this.baseUrl + this.urlLegislatura, this.httpOptions);
    }

    actualizarLegislatura(legislatura: LegislaturaModel): any {
        return this.http.put(this.baseUrl + this.urlLegislatura + '/' + legislatura.id, legislatura, this.httpOptions);
    }

    guardarLegislatura(legislatura: LegislaturaModel): any {
        return this.http.post(this.baseUrl + this.urlLegislatura, legislatura, this.httpOptions);
    }

    eliminarLegislatura(id: string): any {
        return this.http.delete(this.baseUrl + this.urlLegislatura + '/' + id, this.httpOptions);
    }
}