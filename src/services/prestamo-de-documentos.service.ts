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
    }

    obtenerPrestamosDeDocumentos(): any {
        return this.http.get(this.baseUrl + this.urlPrestamoDocumentos, this.httpOptions);
    }

    actualizarPrestamosDeDocumentos(prestamoDocumento: PrestamoDeDocumentosModels): any {
        return this.http.put(this.baseUrl + this.urlPrestamoDocumentos + '/' + prestamoDocumento.id, prestamoDocumento, this.httpOptions);
    }

    guardarPrestamosDeDocumentos(prestamoDocumento: PrestamoDeDocumentosModels): any {
        return this.http.post(this.baseUrl + this.urlPrestamoDocumentos, prestamoDocumento, this.httpOptions);
    }

    eliminarPrestamosDeDocumentos(id: string): any {
        return this.http.delete(this.baseUrl + this.urlPrestamoDocumentos + '/' + id, this.httpOptions);
    }
}