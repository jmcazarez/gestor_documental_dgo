import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DiputadosModel } from 'models/diputados.models';
import { MenuService } from 'services/menu.service';
import { DiputadosService } from 'services/diputados.service';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
    selector: 'app-firma-de-iniciativas',
    templateUrl: './firma-de-iniciativas.component.html',
    styleUrls: ['./firma-de-iniciativas.component.scss']
})
export class FirmasDeIniciativasComponent implements OnInit {
    filterName: string;
    loadingIndicator: boolean;
    reorderable: boolean;
    cargando: boolean;
    Iniciativas = [];
    IniciativasTemp = [];
    optAgregar: boolean;
    optConsultar: boolean;
    optEditar: boolean;
    optEliminar: boolean;
    constructor(private router: Router,
        public dialog: MatDialog,
        private menuService: MenuService,
        private spinner: NgxSpinnerService,
        private diputadosService: DiputadosService) { }

    ngOnInit(): void {
        this.obtenerIniciativasPorFirmar();
    }

    obtenerIniciativasPorFirmar(): void {
        this.spinner.show();
        this.filterName = '';
        this.loadingIndicator = true;
        // Obtenemos los documentos
        this.diputadosService.obtenerDiputados().subscribe((resp: any) => {                   
            this.loadingIndicator = false;
            this.spinner.hide();
        }, err => {
            this.loadingIndicator = false;
            this.spinner.hide();
        });
    }

   
    filterDatatable(value): void {
        this.Iniciativas = this.IniciativasTemp;
        // Filtramos tabla
        if (value.target.value === '') {
            this.Iniciativas = this.IniciativasTemp;
        } else {
            const val = value.target.value.toLowerCase();
            const temp = this.Iniciativas.filter((d) => d.nombre.toLowerCase().indexOf(val) !== -1 || !val ||
                d.distrito.descripcion.toLowerCase().indexOf(val) !== -1 || d.partidos_politico.cPartidoPolitico.toLowerCase().indexOf(val) !== -1 ||
                d.legislatura.cLegislatura.toLowerCase().indexOf(val) !== -1 );
            this.Iniciativas = temp;
        }
    }

}
