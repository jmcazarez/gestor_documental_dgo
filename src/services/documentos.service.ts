import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from '../environments/environment';
import { DocumentosModel } from 'models/documento.models';

@Injectable({
    providedIn: "root",
})
export class DocumentosService {
    private baseUrl: string;
    private urlDocumentos = "documentos";
    private urlDocumentosSinVersion = "documentos-sinVersion";
    private urlDocumentosBorrar = "documentos-borrar";
    private urlDowloadDocument = "documento-file";
    private urlDescargarDocumentoClasificacion = "documento-file-clasificacion";
    private urlDescargarDocumentoSinVersion = "documento-file-sin-version";
    private urlDocumentosFiltrados = "documentos-filtro";
    private urlDocumentosPorFecha = "versionamiento";
    private urlDocumentoPublico = "compartir";
    private urlDocumentosPorTexto = "documentos-text";
    private TOKEN = localStorage.getItem("token");
    private urlUpload = "upload";

    private httpOptions = {
        headers: new HttpHeaders({
            Authorization: this.TOKEN,
        }),
    };
    constructor(private http: HttpClient) {
        this.baseUrl = environment.apiCms;
        this.TOKEN = localStorage.getItem("token");
        this.httpOptions = {
            headers: new HttpHeaders({
                Authorization: this.TOKEN,
            }),
        };
    }

    obtenerDocumentos(): any {
        this.TOKEN = localStorage.getItem("token");

        let httpOptions = {
            headers: new HttpHeaders({
                Authorization: this.TOKEN,
            }),
        };
        return this.http.get(this.baseUrl + this.urlDocumentos, httpOptions);
    }

    obtenerDocumento(id: string, usuario: string): any {
        return this.http.get(
            this.baseUrl + this.urlDocumentos + "/" + id + "/" + usuario,
            this.httpOptions
        );
    }

    obtenerDocumentoReporte(filtro: string): any {
        this.TOKEN = localStorage.getItem("token");

        let httpOptions = {
            headers: new HttpHeaders({
                Authorization: this.TOKEN,
            }),
        };
        return this.http.get(
            this.baseUrl + this.urlDocumentosFiltrados + "/" + filtro,
            httpOptions
        );
    }

    obtenerDocumentoReportePorFecha(filtro: string): any {
        this.TOKEN = localStorage.getItem("token");

        let httpOptions = {
            headers: new HttpHeaders({
                Authorization: this.TOKEN,
            }),
        };

        return this.http.get(
            this.baseUrl + this.urlDocumentosPorFecha + "/" + filtro,
            httpOptions
        );
    }

    obtenerDocumentoPorTexto(filtro: string): any {
        //filtro = filtro.replace('(',"\\(").replace(')','\\)');
        this.TOKEN = localStorage.getItem("token");

        let httpOptions = {
            headers: new HttpHeaders({
                Authorization: this.TOKEN,
            }),
        };
        console.log(filtro);
        let filtroObjt: any;
        filtroObjt = {
            texto: filtro,
        };
        return this.http.post(
            this.baseUrl + this.urlDocumentosPorTexto,
            filtroObjt,
            httpOptions
        );
    }

    actualizarDocumentos(documento: DocumentosModel): any {
        this.TOKEN = localStorage.getItem("token");
        let httpOptions = {
            headers: new HttpHeaders({
                Authorization: this.TOKEN,
            }),
        };
        documento.fechaCarga = documento.fechaCarga;
        documento.fechaCreacion = documento.fechaCreacion;
        console.log(this.baseUrl + this.urlDocumentos + "/" + documento.id);
        return this.http.put(
            this.baseUrl + this.urlDocumentos + "/" + documento.id,
            documento,
            httpOptions
        );
    }

    actualizarDocumentosSinVersion(documento: DocumentosModel): any {
        this.TOKEN = localStorage.getItem("token");
        let httpOptions = {
            headers: new HttpHeaders({
                Authorization: this.TOKEN,
            }),
        };
        documento.fechaCarga = documento.fechaCarga;
        documento.fechaCreacion = documento.fechaCreacion;

        return this.http.put(
            this.baseUrl + this.urlDocumentosSinVersion + "/" + documento.id,
            documento,
            httpOptions
        );
    }

