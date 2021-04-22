import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';
import { ComisionesModel } from 'models/comisiones.models';

@Injectable({
    providedIn: 'root'
})
export class ComisionesService {

    private baseUrl: string;
    private urlComisiones = 'comisiones';
    private urlTipoComisiones = 'tipo_de_comisiones';
    private TOKEN = localStorage.getItem('token');
    idComision: string = '';

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

    obtenerComisiones(): any {
        return this.http.get(this.baseUrl + this.urlComisiones, this.httpOptions);
    }

    obtenerTipoComisiones(): any {
        return this.http.get(this.baseUrl + this.urlTipoComisiones, this.httpOptions);
    }

    actualizarComision(comision: ComisionesModel): any {
        return this.http.put(this.baseUrl + this.urlComisiones + '/' + comision.id, comision, this.httpOptions);
    }

    guardarComision(comision: ComisionesModel): any {
        return this.http.post(this.baseUrl + this.urlComisiones, comision, this.httpOptions);
    }

    eliminarComision(id: string): any {

        return this.http.delete(this.baseUrl + this.urlComisiones + '/' + id, this.httpOptions);
    }
}