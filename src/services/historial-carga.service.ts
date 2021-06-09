import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class HistorialCargaService {

    private baseUrl: string;
    private urlHistorialCarga = 'carga';
    private urlHistorialCargaDetalle = 'carga-detalle';
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

    obtenerHistorialCarga(idUsuario): any {
        this.TOKEN = localStorage.getItem('token');
        let httpOptions = {
            headers: new HttpHeaders({
                Authorization: this.TOKEN,
            }),
        }
        return this.http.get(this.baseUrl + this.urlHistorialCarga + '/' + idUsuario, httpOptions);
    }

    obtenerTipoDocumentosPerfil(ruta: string): any {
        this.TOKEN = localStorage.getItem('token');
        let httpOptions = {
            headers: new HttpHeaders({
                Authorization: this.TOKEN,
            }),
        }
        return this.http.get(this.baseUrl + this.urlHistorialCarga + '/' + ruta, httpOptions);
    }

    actualizarTipoDocumentos(historial: any): any {
        this.TOKEN = localStorage.getItem('token');
        let httpOptions = {
            headers: new HttpHeaders({
                Authorization: this.TOKEN,
            }),
        }
        return this.http.put(this.baseUrl + this.urlHistorialCarga + '/' + historial.id, historial, httpOptions);
    }

    guardarHistorial(historial: any): any {
        this.TOKEN = localStorage.getItem('token');
        let httpOptions = {
            headers: new HttpHeaders({
                Authorization: this.TOKEN,
            }),
        }
        return this.http.post(this.baseUrl + this.urlHistorialCarga, historial, httpOptions);
    }
    guardarHistorialDetalle(historialDetalle: any): Promise<any>  {
        this.TOKEN = localStorage.getItem('token');
        let httpOptions = {
            headers: new HttpHeaders({
                Authorization: this.TOKEN,
            }),
        }
        return new Promise(resolve => {
            {this.http.post(this.baseUrl + this.urlHistorialCargaDetalle, historialDetalle, httpOptions).subscribe(
                (res) => {                            
                    resolve(res);
                },
                (err) => {
                    resolve(err);
                });

            }
        });
    }

    eliminarHistorialCarga(ruta: string): any {
        this.TOKEN = localStorage.getItem('token');
        let httpOptions = {
            headers: new HttpHeaders({
                Authorization: this.TOKEN,
            }),
        }
        return this.http.delete(this.baseUrl + this.urlHistorialCarga + '/' + ruta, httpOptions);
    }

    actualizarHistorial(historial: any, id: string): any {
        this.TOKEN = localStorage.getItem('token');
        let httpOptions = {
            headers: new HttpHeaders({
                Authorization: this.TOKEN,
            }),
        }
        return this.http.put(this.baseUrl + this.urlHistorialCarga + '/' + id, historial, httpOptions);
    }
    actualizarDetalle(historial: any, id: string): any {
        this.TOKEN = localStorage.getItem('token');
        let httpOptions = {
            headers: new HttpHeaders({
                Authorization: this.TOKEN,
            }),
        }
        return this.http.put(this.baseUrl + this.urlHistorialCargaDetalle + '/' + id, historial, httpOptions);
    }
}
