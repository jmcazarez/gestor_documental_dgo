import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GuardarIniciativasComponent } from './guardar-iniciativas/guardar-iniciativas.component';
import { IniciativaTurnadaAComisionComponent } from './iniciativa-turnada-a-comision/iniciativa-turnada-a-comision.component';
import { IniciativasModel } from 'models/iniciativas.models';
import { IniciativasService } from 'services/iniciativas.service';
import { MenuService } from 'services/menu.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
    selector: 'app-tablero-de-iniciativas',
    templateUrl: './tablero-de-iniciativas.component.html',
    styleUrls: ['./tablero-de-iniciativas.component.scss'],
    providers: [DatePipe]
})

export class TableroDeIniciativasComponent implements OnInit {
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

    nuevaIniciativa(): void {
        // Abrimos modal de guardar usuario
        const dialogRef = this.dialog.open(GuardarIniciativasComponent, {
            width: '50%',
            height: '80%',
            // height: '75%',
            // height: '100%',
            disableClose: true,
            data: new IniciativasModel(),


        });

        dialogRef.afterClosed().subscribe(result => {
            this.obtenerIniciativas();
        });
    }


    obtenerIniciativas(): void {
        this.spinner.show();
        this.filterName = '';
        this.loadingIndicator = true;
        const iniciativasTemp: any[] = [];
        let autores: string;
        let temas: string;
        let clasificaciones: any;
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
                    console.log(resp);
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

                        iniciativasTemp.push({
                            id: ini.id,
                            autores: ini.autores,
                            autoresText: autores,
                            tema: ini.tema,
                            temaText: temas,
                            clasificaciones: ini.clasificaciones,
                            clasificacionesText: clasificaciones,
                            estatus: ini.estatus,
                            tipo_de_iniciativa: ini.tipo_de_iniciativa,
                            documentos: ini.documentos,
                            formatosTipoIniciativa: ini.formatosTipoIniciativa,
                            fechaIniciativa: this.datePipe.transform(ini.fechaIniciativa, 'yyyy-MM-dd'),
                            fechaCreacion: this.datePipe.transform(ini.fechaCreacion, 'yyyy-MM-dd'),
                            fechaIniciativaText: this.datePipe.transform(ini.fechaIniciativa, 'dd-MM-yyyy'),
                            fechaCreacionText: this.datePipe.transform(ini.fechaCreacion, 'dd-MM-yyyy'),
                            actasSesion: ini.actasSesion,
                            comisiones: ini.comisiones,
                            anexosTipoCuentaPublica: ini.anexosTipoCuentaPublica,
                            anexosTipoIniciativa: ini.anexosTipoIniciativa
                        });
                    }
                }
                this.iniciativas = iniciativasTemp;
                this.iniciativasTemporal = this.iniciativas;
            }
            this.loadingIndicator = false;
            this.spinner.hide();
        }, err => {
            this.loadingIndicator = false;
            this.spinner.hide();
        });
    }


    editarIniciativa(iniciativa: IniciativasModel): void {
        // Abrimos modal de guardar perfil
        if (iniciativa.estatus == 'Registrada') {
            const dialogRef = this.dialog.open(GuardarIniciativasComponent, {
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

    iniciativaTurnada(iniciativa: IniciativasModel): void {
        // Abrimos modal de guardar perfil
       // if (iniciativa.estatus == 'Turnado de iniciativa a comisión') {
            const dialogRef = this.dialog.open(IniciativaTurnadaAComisionComponent, {
                width: '60%',
                height: '80%',
                disableClose: true,
                data: iniciativa,
            });

            dialogRef.afterClosed().subscribe(result => {
                this.obtenerIniciativas();
            });
        //}
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


    consultarDcumento(iniciativa: IniciativasModel): void {
        // Abrimos modal de guardar perfil
        const dialogRef = this.dialog.open(GuardarIniciativasComponent, {
            width: '60%',
            height: '80%',
            disableClose: true,
            data: iniciativa,
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                result.disabled = true;
                // this.obtenerDocumentos();
                //  if (result.documento.ext === '.pdf') {
                //this.clasificarDocumento(result);
                // }
            }

        });
    }

    filterDatatable(value): void {
        // Filtramos tabla
        this.iniciativas = this.iniciativasTemporal;
        if (value.target.value === '') {
            this.iniciativas = this.iniciativasTemporal;
        } else {
            const val = value.target.value.toLowerCase();
            const temp = this.iniciativas.filter((d) => d.tipo_de_iniciativa.descripcion.toLowerCase().indexOf(val) !== -1 || !val ||
                d.fechaIniciativa.toLowerCase().indexOf(val) !== - 1 || d.fechaCreacion.toLowerCase().indexOf(val) !== - 1 ||
                d.estatus.toLowerCase().indexOf(val) !== - 1 || d.autoresText.toLowerCase().indexOf(val) !== - 1 ||
                d.temaText.toLowerCase().indexOf(val) !== - 1);

            this.iniciativas = temp;
        }
    }

}
