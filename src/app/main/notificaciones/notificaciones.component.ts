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
    totalItems = 0;
    currentPage = 1;
    itemsPerPage = 10;
    currentVisible: number = 3;
    currenPage = 1;
    constructor(private trazabilidadService: TrazabilidadService, private usuariosService: UsuariosService, private datePipe: DatePipe, private menuService: MenuService,) { }

    async ngOnInit(): Promise<void> {
        await this.obtenerDepartamentos();
        this.obtenerTrazabilidad(1);
    }

    onPageChange(event: any) {
        this.currentPage = event.offset;
        console.log(this.currentPage);
        this.obtenerTrazabilidad(this.currentPage + 1);
        // Realiza una consulta a tu fuente de datos para obtener los datos de la página actual
        // y actualiza this.pagedData y this.totalItems en consecuencia.
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
    obtenerTrazabilidad(nPage: number): void {
        let historialTemp = [];
        // Obtenemos la lista historica de notificaciones.
        this.loadingIndicator = true;
        this.trazabilidadService.obtenerTrazabilidadHistorialPage(nPage).subscribe((resp: any) => {
            this.totalItems = resp.pageCount;
            for (const historial of resp.historial) {
                let aDepartamento: any;
                let tipoDocumento = ''

                if (historial.documento) {
                    tipoDocumento = historial.documento.tipo_de_documento;
                }
                const encontro = this.menuService.tipoDocumentos.find((tipo: { id: string; }) => tipo.id === tipoDocumento);
                var date = new Date(historial.createdAt);
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
                        cNombreDocumento: historial.documento.cNombreDocumento,
                        documentoId: historial.documento.id,
                        fecha: this.datePipe.transform(date, 'dd-MM-yyyy'),
                        fechaFiltro: this.datePipe.transform(date, 'dd-MM-yyyy'),
                        hora: horaCreacion,
                        id: historial.id,
                        movimiento: historial.cTipoMovimiento,
                        tipoDeDocumento: historial.tipoDeDocumento,
                        cDepartamento: cDepartamento,
                        usuario: historial.usuario.cNombre,
                        version: historial.documento.version
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
            console.log(err);
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
                    this.obtenerTrazabilidad(this.currentPage + 1);
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
