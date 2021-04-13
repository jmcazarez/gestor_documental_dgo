import { Component, Inject, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';
import { UsuarioLoginService } from 'services/usuario-login.service';
//import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { DocumentosCompartidosService } from 'services/compartir.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
    selector: 'app-compartir-link',
    templateUrl: './compartir-link.component.html',
    styleUrls: ['./compartir-link.component.scss'],
    providers: [DatePipe]
})


export class CompartirLinkComponent implements OnInit {
    pdfSrc: any;
    documento: any;
    bDescargado: boolean = true;
    constructor(private router: Router, private rutaActiva: ActivatedRoute, 
        private spinner: NgxSpinnerService, 
        private fuseNavigationService: FuseNavigationService, 
        private _usuarioLoginService: UsuarioLoginService,
        //private _fuseSidebarService: FuseSidebarService, 
        private documentosCompartidos: DocumentosCompartidosService) { 
        this._usuarioLoginService.eliminarUsuario();
        this.limpiarMenu();
       // this._fuseSidebarService.getSidebar('navbar').toggleFold();
    }

    ngOnInit() {
        this.rutaActiva.paramMap.subscribe(params => {
            //Validamos que la URL reciba el ID del documento.
            if(params.has("id")){
                this.documentoCompartido();
            } 
            else{
            //De no ser el caso retornamos al usuario al login.
                this.router.navigate(['login']);
            }
        })
    }

    limpiarMenu(): void {
        const menuActual = this.fuseNavigationService.getCurrentNavigation();

        for (const itemMenu of menuActual) {
            this.fuseNavigationService.removeNavigationItem(itemMenu.id);
        }
    }

    documentoCompartido(): void {
        this.spinner.show();
        // Descargamos el documento
        if (this.rutaActiva.snapshot.params.id) {
			// '5fda61cdbbd71324a031035a'
			 // '5fda61cdbbd71324a031035a' id de documento creado
            this.documentosCompartidos.documentoCompartido(this.rutaActiva.snapshot.params.id).subscribe((resp: any) => {
                console.log(resp[0]);
                this.documento = resp[0];
                //console.log(this.documento);
                if(this.documento === void 0){
                    alert('Este documento ya ha sido descargado, solicite su activacion nuevamente.');
                    this.router.navigate(['login']);
                }
                else{
                    const source = 'data:application/octet-stream;base64,' + this.documento.base64;
                    this.pdfSrc = source;
                    this.spinner.hide()
                }
            }, err => {
                this.spinner.hide();
                console.log(err);
               // this.router.navigate(['login']);
            });
            
        } else {
            this.spinner.hide()
            // this.router.navigate(['login']);
        }
    }

    convertFile(buf: any): string {
        this.spinner.show();
        // Convertimos el resultado en binstring
        const binstr = Array.prototype.map.call(buf, (ch: number) => String.fromCharCode(ch)).join('');
        this.spinner.hide()
        return btoa(binstr);
    }

    descargar(): void {
        const downloadLink = document.createElement('a');
        const fileName = this.documento.cNombreDocumento;
        const linkSource = 'data:application/octet-stream;base64,' + this.documento.base64;
        downloadLink.href = linkSource;
        downloadLink.download = fileName;
        downloadLink.click();
    }

    documentoYaDescargado(){
        console.log(this.documento.id);
        //preparamos datos para hacer peticion a node
        const data = {
          "id": this.documento.id,
          "bActivo": false,
          "bDescargado": true
      };
        //nos suscribimos al servicio y enviamos la data
        this.documentosCompartidos.downloadAlready(data).subscribe( (resp: any) => {
          //Enviamos respuesta a variable para mostrarla en el textarea del componente
          if(resp){
            console.log(resp);
            this.descargar();
          }
    
        }, err => {
          console.log(err);
        });
      }
}

