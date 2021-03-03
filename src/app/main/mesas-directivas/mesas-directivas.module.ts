import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FuseSharedModule } from '@fuse/shared.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SeguridadGuard } from 'guards/seguridad.guard';
import { MesasDirectivasComponent } from './mesas-directivas.component';
import {MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatDividerModule} from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { NgxSpinnerModule } from 'ngx-spinner';

const routes = [
    {
        path     : 'mesas-directivas',
        component: MesasDirectivasComponent,
        canActivate: [SeguridadGuard],
        
    }
];

@NgModule({
    declarations: [
        MesasDirectivasComponent,
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
        MesasDirectivasComponent
    ]
})

export class MesasDirectivasModule
{
}
