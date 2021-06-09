import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import Swal from 'sweetalert2';

@Injectable({
    providedIn: 'root'
})
export class SeguridadGuard implements CanActivate {

    constructor(private router: Router) {

    }

    canActivate(): boolean {

        const userStorage = localStorage.getItem('usr');
      
        if (userStorage) {
            return true;
        } else {
            //  alert('error');
            this.router.navigate(['login']);
            return false;
        }


    }
}
