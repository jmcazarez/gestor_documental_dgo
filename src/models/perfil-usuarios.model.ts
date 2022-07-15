import { OpcionesSistemaModel } from './opciones-sistema.model';
export class PerfilUsuariosModel {
    id: string;
    cNombrePerfil: string;
    bActivo: boolean;
    Opciones: any[];
    Documentos: any[];
    Visibilidad: any[];
    usuarios: any[];
}
