import { AreaModel } from './area.models';

export class PermisosUsuarioModel {
    id: string;
    cNombreOpcion: string;
    bActivo: boolean;
    area: AreaModel;
    tipoPermiso: any[];
    idTipoPermiso: any;
 
    cNombrePerfil: string;
  
    Opciones: any[];
    Documentos: any[];
    Visibilidad: any[];
    usuarios: any[];
    }
