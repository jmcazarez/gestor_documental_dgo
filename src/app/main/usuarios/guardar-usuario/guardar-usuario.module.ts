import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';

import { FuseSharedModule } from '@fuse/shared.module';
import { GuardarUsuarioComponent } from './guardar-usuario.component';
import { MatDialogModule } from '@angular/material/dialog';



const routes: Routes = [
    {
        path     : 'guardarusuario',
        component: GuardarUsuarioComponent
    }
];

@NgModule({
    declarations: [
        GuardarUsuarioComponent
    ],
    imports     : [
        RouterModule.forChild(routes),

        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatSelectModule,
        MatStepperModule,

        FuseSharedModule,
        MatDialogModule
    ]
})
export class GuardarUsuarioModule
{
}
