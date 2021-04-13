import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MesasDirectivasModel } from 'models/mesas-directivas.models';
import { MenuService } from 'services/menu.service';
import { MesasDirectivasService } from 'services/mesas-directivas.service';
import Swal from 'sweetalert2';
import { GuardarMesaComponent } from './guardar-mesa/guardar-mesa.component';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-mesas-directivas',
  templateUrl: './mesas-directivas.component.html',
  styleUrls: ['./mesas-directivas.component.scss']
})
export class MesasDirectivasComponent implements OnInit {
    loadingIndicator: boolean;
    reorderable: boolean;
    cargando: boolean;
    mesas = [];
    mesasTemp = [];
    optAgregar: boolean;
    optConsultar: boolean;
    optEditar: boolean;
    optEliminar: boolean;
    valueBuscador: string = '';
    constructor(private router: Router,
                public dialog: MatDialog,
                private menuService: MenuService,
                private spinner: NgxSpinnerService,
                private mesasDirectivasService: MesasDirectivasService) { }

    ngOnInit(): void {
        this.obtenerMesas();
    }

    obtenerMesas(): void {
        this.spinner.show();
        this.limpiar();
        this.loadingIndicator = true;
        // Obtenemos los documentos
        this.mesasDirectivasService.obtenerMesas().subscribe((resp: any) => {

            // Buscamos permisos
            const opciones = this.menuService.opcionesPerfil.find((opcion: { cUrl: string; }) => opcion.cUrl === 'mesas-directivas-por-legislatura');
            
            this.optAgregar = opciones.Agregar;
            this.optEditar = opciones.Editar;
            this.optConsultar = opciones.Consultar;
            this.optEliminar = opciones.Eliminar;
            // Si tiene permisos para consultar
            if (this.optConsultar) {
                this.mesas = resp;
                this.mesasTemp = this.mesas;
            }
            this.loadingIndicator = false;
            this.spinner.hide();
        }, err => {
            this.loadingIndicator = false;
            this.spinner.hide();
        });
    }

    editarMesa(mesas: MesasDirectivasModel): void {

        // Abrimos modal de guardar perfil
        const dialogRef = this.dialog.open(GuardarMesaComponent, {
            width: '60%',
            height: '80%',
            disableClose: true,
            data: mesas,
        });

        dialogRef.afterClosed().subscribe(result => {
            this.limpiar();
            this.obtenerMesas();
        });
    }

    nuevaMesa(): void {
        this.mesasDirectivasService.idMesa;
        // Abrimos modal de guardar partido politico
        const dialogRef = this.dialog.open(GuardarMesaComponent, {
            width: '50%',
            height: '80%',
            disableClose: true,
            data: new MesasDirectivasModel(),

        });

        dialogRef.afterClosed().subscribe(result => {
            this.limpiar();
            this.obtenerMesas();
        });
    }

    filterDatatable(value): void {
        // Filtramos tabla
        if (value.target.value === '') {
            this.mesas = this.mesasTemp;
        } else {
            const val = value.target.value.toLowerCase();
            const temp = this.mesas.filter((d) => d.descripcion.toLowerCase().indexOf(val) !== -1 || !val || d.legislatura.cLegislatura.toLowerCase().indexOf(val) !== -1);
            this.mesas = temp;
        }
    }

    limpiar(): void{
        //Limpiamos buscador
        this.valueBuscador = '';
        //console.log('buscador' + this.valueBuscador);
    }

    eliminarMesa(row: { id: string; }): void {
        // Eliminamos partido politico
        Swal.fire({
            title: '¿Está seguro que desea eliminar esta Mesa Directiva?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Si',
            cancelButtonText: 'No'
        }).then((result) => {
            if (result.value) {
                // realizamos delete
                this.mesasDirectivasService.eliminarMesa(row.id).subscribe((resp: any) => {
                    Swal.fire('Eliminado', 'La Mesa Directiva ha sido eliminada.', 'success');
                    this.limpiar();
                    this.obtenerMesas();
                }, err => {
                    this.cargando = false;
                    Swal.fire(
                        'Error',
                        'Ocurrió un error al eliminar el diputado.' + err,
                        'error'
                    );
                });

            }
        });
    }
}
