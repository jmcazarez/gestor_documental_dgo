import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { MatRadioModule } from '@angular/material/radio';
import { FuseSharedModule } from '@fuse/shared.module';
import { GuardarPerfilUsuariosComponent } from './guardar-perfil-usuarios.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { GuardarPermisosUsuariosComponent } from './guardar-permisos-usuarios/guardar-permisos-usuarios.component';
import { NgxSpinnerModule } from 'ngx-spinner';
const routes: Routes = [
    {
        path     : 'guardarperfilusuario',
        component: GuardarPerfilUsuariosComponent
    }
];

@NgModule({
    declarations: [
        GuardarPerfilUsuariosComponent
    ],
    imports     : [
        RouterModule.forChild(routes),
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatSelectModule,
        MatStepperModule,
        MatRadioModule,
        FuseSharedModule,
        MatDialogModule,
        BrowserAnimationsModule,
        MatTabsModule,
                   NgxDatatableModule.forRoot({
            messages: {
                emptyMessage: 'No hay datos disponibles', // Message to show when array is presented, but contains no values
                totalMessage: 'total', // Footer total message
                selectedMessage: 'selected' // Footer selected message
            }
                }),
        MatCheckboxModule,
        NgxSpinnerModule
    ]
})
export class GuardarPerfilUsuarioModule
{
}
