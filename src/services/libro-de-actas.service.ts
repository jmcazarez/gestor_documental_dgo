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
        return this.http.get(this.baseUrl + this.urlLibroDeActas, this.httpOptions);
    }

    actualizarLibroDeActas(libro: LibroDeActasModel): any {
        return this.http.put(this.baseUrl + this.urlLibroDeActas + '/' + libro.id, libro, this.httpOptions);
    }

    guardarLibroDeActas(libro: LibroDeActasModel): any {
        return this.http.post(this.baseUrl + this.urlLibroDeActas, libro, this.httpOptions);
    }

    eliminarLibroDeActas(ruta: string): any {
        return this.http.delete(this.baseUrl + this.urlLibroDeActas + '/' + ruta, this.httpOptions);
    }

    obtenerLibrosDeActasFiltrado(filtro: string): any {

        return this.http.get(this.baseUrl + this.urlLibroDeActasFiltrado + '/' + filtro, this.httpOptions);
    }
}
