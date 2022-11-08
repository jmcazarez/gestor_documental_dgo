import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TrazabilidadService } from 'services/trazabilidad.service';
import { ClasficacionDeDocumentosComponent } from '../clasficacion-de-documentos.component';

@Component({
    selector: 'app-historial-de-versionamiento',
    templateUrl: './historial-de-versionamiento.component.html',
    styleUrls: ['./historial-de-versionamiento.component.scss'],
    providers: [DatePipe]
})
export class HistorialDeVersionamientoComponent implements OnInit {
    historial = [];

    loadingIndicator = true;
    reorderable = true;
    columns = [{ name: 'Versión' }, { name: 'Fecha' }, { name: 'Hora' }, { name: 'Usuario' }, { name: 'Movimiento' }];
    constructor(private trazabilidadService: TrazabilidadService,
                private dialogRef: MatDialogRef<ClasficacionDeDocumentosComponent>,
                private datePipe: DatePipe,
                @Inject(MAT_DIALOG_DATA) public documento) { }

    ngOnInit(): void {
        this.obtenerTrazabilidad();
    }

    obtenerTrazabilidad(): void {

        this.trazabilidadService.obtenerTrazabilidadHistorial(this.documento.id).subscribe((resp: any) => {
            let historialTemp = [];
            for (const historial of resp.historial) {
     
                var date = new Date(historial.fechaUTC);
                let horaCreacion = '';
                if (date.getMinutes() < 10) {
                    horaCreacion = date.getHours() + ':0' + date.getMinutes();
                } else {
                    horaCreacion = date.getHours() + ':' + date.getMinutes();
                }                       

                    historialTemp.push({
                        cNombreDocumento: historial.cNombreDocumento,
                        documentoId: historial.documentoId,
                        fecha: this.datePipe.transform(date, 'dd-MM-yyyy'),                      
                        hora: horaCreacion,
                        id: historial.id,
                        movimiento: historial.movimiento,
                        tipoDeDocumento: historial.tipoDeDocumento,
                        usuario: historial.usuario,
                        version: historial.version
                    });
            }
            this.historial = [...historialTemp];
            this.loadingIndicator = false;
        }, err => {
            this.loadingIndicator = false;
        });
    }

    cerrar(retult: any): void {
        this.dialogRef.close(retult);
    }

    consultarDocumento(row: any): void {


        this.trazabilidadService.obtenerTrazabilidadId(row.id).subscribe((resp: any) => {

            this.dialogRef.close({ opcion: 'consultar', listado: resp.listado.data[0], version: row.movimiento });
        }, err => {
            this.loadingIndicator = false;
        });
    }

    restaurarVersion(row: any): void {

        this.trazabilidadService.obtenerTrazabilidadId(row.id).subscribe((resp: any) => {
            
            this.dialogRef.close({ opcion: 'restaurar', listado: resp.listado.data[0], version: row.movimiento });
        }, err => {
            this.loadingIndicator = false;
        });
    }

}
