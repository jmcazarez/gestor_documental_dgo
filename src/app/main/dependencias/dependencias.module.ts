import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DependenciasComponent } from './dependencias.component';
import { TranslateModule } from '@ngx-translate/core';
import { SeguridadGuard } from 'guards/seguridad.guard';
import { FuseSharedModule } from '@fuse/shared.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import {MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

const routes = [
    {
        path     : 'dependencias',
        component: DependenciasComponent,
        canActivate: [SeguridadGuard],
        
    }
];


@NgModule({
    declarations: [
        DependenciasComponent
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
    ],
    providers: [
        {
          provide: MatDialogRef,
          useValue: {}
        }
    ],
    exports     : [
        DependenciasComponent
    ]
})

export class DependenciasModule
{
}
