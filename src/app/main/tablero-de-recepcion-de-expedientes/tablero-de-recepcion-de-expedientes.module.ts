import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FuseSharedModule } from '@fuse/shared.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SeguridadGuard } from 'guards/seguridad.guard';
import { TableroDeRecepcionDeExpedientesComponent } from './tablero-de-recepcion-de-expedientes.component';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
// import { SafePipePipe } from 'pipes/safe-pipe.pipe';
import { MatDividerModule } from '@angular/material/divider'
import { MatInputModule } from '@angular/material/input';
import { MatSortModule } from "@angular/material/sort";
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { NgxSpinnerModule } from 'ngx-spinner';
import { GuardarRecepcionDeExpedienteComponent } from './guardar-recepcion-de-expediente/guardar-recepcion-de-expediente.component';

const routes = [
    {
       
        path     : 'tablero-de-recepción-de-expedientes',
        component: TableroDeRecepcionDeExpedientesComponent,
        canActivate: [SeguridadGuard],
    }
];

@NgModule({
    declarations: [
        TableroDeRecepcionDeExpedientesComponent,
    ],
    imports     : [
        RouterModule.forChild(routes),
        TranslateModule,
        FuseSharedModule,
             NgxDatatableModule.forRoot({
            messages: {
                emptyMessage: 'No hay datos disponibles', // Message to show when array is presented, but contains no values
                totalMessage: 'total', // Footer total message
                selectedMessage: 'selected' // Footer selected message
            }
        }),
        MatIconModule,
        MatCheckboxModule,
        MatDialogModule,
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatDividerModule,
        MatInputModule ,
        MatSortModule,
        MatStepperModule,
        MatTableModule,
        NgxSpinnerModule
    ],
    providers: [
        {
          provide: MatDialogRef,
          useValue: {}
        }
    ],
    exports     : [
        TableroDeRecepcionDeExpedientesComponent
    ]
})

export class TableroDeRecepcionDeExpedientesModule
{
}
