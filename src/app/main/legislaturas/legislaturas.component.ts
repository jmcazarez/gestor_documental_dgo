import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LegislaturaModel } from 'models/legislaturas.models';
import { MenuService } from 'services/menu.service';
import { LegislaturaService } from 'services/legislaturas.service';
import Swal from 'sweetalert2';
import { GuardarLegislaturasComponent } from './guardar-legislaturas/guardar-legislaturas.component';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
    selector: 'app-legislaturas',
    templateUrl: './legislaturas.component.html',
    styleUrls: ['./legislaturas.component.scss']
})
export class LegislaturaComponent implements OnInit {
    filterName:string;

    loadingIndicator: boolean;
    reorderable: boolean;
    cargando: boolean;
    legislatura = [];
    legislaturaTemp = [];
    optAgregar: boolean;
    optConsultar: boolean;
    optEditar: boolean;
    optEliminar: boolean;
    constructor(private router: Router,
        public dialog: MatDialog,
        private menuService: MenuService,
        private spinner: NgxSpinnerService,
        private legislaturaService: LegislaturaService) { }

    ngOnInit(): void {
        this.obtenerLegislatura();
    }

    obtenerLegislatura(): void {
        this.spinner.show();
        this.filterName = '';
        this.loadingIndicator = true;
        // Obtenemos los documentos
        this.legislaturaService.obtenerLegislatura().subscribe((resp: any) => {

            // Buscamos permisos
            const opciones = this.menuService.opcionesPerfil.find((opcion: { cUrl: string; }) => opcion.cUrl === 'legislaturas');
            
            this.optAgregar = opciones.Agregar;
            this.optEditar = opciones.Editar;
            this.optConsultar = opciones.Consultar;
            this.optEliminar = opciones.Eliminar;
            // Si tiene permisos para consultar
            if (this.optConsultar) {
               
                this.legislatura = resp;
                this.legislaturaTemp = this.legislatura;
            }
            this.loadingIndicator = false;
            this.spinner.hide();
        }, err => {
            this.loadingIndicator = false;
            this.spinner.hide();
        });
    }

    editarLegislatura(legislatura: LegislaturaModel): void {

        // Abrimos modal de guardar perfil
        const dialogRef = this.dialog.open(GuardarLegislaturasComponent, {
            width: '60%',
            // height: '80%',
            disableClose: true,
            data: legislatura,
        });

        dialogRef.afterClosed().subscribe(result => {
            this.obtenerLegislatura();
        });
    }

    nuevaLegislatura(): void {
        // Abrimos modal de guardar legislatura
        const dialogRef = this.dialog.open(GuardarLegislaturasComponent, {
            width: '50%',
            // height: '80%',
            disableClose: true,
            data: new LegislaturaModel(),

        });

        dialogRef.afterClosed().subscribe(result => {
            this.obtenerLegislatura();

        });
    }

    filterDatatable(value): void {
        this.legislatura = this.legislaturaTemp;
        // Filtramos tabla
        if (value.target.value === '') {
            this.legislatura = this.legislaturaTemp;
        } else {
            const val = value.target.value.toLowerCase();
            const temp = this.legislatura.filter((d) => d.cLegislatura.toLowerCase().indexOf(val) !== -1 || !val);
            this.legislatura = temp;
        }
    }

    eliminarLegislatura(row: { id: string; }): void {
        // Eliminamos legislatura
        Swal.fire({
            title: '¿Está seguro que desea eliminar esta legislatura?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Si',
            cancelButtonText: 'No'
        }).then((result) => {
            if (result.value) {
                // realizamos delete
                this.legislaturaService.eliminarLegislatura(row.id).subscribe((resp: any) => {
                    Swal.fire('Eliminado', 'La legislatura ha sido eliminada.', 'success');
                    this.obtenerLegislatura();
                }, err => {
                    this.cargando = false;
                    Swal.fire(
                        'Error',
                        'Ocurrió un error al eliminar el legislatura.' + err,
                        'error'
                    );
                });

            }
        });
    }
}
