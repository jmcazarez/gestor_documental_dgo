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
    }

    obtenerHistorialCarga(idUsuario): any {
        return this.http.get(this.baseUrl + this.urlHistorialCarga + '/' + idUsuario, this.httpOptions);
    }

    obtenerTipoDocumentosPerfil(ruta: string): any {
        return this.http.get(this.baseUrl + this.urlHistorialCarga + '/' + ruta, this.httpOptions);
    }

    actualizarTipoDocumentos(historial: any): any {
        return this.http.put(this.baseUrl + this.urlHistorialCarga + '/' + historial.id, historial, this.httpOptions);
    }

    guardarHistorial(historial: any): any {
        return this.http.post(this.baseUrl + this.urlHistorialCarga, historial, this.httpOptions);
    }
    guardarHistorialDetalle(historialDetalle: any): Promise<any>  {

        return new Promise(resolve => {
            {this.http.post(this.baseUrl + this.urlHistorialCargaDetalle, historialDetalle, this.httpOptions).subscribe(
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
        return this.http.delete(this.baseUrl + this.urlHistorialCarga + '/' + ruta, this.httpOptions);
    }

    actualizarHistorial(historial: any, id: string): any {
        return this.http.put(this.baseUrl + this.urlHistorialCarga + '/' + id, historial, this.httpOptions);
    }
    actualizarDetalle(historial: any, id: string): any {
        return this.http.put(this.baseUrl + this.urlHistorialCargaDetalle + '/' + id, historial, this.httpOptions);
    }
}
