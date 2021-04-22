import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';
import { MesasDirectivasModel } from 'models/mesas-directivas.models';

@Injectable({
    providedIn: 'root'
})
export class MesasDirectivasService {

    private baseUrl: string;
    private urlMesasDirectivas = 'mesas-directivas';
    private TOKEN = localStorage.getItem('token');
    idMesa: string = '';

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

    obtenerMesas(): any {
        return this.http.get(this.baseUrl + this.urlMesasDirectivas, this.httpOptions);
    }

    actualizarMesa(mesas: MesasDirectivasModel): any {
        return this.http.put(this.baseUrl + this.urlMesasDirectivas + '/' + mesas.id, mesas, this.httpOptions);
    }

    guardarMesa(mesas: MesasDirectivasModel): any {
        return this.http.post(this.baseUrl + this.urlMesasDirectivas, mesas, this.httpOptions);
    }

    eliminarMesa(ruta: string): any {
        return this.http.delete(this.baseUrl + this.urlMesasDirectivas + '/' + ruta, this.httpOptions);
    }
}
