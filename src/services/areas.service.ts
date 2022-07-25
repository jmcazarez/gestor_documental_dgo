import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable({
    providedIn: 'root'
})


export class AreasService {

    private baseUrl: string;
    private urlAreas = 'areas';
    private TOKEN = localStorage.getItem('token');

    private httpOptions = {
        headers: new HttpHeaders({
            Authorization: this.TOKEN,
        }),
    };
    constructor(private http: HttpClient) {
        this.baseUrl = environment.apiCms;
    }


     obtenerAreas(): any {
        return this.http.get(this.baseUrl + this.urlAreas, this.httpOptions);
    }

}