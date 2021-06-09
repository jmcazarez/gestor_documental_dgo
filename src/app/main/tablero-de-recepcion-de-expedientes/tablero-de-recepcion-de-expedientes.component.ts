import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RecepcionDeExpedientesModels } from 'models/recepcion-de-expedientes.models';
import { IniciativasService } from 'services/iniciativas.service';
import { MenuService } from 'services/menu.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
import { RecepcionDeExpedientesService } from 'services/recepcion-de-expedientes.services';
import { GuardarRecepcionDeExpedienteComponent } from './guardar-recepcion-de-expediente/guardar-recepcion-de-expediente.component';

@Component({
  selector: 'app-tablero-de-recepcion-de-expedientes',
  templateUrl: './tablero-de-recepcion-de-expedientes.component.html',
  styleUrls: ['./tablero-de-recepcion-de-expedientes.component.scss'],
  providers: [DatePipe]
})

export class TableroDeRecepcionDeExpedientesComponent implements OnInit {

    filterName: string;
    loadingIndicator: boolean;
    reorderable: boolean;
    cargando: boolean;
    recepcionExpedientes = [];
    recepcionExpedientesTemp = [];
    optAgregar: boolean;
    optConsultar: boolean;
    optEditar: boolean;
    optEliminar: boolean;
    valueBuscador: string;

    constructor(
        private spinner: NgxSpinnerService,
        private router: Router,
        public dialog: MatDialog,
        private datePipe: DatePipe,
        private recepcionDeExpedientesService: RecepcionDeExpedientesService,
        private menuService: MenuService,
        private sanitizer: DomSanitizer
    ) {

    }

    ngOnInit(): void {
    // Obtenemos iniciativa
    this.obtenerRecepcionesDeExpediente();
    }

   

    obtenerRecepcionesDeExpediente(): void {
      this.spinner.show();
 
      this.loadingIndicator = true;
      const expedientesTemp: any[] = [];

      // Obtenemos los iniciativas
      this.recepcionDeExpedientesService.obtenerRecepcionExpediente().subscribe((resp: any) => {

          // Buscamos permisos
          const opciones = this.menuService.opcionesPerfil.find((opcion: { cUrl: string; }) => opcion.cUrl === 'tablero-de-recepción-de-expedientes');

          this.optAgregar = opciones.Agregar;
          this.optEditar = opciones.Editar;
          this.optConsultar = opciones.Consultar;
          this.optEliminar = opciones.Eliminar;
          // Si tiene permisos para consultar
          if (this.optConsultar) {
              if (resp) {
                  for (const expediente of resp) {
                      
                      expedientesTemp.push({
                          id: expediente.id,
                          idExpediente: expediente.idExpediente,
                          fechaRecepcion: expediente.fechaRecepcion,
                          fechaRecepcionFormato: this.datePipe.transform(expediente.fechaRecepcion, 'dd-MM-yyyy'),
                          legislatura: expediente.legislatura,
                          emisor: expediente.emisor,
                          receptor: expediente.receptor,
                          estatus: expediente.estatus,
                          notas: expediente.notas,
                          hora: expediente.hora,
                      });
                  }
              }
              this.recepcionExpedientes = expedientesTemp;
              this.recepcionExpedientesTemp = this.recepcionExpedientes;
          }
          this.loadingIndicator = false;
          this.spinner.hide();
      }, err => {
          this.loadingIndicator = false;
          this.spinner.hide();
      });
    }

    guardarRecepcionDeExpediente(): void {
        // Abrimos modal de guardar recepcion de actas
        const dialogRef = this.dialog.open(GuardarRecepcionDeExpedienteComponent, {
            width: '60%',
            height: '80%',
            disableClose: true,
            data: new RecepcionDeExpedientesModels,
        });

        dialogRef.afterClosed().subscribe(result => {
            this.limpiar();
            this.obtenerRecepcionesDeExpediente();
        });
    }

    editarRecepcionDeExpedientes(recepcion: RecepcionDeExpedientesModels): void {
        // Abrimos modal de guardar recepcion de actas
        const dialogRef = this.dialog.open(GuardarRecepcionDeExpedienteComponent, {
            width: '60%',
            height: '80%',
            disableClose: true,
            data: recepcion,
        });

        dialogRef.afterClosed().subscribe(result => {
            this.limpiar();
            this.obtenerRecepcionesDeExpediente();
        });
    }

    eliminarRecepcionDeActas(row): void {
        // Eliminamos recepcion de actas
        Swal.fire({
            title: '¿Está seguro que desea eliminar recepción de expediente??',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Si',
            cancelButtonText: 'No'
        }).then((result) => {
            if (result.value) {

                // realizamos delete
                this.recepcionDeExpedientesService.eliminarRecepcionExpediente(row).subscribe((resp: any) => {
                    Swal.fire('Eliminado', 'La recepción de expediente ha sido eliminada.', 'success'); 
                    this.limpiar();                   
                    this.obtenerRecepcionesDeExpediente();
                }, err => {
                    this.cargando = false;
                    Swal.fire(
                        'Error',
                        'Ocurrió un error al eliminar la recepción de expediente.' + err,
                        'error'
                    );
                });

            }
        });
    }

    limpiar(): void{
        //Limpiamos buscador
        this.valueBuscador = '';
        //console.log('buscador' + this.valueBuscador);
    }

    filterDatatable(value): void {
        // Filtramos tabla
        this.recepcionExpedientes = this.recepcionExpedientesTemp;
        if (value.target.value === '') {
          this.recepcionExpedientes = this.recepcionExpedientesTemp;
      } else {
          const val = value.target.value.toLowerCase();
          //agregamos campos a filtrar
          const temp = this.recepcionExpedientes.filter((d) => d.idExpediente.toLowerCase().indexOf(val) !== -1 || !val || 
          d.notas.toLowerCase().indexOf(val) !== -1 || d.fechaRecepcionFormato.toLowerCase().indexOf(val) !== -1 || !val || 

          d.estatus.toLowerCase().indexOf(val) !== -1 || !val ||
          d.legislatura.cLegislatura.toLowerCase().indexOf(val) !== -1);
          this.recepcionExpedientes = temp;
      }
    }

}
