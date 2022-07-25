import { ModuloModel } from './modulo.models';

export class AreaModel {
    id: string;
    cDescripcionArea: string;
    bActivo: boolean;
    nArea: number;
    nEmisor: number;
    cDescripcion: string;
    cIcono: string;
    nOrden: number;
    modulos: ModuloModel[];
}
