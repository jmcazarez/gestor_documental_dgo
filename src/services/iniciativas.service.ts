import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';
import { IniciativasModel } from 'models/iniciativas.models';

@Injectable({
    providedIn: 'root'
})
export class IniciativasService {
    private baseUrl: string;
    private urlIniciativas = 'iniciativas';
    private urlTipoIniciativas = 'tipo-iniciativas';
    private urlIniciativasFiltrado = 'iniciativas-filtrado';
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

     obtenerIniciativas(): any {
        let usr = JSON.parse(localStorage.getItem('usr'));
      
        this.TOKEN = localStorage.getItem('token');
        let httpOptions = {
            headers: new HttpHeaders({
                Authorization: this.TOKEN,
            }),
        }
        return this.http.get(this.baseUrl + this.urlIniciativas + '/' + usr[0].data.id, httpOptions);
    }

    actualizarIniciativa(iniciativa: any): any {
        this.TOKEN = localStorage.getItem('token');
        let httpOptions = {
            headers: new HttpHeaders({
                Authorization: this.TOKEN,
            }),
        }
        return this.http.put(this.baseUrl + this.urlIniciativas + '/' + iniciativa.id, iniciativa, httpOptions);
    }

    guardarIniciativa(iniciativa: IniciativasModel): any {
        this.TOKEN = localStorage.getItem('token');
        let httpOptions = {
            headers: new HttpHeaders({
                Authorization: this.TOKEN,
            }),
        }
        return this.http.post(this.baseUrl + this.urlIniciativas, iniciativa, httpOptions);
    }

    eliminarIniciativa(ruta: string): any {
        this.TOKEN = localStorage.getItem('token');
        let httpOptions = {
            headers: new HttpHeaders({
                Authorization: this.TOKEN,
            }),
        }
        return this.http.delete(this.baseUrl + this.urlIniciativas + '/' + ruta, httpOptions);
    }

    obtenerTiposIniciativas(): any {
        this.TOKEN = localStorage.getItem('token');
        let httpOptions = {
            headers: new HttpHeaders({
                Authorization: this.TOKEN,
            }),
        }
        return this.http.get(this.baseUrl + this.urlTipoIniciativas, httpOptions);
    }

    obtenerIniciativasFiltrado(filtro: string): any {
        this.TOKEN = localStorage.getItem('token');
        let httpOptions = {
            headers: new HttpHeaders({
                Authorization: this.TOKEN,
            }),
        }
        return this.http.get(this.baseUrl + this.urlIniciativasFiltrado + '/' + filtro, httpOptions);
    }
}
