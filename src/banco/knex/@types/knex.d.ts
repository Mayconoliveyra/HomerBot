import { IEmpresa } from '../../models/empresa';
import { IProdutoERP } from '../../models/produtoERP';
import { IProdutoMC } from '../../models/produtoMC';
import { ITarefa } from '../../models/tarefa';
import { IUsuario } from '../../models/usuario';

declare module 'knex/types/tables' {
  interface Tables {
    empresas: IEmpresa;
    usuarios: IUsuario;
    produtos_mc: IProdutoMC;
    produtos_erp: IProdutoERP;
    tarefas: ITarefa;
  }
}
