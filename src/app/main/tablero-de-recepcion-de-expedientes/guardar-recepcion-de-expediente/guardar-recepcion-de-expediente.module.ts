import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FuseSharedModule } from '@fuse/shared.module';
import { GuardarRecepcionDeExpedienteComponent } from './guardar-recepcion-de-expediente.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MatChipsModule } from '@angular/material/chips';
const routes: Routes = [
    {
        path: 'guardar-recepción-de-expediente',
        component: GuardarRecepcionDeExpedienteComponent
    }
];

@NgModule({
    declarations: [
        GuardarRecepcionDeExpedienteComponent
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
        NgxDatatableModule,
        MatTabsModule,
        MatSlideToggleModule,
        MatDatepickerModule,
        NgxSpinnerModule,
        MatChipsModule
        
    ]
})
export class GuardarRecepcionDeExpedienteModule {
}
