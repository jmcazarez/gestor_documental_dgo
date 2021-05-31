La parte central del proyecto se encuentra dentro de los componentes. Ahí es donde se define la interfaz (html), estilos (scss) y funcionalidad (ts).

Ejemplo:

	main
	    diputado
		      	diputado.component.html
            diputado.component.scss
            diputado.component.ts
            diputado.module.ts
            guardar-diputado
              guardar-diputado.component.html
              guardar-diputado.component.scss
              guardar-diputado.component.ts
              guardar-diputado.module.ts
          
Para lograr la comunicación con el backend se hace mediante los servicios.

Ejemplo:

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';
import { DiputadosModel } from 'models/diputados.models';

@Injectable({
    providedIn: 'root'
})
export class DiputadosService {

    private baseUrl: string;
    private urlDiputados = 'diputados';
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

    obtenerDiputados(): any {
        this.TOKEN = localStorage.getItem('token');
        let httpOptions = {
            headers: new HttpHeaders({
                Authorization: this.TOKEN,
            }),
        }
        return this.http.get(this.baseUrl + this.urlDiputados, httpOptions);
    }

    actualizarDiputados(Diputados: DiputadosModel): any {
        this.TOKEN = localStorage.getItem('token');
        let httpOptions = {
            headers: new HttpHeaders({
                Authorization: this.TOKEN,
            }),
        }
        return this.http.put(this.baseUrl + this.urlDiputados + '/' + Diputados.id, Diputados, httpOptions);
    }

    guardarDiputados(Diputados: DiputadosModel): any {
        this.TOKEN = localStorage.getItem('token');
        let httpOptions = {
            headers: new HttpHeaders({
                Authorization: this.TOKEN,
            }),
        }
        return this.http.post(this.baseUrl + this.urlDiputados, Diputados, httpOptions);
    }

    eliminarDiputados(id: string): any {
        this.TOKEN = localStorage.getItem('token');
        let httpOptions = {
            headers: new HttpHeaders({
                Authorization: this.TOKEN,
            }),
        }
        return this.http.delete(this.baseUrl + this.urlDiputados + '/' + id, httpOptions);
    }
}
