import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "./../environments/environment";

@Injectable({
    providedIn: "root",
})
export class LoginService {
    private baseUrl: string;
    private urlLogin = "login";
    private urlSecretarias = 'secretarias';
    private urlDirecciones = 'direcciones';
    private urlDepartamentos = 'departamentos';
    private TOKEN = localStorage.getItem('token');
    private httpOptions = {
        headers: new HttpHeaders({
            Authorization: this.TOKEN,
        }),
    };

    constructor(private http: HttpClient) {
        this.baseUrl = environment.apiCms;
    }

    validarUsuario(usuario: any): any {
        return this.http.post(this.baseUrl + this.urlLogin, usuario);
    }

    obtenerSecretarias(): any {
        return this.http.get(this.baseUrl + this.urlSecretarias, this.httpOptions);
    }

    obtenerDirecciones(): any {
        return this.http.get(this.baseUrl + this.urlDirecciones, this.httpOptions);
    }

    obtenerDepartamentos(): any {
       let tokenTemp = localStorage.getItem('token');
        console.log(tokenTemp);
        let httpOptions = {
            headers: new HttpHeaders({
                Authorization: tokenTemp,
            }),
        };
    
        return this.http.get(this.baseUrl + this.urlDepartamentos, httpOptions);
    }

    refrescUsuario(): any {
        const usuario = localStorage.getItem("usr");

            const usr = JSON.parse(usuario);

           let options = {
               headers: new HttpHeaders({
                   Authorization: localStorage.getItem("token"),
               }),
           };
        return this.http.get(
            this.baseUrl +
                this.urlLogin +
                "/" +
                usr[0].data.cUsuario +
                "/" +
                localStorage.getItem("token"),
            options
        );
    }
}
