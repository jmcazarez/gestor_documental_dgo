import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { FuseSharedModule } from '@fuse/shared.module';

import { UsuariosComponent } from './usuarios.component';

import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SeguridadGuard } from 'guards/seguridad.guard';
import { GuardarUsuarioComponent } from './guardar-usuario/guardar-usuario.component';
import {MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

const routes = [
    {
        path     : 'usuarios',
        component: UsuariosComponent,
        canActivate: [SeguridadGuard]
    }
];

@NgModule({
    declarations: [
        UsuariosComponent
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
        MatButtonModule
    ],
    providers: [
        {
          provide: MatDialogRef,
          useValue: {}
        },
        GuardarUsuarioComponent
    ],
    exports     : [
        UsuariosComponent
    ]
})

export class UsuariosModule
{
}
