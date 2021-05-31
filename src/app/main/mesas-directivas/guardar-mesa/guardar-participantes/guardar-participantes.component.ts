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
        let presidente = [];
        let visePresidente = [];
        let secretario = [];
        let secretarioAuxiliar = [];
        let vocal = [];
        let vocalAuxiliar = [];


        visePresidente = this.arrDiputados.find(meta => meta.id == this.selectedVicePresidente);
        secretario = this.arrDiputados.find(meta => meta.id == this.selectedSecretario);
        secretarioAuxiliar = this.arrDiputados.find(meta => meta.id == this.selectedSecretarioAuxiliar);
        vocal = this.arrDiputados.find(meta => meta.id == this.selectedVocal);
        vocalAuxiliar = this.arrDiputados.find(meta => meta.id == this.selectedVocalAuxiliar);
        // Form reactivo      
        this.form = this.formBuilder.group({
            presidente: [this.participantes.presidente, [Validators.required]],
            vicePresidente: [this.participantes.vicepresidente, [Validators.required]],
            secretario: [this.participantes.secretario, [Validators.required]],
            secretarioAuxiliar: [this.participantes.secretarioAuxiliar, [Validators.required]],
            vocal: [this.participantes.vocal, [Validators.required]],
            vocalAuxiliar: [this.participantes.vocalAuxiliar, [Validators.required]],
        });
        await this.obtenerDiputados();

        if (this.participantes.detalle_participantes_mesa_directivas) {
            this.resultado = this.participantes.detalle_participantes_mesa_directivas[0];
            if (this.resultado.presidentes) {
                presidente = this.arrDiputados.find(meta => meta.id == this.resultado.presidentes[0]);
                if (presidente) {
                    this.selectedPresidente = presidente['id'];
                } else {
                    this.selectedPresidente = '';
                }

            }
            if (this.resultado.vicepresidentes) {

                visePresidente = this.arrDiputados.find(meta => meta.id == this.resultado.vicepresidentes[0]);
                if (visePresidente) {
                    this.selectedVicePresidente = visePresidente['id'];
                } else {
                    this.selectedVicePresidente = '';
                }
            }
            if (this.resultado.secretario) {
                console.log(this.resultado.secretario[0]);
                console.log(secretario);
                secretario = this.arrDiputados.find(meta => meta.id == this.resultado.secretario[0]);
                if (secretario) {
                    this.selectedSecretario = secretario['id'];
                } else {
                    this.selectedSecretario = '';
                }
            }
            if (this.resultado.secretario_auxiliar) {
                console.log(this.resultado.secretario_auxiliar[0]);
                secretarioAuxiliar = this.arrDiputados.find(meta => meta.id == this.resultado.secretario_auxiliar[0]);
                console.log(secretarioAuxiliar);
                if (secretarioAuxiliar) {
                    this.selectedSecretarioAuxiliar = secretarioAuxiliar['id'];
                } else {
                    this.selectedSecretarioAuxiliar = '';
                }
            }

            if (this.resultado.vocals) {

                vocal = this.arrDiputados.find(meta => meta.id == this.resultado.vocals[0]);
                if (vocal) {
                    this.selectedVocal = vocal['id'];
                } else {
                    this.selectedVocal = '';
                }
            }
            if (this.resultado.vocal_auxiliars) {
                vocalAuxiliar = this.arrDiputados.find(meta => meta.id == this.resultado.vocal_auxiliars[0]);
                if (vocalAuxiliar) {
                    this.selectedVocalAuxiliar = vocal['id'];
                } else {
                    this.selectedVocalAuxiliar = '';
                }
            }

        } else {
            this.participantes.presidente = '';
            this.participantes.vicepresidente = '';
            this.participantes.secretario = '';
            this.participantes.secretarioAuxiliar = '';
            this.participantes.vocal = '';
            this.participantes.vocalAuxiliar = '';
        }




    }

    cerrar(ent): void {
        if (ent) {
            this.dialogRef.close(ent);
        } else {
            this.dialogRef.close();
        }
    }

    async obtenerDiputados(): Promise<void> {
        return new Promise(async (resolve) => {
            {
                this.spinner.show();

                this.loadingIndicator = true;
                // Obtenemos los documentos
                await this.diputadosService.obtenerDiputados().subscribe((resp: any) => {
                    if (this.participantes.legislatura.id) {
                        this.arrDiputados = resp.filter(
                            (d) =>
                                d.legislatura.id === this.participantes.legislatura.id
                        );
                    } else {
                        this.arrDiputados = resp.filter(
                            (d) =>
                                d.legislatura.id === this.participantes.legislatura
                        );
                    }

                    resolve(resp);
                    this.spinner.hide();
                }, err => {
                    this.loadingIndicator = false;
                    resolve(err);
                    this.spinner.hide();
                });
            }
        });
    }

    guardar(): void {
        let repetido: boolean;
        repetido = false;
        this.mesas = [];
        let presidente = [];
        let visePresidente = [];
        let secretario = [];
        let secretarioAuxiliar = [];
        let vocal = [];
        let vocalAuxiliar = [];

        presidente = this.arrDiputados.find(meta => meta.id == this.selectedPresidente);
        visePresidente = this.arrDiputados.find(meta => meta.id == this.selectedVicePresidente);
        secretario = this.arrDiputados.find(meta => meta.id == this.selectedSecretario);
        secretarioAuxiliar = this.arrDiputados.find(meta => meta.id == this.selectedSecretarioAuxiliar);
        vocal = this.arrDiputados.find(meta => meta.id == this.selectedVocal);
        vocalAuxiliar = this.arrDiputados.find(meta => meta.id == this.selectedVocalAuxiliar);
        console.log(vocalAuxiliar);
        if (this.selectedPresidente && presidente) {
            this.mesas.push({
                cargo: 'Presidente',
                idParticipante: this.selectedPresidente,
                participante: presidente['nombre'],
                partido: this.arrDiputados.find(meta => meta.id == this.selectedPresidente).partidos_politico.cNomenclatura
            });
        }
        if (this.selectedVicePresidente && visePresidente) {
            this.mesas.push({
                cargo: 'Vice presidente',
                idParticipante: this.selectedVicePresidente,
                participante: visePresidente['nombre'],
                partido: this.arrDiputados.find(meta => meta.id == this.selectedVicePresidente).partidos_politico.cNomenclatura
            });
        }
        if (this.selectedVicePresidente && secretario) {
            this.mesas.push({
                cargo: 'Secretario',
                idParticipante: this.selectedSecretario,
                participante: secretario['nombre'],
                partido: this.arrDiputados.find(meta => meta.id == this.selectedSecretario).partidos_politico.cNomenclatura

            });
        }
        if (this.selectedSecretarioAuxiliar && secretarioAuxiliar) {
            this.mesas.push({
                cargo: 'Secretario Auxiliar',
                idParticipante: this.selectedSecretarioAuxiliar,
                participante: secretarioAuxiliar['nombre'],
                partido: this.arrDiputados.find(meta => meta.id == this.selectedSecretarioAuxiliar).partidos_politico.cNomenclatura

            });
        }
        if (this.selectedVocal && vocal) {
            this.mesas.push({
                cargo: 'Vocal',
                idParticipante: this.selectedVocal,
                participante: vocal['nombre'],
                partido: this.arrDiputados.find(meta => meta.id == this.selectedVocal).partidos_politico.cNomenclatura

            });
        }
        if (this.selectedVocalAuxiliar && vocalAuxiliar) {
            this.mesas.push({
                cargo: 'Vocal Auxiliar',
                idParticipante: this.selectedVocalAuxiliar,
                participante: vocalAuxiliar['nombre'],
                partido: this.arrDiputados.find(meta => meta.id == this.selectedVocalAuxiliar).partidos_politico.cNomenclatura

            });

        }
        for (let i = 0; i < this.mesas.length; i++) {
            if (this.mesas[i + 1]) {
                if (this.mesas[i + 1].idParticipante === this.mesas[i].idParticipante) {
                    repetido = true;
                    Swal.fire('Error', 'Ocurrió un error al guardar. No debe de haber duplicidad en los participantes..', 'error');
                }
            }
        }
        if (repetido === false) {
            this.cerrar(this.mesas);
        }
    }

}
