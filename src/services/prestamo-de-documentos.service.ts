import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';
import { PrestamoDeDocumentosModels } from 'models/prestamo-de-documentos.models';

@Injectable({
    providedIn: 'root'
})
export class PrestamosDeDocumentosService {

    private baseUrl: string;
    private urlPrestamoDocumentos = 'prestamo-de-documentos';
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

    obtenerPrestamosDeDocumentos(): any {
        this.TOKEN = localStorage.getItem('token');
        let httpOptions = {
            headers: new HttpHeaders({
                Authorization: this.TOKEN,
            }),
        }
        return this.http.get(this.baseUrl + this.urlPrestamoDocumentos, httpOptions);
    }

    actualizarPrestamosDeDocumentos(prestamoDocumento: PrestamoDeDocumentosModels): any {
        this.TOKEN = localStorage.getItem('token');
        let httpOptions = {
            headers: new HttpHeaders({
                Authorization: this.TOKEN,
            }),
        }
        return this.http.put(this.baseUrl + this.urlPrestamoDocumentos + '/' + prestamoDocumento.id, prestamoDocumento, httpOptions);
    }

    guardarPrestamosDeDocumentos(prestamoDocumento: PrestamoDeDocumentosModels): any {
        this.TOKEN = localStorage.getItem('token');
        let httpOptions = {
            headers: new HttpHeaders({
                Authorization: this.TOKEN,
            }),
        }
        return this.http.post(this.baseUrl + this.urlPrestamoDocumentos, prestamoDocumento, httpOptions);
    }

    eliminarPrestamosDeDocumentos(id: string): any {
        this.TOKEN = localStorage.getItem('token');
        let httpOptions = {
            headers: new HttpHeaders({
                Authorization: this.TOKEN,
            }),
        }
        return this.http.delete(this.baseUrl + this.urlPrestamoDocumentos + '/' + id, httpOptions);
    }
}