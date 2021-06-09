import { ModuloModel } from './modulo.models';

export class AreaModel {
    nArea: number;
    nEmisor: number;
    cDescripcion: string;
    cIcono: string;
    nOrden: number;
    modulos: ModuloModel[];
}
