import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { FuseSharedModule } from '@fuse/shared.module';

import { HomeComponent } from './home.component';
import { SeguridadGuard } from 'guards/seguridad.guard';

const routes = [
    {
        path     : 'home',
        component: HomeComponent,
        canActivate: [SeguridadGuard]
    }
];

@NgModule({
    declarations: [
        HomeComponent
    ],
    imports     : [
        RouterModule.forChild(routes),

        TranslateModule,
        FuseSharedModule,
    ],
    exports     : [
        HomeComponent
    ]
})

export class HomeModule
{
}
