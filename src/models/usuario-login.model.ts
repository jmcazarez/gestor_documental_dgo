import { AreaModel } from './area.models';

export class UsuarioLoginModel {
  nEmisor: number;
  nUsuario: number;
  cUsuario: string;
  cNombre: string;
  cApellidoPaterno: string;
  cApellidoMaterno: string;
  cPassword: string;
  cEmail: string;
  nPersonal: number;
  bAdministrador: boolean;
  areas: AreaModel[];
}
