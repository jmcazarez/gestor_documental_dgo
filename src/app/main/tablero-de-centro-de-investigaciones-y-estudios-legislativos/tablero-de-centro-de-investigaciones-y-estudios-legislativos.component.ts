import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RecepcionDeIniciativasComponent } from './recepcion-de-iniciativas/recepcion-de-iniciativas.component';
import { IniciativasModel } from 'models/iniciativas.models';
import { IniciativasService } from 'services/iniciativas.service';
import { MenuService } from 'services/menu.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
import * as moment from 'moment';


@Component({
  selector: 'app-tablero-de-centro-de-investigaciones-y-estudios-legislativos',
  templateUrl: './tablero-de-centro-de-investigaciones-y-estudios-legislativos.component.html',
  styleUrls: ['./tablero-de-centro-de-investigaciones-y-estudios-legislativos.component.scss'],
  providers: [DatePipe]
})

export class TableroDeCentroDeInvestigacionesYEstudiosLegislativosComponent implements OnInit {
    valueBuscador: string;
    filterName: string;
    fileUrl: any;
    loadingIndicator: boolean;
    reorderable: boolean;
    cargando: boolean;
    iniciativas = [];
    iniciativasTemporal = [];
    optAgregar: boolean;
    optConsultar: boolean;
    optEditar: boolean;
    optEliminar: boolean;
    fileBase64: any;
    constructor(
        private spinner: NgxSpinnerService,
        private datePipe: DatePipe,
        private router: Router,
        public dialog: MatDialog,
        private iniciativasService: IniciativasService,
        private menuService: MenuService,
        private sanitizer: DomSanitizer
    ) {
        // Obtenemos iniciativa
        this.obtenerIniciativas();

    }

    ngOnInit(): void {

    }

    nueva(): void {

    }


    obtenerIniciativas(): void {
        this.spinner.show();
        this.filterName = '';
        this.loadingIndicator = true;
        const iniciativasTemp: any[] = [];
        let autores: string;
        let temas: string;
        let clasificaciones: any;
        let pendiente: string;
        let receptor: string;
        let comision: string;
        let fechaRecepcion: any;
        let fechaRecepcionText: any;
        let receptorId: string;
        // Obtenemos los iniciativas
        this.iniciativasService.obtenerIniciativas().subscribe((resp: any) => {

            // Buscamos permisos
            const opciones = this.menuService.opcionesPerfil.find((opcion: { cUrl: string; }) => opcion.cUrl === 'tablero-de-iniciativas');

            this.optAgregar = opciones.Agregar;
            this.optEditar = opciones.Editar;
            this.optConsultar = opciones.Consultar;
            this.optEliminar = opciones.Eliminar;
            // Si tiene permisos para consultar
            if (this.optConsultar) {
                if (resp) {
                    
                    for (const ini of resp) {
                        autores = '';
                        temas = '';
                        clasificaciones = '';

                        for (const aut of ini.autores) {

                            if (autores === '') {
                                autores = aut.name;
                            } else {
                                autores = autores + ' , ' + aut.name;
                            }
                        }

                        for (const tem of ini.tema) {

                            if (temas === '') {
                                temas = tem.name;
                            } else {
                                temas = temas + ' , ' + tem.name;
                            }
                        }

                        if(ini.clasificaciones){
                            for (const clasf of ini.clasificaciones) {

                                if (clasificaciones === '') {
                                    clasificaciones = clasf.name;
                                } else {
                                    clasificaciones = clasificaciones + ' , ' + clasf.name;
                                }
                            }
                        }else{
                            clasificaciones = [];
                        }
                        if(ini.estatus === 'Turnar iniciativa a CIEL'){
                          pendiente = 'Pendiente';
                        }else{
                          pendiente = 'Turnada a dictamen';
                        }

                        if(ini.receptor.length == 0 || ini.receptor === undefined){
                          receptor = '';
                        }else{
                          console.log('hay receptor');
                          receptorId = ini.receptor[0].id;
                          receptor = ini.receptor[0].nombre + ' ' + ini.receptor[0].apellidoPaterno + ' ' + ini.receptor[0].apellidoMaterno;
                        }

                        if(ini.fechaRecepcion === undefined){
                          fechaRecepcion = 'N/A';
                          fechaRecepcionText = 'N/A';
                        }else{
                          fechaRecepcion = moment(ini.fechaRecepcion).format('YYYY-MM-DD');
                          fechaRecepcionText = moment(ini.fechaRecepcion).format('DD-MM-YYYY');
                        }

                        if(ini.comisiones === undefined || ini.comisiones === null){
                            comision = '';
                        }else{
                            comision = ini.comisiones.descripcion;
                        }

                        if(ini.estatus == 'Turnar iniciativa a CIEL' || ini.estatus === 'Turnar dictamen a Secretaría General'){
                          iniciativasTemp.push({
                              id: ini.id,
                              autores: ini.autores,
                              autoresText: autores,
                              tema: ini.tema,
                              temaText: temas,
                              clasificaciones: ini.clasificaciones,
                              clasificacionesText: clasificaciones,
                              estatus: ini.estatus,
                              estatusText: pendiente,
                              tipo_de_iniciativa: ini.tipo_de_iniciativa,
                              documentos: ini.documentos,
                              formatosTipoIniciativa: ini.formatosTipoIniciativa,
                              fechaIniciativa: this.datePipe.transform(ini.fechaIniciativa, 'yyyy-MM-dd'),
                              fechaCreacion: this.datePipe.transform(ini.fechaCreacion, 'yyyy-MM-dd'),
                              fechaIniciativaText: this.datePipe.transform(ini.fechaIniciativa, 'dd-MM-yyyy'),
                              fechaCreacionText: this.datePipe.transform(ini.fechaCreacion, 'dd-MM-yyyy'),
                              actasSesion: ini.actasSesion,
                              comisiones: ini.comisiones,
                              asunto: comision + ', ' + temas,
                              fechaRecepcion: fechaRecepcion,
                              fechaRecepcionText: fechaRecepcionText,
                              receptor: receptor,
                              receptorId: receptorId,
                              anexosTipoCuentaPublica: ini.anexosTipoCuentaPublica,
                              anexosTipoIniciativa: ini.anexosTipoIniciativa,
                              folioExpediente: ini.folioExpediente
                        });
                      }
                    }
                }
             
                this.iniciativas = iniciativasTemp;
                this.iniciativasTemporal = this.iniciativas;
                console.log(this.iniciativas);
            }
            this.loadingIndicator = false;
            this.spinner.hide();
        }, err => {
            this.loadingIndicator = false;
            this.spinner.hide();
        });
    }

