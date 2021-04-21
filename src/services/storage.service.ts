import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class StorageService {

    constructor() { }
    async guardarUsuario(usuario: any): Promise<void> {
        localStorage.setItem('usr', JSON.stringify(usuario));
         
        if (usuario) {
            const usr = JSON.parse(localStorage.getItem('usr'));
                
            const token = usr[0]['data'].token;
            localStorage.setItem('token', token);
         
       
        }
    }
    async obtenerUsuario(): Promise<void> {
        return new Promise(resolve => {
            {
                const usuario = localStorage.getItem('usr');
                
                if (usuario) {
                    const usr = JSON.parse(usuario);

                    const token = usr[0].data.token;
                    localStorage.setItem('token', token);
                 
                    resolve(usr);
                } else {
                    resolve(null);
                }
            }
        });
    }

    eliminarUsuario(): void {
        localStorage.removeItem('usr');
        localStorage.removeItem('token');
    }

}
