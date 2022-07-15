import { Component, OnInit } from '@angular/core';
import { UsuariosService } from 'services/usuarios.service';
import { MatDialog } from '@angular/material/dialog';
import { GuardarUsuarioComponent } from './guardar-usuario/guardar-usuario.component';
import { UsuarioModel } from 'models/usuario.models';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ususarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss']
})
export class UsuariosComponent implements OnInit {
  rows: any[];
  loadingIndicator: boolean;
  reorderable: boolean;
  cargando: boolean;
  
  constructor(
              private _usuariosService: UsuariosService,
              public dialog: MatDialog,
            ) { }

  ngOnInit(): void {

    this.obtener();

  }

  nuevoUsuario(): void {
    const dialogRef = this.dialog.open(GuardarUsuarioComponent, {
      width: '60%',
      // height: '75%',
      // height: '100%',
       disableClose: false,
      data: new UsuarioModel(),
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.obtener();
      }
    });
  }

  guardarUsuario(usuario: UsuarioModel): void {
    const dialogRef = this.dialog.open(GuardarUsuarioComponent, {
      width: '60%',
      // height: '75%',
      // height: '100%',
       disableClose: false,
      data: usuario,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.obtener();
      }
    });
  }

  obtener(): void {
    this.cargando = true;
    this.loadingIndicator = true;
    this._usuariosService.obtenerUsuarios().subscribe( (resp: any) => {
        this.rows = resp;
        this.cargando = false;
        this.loadingIndicator = true;
    }, err => {
        this.cargando = false;            
        this.loadingIndicator = true;
    });
  }

  eliminarUsuario(usuario: UsuarioModel): void {
    Swal.fire({
      title: '¿Está seguro que desea eliminar este usuario?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No'
    }).then((result) => {
    /*   if (result.value) {
        this.cargando = true;

        this._usuariosService.eliminarUsuario(usuario).subscribe( (resp: any) => {
            if (resp.affectedRows && resp.affectedRows > 0){
              Swal.fire('Eliminado', 'El usuario ha sido eliminado.', 'success');
              this.obtener();
            } else {
              Swal.fire('Eliminado', 'Ocurrió un error al eliminar el usuario.', 'error');
            }
        }, err => {
            this.cargando = false;  
            Swal.fire(
              'Error',
              'Ocurrió un error al eliminar el usuario.' + err,
              'error'
            );          
        });
        
      } */
    });
  }
}
