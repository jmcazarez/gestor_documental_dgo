import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from './../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private baseUrl: string;
  private urlLogin = 'login';

  constructor(private http: HttpClient) {
    this.baseUrl = environment.apiCms;
  }

  validarUsuario(usuario: any): any {
    return this.http.post(this.baseUrl + this.urlLogin, usuario);
}

}
