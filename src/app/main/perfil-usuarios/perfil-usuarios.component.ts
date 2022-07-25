import { Component, OnInit } from '@angular/core';
import { PerfilUsuariosModel } from 'models/perfil-usuarios.model';
import { PerfilUsuariosService } from 'services/perfil-usuarios.service';
import { MatDialog } from '@angular/material/dialog';
import { GuardarPerfilUsuariosComponent } from './guardar-perfil-usuarios/guardar-perfil-usuarios.component';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
    selector: 'app-perfil-usuarios',
    templateUrl: './perfil-usuarios.component.html',
    styleUrls: ['./perfil-usuarios.component.scss']
})
export class PerfilUsuariosComponent implements OnInit {
    rows: any[];
    loadingIndicator: boolean;
    reorderable: boolean;
    cargando: boolean;
    busqueda: string;
    temp = [];
    temp2: any;
    valueBuscador = '';
    table = {
        offset: 0,
    };
    constructor(
        private perfilUsuariosService: PerfilUsuariosService,
        public dialog: MatDialog,
        private spinner: NgxSpinnerService,
    ) { }

    ngOnInit(): void {
        // Obtenemos perfiles
      
        this.obtener();
        
    }


    nuevoPerfilUsuarios(): void {
        // abrimos modal de nuevo perfil
        const dialogRef = this.dialog.open(GuardarPerfilUsuariosComponent, {
            width: '60%',
            height: '90%',
            // height: '75%',
            // height: '100%',
            disableClose: true,
            data: new PerfilUsuariosModel(),
        });

        dialogRef.afterClosed().subscribe(result => {
           
            if (result) {
                this.valueBuscador = ''
                this.obtener();
            }
        });
    }

    eliminarPerfilUsuarios(perfilUsuario: PerfilUsuariosModel): void {
        // Eliminamos perfil de usuario
        Swal.fire({
            title: '¿Está seguro que desea eliminar este perfil?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Si',
            cancelButtonText: 'No'
        }).then((result) => {
            this.valueBuscador = ''
            if (result.value) {
                this.cargando = true;

                // realizamos delete
                this.perfilUsuariosService.eliminarPerfilUsuarios(perfilUsuario).subscribe((resp: any) => {
                    Swal.fire('Eliminado', 'El perfil de usuario ha sido eliminado.', 'success');
                    this.valueBuscador = ''
                    this.obtener();
                }, err => {
                    this.cargando = false;
                    Swal.fire(
                        'Error',
                        'Ocurrió un error al eliminar el perfil de usuario.' + err,
                        'error'
                    );
                });

            }
        });
    }

    guardarPerfilUsuarios(perfilUsuario: PerfilUsuariosModel): void {
        // Abrimos modal de guardar perfil
        const dialogRef = this.dialog.open(GuardarPerfilUsuariosComponent, {
            width: '60%',
            height: '90%',
            // height: '75%',
            // height: '100%',
            disableClose: true,
            data: perfilUsuario,
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.obtener();
            }
        });
    }

    obtener(): void {
        this.spinner.show();
        this.loadingIndicator = true;
        // Obtenemos perfiles de usuario
        this.perfilUsuariosService.obtenerPerfilesUsuarios().subscribe((resp: any) => {
            this.valueBuscador = ''
            this.rows = resp;
            this.temp2 = this.rows;
            this.loadingIndicator = false;
             this.valueBuscador = ''
            this.spinner.hide();
        }, err => {
            this.loadingIndicator = false;
            this.spinner.hide();
        });
    }

    filterDatatable(value): void {
        this.rows = this.temp2;
        // Filtramos tabla
        if (value.target.value === '') {
            this.rows = this.temp2;
        } else {
            const val = value.target.value.toLowerCase();
            const temp = this.rows.filter((d) => d.cNombrePerfil.toLowerCase().indexOf(val) !== -1 || !val);
            this.rows = temp;
        }
    }

}
