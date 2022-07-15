import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import {NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FuseSharedModule } from '@fuse/shared.module';
import { GuardarUsuarioFinanzasComponent } from './guardar-usuario-finanzas.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
/* import { SafePipePipe } from 'pipes/safe-pipe.pipe'; */
import { RxReactiveFormsModule } from '@rxweb/reactive-form-validators'; // <-- #2 import module
import { NgxSpinnerModule } from 'ngx-spinner';

const routes: Routes = [
    {
        path: 'guardarusuario',
        component: GuardarUsuarioFinanzasComponent
    }
];

@NgModule({
    declarations: [
        GuardarUsuarioFinanzasComponent,
    /*     SafePipePipe */
    ],
    imports: [
        RouterModule.forChild(routes),
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatSelectModule,
        MatStepperModule,
        FuseSharedModule,
        MatDialogModule,
        MatCheckboxModule,
                   NgxDatatableModule.forRoot({
            messages: {
                emptyMessage: 'No hay datos disponibles', // Message to show when array is presented, but contains no values
                totalMessage: 'total', // Footer total message
                selectedMessage: 'selected' // Footer selected message
            }
                }),
        MatTabsModule,
        MatSlideToggleModule,
        NgxSpinnerModule,
        RxReactiveFormsModule
    ]
})
export class GuardarUsuarioFinanzasModule {
}
