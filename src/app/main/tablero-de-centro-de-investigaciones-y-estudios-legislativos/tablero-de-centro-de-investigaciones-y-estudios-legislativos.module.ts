import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FuseSharedModule } from '@fuse/shared.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SeguridadGuard } from 'guards/seguridad.guard';
import { TableroDeCentroDeInvestigacionesYEstudiosLegislativosComponent } from './tablero-de-centro-de-investigaciones-y-estudios-legislativos.component';
import {MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
// import { SafePipePipe } from 'pipes/safe-pipe.pipe';
import { MatDividerModule } from '@angular/material/divider'
import { MatInputModule } from '@angular/material/input';
import { MatSortModule } from "@angular/material/sort";
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { NgxSpinnerModule } from 'ngx-spinner';

const routes = [
    {
       
        path     : 'tablero-de-centro-de-investigaciones-y-estudios-legislativos',
        component: TableroDeCentroDeInvestigacionesYEstudiosLegislativosComponent,
        canActivate: [SeguridadGuard],
    }
];

@NgModule({
    declarations: [
        TableroDeCentroDeInvestigacionesYEstudiosLegislativosComponent,
        // SafePipePipe
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
        TableroDeCentroDeInvestigacionesYEstudiosLegislativosComponent
    ]
})

export class TableroDeCentroDeInvestigacionesYEstudiosLegislativosModule
{
}
