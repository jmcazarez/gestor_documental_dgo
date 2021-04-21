import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { EmpleadosDelCongresoService } from 'services/empleados-del-congreso.service';
import { MenuService } from 'services/menu.service';
import Swal from 'sweetalert2';
import { GuardarEmpleadoComponent } from './guardar-empleado/guardar-empleado.component';
import { EmpleadosModel } from 'models/empleados.models';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-empleados-del-congreso',
  templateUrl: './empleados-del-congreso.component.html',
  styleUrls: ['./empleados-del-congreso.component.scss']
})
export class EmpleadosDelCongresoComponent implements OnInit {
    loadingIndicator: boolean;
    reorderable: boolean;
    cargando: boolean;
    empleados = [];
    empleadosTemp = [];
    optAgregar: boolean;
    optConsultar: boolean;
    optEditar: boolean;
    optEliminar: boolean;
    valueBuscador: string = '';
    constructor(private router: Router,
                public dialog: MatDialog,
                private menuService: MenuService,
                private spinner: NgxSpinnerService,
                private empleadosService: EmpleadosDelCongresoService) { }

    ngOnInit(): void {
        this.obtenerEmpleados();
    }

    obtenerEmpleados(): void {
        this.spinner.show();
        this.loadingIndicator = true;
        // Obtenemos los empleados
        this.empleadosService.obtenerEmpleados().subscribe((resp: any) => {

            // Buscamos permisos
            const opciones = this.menuService.opcionesPerfil.find((opcion: { cUrl: string; }) => opcion.cUrl === this.router.routerState.snapshot.url.replace('/', ''));
            this.optAgregar = opciones.Agregar;
            this.optEditar = opciones.Editar;
            this.optConsultar = opciones.Consultar;
            this.optEliminar = opciones.Eliminar;
            // Si tiene permisos para consultar
            if (this.optConsultar) {
              
                this.empleados = resp;
                this.empleadosTemp = this.empleados;
            }
            this.loadingIndicator = false;
            this.spinner.hide();
        }, err => {
            this.loadingIndicator = false;
            this.spinner.hide();
        });
    }

    filterDatatable(value): void {
        // Filtramos tabla
        
        if (value.target.value === '') {
            this.empleados = this.empleadosTemp;
        } else {
            const val = value.target.value.toLowerCase();
            //agregamos campos a filtrar
            const temp = this.empleados.filter((d) => d.nombre.toLowerCase().indexOf(val) !== -1 || !val || 
            d.apellidoPaterno.toLowerCase().indexOf(val) !== -1 || !val || 
            d.apellidoMaterno.toLowerCase().indexOf(val) !== -1 || !val || 
            d.email.toLowerCase().indexOf(val) !== -1 || !val || 
            d.telefono.toLowerCase().indexOf(val) !== -1 || !val || 
            d.puesto.descripcion.toLowerCase().indexOf(val) !== -1 || !val || 
            d.secretaria.cDescripcionSecretaria.toLowerCase().indexOf(val) !== -1);
            this.empleados = temp;
        }
    }


    editarEmpleado(empleados: EmpleadosModel): void {

      // Abrimos modal de guardar empleado
      const dialogRef = this.dialog.open(GuardarEmpleadoComponent, {
        width: '60%',
        height: '80%',
        disableClose: true,
        data: empleados,
      });

      dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.limpiar();
            this.obtenerEmpleados();
          }

      });
  }

  guardarEmpleado(): void {
      // Abrimos modal de guardar empleado
      const dialogRef = this.dialog.open(GuardarEmpleadoComponent, {
          width: '50%',
          height: '80%',
          disableClose: true,
          data: new EmpleadosModel(),

      });

      dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.limpiar();
            this.obtenerEmpleados();
          }
      });
  }

  limpiar(): void{
    //Limpiamos buscador
    this.valueBuscador = '';
    //console.log('buscador' + this.valueBuscador);
    }

    eliminarEmpleado(row: { id: string; }): void {
        // Eliminamos empleado
        Swal.fire({
            title: '¿Está seguro que desea eliminar este empleado?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Si',
            cancelButtonText: 'No'
        }).then((result) => {
            if (result.value) {

                // realizamos delete
                this.empleadosService.eliminarEmpleado(row.id).subscribe((resp: any) => {
                    Swal.fire('Eliminado', 'El empleado ha sido eliminado.', 'success');
                    this.limpiar();
                    this.obtenerEmpleados();
                }, err => {
                    this.cargando = false;
                    Swal.fire(
                        'Error',
                        'Ocurrió un error al eliminar la secretaria.' + err,
                        'error'
                    );
                });

            }
        });
    }
}
