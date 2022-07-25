export class DocumentoFormatoExcelModel {
    id: string;
    cNombreDocumento: string;
    fechaCreacion: string;
    fechaCarga: string;
    fechaCreacionDate: string;
    fechaCargaDate: string;
    paginas: number;
    tipo_de_documento: string;
    plazoDeConservacion: string;
    clave: string;
    pasillo: string;
    estante: string;
    nivel: string;
    seccion: string;
    version: number;
    folioExpediente: string;
    tipo_de_expediente: any;
    expediente: any;
    idExpediente: any;
    tipoDocumento: string;   
    informacion: string;
    visibilidade: string;   
    cDocumento: string;    
    metacatalogos: any;
    clasificacion: any;
    valido: boolean;
    errorText: string;
    textoOcr: string;
    bActivo: boolean;
    usuario: any;
    filePDF: File | null;
    fileBase: any | null;
    idEncabezado: string;
    idDetalle: string;
    progress: any
}
