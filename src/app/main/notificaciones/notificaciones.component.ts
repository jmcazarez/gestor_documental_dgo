import { Component, OnInit } from '@angular/core';
import { TrazabilidadService } from 'services/trazabilidad.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-notificaciones',
    templateUrl: './notificaciones.component.html',
    styleUrls: ['./notificaciones.component.scss']
})
export class NotificacionesComponent implements OnInit {
    historial = [];

    loadingIndicator = true;
    reorderable = true;
    constructor(private trazabilidadService: TrazabilidadService) { }

    ngOnInit(): void {
        this.obtenerTrazabilidad();
    }

    obtenerTrazabilidad(): void {
        // Obtenemos la lista historica de notificaciones.
        this.loadingIndicator = true;
        this.trazabilidadService.obtenerTrazabilidadHistorial('').subscribe((resp: any) => {
            this.historial = resp.historial;
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
                this.trazabilidadService.actualizarTrazabilidad({id: row.id, excluirNotificacion: true}).subscribe((resp: any) => {
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
