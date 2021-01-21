import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import 'hammerjs';
import { FuseModule } from '@fuse/fuse.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseProgressBarModule, FuseSidebarModule, FuseThemeOptionsModule } from '@fuse/components';
import { fuseConfig } from 'app/fuse-config';
import { AppComponent } from 'app/app.component';
import { LayoutModule } from 'app/layout/layout.module';
import { HomeModule } from 'app/main/home/home.module';
import { UsuariosModule } from 'app/main/usuarios/usuarios.module';
import { LoginModule } from 'app/main/login/login.module';
import { GuardarUsuarioModule } from './main/usuarios/guardar-usuario/guardar-usuario.module';
import { TableroDeDocumentosModule } from './main/tablero-de-documentos/tablero-de-documentos.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { GuardarDocumentosModule } from './main/tablero-de-documentos/guardar-documentos/guardar-documentos.module';
import { ClasficacionDeDocumentosModule } from './main/tablero-de-documentos/clasficacion-de-documentos/clasificacion-de-documentos.module';
import { EntidadesModule } from './main/entidades/entidades.module';
import { GuardarEntidadesModule } from './main/entidades/guardar-entidades/guardar-entidades.module';
import { EntesModule } from './main/entes/entes.module';
import { GuardarEntesModule } from './main/entes/guardar-entes/guardar-entes.module';
import { TipoDeExpedientesModule } from './main/tipo-de-expedientes/tipo-de-expedientes.module';
import { GuardarTipoDeExpedientesModule } from './main/tipo-de-expedientes/guardar-tipo-de-expedientes/guardar-tipo-de-expedientes.module';
import { TableroDeBusquedaModule } from './main/tablero-de-busqueda/tablero-de-busqueda.module';
import { GuardarTipoDeDocumentosModule } from './main/tipo-de-expedientes/guardar-tipo-de-documentos/guardar-tipo-de-documentos.module';
import { DependenciasModule } from './main/dependencias/dependencias.module';
import { GuardarDependenciaModule } from './main/dependencias/guardar-dependencia/guardar-dependencia.module';
import { ReporteDeEstadoDeDocumentosModule } from './main/reporte-de-estado-de-documentos/reporte-de-estado-de-documentos.module';
import { HistorialDeVersionamientoModule } from './main/tablero-de-documentos/clasficacion-de-documentos/historial-de-versionamiento/historial-de-versionamiento.module';
import { DashboardDeIndicadoresModule } from './main/dashboard-de-indicadores/dashboard-de-indicadores.module';
import { TableroDeCargaMasivaModule } from './main/tablero-de-carga-masiva/tablero-de-carga-masiva.module';
import { ReporteDeDocumentoPorFechaModule } from './main/reporte-de-documento-por-fecha/reporte-de-documento-por-fecha.module';
import { ReporteDeDocumentoPorUsuarioModule } from './main/reporte-de-documento-por-usuario/reporte-de-documento-por-usuario.module';
import { SecretariasModule } from './main/secretarias/secretarias.module';
import { NotificacionesModule } from './main/notificaciones/notificaciones.module';
import { LinkPublicoModule } from './main/tablero-de-documentos/clasficacion-de-documentos/link-publico/link-publico.module';
import { CompartirLinkModule } from './main/compartir-link/compartir-link.module';
import { GuardarSecretariaModule } from './main/secretarias/guardar-secretaria/guardar-secretaria.module';
import { PartidosPoliticosModule } from './main/partidos-politicos/partidos-politicos.module';
import { GuardarPartidosPoliticosModule } from './main/partidos-politicos/guardar-partidos-politicos/guardar-partidos-politicos.module';
import { LegislaturasModule } from './main/legislaturas/legislaturas.module';
import { GuardarLegislaturasModule } from './main/legislaturas/guardar-legislaturas/guardar-legislaturas.module';
import { GuardarDepartamentosModule } from './main/secretarias/guardar-departamentos/guardar-departamentos.module';
import { GuardarDireccionesModule } from './main/secretarias/guardar-direcciones/guardar-direcciones.module';
import { ModalDireccionesModule } from './main/secretarias/guardar-direcciones/modaldirecciones/modaldirecciones.module';
import { DepartamentosModule} from './main/secretarias/guardar-departamentos/departamentos/departamentos.module';
import { DiputadosModule } from './main/diputados/diputados.module';
import { GuardarDiputadosModule } from './main/diputados/guardar-diputados/guardar-diputados.module';
import { ComisionesModule } from './main/comisiones/comisiones.module';
import { GuardarComisionesModule } from './main/comisiones/guardar-comisiones/guardar-comisiones.module';
import { EmpleadosDelCongresoModule } from './main/empleados-del-congreso/empleados-del-congreso.module';
import { GuardarEmpleadoModule } from './main/empleados-del-congreso/guardar-empleado/guardar-empleado.module';
import { MesasDirectivasModule } from './main/mesas-directivas/mesas-directivas.module';
import { GuardarMesaModule } from './main/mesas-directivas/guardar-mesa/guardar-mesa.module';
import { TableroDeIniciativasModule } from './main/tablero-de-Iniciativas/tablero-de-Iniciativas.module';
import { GuardarIniciativasModule } from './main/tablero-de-Iniciativas/guardar-Iniciativas/guardar-Iniciativas.module';
import { ConfiguracionFirmasPorEtapaModule } from './main/configuracion-de-firmas-por-etapa/configuracion-de-firmas-por-etapa.module';
import { GuardarConfiguracionFirmasPorEtapaModule } from './main/configuracion-de-firmas-por-etapa/guardar-configuracion-de-firmas-por-etapa/guardar-configuracion-de-firmas-por-etapa.module';
import { GuardarParticipantesModule } from './main/mesas-directivas/guardar-mesa/guardar-participantes/guardar-participantes.module';
import { GuardarParticipantesComisionModule } from './main/comisiones/guardar-comisiones/guardar-participantes-comision/guardar-participantes-comision.module';
import { TableroDeRecepcionDeActasModule } from './main/tablero-de-recepcion-de-actas/tablero-de-recepcion-de-actas.module';
import { GuardarRecepcionDeActasModule } from './main/tablero-de-recepcion-de-actas/guardar-recepcion-de-actas/guardar-recepcion-de-actas.module';
import { TableroDeRecepcionDeExpedientesModule } from './main/tablero-de-recepcion-de-expedientes/tablero-de-recepcion-de-expedientes.module';
import { GuardarRecepcionDeExpedienteModule } from './main/tablero-de-recepcion-de-expedientes/guardar-recepcion-de-expediente/guardar-recepcion-de-expediente.module';
import { TableroDeLibroDeActasModule } from './main/tablero-de-libro-de-actas/tablero-de-libro-de-actas.module';
import { GuardarlibroDeActasModule } from './main/tablero-de-libro-de-actas/guardar-libro-de-actas/guardar-libro-de-actas.module';
import { TableroDePrestamosDeDocumentosModule } from './main/tablero-de-prestamos-de-documentos/tablero-de-prestamos-de-documentos.module';

