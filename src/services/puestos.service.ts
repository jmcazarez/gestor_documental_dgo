import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class PuestosService {

    private baseUrl: string;
    private urlPuestos = 'puestos';
    private TOKEN = localStorage.getItem('token');

    private httpOptions = {
        headers: new HttpHeaders({
            Authorization: this.TOKEN,
        }),
    };
    constructor(private http: HttpClient) {
        this.baseUrl = environment.apiCms;
    }

    obtenerPuestos(): any {
        return this.http.get(this.baseUrl + this.urlPuestos, this.httpOptions);
    }

}
