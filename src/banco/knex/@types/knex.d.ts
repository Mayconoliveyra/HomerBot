import { IEmpresa } from '../../models/empresa';
import { IProdutoERP } from '../../models/produtoERP';
import { IProdutoMC } from '../../models/produtoMC';
import { ITarefa } from '../../models/tarefa';
import { IUsuario } from '../../models/usuario';
import { IVwTarefaEmpresa } from '../../models/vwTarefaEmpresa';
import { IVwTarefaProcessar } from '../../models/vwTarefaProcessar';

declare module 'knex/types/tables' {
  interface Tables {
    empresas: IEmpresa;
    usuarios: IUsuario;
    produtos_mc: IProdutoMC;
    produtos_erp: IProdutoERP;
    tarefas: ITarefa;
    vw_tarefas_empresas: IVwTarefaEmpresa;
    vw_tarefas_historico: IVwTarefaEmpresa;
    vw_tarefas_simultaneas: IVwTarefaProcessar;
    vw_tarefas_nao_simultaneas: IVwTarefaProcessar;
  }
}
