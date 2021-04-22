import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class TipoFormatosService {
    private TOKEN = localStorage.getItem('token');

    private httpOptions = {
        headers: new HttpHeaders({
            Authorization: this.TOKEN,
        }),
    };
    private baseUrl: string;
    private urlTipoFormatos = 'tipo-formatos';
    constructor(private http: HttpClient) {
        this.baseUrl = environment.apiCms;
        this.TOKEN = localStorage.getItem('token');
        this.httpOptions = {
            headers: new HttpHeaders({
                Authorization: this.TOKEN,
            }),
        };
    }

    obtenerTipoFormatos(): any {
        this.TOKEN = localStorage.getItem('token');

        let httpOptions = {
            headers: new HttpHeaders({
                Authorization: this.TOKEN,
            }),
        };
        return this.http.get(this.baseUrl + this.urlTipoFormatos, httpOptions);
    }
}
