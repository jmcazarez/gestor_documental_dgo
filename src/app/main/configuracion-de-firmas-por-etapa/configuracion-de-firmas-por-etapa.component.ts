import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GuardarConfiguracionFirmasPorEtapaComponent } from './guardar-configuracion-de-firmas-por-etapa/guardar-configuracion-de-firmas-por-etapa.component';
import { FirmasPorEtapaModel } from 'models/configuracion-de-firmas-por-etapa.models';
import { IniciativasService } from 'services/iniciativas.service';
import { MenuService } from 'services/menu.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
import { FirmasPorEtapaService } from 'services/configuracion-de-firmas-por-etapa.service';
import { PuestosService } from 'services/puestos.service';
@Component({
    selector: 'app-configuracion-de-firmas-por-etapa',
    templateUrl: './configuracion-de-firmas-por-etapa.component.html',
    styleUrls: ['./configuracion-de-firmas-por-etapa.scss'],
    providers: [DatePipe]
})
export class ConfiguracionFirmasPorEtapaComponent implements OnInit {
    filterName: string;
    fileUrl: any;
    loadingIndicator: boolean;
    reorderable: boolean;
    cargando: boolean;
    confFirmas = [];
    confFirmasTemporal = [];
    arrPuestos = [];
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
        private firmasEtapaService: FirmasPorEtapaService,
        private menuService: MenuService,
        private sanitizer: DomSanitizer,
        private puestosService: PuestosService
    ) {
        // Obtenemos los puestos
        this.obtenerPuestos();
        // Obtenemos firmas por etapa
        this.obtenerFirmasPorEtapa();

    }

    ngOnInit(): void {

    }

    nuevaConfiguracion(): void {
        // Abrimos modal de guardar usuario
        const dialogRef = this.dialog.open(GuardarConfiguracionFirmasPorEtapaComponent, {
            width: '50%',
            height: '80%',
            // height: '75%',
            // height: '100%',
            disableClose: true,
            data: new FirmasPorEtapaModel(),

        });

        dialogRef.afterClosed().subscribe(result => {
            this.obtenerFirmasPorEtapa();
        });
    }


    async obtenerFirmasPorEtapa(): Promise<void> {
        this.spinner.show();
        this.filterName = '';
        let objPartificapntes: any;
        let nombresParticipantes = '';
        let descripcionPuestos = '';
        this.loadingIndicator = true;
        const firmasTemp: any[] = [];
        let puesto: any;
        // Obtenemos los firmas por etapa
        await this.firmasEtapaService.obtenerFirmasPorEtapa().subscribe((resp: any) => {

            // Buscamos permisos
            const opciones = this.menuService.opcionesPerfil.find((opcion: { cUrl: string; }) => opcion.cUrl === 'configuración-de-firmas-por-etapa');

            this.optAgregar = opciones.Agregar;
            this.optEditar = opciones.Editar;
            this.optConsultar = opciones.Consultar;
            this.optEliminar = opciones.Eliminar;
            // Si tiene permisos para consultar
            if (this.optConsultar) {
                if (resp) {
                    for (const ini of resp) {

                        if (ini.participantes) {
                            objPartificapntes = ini.participantes;
                            nombresParticipantes = '';
                            puesto = [];
                            descripcionPuestos = '';
                            for (const participante of objPartificapntes) {
                                console.log(participante);
                                if (participante.puesto) {
                                    puesto = this.arrPuestos.find(puesto => puesto.id === participante.puesto);
                                    if(puesto){
                                        descripcionPuestos
                                        if (descripcionPuestos === '') {
                                            descripcionPuestos = puesto.descripcion;
                                        } else {
                                            descripcionPuestos = descripcionPuestos + ' , ' + puesto.descripcion;;
                                        }
                                    }
                                }
                                if (nombresParticipantes === '') {
                                    nombresParticipantes = participante.nombre;
                                } else {
                                    nombresParticipantes = nombresParticipantes + ' , ' + participante.nombre;
                                }
                            }
                        }

                        firmasTemp.push({
                            id: ini.id,
                            etapa: ini.etapa,
                            nombresParticipantes: nombresParticipantes,
                            participantes: ini.participantes,
                            puestos: descripcionPuestos,
                            arrPuestos: this.arrPuestos
                        });
                    }
                }
                this.confFirmas = firmasTemp;
                this.confFirmasTemporal = this.confFirmas;
            }
            this.loadingIndicator = false;
            this.spinner.hide();
        }, err => {
            this.loadingIndicator = false;
            this.spinner.hide();
        });
    }


    async obtenerPuestos(): Promise<void> {
        // Obtenemos empleados
        this.spinner.show();
        await this.puestosService.obtenerPuestos().subscribe((resp: any) => {

            this.arrPuestos = resp;
            this.spinner.hide();
        }, err => {
            Swal.fire('Error', 'Ocurrió un error obtener los puestos.' + err, 'error');
            this.spinner.hide();
        });
    }
    editarConfiguracion(configuracion: FirmasPorEtapaModel): void {
        // Abrimos modal de guardar perfil
        const dialogRef = this.dialog.open(GuardarConfiguracionFirmasPorEtapaComponent, {
            width: '60%',
            height: '80%',
            disableClose: true,
            data: configuracion,
        });

        dialogRef.afterClosed().subscribe(result => {
            this.obtenerFirmasPorEtapa();
        });
    }



    filterDatatable(value): void {
        // Filtramos tabla
        if (value.target.value === '') {
            this.confFirmas = this.confFirmasTemporal;
        } else {
            const val = value.target.value.toLowerCase();
            const temp = this.confFirmas.filter((d) => d.etapa.descripcion.toLowerCase().indexOf(val) !== -1 || !val ||
                d.nombresParticipantes.toLowerCase().indexOf(val) !== - 1 || d.puestos.toLowerCase().indexOf(val) !== - 1 );

            this.confFirmas = temp;
        }
    }

}
