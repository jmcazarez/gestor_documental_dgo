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

        return this.http.get(this.baseUrl + this.urlTrazabilidad + '/' + idDocumento, this.httpOptions);
    }
    obtenerTrazabilidadId(idDocumento: string): any {

        return this.http.get(this.baseUrl + this.urlTrazabilidadId + '/' + idDocumento, this.httpOptions);
    }

    obtenerTrazabilidadHistorial(idDocumento: string): any {

        return this.http.get(this.baseUrl + this.urlTrazabilidadHistorial + '/' + idDocumento, this.httpOptions);
    }

    actualizarTrazabilidad(trazabilidad: any): any {
        return this.http.put(this.baseUrl + this.urlTrazabilidad + '/' + trazabilidad.id, trazabilidad, this.httpOptions);
    }

    obtenerTrazabilidades(): any {

        return this.http.get(this.baseUrl + this.urlTrazabilidad, this.httpOptions);
    }

    obtenerTrazabilidadFiltrado(filtro: string): any {

        return this.http.get(this.baseUrl + this.urlTrazabilidadFiltrado + '/' + filtro, this.httpOptions);
    }
}
