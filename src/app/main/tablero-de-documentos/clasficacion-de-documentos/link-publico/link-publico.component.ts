import { Component, Inject, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TableroDeDocumentosComponent } from '../../tablero-de-documentos.component';
import { DocumentosCompartidosService } from 'services/compartir.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
@Component({
  selector: 'app-link-publico',
  templateUrl: './link-publico.component.html',
  styleUrls: ['./link-publico.component.scss'],
  providers: [DatePipe]
})
export class LinkPublicoComponent implements OnInit {
  publicid: string = '';
  url: string = '10.20.30.7:4300/#/compartir-link/';
  documento: string = '';

  constructor(
    private dialogRef: MatDialogRef<TableroDeDocumentosComponent>,
    private compartidos: DocumentosCompartidosService,
  
    private router: Router,
    private location: Location,
    @Inject(MAT_DIALOG_DATA) public documentos
    ) { 
        this.url = '';

    }

  ngOnInit(): void {
    this.documento = this.documentos.id;
  }

  cerrar() {
    this.dialogRef.close();
  }

  generarLink(){
    this.compartidos.linkGenerate(this.documento).subscribe( (resp: any) => {

       
      //console.log(resp + 'hay respuesta');
      this.url = this.location['_platformLocation']['location']['origin']+'/#/compartir-link/' + resp.id;
     
    }, err => {
      console.log(err);
    });
  }
}
