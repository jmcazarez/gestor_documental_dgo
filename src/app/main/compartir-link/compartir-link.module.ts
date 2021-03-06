import { NgModule } from '@angular/core';
import { RouterModule, Routes, Params } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FuseSharedModule } from '@fuse/shared.module';
import { CompartirLinkComponent } from './compartir-link.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatChipsModule } from '@angular/material/chips';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ClipboardModule } from 'ngx-clipboard';
import { SeguridadGuard } from 'guards/seguridad.guard';

const routes: Routes = [
    {
        path: 'compartir-link/:id',
        component: CompartirLinkComponent,
    }
];

@NgModule({
    declarations: [
        CompartirLinkComponent
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
        MatDatepickerModule,
        PdfViewerModule,
        MatGridListModule,
        MatListModule,
        MatSidenavModule,
        MatChipsModule,
        NgxSpinnerModule,
        ClipboardModule
    ]
})
export class CompartirLinkModule {
}
