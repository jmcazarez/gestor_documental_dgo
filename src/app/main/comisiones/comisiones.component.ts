import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ComisionesModel } from 'models/comisiones.models';
import { MenuService } from 'services/menu.service';

import Swal from 'sweetalert2';
import { GuardarComisionesComponent } from './guardar-comisiones/guardar-comisiones.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { ComisionesService } from 'services/comisiones.service';

@Component({
    selector: 'app-comisiones',
    templateUrl: './comisiones.component.html',
    styleUrls: ['./comisiones.component.scss']
})
export class ComisionesComponent implements OnInit {
    filterName: string;
    loadingIndicator: boolean;
    reorderable: boolean;
    cargando: boolean;
    comisiones = [];
    comisionesTemp = [];
    optAgregar: boolean;
    optConsultar: boolean;
    optEditar: boolean;
    optEliminar: boolean;
    constructor(private router: Router,
        public dialog: MatDialog,
        private menuService: MenuService,
        private spinner: NgxSpinnerService,
        private comisionesService: ComisionesService) { }

    ngOnInit(): void {
        this.obtenerComisiones();
    }

    obtenerComisiones(): void {
        this.spinner.show();
        this.loadingIndicator = true;
        this.comisiones = [];
        this.filterName = '';
        // Obtenemos los documentos
        this.comisionesService.obtenerComisiones().subscribe((resp: any) => {

            // Buscamos permisos
            const opciones = this.menuService.opcionesPerfil.find((opcion: { cUrl: string; }) => opcion.cUrl === 'comisiones');
            
            this.optAgregar = opciones.Agregar;
            this.optEditar = opciones.Editar;
            this.optConsultar = opciones.Consultar;
            this.optEliminar = opciones.Eliminar;
            // Si tiene permisos para consultar
            if (this.optConsultar) {
                resp.forEach(element => {
                    let descripcionComicion = '';
                    let iniciativas = 0;
                    if(element.tipos_comisione){
                        descripcionComicion = element.tipos_comisione.descripcion
                    }
                    if(element.iniciativas){
                        iniciativas = element.iniciativas.length
                    }
                    this.comisiones.push({
                        id: element.id,
                        descripcion: element.descripcion,
                        detalle_participantes_comisions: element.detalle_participantes_comisions,
                        tipos_comisione: element.tipos_comisione,
                        descripcionComicion,
                        iniciativas
                    })
                });
                this.comisiones = [...this.comisiones];
                this.comisionesTemp = this.comisiones;
            }
            this.loadingIndicator = false;
            this.spinner.hide();
        }, err => {
            this.loadingIndicator = false;
            this.spinner.hide();
        });
    }

    editarComision(comision: ComisionesModel): void {
       
        // Abrimos modal de guardar perfil
        const dialogRef = this.dialog.open(GuardarComisionesComponent, {
            width: '60%',
            height: '80%',
            disableClose: true,
            data: comision,
        });

        dialogRef.afterClosed().subscribe(result => {
            this.obtenerComisiones();
        });
    }

    nuevaComision(): void {
        // Abrimos modal de guardar comision
        const dialogRef = this.dialog.open(GuardarComisionesComponent, {
            width: '50%',
            height: '80%',
            disableClose: true,
            data: new ComisionesModel(),

        });

        dialogRef.afterClosed().subscribe(result => {
            this.obtenerComisiones();

        });
    }

    filterDatatable(value): void {
        this.comisiones = this.comisionesTemp;
        // Filtramos tabla
        if (value.target.value === '') {
            this.comisiones = this.comisionesTemp;
        } else {
            const val = value.target.value.toLowerCase();
            const temp = this.comisiones.filter((d) => d.descripcion.toLowerCase().indexOf(val) !== -1 || !val || d.descripcionComicion.toLowerCase().indexOf(val) !== -1);
            this.comisiones = temp;
        }
    }

    eliminarComision(row: { id: string; }): void {
        // Eliminamos comision
        Swal.fire({
            title: '¿Está seguro que desea eliminar esta comisión?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Si',
            cancelButtonText: 'No'
        }).then((result) => {
            this.spinner.show();
            if (result.value) {
                // realizamos delete
                this.comisionesService.eliminarComision(row.id).subscribe((resp: any) => {
                    Swal.fire('Eliminado', 'La comisión ha sido eliminada.', 'success');
                    this.spinner.hide();
                    this.obtenerComisiones();
                }, err => {
                    this.spinner.hide();
                    this.cargando = false;
                    Swal.fire(
                        'Error',
                        'Ocurrió un error al eliminar el comision.' + err,
                        'error'
                    );
                });

            }
        });
    }
}
