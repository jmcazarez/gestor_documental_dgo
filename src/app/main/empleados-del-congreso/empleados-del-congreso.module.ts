import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FuseSharedModule } from '@fuse/shared.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { NgxSpinnerModule } from 'ngx-spinner';
import { SeguridadGuard } from 'guards/seguridad.guard';
import { EmpleadosDelCongresoComponent } from './empleados-del-congreso.component';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

const routes = [
    {
        path     : 'empleados-del-congreso',
        component: EmpleadosDelCongresoComponent,
        canActivate: [SeguridadGuard],
    }
];

@NgModule({
    declarations: [
        EmpleadosDelCongresoComponent,
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
        MatInputModule,
        NgxSpinnerModule
    ],
    providers: [
        {
          provide: MatDialogRef,
          useValue: {}
        }
    ],
    exports     : [
        EmpleadosDelCongresoComponent
    ]
})

export class EmpleadosDelCongresoModule
{
}
