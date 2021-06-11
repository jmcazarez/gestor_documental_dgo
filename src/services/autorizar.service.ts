import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';
import { DistritosModel } from 'models/distritos.models';

@Injectable({
    providedIn: 'root'
})
export class AutorizarService {

    private baseUrl: string;
    private urlFirmaDigitalPaso1 = 'multiSignedMessage_Init';
    private urlFirmaDigitalPaso2 = 'multiSignedMessage_GetHash';
    private urlFirmaDigitalPaso11 = 'firmaDigitalPaso1';
    private urlFirmaDigitalPaso3 = 'multiSignedMessage_Update';
    private urlFirmaDigitalPaso4 = 'multiSignedMessage_Final';
    private urlAutorizarRegistro = 'autorizacion';

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

    autorizarDocumentoPaso1(fileName, numeroFirmantes, fileBase64): any {


        this.TOKEN = localStorage.getItem('token');
        let httpOptions = {
            headers: new HttpHeaders({
                Authorization: this.TOKEN,
            }),
        }

        let objeto = {
            fileName, numeroFirmantes, fileBase64
        }
        return this.http.post(this.baseUrl + this.urlFirmaDigitalPaso1, objeto);
    }

    autorizarDocumentoPaso2(processID: number, cerBase64: String): any {


        this.TOKEN = localStorage.getItem('token');
        let httpOptions = {
            headers: new HttpHeaders({
                Authorization: this.TOKEN,
            }),
        }

        let objeto = {
            processID, cerBase64
        }
        return this.http.post(this.baseUrl + this.urlFirmaDigitalPaso2, objeto);
    }
    autorizarDocumentoPaso11(fileName, numeroFirmantes, cerBase64, fileBase64): any {


        this.TOKEN = localStorage.getItem('token');
        let httpOptions = {
            headers: new HttpHeaders({
                Authorization: this.TOKEN,
            }),
        }

        let objeto = {
            fileName, numeroFirmantes, cerBase64, fileBase64
        }
        return this.http.post(this.baseUrl + this.urlFirmaDigitalPaso11, objeto);
    }

    autorizarDocumentoPaso3(filePKCSBase64, fileName, processID, serialNumber): any {


        this.TOKEN = localStorage.getItem('token');
        let httpOptions = {
            headers: new HttpHeaders({
                Authorization: this.TOKEN,
            }),
        }

        let objeto = {
            filePKCSBase64, fileName, processID, serialNumber
        }
        return this.http.post(this.baseUrl + this.urlFirmaDigitalPaso3, objeto);
    }
    autorizarDocumentoPaso4(processID): any {


        this.TOKEN = localStorage.getItem('token');
        let httpOptions = {
            headers: new HttpHeaders({
                Authorization: this.TOKEN,
            }),
        }

        let objeto = {
            processID
        }
        return this.http.post(this.baseUrl + this.urlFirmaDigitalPaso4, objeto);
    }

    autorizarRegistro(objeto: any): any {
        this.TOKEN = localStorage.getItem('token');
        let httpOptions = {
            headers: new HttpHeaders({
                Authorization: this.TOKEN,
            }),
        }


        return this.http.post(this.baseUrl + this.urlAutorizarRegistro, objeto, httpOptions);
    }
    obtenerAutorizacionesPorIdDocumento(idDocumento: string): any {
        this.TOKEN = localStorage.getItem('token');
        let httpOptions = {
            headers: new HttpHeaders({
                Authorization: this.TOKEN,
            }),
        }


        return this.http.get(this.baseUrl + this.urlAutorizarRegistro + '/' + idDocumento, httpOptions);
    }
    obtenerAutorizacionesPorEmpleado(idEmpleado: string): any {
        this.TOKEN = localStorage.getItem('token');
        let httpOptions = {
            headers: new HttpHeaders({
                Authorization: this.TOKEN,
            }),
        }


        return this.http.get(this.baseUrl + this.urlAutorizarRegistro + '-empleado/' + idEmpleado, httpOptions);
    }
    atualizarAutorizacionEncabezado(autorizacion: any): any {
        this.TOKEN = localStorage.getItem('token');
        let httpOptions = {
            headers: new HttpHeaders({
                Authorization: this.TOKEN,
            }),
        }
        return this.http.put(this.baseUrl + this.urlAutorizarRegistro + '-encabezado/' + autorizacion.id, autorizacion, httpOptions);
    }
    atualizarAutorizacionDetalle(autorizacionDetalle: any): any {
        this.TOKEN = localStorage.getItem('token');
        let httpOptions = {
            headers: new HttpHeaders({
                Authorization: this.TOKEN,
            }),
        }
        return this.http.put(this.baseUrl + this.urlAutorizarRegistro + '-detalle/' + autorizacionDetalle.id, autorizacionDetalle, httpOptions);
    }
    obtenerDetalleAutorizacionPorId(id: string): any {
        this.TOKEN = localStorage.getItem('token');
        let httpOptions = {
            headers: new HttpHeaders({
                Authorization: this.TOKEN,
            }),
        }
        return this.http.get(this.baseUrl + this.urlAutorizarRegistro + '-detalle/' + id, httpOptions);
    }
    actualizaPfdDocumento(documento: any): any {
        this.TOKEN = localStorage.getItem('token');
        let httpOptions = {
            headers: new HttpHeaders({
                Authorization: this.TOKEN,
            }),
        }
        return this.http.put(this.baseUrl + this.urlAutorizarRegistro + '-actualiza-documento/' + documento.id, documento, httpOptions);
    }
}
