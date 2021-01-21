import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

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
    }
    
    this.router.navigate(['login']);
    return false;
  }
}
