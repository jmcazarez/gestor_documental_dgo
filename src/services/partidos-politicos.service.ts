import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';
import { PartidosPoliticosModel } from 'models/partidos-politicos.models';

@Injectable({
    providedIn: 'root'
})
export class PartidosPoliticosService {

    private baseUrl: string;
    private urlPartidosPoliticos = 'partidos-politicos';
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

    obtenerPartidoPolitico(): any {
        this.TOKEN = localStorage.getItem('token');
        let httpOptions = {
            headers: new HttpHeaders({
                Authorization: this.TOKEN,
            }),
        }
        return this.http.get(this.baseUrl + this.urlPartidosPoliticos, httpOptions);
    }

    actualizarPartidoPolitico(partidosPoliticos: PartidosPoliticosModel): any {
        this.TOKEN = localStorage.getItem('token');
        let httpOptions = {
            headers: new HttpHeaders({
                Authorization: this.TOKEN,
            }),
        }
        return this.http.put(this.baseUrl + this.urlPartidosPoliticos + '/' + partidosPoliticos.id, partidosPoliticos, httpOptions);
    }

    guardarPartidoPolitico(partidosPoliticos: PartidosPoliticosModel): any {
        this.TOKEN = localStorage.getItem('token');
        let httpOptions = {
            headers: new HttpHeaders({
                Authorization: this.TOKEN,
            }),
        }
        return this.http.post(this.baseUrl + this.urlPartidosPoliticos, partidosPoliticos, httpOptions);
    }

    eliminarPartidoPolitico(id: string): any {
        this.TOKEN = localStorage.getItem('token');
        let httpOptions = {
            headers: new HttpHeaders({
                Authorization: this.TOKEN,
            }),
        }
        return this.http.delete(this.baseUrl + this.urlPartidosPoliticos + '/' + id, httpOptions);
    }
}