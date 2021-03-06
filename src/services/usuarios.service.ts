import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from '../environments/environment';
import { UsuarioModel } from 'models/usuario.models';
import { SecretariasModel } from 'models/secretarias.models';
import { DireccionesModel } from 'models/direcciones.models';
import { DepartamentosModels } from 'models/departamentos.models';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  private baseUrl: string;
  private urlUsuarios = 'usuarios-lista';
  private urlSecretarias = 'secretarias';
  private urlDirecciones = 'direcciones';
  private urlDepartamentos = 'departamentos';
  private urlEntes = 'entes';
  private TOKEN = localStorage.getItem('token');
  idSecretaria: string = '';
  idDireccion: string = '';

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

  obtenerUsuarios(): any {
    this.TOKEN = localStorage.getItem('token');
    let httpOptions = {
        headers: new HttpHeaders({
            Authorization: this.TOKEN,
        }),
    }

    return this.http.get(this.baseUrl + this.urlUsuarios, httpOptions);
  }

  obtenerUsuario(id: number): any{
    this.TOKEN = localStorage.getItem('token');
    let httpOptions = {
        headers: new HttpHeaders({
            Authorization: this.TOKEN,
        }),
    }

    return this.http.get(this.baseUrl + this.urlUsuarios + '/' + id, httpOptions);
  }

  guardarUsuario(usuario: UsuarioModel): any {
    this.TOKEN = localStorage.getItem('token');
    let httpOptions = {
        headers: new HttpHeaders({
            Authorization: this.TOKEN,
        }),
    }

    return this.http.post(this.baseUrl + this.urlUsuarios, usuario, httpOptions);

  }

  actualizarUsuario(usuario: UsuarioModel): any{
    this.TOKEN = localStorage.getItem('token');
    let httpOptions = {
        headers: new HttpHeaders({
            Authorization: this.TOKEN,
        }),
    }

    return this.http.put(this.baseUrl + this.urlUsuarios + '/' + usuario.nIdUsuario, usuario, httpOptions);
  }

  eliminarUsuario(usuario: UsuarioModel): any {
    this.TOKEN = localStorage.getItem('token');
    let httpOptions = {
        headers: new HttpHeaders({
            Authorization: this.TOKEN,
        }),
    }

    return this.http.delete(this.baseUrl + this.urlUsuarios + '/' + usuario.nIdUsuario, httpOptions);
  }


  //Servicios Secretaria
  obtenerSecretarias(): any {
    this.TOKEN = localStorage.getItem('token');
    let httpOptions = {
        headers: new HttpHeaders({
            Authorization: this.TOKEN,
        }),
    }

    return this.http.get(this.baseUrl + this.urlSecretarias, httpOptions);
  }

  guardarSecretaria(secretaria: any): any{
    this.TOKEN = localStorage.getItem('token');
    let httpOptions = {
        headers: new HttpHeaders({
            Authorization: this.TOKEN,
        }),
    }

    return this.http.post(this.baseUrl + this.urlSecretarias, secretaria, httpOptions);
  }
  
  actualizarSecretaria(secretaria: SecretariasModel): any{    
    this.TOKEN = localStorage.getItem('token');
    let httpOptions = {
        headers: new HttpHeaders({
            Authorization: this.TOKEN,
        }),
    }

    return this.http.put(this.baseUrl + this.urlSecretarias + '/' + secretaria.id, secretaria, httpOptions);
  }

  eliminarSecretaria(ruta: string): any {
    this.TOKEN = localStorage.getItem('token');
    let httpOptions = {
        headers: new HttpHeaders({
            Authorization: this.TOKEN,
        }),
    }

    return this.http.delete(this.baseUrl + this.urlSecretarias + '/' + ruta, httpOptions);
  }


  //Servicios direcciones
  obtenerDirecciones(): any {
    this.TOKEN = localStorage.getItem('token');
    let httpOptions = {
        headers: new HttpHeaders({
            Authorization: this.TOKEN,
        }),
    }

    return this.http.get(this.baseUrl + this.urlDirecciones, httpOptions);
  }

  guardarDireccion(direcciones: any): any{
    this.TOKEN = localStorage.getItem('token');
    let httpOptions = {
        headers: new HttpHeaders({
            Authorization: this.TOKEN,
        }),
    }

    return this.http.post(this.baseUrl + this.urlDirecciones, direcciones, httpOptions);
  }

  actualizarDireccion(direcciones: DireccionesModel): any{ 
    this.TOKEN = localStorage.getItem('token');
    let httpOptions = {
        headers: new HttpHeaders({
            Authorization: this.TOKEN,
        }),
    }

    //console.log('servicio ' + direcciones);
    return this.http.put(this.baseUrl + this.urlDirecciones + '/' + direcciones.id, direcciones, httpOptions);
  }

  eliminarDireccion(ruta: string): any {
    this.TOKEN = localStorage.getItem('token');
    let httpOptions = {
        headers: new HttpHeaders({
            Authorization: this.TOKEN,
        }),
    }

    return this.http.delete(this.baseUrl + this.urlDirecciones + '/' + ruta, httpOptions);
  }

  //departamentos
  obtenerDepartamentos(): any {
    this.TOKEN = localStorage.getItem('token');
    let httpOptions = {
        headers: new HttpHeaders({
            Authorization: this.TOKEN,
        }),
    }

    return this.http.get(this.baseUrl + this.urlDepartamentos, httpOptions);
  }

  guardarDepartamento(departamentos: any): any{
    this.TOKEN = localStorage.getItem('token');
    let httpOptions = {
        headers: new HttpHeaders({
            Authorization: this.TOKEN,
        }),
    }

    return this.http.post(this.baseUrl + this.urlDepartamentos, departamentos, httpOptions);
  }

  actualizarDepartamento(departamentos: any): any{    
    this.TOKEN = localStorage.getItem('token');
    let httpOptions = {
        headers: new HttpHeaders({
            Authorization: this.TOKEN,
        }),
    }

    return this.http.put(this.baseUrl + this.urlDepartamentos + '/' + departamentos.id, departamentos, httpOptions);
  }

  eliminarDepartamento(ruta: string): any {
    this.TOKEN = localStorage.getItem('token');
    let httpOptions = {
        headers: new HttpHeaders({
            Authorization: this.TOKEN,
        }),
    }

    return this.http.delete(this.baseUrl + this.urlDepartamentos + '/' + ruta, httpOptions);
  }


  //Entes
  obtenerEntes(): any {
    this.TOKEN = localStorage.getItem('token');
    let httpOptions = {
        headers: new HttpHeaders({
            Authorization: this.TOKEN,
        }),
    }

    return this.http.get(this.baseUrl + this.urlEntes, httpOptions);
  }
}
