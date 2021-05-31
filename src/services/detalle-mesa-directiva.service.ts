import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';
import { DetalleMesaModels } from 'models/detalle-mesa-directiva.models';

@Injectable({
    providedIn: 'root'
})
export class DetalleMesaService {

    private baseUrl: string;
    private urlDetalleMesa = 'detalle-participantes-mesa-directivas';
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

    obtenerDetalleMesa(): any {
        this.TOKEN = localStorage.getItem('token');
        let httpOptions = {
            headers: new HttpHeaders({
                Authorization: this.TOKEN,
            }),
        }
        return this.http.get(this.baseUrl + this.urlDetalleMesa, httpOptions);
    }

    actualizarDetalleMesa(detalleMesas: any): any {
        this.TOKEN = localStorage.getItem('token');
        let httpOptions = {
            headers: new HttpHeaders({
                Authorization: this.TOKEN,
            }),
        }
        return this.http.put(this.baseUrl + this.urlDetalleMesa + '/' + detalleMesas.id, detalleMesas, httpOptions);
    }

    guardarDetalleMesa(detalleMesas: any): any {
        this.TOKEN = localStorage.getItem('token');
        let httpOptions = {
            headers: new HttpHeaders({
                Authorization: this.TOKEN,
            }),
        }
        return this.http.post(this.baseUrl + this.urlDetalleMesa, detalleMesas, httpOptions);
    }

    eliminarDetalleMesa(ruta: string): any {
        this.TOKEN = localStorage.getItem('token');
        let httpOptions = {
            headers: new HttpHeaders({
                Authorization: this.TOKEN,
            }),
        }
        return this.http.delete(this.baseUrl + this.urlDetalleMesa + '/' + ruta, httpOptions);
    }
}
