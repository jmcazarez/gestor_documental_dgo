import { Component, OnInit } from '@angular/core';
import { UsuariosService } from 'services/usuarios.service';
import { MatDialog } from '@angular/material/dialog';
import { GuardarUsuarioFinanzasComponent } from './guardar-usuario-finanzas/guardar-usuario-finanzas.component';
import { UsuarioModel } from 'models/usuario.models';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
import { UsuarioFinanzasModel } from 'models/usuario-finanzas.models';
@Component({
    selector: 'app-ususarios',
    templateUrl: './usuarios-finanzas.component.html',
    styleUrls: ['./usuarios-finanzas.component.scss']
})
export class UsuariosFinanzasComponent implements OnInit {
    rows: any[];
    rowsTemp: any[];
    loadingIndicator: boolean;
    reorderable: boolean;
    cargando: boolean;
    valueBuscador = '';
    constructor(
        private usuariosService: UsuariosService,
        public dialog: MatDialog,
        private spinner: NgxSpinnerService,
    ) { }

    ngOnInit(): void {
        // obtenemos informacion
        this.obtener();

    }

    nuevoUsuario(): void {
        // Abrimos modal de guardar usuario
        const dialogRef = this.dialog.open(GuardarUsuarioFinanzasComponent, {
            width: '40%',
            height: '90%',
            // height: '75%',
            // height: '100%',
            disableClose: true,
            data: new UsuarioModel(),
            
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.obtener();
            }
        });
    }

    guardarUsuario(usuario: any): void {
        
        // Abrimos modal de guardar usuario
        const dialogRef = this.dialog.open(GuardarUsuarioFinanzasComponent, {
            width: '40%',
            height: '90%',
            // height: '75%',
            // height: '100%',
            disableClose: true,
            data: usuario,
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.obtener();
            }
        });
    }

    obtener(): void {
        this.spinner.show();
        this.cargando = true;
        this.loadingIndicator = true;
        // Obtenemos usuarios
        this.usuariosService.obtenerUsuariosAuth().subscribe((resp: any) => {            
            this.rows = resp;  
            this.rowsTemp = this.rows;      
         
            this.loadingIndicator = false;
            this.valueBuscador = '';
            this.spinner.hide();
        }, err => {
          
            this.loadingIndicator = false;
            this.valueBuscador = '';
            this.spinner.hide();
        });
    }

    eliminarUsuario(usuario: UsuarioFinanzasModel): void {
        // Eliminar usuario
        Swal.fire({
            title: '¿Está seguro que desea eliminar este usuario?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Si',
            cancelButtonText: 'No'
        }).then((result) => {
            if (result.value) {
                this.cargando = true;

                this.usuariosService.eliminarUsuario(usuario).subscribe((resp: any) => {
                    Swal.fire('Eliminado', 'El usuario ha sido eliminado.', 'success');
                    this.obtener();
                }, err => {
                    this.cargando = false;
                    Swal.fire(
                        'Error',
                        'Ocurrió un error al eliminar el usuario.' + err,
                        'error'
                    );
                });

            }
        });
    }

    filterDatatable(value): void{
            // Filtramos tabla
            this.rows = this.rowsTemp;
            if (value.target.value === '') {
                this.rows = this.rowsTemp;
            } else {
                const val = value.target.value.toLowerCase();
                const temp = this.rows.filter((d) => d.cUsuario.toLowerCase().indexOf(val) !== -1 || !val ||
                d.cNombre.toLowerCase().indexOf(val) !== - 1 || d.cCorreo.toLowerCase().indexOf(val) !== - 1 ||
                d.cApellidoPaterno.toLowerCase().indexOf(val) !== - 1 || d.cApellidoMaterno.toLowerCase().indexOf(val) !== - 1);

                
                this.rows = temp;
            }
    }   

 
}
