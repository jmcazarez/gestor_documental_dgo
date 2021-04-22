import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';
import { InventarioFisicoModels } from 'models/inventario-fisico.models';

@Injectable({
    providedIn: 'root'
})
export class InventarioFisicoService {

    private baseUrl: string;
    private urlInventarioFisico = 'inventario-fisicos';
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

    obtenerInventario(): any {
        return this.http.get(this.baseUrl + this.urlInventarioFisico, this.httpOptions);
    }

    actualizarInventario(inventario: InventarioFisicoModels): any {
        return this.http.put(this.baseUrl + this.urlInventarioFisico + '/' + inventario.id, inventario, this.httpOptions);
    }

    guardarInventario(inventario: InventarioFisicoModels): any {
        return this.http.post(this.baseUrl + this.urlInventarioFisico, inventario, this.httpOptions);
    }

    eliminarInventario(id: string): any {
        return this.http.delete(this.baseUrl + this.urlInventarioFisico + '/' + id, this.httpOptions);
    }
}