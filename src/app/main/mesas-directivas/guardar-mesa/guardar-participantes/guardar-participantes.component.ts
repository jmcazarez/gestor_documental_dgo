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

    async ngOnInit(): Promise<void> {
        this.spinner.show();

        await this.obtenerDiputados();

        if (this.participantes.detalle_participantes_mesa_directivas) {

            if (this.participantes.detalle_participantes_mesa_directivas.length > 0) {

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

            } else {
                this.participantes.presidente = '';
                this.participantes.vicepresidente = '';
                this.participantes.secretario = '';
                this.participantes.secretarioAuxiliar = '';
                this.participantes.vocal = '';
                this.participantes.vocalAuxiliar = '';
            }
        } else {
            this.participantes.presidente = '';
            this.participantes.vicepresidente = '';
            this.participantes.secretario = '';
            this.participantes.secretarioAuxiliar = '';
            this.participantes.vocal = '';
            this.participantes.vocalAuxiliar = '';
        }



        // Form reactivo      
        this.form = this.formBuilder.group({
            presidente: [this.participantes.presidente, [Validators.required]],
            vicePresidente: [this.participantes.vicepresidente, [Validators.required]],
            secretario: [this.participantes.secretario, [Validators.required]],
            secretarioAuxiliar: [this.participantes.secretarioAuxiliar, [Validators.required]],
            vocal: [this.participantes.vocal, [Validators.required]],
            vocalAuxiliar: [this.participantes.vocalAuxiliar, [Validators.required]],
        });
        this.spinner.hide();
    }

    cerrar(ent): void {
        if (ent) {
            this.dialogRef.close(ent);
        } else {
            this.dialogRef.close();
        }
    }

    async obtenerDiputados(): Promise<void> {
        // Obtenemos empleados
        this.spinner.show();
        await this.diputadosService.obtenerDiputados().subscribe((resp: any) => {
            for (const diputados of resp) {
                if (diputados.legislatura) {

                    this.arrDiputados.push(diputados);
                } else {

                }
            }
            if (this.arrDiputados.length == 0) {
                Swal.fire('Error', 'No se encontraron diputados en la legislatura seleccionada.', 'error');
            }

            //this.arrDiputados = resp;
            this.arrDiputados = this.arrDiputados.filter(meta => meta.legislatura.id === this.participantes.legislatura);

            this.spinner.hide();
        }, err => {
            Swal.fire('Error', 'Ocurrió un error obtener los diputados.' + err, 'error');
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

        /*for (let i = 0; i < this.mesas.length; i++) {
            if (this.mesas[i + 1]) {
                if (this.mesas[i + 1].idParticipante === this.mesas[i].idParticipante) {
                    repetido = true;
                    Swal.fire('Error', 'Ocurrió un error al guardar. No debe haber duplicidad en los participantes.', 'error');
                }
            }
        }*/

        let idDiputados = [];
        let idCompare = '';

        for (let i = 0; i < this.mesas.length; i++) {
            if (this.mesas[i].idParticipante.hasOwnProperty('id')) {
                idDiputados.push({ "id": this.mesas[i].idParticipante.id });
            } else {
                idDiputados.push({ "id": this.mesas[i].idParticipante });
            }
        }

        idDiputados.forEach(element => {
            if (idCompare === '') {
                idCompare = element.id;
            } else {
                idCompare = idCompare + ',' + element.id;
            }
        });

        let separatedId = idCompare.split(",");
        let normalizedInputArray = separatedId.map(el => el.toLowerCase());
        let idValue = [];
        let idEqual = [];

        //console.log(separatedAutors);

        normalizedInputArray.forEach(value => {
            idValue.push({ "diputado": value, "valor": normalizedInputArray.filter(el => el === value).length });
        });

        idValue.forEach(dip => {
            if (dip.valor > 1) {
                repetido = true;
                Swal.fire('Error', 'Ocurrió un error al guardar. No debe haber duplicidad en los participantes.', 'error');
            }
        });

        console.log(this.mesas);
        console.log(idDiputados);
        console.log(idValue);
        console.log(idEqual);

        if (repetido === false) {
            this.cerrar(this.mesas);
        }
    }
}
