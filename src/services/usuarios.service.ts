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
  }

  obtenerUsuarios(): any {
    return this.http.get(this.baseUrl + this.urlUsuarios, this.httpOptions);
  }

  obtenerUsuario(id: number): any{
    return this.http.get(this.baseUrl + this.urlUsuarios + '/' + id, this.httpOptions);
  }

  guardarUsuario(usuario: UsuarioModel): any {
    return this.http.post(this.baseUrl + this.urlUsuarios, usuario, this.httpOptions);

  }

  actualizarUsuario(usuario: UsuarioModel): any{
    return this.http.put(this.baseUrl + this.urlUsuarios + '/' + usuario.nIdUsuario, usuario, this.httpOptions);
  }

  eliminarUsuario(usuario: UsuarioModel): any {
    return this.http.delete(this.baseUrl + this.urlUsuarios + '/' + usuario.nIdUsuario, this.httpOptions);
  }


  //Servicios Secretaria
  obtenerSecretarias(): any {
    return this.http.get(this.baseUrl + this.urlSecretarias, this.httpOptions);
  }

  guardarSecretaria(secretaria: any): any{
    return this.http.post(this.baseUrl + this.urlSecretarias, secretaria, this.httpOptions);
  }
  
  actualizarSecretaria(secretaria: SecretariasModel): any{    
    return this.http.put(this.baseUrl + this.urlSecretarias + '/' + secretaria.id, secretaria, this.httpOptions);
  }

  eliminarSecretaria(ruta: string): any {
    return this.http.delete(this.baseUrl + this.urlSecretarias + '/' + ruta, this.httpOptions);
  }


  //Servicios direcciones
  obtenerDirecciones(): any {
    return this.http.get(this.baseUrl + this.urlDirecciones, this.httpOptions);
  }

  guardarDireccion(direcciones: any): any{
    return this.http.post(this.baseUrl + this.urlDirecciones, direcciones, this.httpOptions);
  }

  actualizarDireccion(direcciones: DireccionesModel): any{    
    //console.log('servicio ' + direcciones);
    return this.http.put(this.baseUrl + this.urlDirecciones + '/' + direcciones.id, direcciones, this.httpOptions);
  }

  eliminarDireccion(ruta: string): any {
    console.log('service ' + ruta);
    return this.http.delete(this.baseUrl + this.urlDirecciones + '/' + ruta, this.httpOptions);
  }



  //departamentos
  obtenerDepartamentos(): any {
    return this.http.get(this.baseUrl + this.urlDepartamentos, this.httpOptions);
  }

  guardarDepartamento(departamentos: any): any{
    return this.http.post(this.baseUrl + this.urlDepartamentos, departamentos, this.httpOptions);
  }

  actualizarDepartamento(departamentos: any): any{    
    //console.log('servicio ' + departamentos);
    return this.http.put(this.baseUrl + this.urlDepartamentos + '/' + departamentos.id, departamentos, this.httpOptions);
  }

  eliminarDepartamento(ruta: string): any {
    //console.log('service ' + ruta);
    return this.http.delete(this.baseUrl + this.urlDepartamentos + '/' + ruta, this.httpOptions);
  }


  //Entes
  obtenerEntes(): any {
    return this.http.get(this.baseUrl + this.urlEntes, this.httpOptions);
  }
}
