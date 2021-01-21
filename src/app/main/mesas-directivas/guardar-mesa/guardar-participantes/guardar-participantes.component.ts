import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MesasDirectivasModel } from 'models/mesas-directivas.models';
import { MesasDirectivasService } from 'services/mesas-directivas.service';
import { DetalleMesaService } from 'services/detalle-mesa-directiva.service'
import Swal from 'sweetalert2';
import { GuardarMesaComponent } from '../guardar-mesa.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { LegislaturaService } from 'services/legislaturas.service';
import { MenuService } from 'services/menu.service';
import { Router } from '@angular/router';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { DetalleMesaModels } from 'models/detalle-mesa-directiva.models';
import { PartidosPoliticosService } from 'services/partidos-politicos.service';
import { DiputadosService } from 'services/diputados.service';

@Component({
    selector: 'app-guardar-participantes',
    templateUrl: './guardar-participantes.component.html',
    styleUrls: ['./guardar-participantes.component.scss']
})

export class GuardarParticipantesComponent implements OnInit {

    loadingIndicator: boolean;
    reorderable: boolean;

    arrDiputados: any = [];
    mesas: any = [];
    form: FormGroup;
    selectedPresidente: string;
    selectedVicePresidente: string;
    selectedSecretario: string;
    selectedSecretarioAuxiliar: string;
    selectedVocal: string;
    selectedVocalAuxiliar: string;
    resultado: any;
    constructor(
        private formBuilder: FormBuilder,
        private spinner: NgxSpinnerService,

        private dialogRef: MatDialogRef<GuardarMesaComponent>,
        private diputadosService: DiputadosService,
        @Inject(MAT_DIALOG_DATA) public participantes: any
    ) { }

    ngOnInit(): void {

        console.log(this.participantes);
        if (this.participantes.detalle_participantes_mesa_directivas) {
            this.resultado = this.participantes.detalle_participantes_mesa_directivas[0];
            if (this.resultado.presidentes) {
                this.selectedPresidente = this.resultado.presidentes[0];
            }
            if (this.resultado.vicepresidentes) {
                this.selectedVicePresidente = this.resultado.vicepresidentes[0];
            }
            if (this.resultado.secretario_auxiliar) {
                this.selectedSecretario = this.resultado.secretario[0];
            }
            if (this.resultado.secretario_auxiliar) {
                this.selectedSecretarioAuxiliar = this.resultado.secretario_auxiliar[0];
            }

            if (this.resultado.vocals) {
                this.selectedVocal = this.resultado.vocals[0];
            }
            if (this.resultado.vocal_auxiliars) {
                this.selectedVocalAuxiliar = this.resultado.vocal_auxiliars[0];
            }

        }else{
            this.participantes.presidente = '';
            this.participantes.vicepresidente = '';
            this.participantes.secretario = '';
            this.participantes.secretarioAuxiliar = '';
            this.participantes.vocal = '';
            this.participantes.vocalAuxiliar = '';
        }
        this.obtenerDiputados();


        // Form reactivo      
        this.form = this.formBuilder.group({
            presidente: [this.participantes.presidente, [Validators.required]],
            vicePresidente: [this.participantes.vicepresidente, [Validators.required]],
            secretario: [this.participantes.secretario, [Validators.required]],
            secretarioAuxiliar: [this.participantes.secretarioAuxiliar, [Validators.required]],
            vocal: [this.participantes.vocal, [Validators.required]],
            vocalAuxiliar: [this.participantes.vocalAuxiliar, [Validators.required]],
        });

    }

    cerrar(ent): void {
        if (ent) {
            this.dialogRef.close(ent);
        } else {
            this.dialogRef.close();
        }
    }

    async obtenerDiputados(): Promise<void> {
        this.spinner.show();

        this.loadingIndicator = true;
        // Obtenemos los documentos
        await this.diputadosService.obtenerDiputados().subscribe((resp: any) => {

            this.arrDiputados = resp;
            console.log(this.arrDiputados);
            this.spinner.hide();
        }, err => {
            this.loadingIndicator = false;
            this.spinner.hide();
        });
    }

    guardar(): void {
        let repetido: boolean;
        repetido = false;
        this.mesas = [];
        if (this.selectedPresidente)
            this.mesas.push({
                cargo: 'Presidente',
                idParticipante: this.selectedPresidente,
                participante: this.arrDiputados.find(meta => meta.id == this.selectedPresidente).nombre,
                partido: this.arrDiputados.find(meta => meta.id == this.selectedPresidente).partidos_politico.cNomenclatura
            });

        this.mesas.push({
            cargo: 'Vice presidente',
            idParticipante: this.selectedVicePresidente,
            participante: this.arrDiputados.find(meta => meta.id == this.selectedVicePresidente).nombre,
            partido: this.arrDiputados.find(meta => meta.id == this.selectedVicePresidente).partidos_politico.cNomenclatura
        });

        this.mesas.push({
            cargo: 'Secretario',
            idParticipante: this.selectedSecretario,
            participante: this.arrDiputados.find(meta => meta.id == this.selectedSecretario).nombre,
            partido: this.arrDiputados.find(meta => meta.id == this.selectedSecretario).partidos_politico.cNomenclatura

        });

        this.mesas.push({
            cargo: 'Secretario Auxiliar',
            idParticipante: this.selectedSecretarioAuxiliar,
            participante: this.arrDiputados.find(meta => meta.id == this.selectedSecretarioAuxiliar).nombre,
            partido: this.arrDiputados.find(meta => meta.id == this.selectedSecretarioAuxiliar).partidos_politico.cNomenclatura

        });

        this.mesas.push({
            cargo: 'Vocal',
            idParticipante: this.selectedVocal,
            participante: this.arrDiputados.find(meta => meta.id == this.selectedVocal).nombre,
            partido: this.arrDiputados.find(meta => meta.id == this.selectedVocal).partidos_politico.cNomenclatura

        });

        this.mesas.push({
            cargo: 'Vocal Auxiliar',
            idParticipante: this.selectedVocalAuxiliar,
            participante: this.arrDiputados.find(meta => meta.id == this.selectedVocalAuxiliar).nombre,
            partido: this.arrDiputados.find(meta => meta.id == this.selectedVocalAuxiliar).partidos_politico.cNomenclatura

        });


        for (let i = 0; i < this.mesas.length; i++) {
            if (this.mesas[i + 1]) {
                if (this.mesas[i + 1].idParticipante === this.mesas[i].idParticipante) {
                    repetido = true;
                    Swal.fire('Error', 'Existen participantes repetidos, esto no es correcto, favor de modificarlos.', 'error');
                }
            }
        }
        if (repetido === false) {
            this.cerrar(this.mesas);
        }
    }

}
