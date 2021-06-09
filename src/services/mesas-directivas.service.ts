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
        this.TOKEN = localStorage.getItem('token');
        let httpOptions = {
            headers: new HttpHeaders({
                Authorization: this.TOKEN,
            }),
        }
        return this.http.get(this.baseUrl + this.urlMesasDirectivas, httpOptions);
    }

    actualizarMesa(mesas: MesasDirectivasModel): any {
        this.TOKEN = localStorage.getItem('token');
        let httpOptions = {
            headers: new HttpHeaders({
                Authorization: this.TOKEN,
            }),
        }
        return this.http.put(this.baseUrl + this.urlMesasDirectivas + '/' + mesas.id, mesas, httpOptions);
    }

    guardarMesa(mesas: MesasDirectivasModel): any {
        this.TOKEN = localStorage.getItem('token');
        let httpOptions = {
            headers: new HttpHeaders({
                Authorization: this.TOKEN,
            }),
        }
        return this.http.post(this.baseUrl + this.urlMesasDirectivas, mesas,httpOptions);
    }

    eliminarMesa(ruta: string): any {
        this.TOKEN = localStorage.getItem('token');
        let httpOptions = {
            headers: new HttpHeaders({
                Authorization: this.TOKEN,
            }),
        }
        return this.http.delete(this.baseUrl + this.urlMesasDirectivas + '/' + ruta, httpOptions);
    }
}
