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
        this.TOKEN = localStorage.getItem('token');
        this.httpOptions = {
            headers: new HttpHeaders({
                Authorization: this.TOKEN,
            }),
        };
    }

    obtenerFirmasPorEtapa(): any {
        this.TOKEN = localStorage.getItem('token');
        let httpOptions = {
            headers: new HttpHeaders({
                Authorization: this.TOKEN,
            }),
        }
        return this.http.get(this.baseUrl + this.urlFirmasPorEtapa, httpOptions);
    }
    obtenerFirmaPorEtapa(id: string): any {
        this.TOKEN = localStorage.getItem('token');
        let httpOptions = {
            headers: new HttpHeaders({
                Authorization: this.TOKEN,
            }),
        }
        return this.http.get(this.baseUrl + this.urlFirmasPorEtapa + '/' + id, httpOptions);
    }
    actualizarFirmasPorEtapa(firmasPorEtapa: FirmasPorEtapaModel): any {
        this.TOKEN = localStorage.getItem('token');
        let httpOptions = {
            headers: new HttpHeaders({
                Authorization: this.TOKEN,
            }),
        }
        return this.http.put(this.baseUrl + this.urlFirmasPorEtapa + '/' + firmasPorEtapa.id, firmasPorEtapa, httpOptions);
    }

    guardarFirmasPorEtapa(firmasPorEtapa: FirmasPorEtapaModel): any {
        this.TOKEN = localStorage.getItem('token');
        let httpOptions = {
            headers: new HttpHeaders({
                Authorization: this.TOKEN,
            }),
        }
        return this.http.post(this.baseUrl + this.urlFirmasPorEtapa, firmasPorEtapa, httpOptions);
    }

    eliminarFirmasPorEtapa(ruta: string): any {
        this.TOKEN = localStorage.getItem('token');
        let httpOptions = {
            headers: new HttpHeaders({
                Authorization: this.TOKEN,
            }),
        }
        return this.http.delete(this.baseUrl + this.urlFirmasPorEtapa + '/' + ruta, httpOptions);
    }


    obtenerEtapas(): any {
        this.TOKEN = localStorage.getItem('token');
        let httpOptions = {
            headers: new HttpHeaders({
                Authorization: this.TOKEN,
            }),
        }
        return this.http.get(this.baseUrl + this.urlEtapas, httpOptions);
    }

}
