import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';
import { DistritosModel } from 'models/distritos.models';

@Injectable({
    providedIn: 'root'
})
export class DistritosService {

    private baseUrl: string;
    private urlDistritos = 'distritos';
    private TOKEN = localStorage.getItem('token');

    private httpOptions = {
        headers: new HttpHeaders({
            Authorization: this.TOKEN,
        }),
    };
    constructor(private http: HttpClient) {
        this.baseUrl = environment.apiCms;
    }

    obtenerDistritos(): any {
        return this.http.get(this.baseUrl + this.urlDistritos, this.httpOptions);
    }

}