    turnarIniciativaDictamen(iniciativa: IniciativasModel): void {
        console.log(iniciativa);
        this.valueBuscador = '';
        // Abrimos modal de guardar perfil
        if (iniciativa.estatus == 'Turnada a dictamen' || iniciativa.estatus == 'Turnar iniciativa a CIEL' || iniciativa.estatus == 'Pendiente') {
            const dialogRef = this.dialog.open(RecepcionDeIniciativasComponent, {
                width: '60%',
                height: '80%',
                disableClose: true,
                data: iniciativa,
            });

            dialogRef.afterClosed().subscribe(result => {
                this.obtenerIniciativas();
            });
        }
    }

    eliminarIniciativa(row): void {
        // Eliminamos iniciativa
        Swal.fire({
            title: '¿Está seguro que desea eliminar esta iniciativa?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Si',
            cancelButtonText: 'No'
        }).then((result) => {
            if (result.value) {

                // realizamos delete
                this.iniciativasService.eliminarIniciativa(row).subscribe((resp: any) => {
                    Swal.fire('Eliminado', 'La iniciativa ha sido eliminado.', 'success');
                    this.obtenerIniciativas();
                }, err => {
                    this.cargando = false;
                    Swal.fire(
                        'Error',
                        'Ocurrió un error al eliminar el documento.' + err,
                        'error'
                    );
                });

            }
        });
    }

    filterDatatable(value): void {
        // Filtramos tabla
        if (value.target.value === '') {
            this.iniciativas = this.iniciativasTemporal;
        } else {
            const val = value.target.value.toLowerCase();
            const temp = this.iniciativas.filter((d) => d.id.toLowerCase().indexOf(val) !== -1 || !val ||
                d.fechaIniciativa.toLowerCase().indexOf(val) !== - 1 || d.asunto.toLowerCase().indexOf(val) !== - 1 ||
                d.estatus.toLowerCase().indexOf(val) !== - 1 || d.autoresText.toLowerCase().indexOf(val) !== - 1 ||
                d.receptor.toLowerCase().indexOf(val) !== - 1 ||
                d.fechaRecepcion.toLowerCase().indexOf(val) !== - 1);

            this.iniciativas = temp;
        }
    }

}
