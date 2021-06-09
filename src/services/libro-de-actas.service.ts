import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';
import { LibroDeActasModel } from 'models/libro-de-actas.models';

@Injectable({
    providedIn: 'root'
})
export class LibroDeActasService {

    private baseUrl: string;
    private urlLibroDeActas = 'libro-de-actas';
    private urlLibroDeActasFiltrado = 'libro-de-actas-filtrado';
 
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

    obtenerLibrosDeActas(): any {
        this.TOKEN = localStorage.getItem('token');
        let httpOptions = {
            headers: new HttpHeaders({
                Authorization: this.TOKEN,
            }),
        }
        return this.http.get(this.baseUrl + this.urlLibroDeActas, httpOptions);
    }

    actualizarLibroDeActas(libro: LibroDeActasModel): any {
        this.TOKEN = localStorage.getItem('token');
        let httpOptions = {
            headers: new HttpHeaders({
                Authorization: this.TOKEN,
            }),
        }
        return this.http.put(this.baseUrl + this.urlLibroDeActas + '/' + libro.id, libro, httpOptions);
    }

    guardarLibroDeActas(libro: LibroDeActasModel): any {
        this.TOKEN = localStorage.getItem('token');
        let httpOptions = {
            headers: new HttpHeaders({
                Authorization: this.TOKEN,
            }),
        }
        return this.http.post(this.baseUrl + this.urlLibroDeActas, libro, httpOptions);
    }

    eliminarLibroDeActas(ruta: string): any {
        this.TOKEN = localStorage.getItem('token');
        let httpOptions = {
            headers: new HttpHeaders({
                Authorization: this.TOKEN,
            }),
        }
        return this.http.delete(this.baseUrl + this.urlLibroDeActas + '/' + ruta, httpOptions);
    }

    obtenerLibrosDeActasFiltrado(filtro: string): any {
        this.TOKEN = localStorage.getItem('token');
        let httpOptions = {
            headers: new HttpHeaders({
                Authorization: this.TOKEN,
            }),
        }
        return this.http.get(this.baseUrl + this.urlLibroDeActasFiltrado + '/' + filtro, httpOptions);
    }
}
