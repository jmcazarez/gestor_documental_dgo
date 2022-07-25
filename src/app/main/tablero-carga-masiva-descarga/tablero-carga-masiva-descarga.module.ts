import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import {MatTabsModule} from '@angular/material/tabs';
import { TableroDeBusquedaComponent } from '../tablero-de-busqueda/tablero-de-busqueda.component';
import { FuseSharedModule } from '@fuse/shared.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SeguridadGuard } from 'guards/seguridad.guard';
import {MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatDividerModule} from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import {MatTableModule} from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import {MatStepperModule} from '@angular/material/stepper';
import {MatMenuModule} from '@angular/material/menu';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MatSortModule } from '@angular/material/sort';
import { TableroCargaMasivaDescargaComponent } from './tablero-carga-masiva-descarga.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';

const routes = [
  {
      path     : 'tablero-de-carga-masiva-y-descarga',
      component: TableroCargaMasivaDescargaComponent,
      canActivate: [SeguridadGuard],
  }
];

@NgModule({
  declarations: [
      TableroCargaMasivaDescargaComponent
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
      MatInputModule ,
      MatSelectModule,
      MatDatepickerModule,
      MatNativeDateModule ,
      MatStepperModule,
      MatPaginatorModule,
      MatSortModule,
      MatTableModule,
      MatTabsModule,
      MatMenuModule,
      NgxSpinnerModule,
      MatProgressBarModule
  ],
  providers: [
      {
        provide: MatDialogRef,
        useValue: {}
      }
  ],
  exports     : [
      TableroCargaMasivaDescargaComponent
  ]
})
export class TableroCargaMasivaDescargaModule { }
