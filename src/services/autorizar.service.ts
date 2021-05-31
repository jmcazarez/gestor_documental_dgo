import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';
import { DistritosModel } from 'models/distritos.models';

@Injectable({
    providedIn: 'root'
})
export class AutorizarService {

    private baseUrl: string;
    private urlFirmaDigitalPaso1 = 'firmaDigitalPaso1';
    private urlFirmaDigitalPaso3 = 'multiSignedMessage_Update';
    private urlFirmaDigitalPaso4 = 'multiSignedMessage_Final';

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

    autorizarDocumentoPaso1(fileName, numeroFirmantes, cerBase64, fileBase64): any {


        this.TOKEN = localStorage.getItem('token');
        let httpOptions = {
            headers: new HttpHeaders({
                Authorization: this.TOKEN,
            }),
        }

        let objeto = {
            fileName, numeroFirmantes, cerBase64, fileBase64
        }
        return this.http.post(this.baseUrl + this.urlFirmaDigitalPaso1, objeto);
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
}
