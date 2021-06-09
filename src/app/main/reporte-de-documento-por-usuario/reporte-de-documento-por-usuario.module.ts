import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FuseSharedModule } from '@fuse/shared.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SeguridadGuard } from 'guards/seguridad.guard';
import {MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatDividerModule} from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import {MatTableModule} from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import {MatStepperModule} from '@angular/material/stepper';
import { ReporteDeDocumentoPorUsuarioComponent } from './reporte-de-documento-por-usuario.component';
import { MatSortModule } from '@angular/material/sort';
import { NgxSpinnerModule } from 'ngx-spinner';
const routes = [
    {              
       path     : 'reporte-de-movimiento-de-documentos-por-usuario',
        component: ReporteDeDocumentoPorUsuarioComponent,
        canActivate: [SeguridadGuard],
    }
];

@NgModule({
    declarations: [
        ReporteDeDocumentoPorUsuarioComponent
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
        MatSelectModule,
        MatDatepickerModule,
        MatNativeDateModule ,
        MatStepperModule,
        MatPaginatorModule,
        MatSortModule,
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
        ReporteDeDocumentoPorUsuarioComponent
    ]
})

export class ReporteDeDocumentoPorUsuarioModule
{
}
