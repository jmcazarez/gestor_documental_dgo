import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ActasSesionsService {

    private baseUrl: string;
    private urlActasSesions = 'actas-sesions';
    private urlActasSesionsFiltrado = 'actas-sesions-filtrado';
    private TOKEN = localStorage.getItem('token');

    private httpOptions = {
        headers: new HttpHeaders({
            Authorization: this.TOKEN,
        }),
    };
    constructor(private http: HttpClient) {
        this.baseUrl = environment.apiCms;
    }

    obtenerActasSesions(): any {
        return this.http.get(this.baseUrl + this.urlActasSesions, this.httpOptions);
    }

    actualizarActasSesions(actasSesions: any): any {
        return this.http.put(this.baseUrl + this.urlActasSesions + '/' + actasSesions.id, actasSesions, this.httpOptions);
    }

    guardarActasSesions(actasSesions: any): any {
        return this.http.post(this.baseUrl + this.urlActasSesions, actasSesions, this.httpOptions);
    }

    eliminarActasSesions(id: string): any {

        return this.http.delete(this.baseUrl + this.urlActasSesions + '/' + id, this.httpOptions);
    }

    obtenerActasSesionsFiltrado(filtro: string): any {

        return this.http.get(this.baseUrl + this.urlActasSesionsFiltrado + '/' + filtro, this.httpOptions);
    }
}