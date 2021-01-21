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
import { GuardarTipoDeDocumentosComponent } from './guardar-tipo-de-documentos.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

const routes: Routes = [
    {
        path     : 'guardar-tipo-de-documentos',
        component: GuardarTipoDeDocumentosComponent
    }
];

@NgModule({
    declarations: [
        GuardarTipoDeDocumentosComponent
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
        MatDialogModule,
        MatCheckboxModule,
        NgxDatatableModule,
        MatTabsModule,
        MatSlideToggleModule
    ]
})
export class GuardarTipoDeDocumentosModule
{
}
