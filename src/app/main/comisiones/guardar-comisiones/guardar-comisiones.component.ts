import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ComisionesModel } from 'models/comisiones.models';
import { ComisionesService } from 'services/comisiones.service';
import Swal from 'sweetalert2';
import { ComisionesComponent } from '../comisiones.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { GuardarParticipantesComisionComponent } from './guardar-participantes-comision/guardar-participantes-comision.component';
import { MenuService } from 'services/menu.service';
import { Router } from '@angular/router';
import { PartidosPoliticosService } from 'services/partidos-politicos.service';
import { DetalleComisionsService } from 'services/detalle-participante-comisions.service';
import { DetalleComisionModels } from 'models/detalle-participante-comision';
import { LegislaturaService } from 'services/legislaturas.service';

export interface vocals {
    cargo: string;
    idParticipante: [];
    participante: string;
    partido: string;
}

@Component({
    selector: 'app-guardar-comisiones',
    templateUrl: './guardar-comisiones.component.html',
    styleUrls: ['./guardar-comisiones.component.scss']
})
export class GuardarComisionesComponent implements OnInit {

    form: FormGroup;
    filterName: string;
    selectedTipoComision: any;
    arrTipoComision: [];
    arrPartidos: any[];
    arrLegislatura: any[];
    detalles: any[];
    detallesTemp: any[];
    loadingIndicator: boolean;
    optAgregar: boolean;
    optConsultar: boolean;
    optEditar: boolean;
    optEliminar: boolean;
    searchText: string;
    detalleComision: DetalleComisionModels;
    participantesExist: boolean = false;
    vocals: vocals[] = [];

    constructor(
        private formBuilder: FormBuilder,
        private spinner: NgxSpinnerService,
        private dialogRef: MatDialogRef<ComisionesComponent>,
        private comsionesService: ComisionesService,
        private dialog: MatDialog,
        private menuService: MenuService,
        private router: Router,
        private partidoPoliticoService: PartidosPoliticosService,
        private detalleComisionsService: DetalleComisionsService,
        private legislaturaService: LegislaturaService,
        @Inject(MAT_DIALOG_DATA) public comision: ComisionesModel
    ) { }

