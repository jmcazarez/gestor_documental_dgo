import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';
import { DetalleComisionModels } from 'models/detalle-participante-comision';

@Injectable({
    providedIn: 'root'
})
export class DetalleComisionsService {

    private baseUrl: string;
    private urlDetalleComision = 'detalle-participantes-comisions';
    private TOKEN = localStorage.getItem('token');

    private httpOptions = {
        headers: new HttpHeaders({
            Authorization: this.TOKEN,
        }),
    };
    constructor(private http: HttpClient) {
        this.baseUrl = environment.apiCms;
    }

    obtenerDetalleComision(): any {
        return this.http.get(this.baseUrl + this.urlDetalleComision, this.httpOptions);
    }

    actualizarDetalleComisions(detalleComision: any): any {
        return this.http.put(this.baseUrl + this.urlDetalleComision + '/' + detalleComision.id, detalleComision, this.httpOptions);
    }

    guardarDetalleComision(detalleComision: any): any {
        return this.http.post(this.baseUrl + this.urlDetalleComision, detalleComision, this.httpOptions);
    }

    eliminarDetalleComision(ruta: string): any {
        return this.http.delete(this.baseUrl + this.urlDetalleComision + '/' + ruta, this.httpOptions);
    }
}
