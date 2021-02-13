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
import { IniciativaTurnadaAComisionComponent } from './iniciativa-turnada-a-comision.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { AmazingTimePickerModule } from 'amazing-time-picker';

const routes: Routes = [
    {
        path: 'iniciativa-turnada-a-comisión',
        component: IniciativaTurnadaAComisionComponent
    }
];

@NgModule({
    declarations: [
        IniciativaTurnadaAComisionComponent
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
        MatChipsModule,
        AmazingTimePickerModule
    ]
})
export class IniciativaTurnadaAComisionModule {
}
