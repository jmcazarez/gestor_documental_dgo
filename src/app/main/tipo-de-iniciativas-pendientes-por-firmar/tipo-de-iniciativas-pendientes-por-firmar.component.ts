import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TipoExpedientesModel } from 'models/tipo-expedientes.models';
import { MenuService } from 'services/menu.service';
import { TipoExpedientesService } from 'services/tipo-expedientes.service';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
import { AutorizarService } from 'services/autorizar.service';
import { UsuarioLoginService } from 'services/usuario-login.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { element } from 'protractor';
@Component({
    selector: 'app-tipo-de-iniciativas-pendientes-por-firmar',
    templateUrl: './tipo-de-iniciativas-pendientes-por-firmar.component.html',
    styleUrls: ['./tipo-de-iniciativas-pendientes-por-firmar.component.scss']
})
export class IniciativasPendientesPorFirmarComponent implements OnInit {
    loadingIndicator: boolean;
    reorderable: boolean;
    cargando: boolean;
    documentosPendientes = [];
    documentosPendientesTemp = [];
    public formGroup: FormGroup;
    form: FormGroup;
    optAgregar: boolean;
    optConsultar: boolean;
    optEditar: boolean;
    optEliminar: boolean;
    searchText: string;
    usuario: any;
    certificadoB64: any;
    llaveB64: any;
    constructor(
        private spinner: NgxSpinnerService,
        private formBuilder: FormBuilder,
        public dialog: MatDialog,
        private usuarioLoginService: UsuarioLoginService,
        private menuService: MenuService,
        private autorizarService: AutorizarService,
        private tipoExpedientesService: TipoExpedientesService
    ) { }

    async ngOnInit(): Promise<void> {
        this.form = this.formBuilder.group({
            cSubirCertificado: new FormControl('', [Validators.required]),
            cSubirLlave: new FormControl('', [Validators.required]),
            cPassword: new FormControl('', [Validators.required]),

        });
        this.usuario = await this.usuarioLoginService.obtenerUsuario();
        this.documentosPendientes = await this.obtenerAutorizacionPorLegislatura();
        this.documentosPendientesTemp = this.documentosPendientes



    }


    async obtenerAutorizacionPorLegislatura(): Promise<[]> {

        return new Promise((resolve) => {
            {
                this.autorizarService.obtenerAutorizacionesPorEmpleado(this.usuario[0].data.empleado.id).subscribe(
                    (resp: any) => {

                        resolve(resp.filter(
                            (d) => d["estatusAutorizacion"] <= 2
                        ));
                    },
                    (err) => {
                        Swal.fire(
                            "Error",
                            "Ocurrió un error al obtener las autorizaciones por legislatura." +
                            err,
                            "error"
                        );
                        resolve(err);
                    }
                );
            }
        });
    }



    filterDatatable(value): void {
        this.documentosPendientes = this.documentosPendientesTemp;
        // Filtramos tabla
        if (value.target.value === '') {
            this.documentosPendientes = this.documentosPendientesTemp;
        } else {
            const val = value.target.value.toLowerCase();
            const temp = this.documentosPendientes.filter((d) => d.cNombreDocumento.toLowerCase().indexOf(val) !== -1 || !val);
            this.documentosPendientes = temp;
        }


    }

    firmarDocumentos(): void {
        let documentos: any[] = [];

        if (this.documentosPendientes.filter(element => element.Agregar).length === 0) {
            Swal.fire(
                "Error",
                "Es necesario seleccionar al menos un documento.",
                "error"
            );
        } else {
            documentos = this.documentosPendientes.filter(element => element.Agregar);
       
            documentos.forEach(element => {
                console.log(element);
              /*  this.autorizarService.autorizarDocumentoPaso2( Number(element.idProcesoApi), this.llaveB64).subscribe(
                    async (resp: any) => {
                        console.log(resp);
                        this.spinner.hide()
                    },
                    (err) => {
                        this.spinner.hide()
                        Swal.fire(
                            "Error",
                            "Ocurrió un error al firmar el documento. Paso 2. " + err,
                            "error"
                        );
                    }
                );
                */
            });
        }
    }



    async cambioCertificado(event): Promise<void> {
        const file = event.target.files[0];
        this.certificadoB64 = await this.convertirFileBase64(file);
    }
    async cambioLlave(event): Promise<void> {
        const file = event.target.files[0];
        this.llaveB64 = await this.convertirFileBase64(file);

    }

    convertirFileBase64(file: any): Promise<string> {
        return new Promise(async (resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = () => {

                resolve(reader.result.toString().replace('data:application/x-x509-ca-cert;base64,', '').replace('data:application/octet-stream;base64,', ''));

            };
        })
    }
}
