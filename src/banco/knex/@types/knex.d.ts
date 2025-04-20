import { IEmpresa } from '../../models/empresa';
import { IProdutoMC } from '../../models/produtoMC';
import { IUsuario } from '../../models/usuario';

declare module 'knex/types/tables' {
  interface Tables {
    empresas: IEmpresa;
    usuarios: IUsuario;
    produtos_mc: IProdutoMC;
  }
}
