import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ParametrosService {
    private baseUrl: string;
    private TOKEN = localStorage.getItem('token');
    private urlParametros = 'parametros';
    private httpOptions = {
        headers: new HttpHeaders({
            Authorization: this.TOKEN,
        }),
    };
    constructor(private http: HttpClient) {
        this.baseUrl = environment.apiCms;
    }

     obtenerParametros(filtro: string): any {     
        return this.http.get(this.baseUrl + this.urlParametros + '/' + filtro , this.httpOptions);      
    }

}
