import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "./../environments/environment";

@Injectable({
    providedIn: "root",
})
export class LoginService {
    private baseUrl: string;
    private urlLogin = "login";

    constructor(private http: HttpClient) {
        this.baseUrl = environment.apiCms;
    }

    validarUsuario(usuario: any): any {
        return this.http.post(this.baseUrl + this.urlLogin, usuario);
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
