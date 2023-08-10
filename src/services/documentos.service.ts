import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from '../environments/environment';
import { DocumentosModel } from 'models/documento.models';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: "root",
})
export class DocumentosService {
    private baseUrl: string;
    private baseUrlStrapi: string;
    private urlDocumentos = "documentos";
    private urlDocumentosFiltro = "documentos-filtrados";
    private urlDocumentosConsulto = "documentos-consulto";
    private urlDocumentosSinVersion = "documentos-sinVersion";
    private urlDocumentosBorrar = "documentos-borrar";
    private urlDowloadDocument = "documento-file";
    private urlDescargarDocumentoClasificacion = "documento-file-clasificacion";
    private urlDescargarDocumentoSinVersion = "documento-file-sin-version";
    private urlDocumentosFiltrados = "documentos-filtro";
    private urlDocumentosPorFecha = "versionamiento-rango";
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
        this.baseUrlStrapi = environment.apiStrapi
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

    obtenerDocumentosFiltrados(filtro: any): any {
        this.TOKEN = localStorage.getItem("token");
        console.log('filtro');
        let httpOptions = {
            headers: new HttpHeaders({
                Authorization: this.TOKEN,
            }),
        };
        return this.http.post(this.baseUrl + this.urlDocumentosFiltro, filtro, httpOptions);
    }

    obtenerDocumento(id: string): any {
        this.TOKEN = localStorage.getItem("token");

        let httpOptions = {
            headers: new HttpHeaders({
                Authorization: this.TOKEN,
            }),
        };
        return this.http.get(
            this.baseUrl + this.urlDocumentos + "/" + id,
            httpOptions
        );
    }

    obtenerDocumentoConsulto(id: string): any {
        this.TOKEN = localStorage.getItem("token");

        let httpOptions = {
            headers: new HttpHeaders({
                Authorization: this.TOKEN,
            }),
        };
        return this.http.get(
            this.baseUrl + this.urlDocumentosConsulto + "/" + id,
            httpOptions
        );
    }

    obtenerDocumentoById(id: string): any {
        this.TOKEN = localStorage.getItem("token");

        let httpOptions = {
            headers: new HttpHeaders({
                Authorization: this.TOKEN,
            }),
        };
        return this.http.get(
            this.baseUrl + this.urlDocumentos + "/" + id,
            httpOptions
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

    obtenerDocumentoReportePorFecha(cFechaInicial: string,cFechaFinal: string): any {
        this.TOKEN = localStorage.getItem("token");

        let httpOptions = {
            headers: new HttpHeaders({
                Authorization: this.TOKEN,
            }),
        };

        return this.http.get(
            this.baseUrl + this.urlDocumentosPorFecha + "/" + cFechaInicial+ "/" + cFechaFinal,
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
        nombreDocumento: string
    ): any {
        let options = {
            headers: new HttpHeaders({
                Authorization: localStorage.getItem("token"),
            }),
        };
        let headers = new HttpHeaders();
        headers = headers.set('Accept', 'application/pdf');
        return this.http.get(this.baseUrlStrapi + 'uploads' + "/" + idFile, { headers: headers, responseType: 'blob' });
        /*   console.log(this.baseUrl + this.urlDowloadDocument + "/" + idFile);
          return this.http.get(
              this.baseUrl + this.urlDowloadDocument + "/" + idFile,
              options
          ); */
    }

    dowloadDocumentStrapi(
        url: string
    ): Observable<any> {

        let headers = new HttpHeaders();
        headers = headers.set('Accept', 'application/pdf');

        return this.http.get(url, { headers: headers, responseType: 'blob' });


        /*     let options = {
                headers: new HttpHeaders({
                    Authorization: localStorage.getItem("token"),
                }),
            };
    
            return this.http.get(
                url,
                options
            );*/
    }

    documentoFileSinVersion(
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
        console.log(this.baseUrl +
            this.urlDescargarDocumentoSinVersion +
            "/" +
            idFile +
            "/" +
            idDocumento +
            "/" +
            usuario +
            "/" +
            nombreDocumento,)

        console.log(localStorage.getItem("token"));
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
        nombreDocumento: string
    ): any {
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

    obtenerUpload(id: any) {
      
        return new Promise((resolve) => {
            {
           
                this.http
                    .get(this.baseUrlStrapi + this.urlUpload + '/files/' + id)
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
