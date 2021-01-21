import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from '../environments/environment';
import { DocumentosModel } from 'models/documento.models';

@Injectable({
    providedIn: 'root'
})
export class DocumentosService {

    private baseUrl: string;
    private urlDocumentos = 'documentos';
    private urlDocumentosSinVersion = 'documentos-sinVersion';
    private urlDocumentosBorrar = 'documentos-borrar';
    private urlDowloadDocument = 'documento-file';
    private urlDescargarDocumentoClasificacion = 'documento-file-clasificacion';
    private urlDocumentosFiltrados = 'documentos-filtro';
    private urlDocumentosPorFecha = 'versionamiento';
	private urlDocumentoPublico = 'compartir';
	private urlDocumentosPorTexto = 'documentos-text';
    private TOKEN = localStorage.getItem('token');
    private urlUpload = 'upload';

    private httpOptions = {
        headers: new HttpHeaders({
            Authorization: this.TOKEN,
        }),
    };
    constructor(private http: HttpClient) {
        this.baseUrl = environment.apiCms;
    }

    obtenerDocumentos(): any {
        return this.http.get(this.baseUrl + this.urlDocumentos, this.httpOptions);
    }

    obtenerDocumento(id: string, usuario: string): any {
        return this.http.get(this.baseUrl + this.urlDocumentos + '/' + id + '/' + usuario, this.httpOptions);
    }

    obtenerDocumentoReporte(filtro: string): any {
        return this.http.get(this.baseUrl + this.urlDocumentosFiltrados + '/' + filtro, this.httpOptions);
    }

    obtenerDocumentoReportePorFecha(filtro: string): any {

        return this.http.get(this.baseUrl + this.urlDocumentosPorFecha + '/' + filtro,
            this.httpOptions);
    }

    obtenerDocumentoPorTexto(filtro: string): any {
        return this.http.get(this.baseUrl + this.urlDocumentosPorTexto + '/' + filtro, this.httpOptions);
    }

    actualizarDocumentos(documento: DocumentosModel): any {

        documento.fechaCarga = documento.fechaCarga;
        documento.fechaCreacion = documento.fechaCreacion;
        return this.http.put(this.baseUrl + this.urlDocumentos + '/' + documento.id, documento, this.httpOptions);
    }

    actualizarDocumentosSinVersion(documento: DocumentosModel): any {

        documento.fechaCarga = documento.fechaCarga;
        documento.fechaCreacion = documento.fechaCreacion;
        return this.http.put(this.baseUrl + this.urlDocumentosSinVersion + '/' + documento.id, documento, this.httpOptions);
    }

    borrarDocumentos(documento: DocumentosModel): any {
        documento.fechaCarga = documento.fechaCarga;
        documento.fechaCreacion = documento.fechaCreacion;
        return this.http.put(this.baseUrl + this.urlDocumentosBorrar + '/' + documento.id, documento, this.httpOptions);
    }

    guardarDocumentos(documento: DocumentosModel): any {

        return this.http.post(this.baseUrl + this.urlDocumentos, documento, this.httpOptions);
    }
    guardarDocumento(documento: any): any {

        return this.http.post(this.baseUrl + this.urlDocumentos, documento, this.httpOptions);
    }

    eliminarDocumentos(ruta: string, usuario: string): any {
        
        return this.http.delete(this.baseUrl + this.urlDocumentos + '/' + ruta + '/' + usuario, this.httpOptions);
    }
    dowloadDocument(idFile: string, idDocumento: string, usuario: string, nombreDocumento: string): any {

        let options = {
            headers: new HttpHeaders({
                Authorization: localStorage.getItem('token'),
            }),
        };

        if(usuario.length > 0){
            return this.http.get(this.baseUrl + this.urlDowloadDocument + '/' + idFile + '/' + idDocumento + '/' + usuario + '/' + nombreDocumento, options);
        }else{
            return this.http.get(this.baseUrl + this.urlDowloadDocument + '/' + idFile , options);
        }   
        
    }
    dowloadDocumentClasificacion(idFile: string, idDocumento: string, usuario: string, nombreDocumento: string): any {
        return this.http.get(this.baseUrl + this.urlDescargarDocumentoClasificacion + '/' + idFile + '/' + idDocumento + '/' + usuario + '/' + nombreDocumento, this.httpOptions);
    }

    // tslint:disable-next-line: typedef
    uploadDocument(file: any) {
        return new Promise(resolve => {
            {
                const formData: FormData = new FormData();
                // Enviamos la imagen
                formData.append('files', file, file.name);
                this.http.post(this.baseUrl + this.urlUpload, formData, this.httpOptions).subscribe(
                    (res) => {

                        resolve(res);

                    },
                    (err) => {
                        resolve(err);
                    });

            }
        });
    }
}
