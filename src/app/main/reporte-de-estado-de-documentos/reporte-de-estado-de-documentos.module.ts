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
import { ReporteDeEstadoDeDocumentosComponent } from './reporte-de-estado-de-documentos.component';
import { MatSortModule } from '@angular/material/sort';
const routes = [
    {
        path     : 'reporte-de-estado-de-documentos',
        component: ReporteDeEstadoDeDocumentosComponent,
        canActivate: [SeguridadGuard],
    }
];

@NgModule({
    declarations: [
        ReporteDeEstadoDeDocumentosComponent
    ],
    imports     : [
        RouterModule.forChild(routes),
        TranslateModule,
        FuseSharedModule,
        NgxDatatableModule,
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
        MatTableModule

        
    ],
    providers: [
        {
          provide: MatDialogRef,
          useValue: {}
        }
    ],
    exports     : [
        ReporteDeEstadoDeDocumentosComponent
    ]
})

export class ReporteDeEstadoDeDocumentosModule
{
}
