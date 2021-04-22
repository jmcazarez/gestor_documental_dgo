import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';
import { EntidadesModel } from 'models/entidades.models';

@Injectable({
    providedIn: 'root'
})
export class EntidadesService {

    private baseUrl: string;
    private urlEntidades = 'entidades';
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

    obtenerEntidades(): any {
        return this.http.get(this.baseUrl + this.urlEntidades, this.httpOptions);
    }

    actualizarEntidades(entidad: EntidadesModel): any {
        return this.http.put(this.baseUrl + this.urlEntidades + '/' + entidad.id, entidad, this.httpOptions);
    }

    guardarEntidad(entidad: EntidadesModel): any {
        return this.http.post(this.baseUrl + this.urlEntidades, entidad, this.httpOptions);
    }

    eliminarEntidad(ruta: string): any {

        return this.http.delete(this.baseUrl + this.urlEntidades + '/' + ruta, this.httpOptions);
    }
}
