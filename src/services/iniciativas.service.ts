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
    private TOKEN = localStorage.getItem('token');

    private httpOptions = {
        headers: new HttpHeaders({
            Authorization: this.TOKEN,
        }),
    };
    constructor(private http: HttpClient) {
        this.baseUrl = environment.apiCms;
    }

    obtenerIniciativas(): any {
        return this.http.get(this.baseUrl + this.urlIniciativas, this.httpOptions);
    }

    actualizarIniciativa(iniciativa: IniciativasModel): any {
        return this.http.put(this.baseUrl + this.urlIniciativas + '/' + iniciativa.id, iniciativa, this.httpOptions);
    }

    guardarIniciativa(iniciativa: IniciativasModel): any {
        return this.http.post(this.baseUrl + this.urlIniciativas, iniciativa, this.httpOptions);
    }

    eliminarIniciativa(ruta: string): any {
        return this.http.delete(this.baseUrl + this.urlIniciativas + '/' + ruta, this.httpOptions);
    }


    obtenerTiposIniciativas(): any {
        return this.http.get(this.baseUrl + this.urlTipoIniciativas, this.httpOptions);
    }
}
