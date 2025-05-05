import { ETableNames } from '../banco/eTableNames';
import { Knex } from '../banco/knex';
import { ITarefaEmpresa } from '../banco/models/tarefaEmpresa';

import { Util } from '../util';
import { IFiltro, IRetorno } from '../util/tipagens';

const MODULO = '[TarefaEmpresa]';

const solicitar = async (dados: Partial<ITarefaEmpresa>): Promise<IRetorno<string>> => {
  try {
    const result = await Knex(ETableNames.tarefa_empresa).insert(dados);

    if (result) {
      return {
        sucesso: true,
        dados: Util.Msg.sucesso,
        erro: null,
        total: 1,
      };
    } else {
      return {
        sucesso: false,
        dados: null,
        erro: Util.Msg.erroInesperado,
        total: 0,
      };
    }
  } catch (error) {
    Util.Log.error(`${MODULO} | Erro ao realizar cadastro.`, error);

    return {
      sucesso: false,
      dados: null,
      erro: Util.Msg.erroInesperado,
      total: 0,
    };
  }
};

const consultarPrimeiroRegistro = async (filtros: IFiltro<ITarefaEmpresa>[]): Promise<IRetorno<ITarefaEmpresa>> => {
  try {
    const query = Knex.table(ETableNames.tarefa_empresa).select('*').orderBy('id', 'desc');

    filtros.forEach((filtro) => {
      query.where(filtro.coluna, filtro.operador, filtro.valor);
    });

    const result = await query.first();

    if (result) {
      return {
        sucesso: true,
        dados: result,
        erro: null,
        total: 1,
      };
    } else {
      return {
        sucesso: false,
        dados: null,
        erro: 'Nenhum registro foi encontrado.',
        total: 0,
      };
    }
  } catch (error) {
    Util.Log.error(`${MODULO} | Erro ao consultar primeiro registro com filtros: filtros:${JSON.stringify(filtros)}`, error);

    return {
      sucesso: false,
      dados: null,
      erro: Util.Msg.erroInesperado,
      total: 0,
    };
  }
};

const atualizarDados = async (id: number, dados: Partial<ITarefaEmpresa>): Promise<IRetorno<string>> => {
  try {
    delete dados.id;
    delete dados.tarefa_id;
    delete dados.empresa_id;
    delete dados.created_at;
    delete dados.updated_at;

    const result = await Knex(ETableNames.tarefa_empresa)
      .where('id', '=', id)
      .update({ ...dados });

    if (result) {
      return {
        sucesso: true,
        dados: Util.Msg.sucesso,
        erro: null,
        total: 1,
      };
    } else {
      return {
        sucesso: false,
        dados: null,
        erro: Util.Msg.erroInesperado,
        total: 0,
      };
    }
  } catch (error) {
    Util.Log.error(`${MODULO} | Erro ao atualizar dados.`, error);

    return {
      sucesso: false,
      dados: null,
      erro: Util.Msg.erroInesperado,
      total: 0,
    };
  }
};

export const TarefaEmpresa = { solicitar, consultarPrimeiroRegistro, atualizarDados };
