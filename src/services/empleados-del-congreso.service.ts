import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';
import { EmpleadosModel } from 'models/empleados.models';

@Injectable({
    providedIn: 'root'
})
export class EmpleadosDelCongresoService {

    private baseUrl: string;
    private urlEmpleados = 'empleados';
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

    obtenerEmpleados(): any {
        return this.http.get(this.baseUrl + this.urlEmpleados, this.httpOptions);
    }

    actualizarEmpleado(empleados: EmpleadosModel): any {
        return this.http.put(this.baseUrl + this.urlEmpleados + '/' + empleados.id, empleados, this.httpOptions);
    }

    guardarEmpleado(empleados: EmpleadosModel): any {
        return this.http.post(this.baseUrl + this.urlEmpleados, empleados, this.httpOptions);
    }

    eliminarEmpleado(ruta: string): any {
        return this.http.delete(this.baseUrl + this.urlEmpleados + '/' + ruta, this.httpOptions);
    }
}
