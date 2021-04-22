import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';
import { DependenciasModel } from 'models/dependencias.model';

@Injectable({
    providedIn: 'root'
})
export class DependenciasService {

    private baseUrl: string;
    private urlDependencias = 'dependencias';
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

    obtenerDependencias(): any {
        return this.http.get(this.baseUrl + this.urlDependencias, this.httpOptions);
    }

    actualizarDependencias(dependencia: DependenciasModel): any {
        return this.http.put(this.baseUrl + this.urlDependencias + '/' + dependencia.id, dependencia, this.httpOptions);
    }

    guardarDependencias(dependencia: DependenciasModel): any {
        return this.http.post(this.baseUrl + this.urlDependencias, dependencia, this.httpOptions);
    }

    eliminarDependencias(ruta: string): any {

        return this.http.delete(this.baseUrl + this.urlDependencias + '/' + ruta, this.httpOptions);
    }
}
