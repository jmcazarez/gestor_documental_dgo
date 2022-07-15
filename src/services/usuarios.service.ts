import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from '../environments/environment';
import { UsuarioModel } from 'models/usuario.models';
import { SecretariasModel } from 'models/secretarias.models';
import { DireccionesModel } from 'models/direcciones.models';
import { DepartamentosModels } from 'models/departamentos.models';
import { UsuarioFinanzasModel } from 'models/usuario-finanzas.models';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  private baseUrl: string;
  private urlUsuarios = 'usuarios-lista';
  private urlUsuariosGuardar = 'usuarios';
  private urlSecretarias = 'secretarias';
  private urlDirecciones = 'direcciones';
  private urlDepartamentos = 'departamentos';
  private urlEntes = 'entes';
  private TOKEN = localStorage.getItem('token');
  private urlUsuariosAuth = 'usuarios-auth';
  private urlDowloadDocument = 'documento-file';
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


  dowloadDocument(idFile: string, idDocumento: string, usuario: string, nombreDocumento: string): any {

    if (usuario.length > 0) {
        return this.http.get(this.baseUrl + this.urlDowloadDocument + '/' + idFile + '/' + idDocumento + '/' + usuario + '/' + nombreDocumento, this.httpOptions);
    } else {
        return this.http.get(this.baseUrl + this.urlDowloadDocument + '/' + idFile, this.httpOptions);
    }

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

  obtenerUsuariosAuth(): any {
    console.log('entro');
    return this.http.get(this.baseUrl + this.urlUsuariosAuth, this.httpOptions);
}

  obtenerUsuario(id: string): any {
    this.TOKEN = localStorage.getItem('token');
    let httpOptions = {
        headers: new HttpHeaders({
            Authorization: this.TOKEN,
        }),
    }
    return this.http.get(this.baseUrl + this.urlUsuariosAuth + '/' + id, this.httpOptions);
}


  guardarUsuario(usuario: UsuarioFinanzasModel): any {
    this.TOKEN = localStorage.getItem('token');
    let httpOptions = {
        headers: new HttpHeaders({
            Authorization: this.TOKEN,
        }),
    }

    return this.http.post(this.baseUrl + this.urlUsuariosGuardar, usuario, httpOptions);

  }

  actualizarUsuario(usuario: UsuarioFinanzasModel): any{
    this.TOKEN = localStorage.getItem('token');
    let httpOptions = {
        headers: new HttpHeaders({
            Authorization: this.TOKEN,
        }),
    }

    return this.http.put(this.baseUrl + this.urlUsuariosGuardar + '/' + usuario.id, usuario, httpOptions);
  }

  eliminarUsuario(usuario: UsuarioFinanzasModel): any {
    this.TOKEN = localStorage.getItem('token');
    let httpOptions = {
        headers: new HttpHeaders({
            Authorization: this.TOKEN,
        }),
    }

    return this.http.delete(this.baseUrl + this.urlUsuariosGuardar + '/' + usuario.id, httpOptions);
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
