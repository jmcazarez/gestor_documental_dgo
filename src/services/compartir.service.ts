import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';
import { CompartidosModel } from '../models/compartidos.models';
import { CompartirModel } from 'models/compartir.models';

@Injectable({
    providedIn: 'root'
})
export class DocumentosCompartidosService {

    private baseUrl: string;
    private urlDowloadDocument = 'documento-file';
    private urlDescargarDocumentoClasificacion = 'documento-file-clasificacion';
    private TOKEN = localStorage.getItem('token');
    private urlDocumentoPublico = 'compartir';

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

    documentoCompartido(id: string){
        return this.http.get(this.baseUrl + this.urlDocumentoPublico + '/' + id);
    }

    dowloadDocument(idFile: string, idDocumento: string, usuario: string, nombreDocumento: string): any {
        return this.http.get(this.baseUrl + this.urlDowloadDocument + '/' + idFile + '/' + idDocumento + '/' + usuario + '/' + nombreDocumento, this.httpOptions);
    }

    dowloadDocumentClasificacion(idFile: string, idDocumento: string, usuario: string, nombreDocumento: string): any {
        return this.http.get(this.baseUrl + this.urlDescargarDocumentoClasificacion + '/' + idFile + '/' + idDocumento + '/' + usuario + '/' + nombreDocumento, this.httpOptions);
    }

    downloadAlready(compartidos: CompartirModel): any{
        //sin httpoptions debido a que no necesita token de autenticacion
        return this.http.put(this.baseUrl + this.urlDocumentoPublico + '/' + compartidos.id, compartidos);
    }
    
    linkGenerate(documento: string){
        //console.log(documento + 'service');
        return this.http.post(this.baseUrl + this.urlDocumentoPublico, {documento}, this.httpOptions);
    }
}
