import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TipoExpedientesModel } from 'models/tipo-expedientes.models';
import { MenuService } from 'services/menu.service';
import { TipoExpedientesService } from 'services/tipo-expedientes.service';
import Swal from 'sweetalert2';
import { GuardarTipoDeExpedientesComponent } from './guardar-tipo-de-expedientes/guardar-tipo-de-expedientes.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { LoginService } from 'services/login.service';
@Component({
    selector: 'app-tipo-de-expedientes',
    templateUrl: './tipo-de-expedientes.component.html',
    styleUrls: ['./tipo-de-expedientes.component.scss']
})
export class TipoDeExpedientesComponent implements OnInit {
    loadingIndicator: boolean;
    reorderable: boolean;
    cargando: boolean;
    tipoExpedientes = [];
    tipoExpedientesTemp = [];
    optAgregar: boolean;
    optConsultar: boolean;
    optEditar: boolean;
    optEliminar: boolean;
    searchText: string;
    arrDepartamentos = []
    arrDepartamentosnew = []
    privilegios: any;
    constructor(
        private spinner: NgxSpinnerService,
        private router: Router,
        public dialog: MatDialog,
        private menuService: MenuService,
        private usuarioService: LoginService,
        private tipoExpedientesService: TipoExpedientesService
    ) { }

    async ngOnInit(): Promise<void> {
       /*  await this.menuService.limpiarMenu();
        await this.menuService.crearMenu(); */
        this.privilegios = await this.menuService.obtenerPrivilegios();
        await this.obtenerDepartamentos();
        this.obtenerTiposExpedientes();
      
      
    }

    async obtenerDepartamentos(): Promise<void> {
        return new Promise(async (resolve) => {
            {
                this.cargando = true;
                // Obtenemos departamentos
                const departamentosTemp: any[] = [];
                this.usuarioService.obtenerDepartamentos().subscribe((resp: any) => {
               
                  
                    this.arrDepartamentosnew = resp;
                   
                    this.cargando = false;
                    resolve(resp)
                }, err => {
                    this.cargando = false;
                    resolve(err)
                });
            }
        })
    }
    obtenerTiposExpedientes(): void {
        this.spinner.show();
        this.loadingIndicator = true;
        let tempTipoExpediente = [];
        this.tipoExpedientes =[];
        this.tipoExpedientesTemp =[];
        // Obtenemos los documentos
        this.tipoExpedientesService.obtenerTipoExpedientes().subscribe((resp: any) => {

            // Buscamos permisos
            const opciones = this.privilegios.opcionesPerfil.find((opcion: { cUrl: string; }) => opcion.cUrl === this.router.routerState.snapshot.url.replace('/', ''));
            if (opciones) {
                this.optAgregar = opciones.Agregar;
                this.optEditar = opciones.Editar;
                this.optConsultar = opciones.Consultar;
                this.optEliminar = opciones.Eliminar;
                // Si tiene permisos para consultar
                
                if (this.optConsultar) {
                   
                 
                    resp.forEach( tipoExpediente =>{
                        const departamento = this.arrDepartamentosnew.find((opcion: { id: string; }) => opcion.id === tipoExpediente.idDepartamento);
             
                      
                        tempTipoExpediente.push(
                            {id:tipoExpediente.id,
                                cDescripcionTipoExpediente: tipoExpediente.cDescripcionTipoExpediente,
                                descripcionTiposDocumentos: tipoExpediente.descripcionTiposDocumentos,
                                idDepartamento: tipoExpediente.idDepartamento,
                                tipo_de_documentos: tipoExpediente.tipo_de_documentos,
                                bActivo: tipoExpediente.bActivo,
                                departamento: departamento.cDescripcionDepartamento
                            
                            } 
                        )
                    })
                    this.tipoExpedientes = [...tempTipoExpediente]
                    this.tipoExpedientesTemp = [...tempTipoExpediente]
                    
                    
                }
            }
            this.loadingIndicator = false;
            this.spinner.hide();
        }, err => {
            this.loadingIndicator = false;
            this.spinner.hide();
        });
    }


    nuevoExpediente(): void {
        // Abrimos modal de guardar expediente
        const dialogRef = this.dialog.open(GuardarTipoDeExpedientesComponent, {
            width: '50%',
            height: '80%',
            disableClose: true,
            data: new TipoExpedientesModel(),

        });

        dialogRef.afterClosed().subscribe(result => {
            this.searchText = '';
          
                this.obtenerTiposExpedientes();
           

        });
    }


    eliminarExpediente(row: { id: string; }): void {
        // Eliminamos tipo de expediente
        Swal.fire({
            title: '¿Está seguro que desea eliminar este tipo de expediente?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Si',
            cancelButtonText: 'No'
        }).then((result) => {
            if (result.value) {

                // realizamos delete
                this.tipoExpedientesService.eliminarTipoExpedientes(row.id).subscribe((resp: any) => {
                    Swal.fire('Eliminado', 'El tipo de expediente ha sido eliminado.', 'success');
                    this.obtenerTiposExpedientes();
                }, err => {
                    this.cargando = false;
                    Swal.fire(
                        'Error',
                        'Ocurrió un error al eliminar el tipo de expediente.' + err,
                        'error'
                    );
                });

            }
        });
    }

    editarExpediente(expediente: TipoExpedientesModel): void {
        // Abrimos modal de editar expediente

        console.log('edit');
        const dialogRef = this.dialog.open(GuardarTipoDeExpedientesComponent, {
            width: '50%',
            height: '80%',
            disableClose: true,
            data: expediente,

        });

        dialogRef.afterClosed().subscribe(result => {
          
                this.searchText = '';
                this.obtenerTiposExpedientes();
          
        });
    }

    filterDatatable(value): void {
        this.tipoExpedientes = this.tipoExpedientesTemp;
        // Filtramos tabla
        if (value.target.value === '') {
            this.tipoExpedientes = this.tipoExpedientesTemp;
        } else {
            const val = value.target.value.toLowerCase();
            const temp = this.tipoExpedientes.filter((d) => d.cDescripcionTipoExpediente.toLowerCase().indexOf(val) !== -1 || d.departamento.toLowerCase().indexOf(val) !== -1 || d.descripcionTiposDocumentos.toLowerCase().indexOf(val) !== -1 || !val);
            this.tipoExpedientes = temp;
        }


    }
}
