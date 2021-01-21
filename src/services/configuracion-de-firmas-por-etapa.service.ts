import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';
import { FirmasPorEtapaModel } from 'models/configuracion-de-firmas-por-etapa.models';

@Injectable({
    providedIn: 'root'
})
export class FirmasPorEtapaService {

    private baseUrl: string;
    private urlFirmasPorEtapa = 'firmas-por-etapa';
    private urlEtapas = 'etapas';
    private TOKEN = localStorage.getItem('token');

    private httpOptions = {
        headers: new HttpHeaders({
            Authorization: this.TOKEN,
        }),
    };
    constructor(private http: HttpClient) {
        this.baseUrl = environment.apiCms;
    }

    obtenerFirmasPorEtapa(): any {
        return this.http.get(this.baseUrl + this.urlFirmasPorEtapa, this.httpOptions);
    }

    actualizarFirmasPorEtapa(firmasPorEtapa: FirmasPorEtapaModel): any {
        return this.http.put(this.baseUrl + this.urlFirmasPorEtapa + '/' + firmasPorEtapa.id, firmasPorEtapa, this.httpOptions);
    }

    guardarFirmasPorEtapa(firmasPorEtapa: FirmasPorEtapaModel): any {
        return this.http.post(this.baseUrl + this.urlFirmasPorEtapa, firmasPorEtapa, this.httpOptions);
    }

    eliminarFirmasPorEtapa(ruta: string): any {
        return this.http.delete(this.baseUrl + this.urlFirmasPorEtapa + '/' + ruta, this.httpOptions);
    }

    
    obtenerEtapas(): any {
        return this.http.get(this.baseUrl + this.urlEtapas, this.httpOptions);
    }

}
