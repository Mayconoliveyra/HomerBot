import { IEmpresa } from '../../models/empresa';
import { IUsuario } from '../../models/usuario';

declare module 'knex/types/tables' {
  interface Tables {
    empresas: IEmpresa;
    usuarios: IUsuario;
  }
}
