import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';
import { EntesModel } from 'models/entes.models';

@Injectable({
    providedIn: 'root'
})
export class EntesService {

    private baseUrl: string;
    private urlEntes = 'entes';
    private TOKEN = localStorage.getItem('token');

    private httpOptions = {
        headers: new HttpHeaders({
            Authorization: this.TOKEN,
        }),
    };
    constructor(private http: HttpClient) {
        this.baseUrl = environment.apiCms;
    }

    obtenerEntes(): any {
        return this.http.get(this.baseUrl + this.urlEntes, this.httpOptions);
    }

    actualizarEnte(entes: EntesModel): any {
        return this.http.put(this.baseUrl + this.urlEntes + '/' + entes.id, entes, this.httpOptions);
    }

    guardarEnte(entes: EntesModel): any {
        return this.http.post(this.baseUrl + this.urlEntes, entes, this.httpOptions);
    }

    eliminarEnte(ruta: string): any {

        return this.http.delete(this.baseUrl + this.urlEntes + '/' + ruta, this.httpOptions);
    }
}
