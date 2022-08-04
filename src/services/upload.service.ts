import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpEventType, HttpHeaders, HttpRequest, HttpResponse } from '@angular/common/http';

import { environment } from '../environments/environment';
import { UsuarioModel } from 'models/usuario.models';
import { Observable, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class UploadFileService {

    private urlCms: string;
    private urlApi: string;
    private urlUpload = 'upload';
    private urlOCR = 'OCR';
    private TOKEN = localStorage.getItem('token');

    private httpOptions = {
        headers: new HttpHeaders({
            Authorization: this.TOKEN,
        }),
    };
    constructor(private http: HttpClient) {
        //  this.urlCms = environment.apiStrapi;
        this.urlApi = environment.apiCms;
        this.urlCms = environment.apiStrapi
        this.TOKEN = localStorage.getItem('token');
        this.httpOptions = {
            headers: new HttpHeaders({
                Authorization: this.TOKEN,
            }),
        };
    }
    /*
        async uploadFile(file: any, base64: any): Promise<any> {
            return new Promise(resolve => {
                {
                    const formData: FormData = new FormData();
                    // Enviamos la imagen
                    formData.append('files', file, file.name);
                    // formData.append('base64', base64);
    
                    this.http.post(this.urlCms + this.urlUpload, formData, this.httpOptions).subscribe(
                        (res) => {
    
                            resolve(res);
    
                        },
                        (err) => {
                            resolve(err);
                        });
    
                }
            });
    
        }
    */
    subirArchivo(file: any, base64: any): Promise<any> {
        this.TOKEN = localStorage.getItem('token');
        let httpOptions = {
            headers: new HttpHeaders({
                Authorization: this.TOKEN,
            }),
        }


        return new Promise(resolve => {
            {

                const formData: FormData = new FormData();
                const data = {
                    name: file.name
                };
                // Enviamos la imagen

                formData.append('data', JSON.stringify(data));
                // formData.append('files', file, data.name);                           
                formData.append('base64', base64);
                this.http.post(this.urlApi + this.urlUpload, formData, httpOptions).subscribe(
                    (res) => {
                        resolve(res);
                    },
                    (err) => {
                        resolve(err);
                    });
            }
        });

    }
    subirOCR(documento: any): Promise<any> {
        this.TOKEN = localStorage.getItem('token');
        let httpOptions = {
            headers: new HttpHeaders({
                Authorization: this.TOKEN,
            }),
        }


        return new Promise(resolve => {
            {

              
                this.http.post(this.urlApi + this.urlOCR, documento, httpOptions).subscribe(
                    (res) => {
                        resolve(res);
                    },
                    (err) => {
                        resolve(err);
                    });
            }
        });

    }
    subirArchivoStrapi(file: any): Promise<any> {
        this.TOKEN = localStorage.getItem('token');
        let httpOptions = {
            headers: new HttpHeaders({
                Authorization: this.TOKEN,
            }),
        }


        return new Promise(resolve => {
            {

                const formData: FormData = new FormData();
                formData.append('files', file);
                // Enviamos la imagen

                // formData.append('files', file, data.name);  
                this.http.post(this.urlCms + 'upload/', formData).subscribe(
                    (res) => {
                        resolve(res);
                    },
                    (err) => {
                        resolve(err);
                    });
            }
        });

    }

    download(id: string): Observable<HttpEvent<any>> {
        this.TOKEN = localStorage.getItem('token');            
     
        const req = new HttpRequest('GET', this.urlCms + 'uploads/'  + id, {
            reportProgress: true,
            responseType: 'blob'
        });
        return this.http.request(req);
    }


    upload(file: File): Observable<HttpEvent<any>> {
        this.TOKEN = localStorage.getItem('token');      
        const formData: FormData = new FormData();

        formData.append('files', file);
     
        const req = new HttpRequest('POST', this.urlCms + 'upload/', formData, {
            reportProgress: true
        });
        return this.http.request(req);
    }

    subirArchivoProgress(file: any): { [key: string]: { progress: Observable<number> } } {
        // this will be the our resulting map
        const status: { [key: string]: { progress: Observable<number> } } = {};

        // create a new multipart-form for every file
        const formData: FormData = new FormData();
        formData.append('files', file, file.name);

        // create a new progress-subject for every file
        const progress = new Subject<number>();

        // send the http-request and subscribe for progress-updates
        this.http
            .post(
                this.urlApi + this.urlUpload,
                formData,
                { reportProgress: true, observe: 'events' }
            )
            .subscribe((event) => {
                if (event.type === HttpEventType.UploadProgress) {
                    // calculate the progress percentage
                    const percentDone = Math.round((100 * event.loaded) / event.total);

                    // pass the percentage into the progress-stream
                    progress.next(percentDone);
                } else if (event instanceof HttpResponse) {
                    // Close the progress-stream if we get an answer form the API
                    // The upload is complete
                    progress.complete();
                }
            });

        // Save every progress-observable in a map of all observables
        status.logo = {
            progress: progress.asObservable(),
        };

        // return the map of progress.observables
        return status;
    }

}
