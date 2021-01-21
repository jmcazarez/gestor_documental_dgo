import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TrazabilidadService } from 'services/trazabilidad.service';
import { ClasficacionDeDocumentosComponent } from '../clasficacion-de-documentos.component';

@Component({
    selector: 'app-historial-de-versionamiento',
    templateUrl: './historial-de-versionamiento.component.html',
    styleUrls: ['./historial-de-versionamiento.component.scss']
})
export class HistorialDeVersionamientoComponent implements OnInit {
    historial = [];

    loadingIndicator = true;
    reorderable = true;
    columns = [{ name: 'Versión' }, { name: 'Fecha' }, { name: 'Hora' }, { name: 'Usuario' }, { name: 'Movimiento' }];
    constructor(private trazabilidadService: TrazabilidadService,
                private dialogRef: MatDialogRef<ClasficacionDeDocumentosComponent>,
                @Inject(MAT_DIALOG_DATA) public documento) { }

    ngOnInit(): void {
        this.obtenerTrazabilidad();
    }

    obtenerTrazabilidad(): void {

        this.trazabilidadService.obtenerTrazabilidadHistorial(this.documento.id).subscribe((resp: any) => {
            this.historial = resp.historial;
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
