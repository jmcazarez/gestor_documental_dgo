import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable({
    providedIn: 'root'
})

export class TrazabilidadService {

    private baseUrl: string;
    private urlTrazabilidad = 'trazabilidad';
    private urlTrazabilidadId = 'trazabilidad-id';
    private urlTrazabilidadHistorial = 'trazabilidad-historial';
    private urlTrazabilidadHistorialPage = 'trazabilidad-historial-page';
    private urlTrazabilidadFiltrado = 'trazabilidad-filtrado';
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

    obtenerTrazabilidad(idDocumento: string): any {
        this.TOKEN = localStorage.getItem('token');
        let httpOptions = {
            headers: new HttpHeaders({
                Authorization: this.TOKEN,
            }),
        }
        return this.http.get(this.baseUrl + this.urlTrazabilidad + '/' + idDocumento, httpOptions);
    }
    obtenerTrazabilidadId(idDocumento: string): any {
        this.TOKEN = localStorage.getItem('token');
        let httpOptions = {
            headers: new HttpHeaders({
                Authorization: this.TOKEN,
            }),
        }
        return this.http.get(this.baseUrl + this.urlTrazabilidadId + '/' + idDocumento, httpOptions);
    }

    obtenerTrazabilidadHistorial(idDocumento: string): any {
        this.TOKEN = localStorage.getItem('token');
        let httpOptions = {
            headers: new HttpHeaders({
                Authorization: this.TOKEN,
            }),
        }
        return this.http.get(this.baseUrl + this.urlTrazabilidadHistorial + '/' + idDocumento, httpOptions);
    }

    obtenerTrazabilidadHistorialPage(nPage: number): any {
        this.TOKEN = localStorage.getItem('token');
        let httpOptions = {
            headers: new HttpHeaders({
                Authorization: this.TOKEN,
            }),
        }
        return this.http.get(this.baseUrl + this.urlTrazabilidadHistorialPage + '/' + nPage, httpOptions);
    }


    

    actualizarTrazabilidad(trazabilidad: any): any {
        this.TOKEN = localStorage.getItem('token');
        let httpOptions = {
            headers: new HttpHeaders({
                Authorization: this.TOKEN,
            }),
        }
        return this.http.put(this.baseUrl + this.urlTrazabilidad + '/' + trazabilidad.id, trazabilidad, httpOptions);
    }

    obtenerTrazabilidades(): any {
        this.TOKEN = localStorage.getItem('token');
        let httpOptions = {
            headers: new HttpHeaders({
                Authorization: this.TOKEN,
            }),
        }
        return this.http.get(this.baseUrl + this.urlTrazabilidad, httpOptions);
    }

    obtenerTrazabilidadFiltrado(filtro: string): any {
        this.TOKEN = localStorage.getItem('token');
        let httpOptions = {
            headers: new HttpHeaders({
                Authorization: this.TOKEN,
            }),
        }
        return this.http.get(this.baseUrl + this.urlTrazabilidadFiltrado + '/' + filtro, httpOptions);
    }
}
