import { Component, Inject, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TableroDeDocumentosComponent } from '../../tablero-de-documentos.component';
import { DocumentosCompartidosService } from 'services/compartir.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public documentos
    ) { }

  ngOnInit(): void {
    console.log(this.documentos.documento.related[0]);
    this.documento = this.documentos.documento.related[0];
  }

  cerrar() {
    this.dialogRef.close();
  }

  generarLink(){
    console.log('boton');
    console.log(this.documento);
    this.compartidos.linkGenerate(this.documento).subscribe( (resp: any) => {
      //console.log(resp + 'hay respuesta');
      this.url = '10.20.30.7:4300/#/compartir-link/' + resp.id;
      console.log(this.url);
    }, err => {
      console.log(err);
    });
  }
}
