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

import { SeguridadGuard } from 'guards/seguridad.guard';
import { GuardarDireccionesComponent } from './guardar-direcciones.component';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ModaldireccionesComponent } from './modaldirecciones/modaldirecciones.component';
import { NgxSpinnerModule} from 'ngx-spinner';

const routes = [
    {
        path     : 'guardar-direcciones',
        component: GuardarDireccionesComponent,
        canActivate: [SeguridadGuard],
        
    }
];

@NgModule({
    declarations: [
        GuardarDireccionesComponent,
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
        GuardarDireccionesComponent
    ]
})

export class GuardarDireccionesModule
{
}
