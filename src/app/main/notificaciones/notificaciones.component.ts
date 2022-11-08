import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MenuService } from 'services/menu.service';
import { TrazabilidadService } from 'services/trazabilidad.service';
import { UsuariosService } from 'services/usuarios.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-notificaciones',
    templateUrl: './notificaciones.component.html',
    styleUrls: ['./notificaciones.component.scss'],
    providers: [DatePipe]
})
export class NotificacionesComponent implements OnInit {
    historial = [];
    arrDepartamentos = [];
    loadingIndicator = true;
    reorderable = true;
    constructor(private trazabilidadService: TrazabilidadService, private usuariosService: UsuariosService, private datePipe: DatePipe, private menuService: MenuService,) { }

    async ngOnInit(): Promise<void> {
        await this.obtenerDepartamentos();
        this.obtenerTrazabilidad();
    }


    /*     async obtenerDepartamentos(): Promise<void> {
            // Obtenemos departamentos
            await this.usuariosService.obtenerDepartamentos().subscribe(
                (resp: any) => {
                    this.arrDepartamentos = resp;
                   
                   
                },
                (err) => {
                    Swal.fire(
                        "Error",
                        "Ocurrió un error obtener el documento." + err,
                        "error"
                    );
                }
            );
        } */
    async obtenerDepartamentos(): Promise<void> {
        return new Promise(async (resolve) => {
            {

                // Obtenemos departamentos
                const departamentosTemp: any[] = [];
                await this.usuariosService.obtenerDepartamentos().subscribe((resp: any) => {

                    for (const departamentos of resp) {

                        if (departamentos.bActivo && departamentos.direccionId) {

                            departamentosTemp.push({
                                id: departamentos.id,
                                cDescripcionDepartamento: departamentos.cDescripcionDepartamento,
                                bActivo: departamentos.bActivo,
                                direccionId: departamentos.direccionId
                            });
                            // }
                        }

                    }
                    this.arrDepartamentos = departamentosTemp;


                    resolve(resp)
                }, err => {

                    resolve(err)
                });
            }
        })
    }
    obtenerTrazabilidad(): void {
        let historialTemp = [];
        // Obtenemos la lista historica de notificaciones.
        this.loadingIndicator = true;
        this.trazabilidadService.obtenerTrazabilidadHistorial('').subscribe((resp: any) => {
            console.log(resp.historial);
            for (const historial of resp.historial) {
                let aDepartamento: any;

                const encontro = this.menuService.tipoDocumentos.find((tipo: { id: string; }) => tipo.id === historial.tipoDeDocumento);
                var date = new Date(historial.fechaUTC);
                let horaCreacion = '';
                if (date.getMinutes() < 10) {
                    horaCreacion = date.getHours() + ':0' + date.getMinutes();
                } else {
                    horaCreacion = date.getHours() + ':' + date.getMinutes();
                }

                if (encontro) {
                    aDepartamento = this.arrDepartamentos.find(dep => dep.id = encontro.departamento)
                    let cDepartamento = '';

                    if (aDepartamento) {
                        cDepartamento = aDepartamento.cDescripcionDepartamento
                    }

                    historialTemp.push({
                        cNombreDocumento: historial.cNombreDocumento,
                        documentoId: historial.documentoId,
                        fecha: this.datePipe.transform(date, 'dd-MM-yyyy'),
                        fechaFiltro: this.datePipe.transform(date, 'dd-MM-yyyy'),
                        hora: horaCreacion,
                        id: historial.id,
                        movimiento: historial.movimiento,
                        tipoDeDocumento: historial.tipoDeDocumento,
                        cDepartamento: cDepartamento,
                        usuario: historial.usuario,
                        version: historial.version
                    });
                } else {
                    historialTemp.push({
                        cNombreDocumento: historial.cNombreDocumento,
                        documentoId: historial.documentoId,
                        fecha: this.datePipe.transform(date, 'dd-MM-yyyy'),
                        fechaFiltro: this.datePipe.transform(date, 'dd-MM-yyyy'),
                        hora: horaCreacion,
                        id: historial.id,
                        movimiento: historial.movimiento,
                        tipoDeDocumento: historial.tipoDeDocumento,
                        cDepartamento: "",
                        usuario: historial.usuario,
                        version: historial.version
                    });
                }


            }

            this.historial = [...historialTemp];
          /*   this.historial = resp.historial */;
            this.loadingIndicator = false;
        }, err => {
            this.loadingIndicator = false;
            Swal.fire(
                'Error',
                'Ocurrió un error al obtener las notificación.' + err,
                'error'
            );
        });
    }
    borrarNotificacion(row: any): void {
        this.loadingIndicator = false;
        Swal.fire({
            title: '¿Está seguro que desea eliminar esta notificación?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Si',
            cancelButtonText: 'No'
        }).then((result) => {
            if (result.value) {

                // realizamos delete
                this.trazabilidadService.actualizarTrazabilidad({ id: row.id, excluirNotificacion: true }).subscribe((resp: any) => {
                    Swal.fire('Eliminado', 'La notificación ha sido eliminada.', 'success');
                    this.obtenerTrazabilidad();
                }, err => {
                    this.loadingIndicator = false;
                    Swal.fire(
                        'Error',
                        'Ocurrió un error al eliminar la notificación.' + err,
                        'error'
                    );
                });

            }
        });

    }
}