const appRoutes: Routes = [
    {
        path      : '**',
        redirectTo: 'home'        
    } 

];



@NgModule({
    declarations: [
        AppComponent
    ],
    imports     : [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        RouterModule.forRoot(appRoutes, {useHash: true}),

        TranslateModule.forRoot(),

        // Material moment date module
        MatMomentDateModule,

        // Material
        MatButtonModule,
        MatIconModule,
        MatFormFieldModule,
        // Fuse modules
        FuseModule.forRoot(fuseConfig),
        FuseProgressBarModule,
        FuseSharedModule,
        FuseSidebarModule,
        FuseThemeOptionsModule,

        // App modules
        LayoutModule,
        HomeModule,
        UsuariosModule,
        LoginModule,
        GuardarUsuarioModule,
        TableroDeDocumentosModule,
        GuardarDocumentosModule,
        ClasficacionDeDocumentosModule,
        LinkPublicoModule,
        EntidadesModule,
        GuardarEntidadesModule,
        EntesModule,
        GuardarEntesModule,
        TipoDeExpedientesModule,
        GuardarTipoDeExpedientesModule,
        TableroDeBusquedaModule,
        GuardarTipoDeDocumentosModule,
        DependenciasModule,
        GuardarDependenciaModule,
        ReporteDeEstadoDeDocumentosModule,
        GuardarDependenciaModule,
        HistorialDeVersionamientoModule,
        DashboardDeIndicadoresModule,
        TableroDeCargaMasivaModule,
        ReporteDeDocumentoPorFechaModule,
        ReporteDeDocumentoPorUsuarioModule,
        SecretariasModule,
        GuardarSecretariaModule,
        NotificacionesModule,
        CompartirLinkModule,
        PartidosPoliticosModule,
        GuardarPartidosPoliticosModule,
        LegislaturasModule,
        GuardarLegislaturasModule,
        GuardarDireccionesModule,
        GuardarDepartamentosModule,
        ModalDireccionesModule,
        DepartamentosModule,
        DiputadosModule,
        GuardarDiputadosModule,
        ComisionesModule,
        GuardarComisionesModule,
        GuardarDiputadosModule,
        EmpleadosDelCongresoModule,
		MesasDirectivasModule,
        GuardarMesaModule,
        TableroDeIniciativasModule,
        GuardarIniciativasModule,
        ConfiguracionFirmasPorEtapaModule,
		GuardarParticipantesModule,
        GuardarParticipantesComisionModule,
        TableroDeRecepcionDeActasModule,
        GuardarRecepcionDeActasModule,
        TableroDeRecepcionDeExpedientesModule,
        GuardarRecepcionDeExpedienteModule,
        TableroDeLibroDeActasModule,
        GuardarlibroDeActasModule,
        TableroDePrestamosDeDocumentosModule
    ],
                          
    bootstrap   : [
        AppComponent
    ]
})
export class AppModule
{
}
