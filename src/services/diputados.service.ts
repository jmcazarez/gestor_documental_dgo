import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';
import { DiputadosModel } from 'models/diputados.models';

@Injectable({
    providedIn: 'root'
})
export class DiputadosService {

    private baseUrl: string;
    private urlDiputados = 'diputados';
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

    obtenerDiputados(): any {
        return this.http.get(this.baseUrl + this.urlDiputados, this.httpOptions);
    }

    actualizarDiputados(Diputados: DiputadosModel): any {
        return this.http.put(this.baseUrl + this.urlDiputados + '/' + Diputados.id, Diputados, this.httpOptions);
    }

    guardarDiputados(Diputados: DiputadosModel): any {
        return this.http.post(this.baseUrl + this.urlDiputados, Diputados, this.httpOptions);
    }

    eliminarDiputados(id: string): any {

        return this.http.delete(this.baseUrl + this.urlDiputados + '/' + id, this.httpOptions);
    }
}