    async ngOnInit(): Promise<void> {
        // Form reactivo

        console.log(this.comision.detalle_participantes_comisions);

        if (this.comision.activo === undefined) {
            this.comision.activo = true;
        }
        if (this.comision.tipos_comisione) {
            this.selectedTipoComision = this.comision.tipos_comisione.id;
        }

        this.form = this.formBuilder.group({
            descripcion: [this.comision.descripcion, [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
            tipoComision: [{ value: this.comision.tipos_comisione, disabled: false }, [Validators.required]],
            estatus: this.comision.activo,
        });

        if (this.comision.iniciativas > 0) {
            this.form.disable();
        }
        await this.obtenerLegislaturas();
        await this.obtenerPartidos();
        await this.obtenerTipoComisiones();
        await this.obtenerDetallesComision();


    }

    async obtenerDetallesComision(): Promise<void> {
        this.spinner.show();
        const detallesComisionTemp: any[] = [];
        this.loadingIndicator = true;
        // Obtenemos los documentos
        await this.detalleComisionsService.obtenerDetalleComision().subscribe((resp: any) => {

            // Buscamos permisos
            const opciones = this.menuService.opcionesPerfil.find((opcion: { cUrl: string; }) => opcion.cUrl === this.router.routerState.snapshot.url.replace('/', ''));

            this.optAgregar = opciones.Agregar;
            this.optEditar = opciones.Editar;
            this.optConsultar = opciones.Consultar;
            this.optEliminar = opciones.Eliminar;
            let i = 0;
            let legislaturaId: string;
            let legislatura: string;
            // Si tiene permisos para consultar
            if (this.optConsultar) {
                //Mostramos participantes presidente y vicepresidente
                for (const detalleComision of resp) {

                    if (detalleComision.comisione === this.comision.id) {
                        console.log(detalleComision)
                        this.participantesExist = true;
                        const partido = this.arrPartidos.find(meta => meta.id == detalleComision.presidente[0].partidos_politico);
                        const partidoVice = this.arrPartidos.find(meta => meta.id == detalleComision.vicepresidente[0].partidos_politico);

                        if (detalleComision.legislatura == null || detalleComision.legislatura == undefined) {
                            legislaturaId = 'N/A'
                            legislatura = 'N/A';
                        } else {
                            legislaturaId = detalleComision.legislatura.id;
                            legislatura = detalleComision.legislatura.cLegislatura;
                        }

                        if (detalleComision.presidente[0]) {
                            detallesComisionTemp.push({

                                cargo: 'Presidente',
                                idParticipante: detalleComision.presidente[0].id,
                                participante: detalleComision.presidente[0].nombre,
                                partido: partido.cNomenclatura,
                                idLegislatura: legislaturaId,
                                legislatura: legislatura

                            });

                        }

                        if (detalleComision.vicepresidente[0]) {
                            detallesComisionTemp.push({

                                cargo: 'Vice presidente',
                                idParticipante: detalleComision.vicepresidente[0].id,
                                participante: detalleComision.vicepresidente[0].nombre,
                                partido: partidoVice.cNomenclatura,
                                legislatura: legislatura

                            });

                        }

                        while (i <= detalleComision.vocals.length - 1) {
                            if (detalleComision.vocals[i]) {
                                detallesComisionTemp.push({

                                    cargo: 'Vocal',
                                    idParticipante: detalleComision.vocals[i].id,
                                    participante: detalleComision.vocals[i].nombre,
                                    partido: this.arrPartidos.find(meta => meta.id == detalleComision.vocals[i].partidos_politico).cNomenclatura,
                                    legislatura: legislatura

                                });
                            }
                            i++
                        }
                    }
                }

                this.detalles = detallesComisionTemp;

                console.log(this.detalles);
                this.detallesTemp = this.detalles;
                this.spinner.hide();
            }
            this.loadingIndicator = false;
            this.spinner.hide();
        }, err => {
            this.spinner.hide();
            this.loadingIndicator = false;
        });
    }

    async guardar(): Promise<void> {

        if (this.detalles.length === 0) {
            Swal.fire('Error', 'Es necesario capturar los participantes para poder guardar la comisión.', 'error');
        } else {
            this.spinner.show();
            // Asignamos valores a objeto

            this.comision.activo = this.form.get('estatus').value;
            this.comision.descripcion = this.form.get('descripcion').value;
            this.comision.tipos_comisione = this.selectedTipoComision;

            console.log(this.detalles);
            let presidente = this.detalles.find(meta => meta.cargo == 'Presidente');
            let vicepresidentes = this.detalles.find(meta => meta.cargo == 'Vice presidente');
            //Obtenermos los vocals
            this.vocals = this.detalles.filter(meta => meta.cargo == 'Vocal');


            console.log(this.vocals);

            if (this.comision.id) {


                if (this.comision.detalle_participantes_comisions) {
                    // Actualizamos la comision 
                    this.detalleComisionsService.actualizarDetalleComisions({
                        id: this.comision.detalle_participantes_comisions[0].id,
                        comisione: this.comision.id,
                        legislatura: [presidente.idLegislatura],
                        presidente: [presidente.idParticipante],
                        vicepresidente: [vicepresidentes.idParticipante],
                        vocals: [this.vocals],
                        activo: true
                    }).subscribe((resp: any) => {
                        if (resp) {

                        } else {
                            this.spinner.hide();
                            Swal.fire('Error', 'Ocurrió un error al guardar. ' + resp.error.data, 'error');
                        }
                    }, err => {
                        this.spinner.hide();
                        Swal.fire('Error', 'Ocurrió un error al guardar.' + err.error.data, 'error');
                    });
                } else {

                    this.detalleComisionsService.guardarDetalleComision({
                        id: this.comision.detalle_participantes_comisions[0].id,
                        comisione: this.comision.id,
                        legislatura: [presidente.idLegislatura],
                        presidente: [presidente.idParticipante],
                        vicepresidente: [vicepresidentes.idParticipante],
                        vocals: [this.vocals],
                        activo: true
                    }).subscribe((resp: any) => {
                        if (resp) {

                        } else {
                            this.spinner.hide();
                            Swal.fire('Error', 'Ocurrió un error al guardar. ' + resp.error.data, 'error');
                        }
                    }, err => {
                        this.spinner.hide();
                        Swal.fire('Error', 'Ocurrió un error al guardar.' + err.error.data, 'error');
                    });

                }

                // Actualizamos la comisión
                this.comsionesService.actualizarComision(this.comision).subscribe((resp: any) => {
                    if (resp) {
                        this.spinner.hide();
                        Swal.fire('Éxito', 'Comisión actualizada correctamente.', 'success');
                        this.comision = resp.data;

                        this.cerrar(this.comision);
                    } else {
                        this.spinner.hide();
                        Swal.fire('Error', 'Ocurrió un error al actualizar. ' + resp.error.data, 'error');
                    }
                }, err => {
                    this.spinner.hide();
                    Swal.fire('Error', 'Ocurrió un error al actualizar.' + err.error.data, 'error');
                });

            } else {
                // Guardamos la comisión

                this.detalleComisionsService.guardarDetalleComision({
                    legislatura: [presidente.idLegislatura],
                    presidente: [presidente.idParticipante],
                    vicepresidente: [vicepresidentes.idParticipante],
                    vocals: [this.vocals],
                    activo: true
                }).subscribe((resp: any) => {
                    if (resp) {
                        this.comision.detalle_participantes_comisions = [resp.data.id];
                        this.comsionesService.guardarComision(this.comision).subscribe((resp: any) => {
                            if (resp) {
                                this.spinner.hide();
                                Swal.fire('Éxito', 'Comisión por legislatura guardada correctamente.', 'success');
                                this.cerrar(this.comision);
                            } else {
                                this.spinner.hide();
                                Swal.fire('Error', 'Ocurrió un error al guardar. ' + resp.error.data, 'error');
                            }
                        }, err => {
                            this.spinner.hide();
                            Swal.fire('Error', 'Ocurrió un error al guardar.' + err.error.data, 'error');
                        });
                    } else {
                        this.spinner.hide();
                        Swal.fire('Error', 'Ocurrió un error al guardar. ' + resp.error.data, 'error');
                    }
                }, err => {
                    this.spinner.hide();
                    Swal.fire('Error', 'Ocurrió un error al guardar.' + err.error.data, 'error');
                });
            }
        }
    }

    async obtenerTipoComisiones(): Promise<void> {
        // Obtenemos los tipos de comisiones
        this.spinner.show();
        this.filterName = '';
        await this.comsionesService.obtenerTipoComisiones().subscribe((resp: any) => {

            this.arrTipoComision = resp;
            this.spinner.hide();
        }, err => {
            Swal.fire('Error', 'Ocurrió un error obtener los tipos de comision.' + err, 'error');
            this.spinner.hide();
        });
    }


    configurarParticipantes(): void {

        const dialogRef = this.dialog.open(GuardarParticipantesComisionComponent, {
            width: '50%',
            height: '80%',
            disableClose: true,
            data: this.comision,

        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                if (result) {
                    this.participantesExist = true;
                }
                this.detalles = result;
                this.detallesTemp = this.detalles;
            }

        });
    }

    filterDatatable(value): void {
        this.detalles = this.detallesTemp;
        // Filtramos tabla
        if (value.target.value === '') {
            this.detalles = this.detallesTemp;
        } else {
            const val = value.target.value.toLowerCase();
            const temp = this.detalles.filter((d) => d.participante.toLowerCase().indexOf(val) !== -1 || !val || d.partido.toLowerCase().indexOf(val) !== -1 || d.cargo.toLowerCase().indexOf(val) !== -1);
            this.detalles = temp;
        }
    }

    async obtenerPartidos(): Promise<void> {
        return new Promise(async (resolve) => {
            {
                // Obtenemos Partidos Politicos
                this.spinner.show();
                await this.partidoPoliticoService.obtenerPartidoPolitico().subscribe((resp: any) => {
                    this.arrPartidos = resp;
                    resolve(resp)
                    this.spinner.hide();
                }, err => {
                    Swal.fire('Error', 'Ocurrió un error obtener los partidos politicos.' + err, 'error');
                    resolve(err)
                    this.spinner.hide();
                });
            }
        });
    }

    async obtenerLegislaturas(): Promise<void> {
        // Obtenemos Partidos Politicos
        this.spinner.show();
        await this.legislaturaService.obtenerLegislatura().subscribe((resp: any) => {
            this.arrLegislatura = resp;
            this.spinner.hide();
        }, err => {
            Swal.fire('Error', 'Ocurrió un error obtener las legislaturas.' + err, 'error');
            this.spinner.hide();
        });
    }

    cerrar(ent): void {
        if (ent) {
            this.dialogRef.close(ent);
        } else {
            this.dialogRef.close();
        }
    }


}
