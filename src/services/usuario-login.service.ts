import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { StorageService } from './storage.service';
import { AccionesPermitidasModel } from '../models/acciones-permitidas-models';

@Injectable({
  providedIn: 'root'
})
export class UsuarioLoginService {

  private subject = new Subject<any>();

  constructor(private storage: StorageService) { }

  logueado(resp: boolean): void {
    this.subject.next({ login: resp });
  }
  async guardarUsuario( usuario: any ): Promise<void> {

   await this.storage.guardarUsuario(usuario);
    this.logueado(true);
  }

  eliminarUsuario(): void {
      this.logueado(false);
      this.storage.eliminarUsuario();
  }

  obtenerUsuario(): any {
    return this.storage.obtenerUsuario();
  }

  async obtenerAccionesUsuario( cUrl: string): Promise<AccionesPermitidasModel> {
    // Se obtienen las acciones a las que el usuario tiene derechos
    const usuarioLogeado = await this.storage.obtenerUsuario();
    let acciones: AccionesPermitidasModel;
/*
    // Si es el super usuario se regresa modelo con todos los permisos
    if (usuarioLogeado.bSuperUsuario) {
      acciones = {
        bConsultar: true,
        bGuardar: true,
        bExportar: true,
        bAutorizar: true,
        bRechazar: true,
        bAsignarInfoPago: true,
        bEliminar: true
      };

      return acciones;
    }

    acciones = {
      bConsultar: false,
      bGuardar: false,
      bExportar: false,
      bAutorizar: false,
      bRechazar: false,
      bAsignarInfoPago: false,
      bEliminar: false
    };
    let bEncontrado = false;

    // Se verifican permisos
    for (const area of usuarioLogeado.areas) {
        for (const modulo of area.modulos) {
          if (modulo.cUrl === cUrl) {
            for (const accion of modulo.acciones) {
              switch (accion.cDescripcion) {
                case 'GUARDAR':
                  acciones.bGuardar = true;
                  break;
                case 'ASIGNAR INFO. PAGO':
                  acciones.bAsignarInfoPago = true;
                  break;
                case 'RECHAZAR':
                  acciones.bRechazar = true;
                  break;
                case 'AUTORIZAR':
                  acciones.bAutorizar = true;
                  break;
                case 'EXPORTAR':
                  acciones.bExportar = true;
                  break;
                case 'CONSULTAR':
                  acciones.bConsultar = true;
                  break;
                case 'ELIMINAR':
                  acciones.bEliminar = true;
                  break;
                default:
                  break;
              }
            }
            bEncontrado = true;
            break;
          }
        }

        if (bEncontrado) {
          break;
        }
     }*/
    return acciones;
  }

  getLogueado(): Observable<any> {

    // Obtener del storage
    const usuario = this.storage.obtenerUsuario();

    if (usuario) {
     
      this.logueado(true);
    } else {
      this.logueado(false);
    }

    return this.subject.asObservable();

  }

  getEstatus(): boolean {
    // Obtener del storage
    const usuario = this.storage.obtenerUsuario();

    if (usuario) {
      
      return true;
    } else {
      return true;
    }

  }

}