    borrarDocumentos(documento: DocumentosModel): any {
        this.TOKEN = localStorage.getItem("token");
        let httpOptions = {
            headers: new HttpHeaders({
                Authorization: this.TOKEN,
            }),
        };
        documento.documento = "";
        documento.fechaCarga = documento.fechaCarga;
        documento.fechaCreacion = documento.fechaCreacion;
        return this.http.put(
            this.baseUrl + this.urlDocumentosBorrar + "/" + documento.id,
            documento,
            httpOptions
        );
    }

    guardarDocumentos(documento: DocumentosModel): any {
        let options = {
            headers: new HttpHeaders({
                Authorization: localStorage.getItem("token"),
            }),
        };
        return this.http.post(
            this.baseUrl + this.urlDocumentos,
            documento,
            options
        );
    }
    guardarDocumento(documento: any): any {
        let options = {
            headers: new HttpHeaders({
                Authorization: localStorage.getItem("token"),
            }),
        };
        return this.http.post(
            this.baseUrl + this.urlDocumentos,
            documento,
            options
        );
    }

    eliminarDocumentos(ruta: string, usuario: string): any {
        return this.http.delete(
            this.baseUrl + this.urlDocumentos + "/" + ruta + "/" + usuario,
            this.httpOptions
        );
    }
    dowloadDocument(
        idFile: string,
        idDocumento: string,
        usuario: string,
        nombreDocumento: string
    ): any {
        let options = {
            headers: new HttpHeaders({
                Authorization: localStorage.getItem("token"),
            }),
        };

        if (usuario.length > 0) {
            return this.http.get(
                this.baseUrl +
                    this.urlDowloadDocument +
                    "/" +
                    idFile +
                    "/" +
                    idDocumento +
                    "/" +
                    usuario +
                    "/" +
                    nombreDocumento,
                options
            );
        } else {
            return this.http.get(
                this.baseUrl + this.urlDowloadDocument + "/" + idFile,
                options
            );
        }
    }

    documentoFileSinVersion(
        idFile: string,
        idDocumento: string,
        usuario: string,
        nombreDocumento: string
    ): any {
        console.log("documentoFileSinVersion");
        let options = {
            headers: new HttpHeaders({
                Authorization: localStorage.getItem("token"),
            }),
        };
        return this.http.get(
            this.baseUrl +
                this.urlDescargarDocumentoSinVersion +
                "/" +
                idFile +
                "/" +
                idDocumento +
                "/" +
                usuario +
                "/" +
                nombreDocumento,
            options
        );
    }

    dowloadDocumentClasificacion(
        idFile: string,
        idDocumento: string,
        usuario: string,
        nombreDocumento: string
    ): any {
        console.log("urlDescargarDocumentoClasificacion");
        console.log(idDocumento);
        let options = {
            headers: new HttpHeaders({
                Authorization: localStorage.getItem("token"),
            }),
        };
        return this.http.get(
            this.baseUrl +
                this.urlDescargarDocumentoClasificacion +
                "/" +
                idFile +
                "/" +
                idDocumento +
                "/" +
                usuario +
                "/" +
                nombreDocumento,
            options
        );
    }

    // tslint:disable-next-line: typedef
    uploadDocument(file: any) {
        let options = {
            headers: new HttpHeaders({
                Authorization: localStorage.getItem("token"),
            }),
        };
        return new Promise((resolve) => {
            {
                const formData: FormData = new FormData();
                // Enviamos la imagen
                formData.append("files", file, file.name);
                this.http
                    .post(this.baseUrl + this.urlUpload, formData, options)
                    .subscribe(
                        (res) => {
                            resolve(res);
                        },
                        (err) => {
                            resolve(err);
                        }
                    );
            }
        });
    }

    printPdf() {
        setTimeout(() => {
            window.print();
        });
    }
}
