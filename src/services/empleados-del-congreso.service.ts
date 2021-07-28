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
        this.TOKEN = localStorage.getItem('token');
        let httpOptions = {
            headers: new HttpHeaders({
                Authorization: this.TOKEN,
            }),
        }
        return this.http.get(this.baseUrl + this.urlEmpleados, httpOptions);
    }

    obtenerEmpleadosByPuesto(idPuesto: string): any {
        this.TOKEN = localStorage.getItem('token');
        let httpOptions = {
            headers: new HttpHeaders({
                Authorization: this.TOKEN,
            }),
        }
        return this.http.get(this.baseUrl + this.urlEmpleados + '/' + idPuesto, httpOptions);
    }
    actualizarEmpleado(empleados: EmpleadosModel): any {
        this.TOKEN = localStorage.getItem('token');
        let httpOptions = {
            headers: new HttpHeaders({
                Authorization: this.TOKEN,
            }),
        }
        return this.http.put(this.baseUrl + this.urlEmpleados + '/' + empleados.id, empleados, httpOptions);
    }

    guardarEmpleado(empleados: EmpleadosModel): any {
        this.TOKEN = localStorage.getItem('token');
        let httpOptions = {
            headers: new HttpHeaders({
                Authorization: this.TOKEN,
            }),
        }
        return this.http.post(this.baseUrl + this.urlEmpleados, empleados, httpOptions);
    }

    eliminarEmpleado(ruta: string): any {
        this.TOKEN = localStorage.getItem('token');
        let httpOptions = {
            headers: new HttpHeaders({
                Authorization: this.TOKEN,
            }),
        }
        return this.http.delete(this.baseUrl + this.urlEmpleados + '/' + ruta, httpOptions);
    }
}
