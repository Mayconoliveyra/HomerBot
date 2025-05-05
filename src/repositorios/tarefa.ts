import { ETableNames } from '../banco/eTableNames';
import { Knex } from '../banco/knex';
import { ITarefa } from '../banco/models/tarefa';
import { IVwTarefaEmpresa } from '../banco/models/vwTarefaEmpresa';

import { IBodyCadastrarProps } from '../controladores/empresa';

import { Util } from '../util';
import { IFiltro, IRetorno } from '../util/tipagens';

const MODULO = '[Tarefa]';

const cadastrar = async (empresa: IBodyCadastrarProps): Promise<IRetorno<string>> => {
  try {
    const result = await Knex(ETableNames.tarefas).insert(empresa);

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

const consultar = async (
  empresaId: number,
  pagina: number,
  limite: number,
  filtro: string,
  ordenarPor: string,
  ordem: string,
): Promise<IRetorno<IVwTarefaEmpresa[]>> => {
  try {
    const offset = (pagina - 1) * limite;

    // Valida se a coluna existe de fato na tabela
    const colunaOrdem = ordem && ordem.toLowerCase() === 'desc' ? 'desc' : 'asc';

    const colunasTabela = await Knex(ETableNames.vw_tarefas_empresas).columnInfo();
    const nomesColunas = Object.keys(colunasTabela);
    const colunaOrdenada = nomesColunas.includes(ordenarPor) ? ordenarPor : 't_nome';

    // Dados
    const tarefas = (await Knex(ETableNames.vw_tarefas_empresas)
      .select('*')
      .where('e_id', '=', empresaId)
      .where('e_ativo', '=', true)
      .where('t_ativo', '=', true)
      .modify((queryBuilder) => {
        if (filtro) {
          queryBuilder.where((qb) => {
            qb.where('t_nome', 'like', `%${filtro}%`).orWhere('t_descricao', 'like', `%${filtro}%`);
          });
        }
      })
      .orderBy(colunaOrdenada, colunaOrdem)
      .limit(limite)
      .offset(offset)) as IVwTarefaEmpresa[];

    // Total registros
    const countResult = await Knex(ETableNames.vw_tarefas_empresas)
      .where('e_id', '=', empresaId)
      .where('e_ativo', '=', true)
      .where('t_ativo', '=', true)
      .modify((queryBuilder) => {
        if (filtro) {
          queryBuilder.where((qb) => {
            qb.where('t_nome', 'like', `%${filtro}%`).orWhere('t_descricao', 'like', `%${filtro}%`);
          });
        }
      })
      .count('t_id as count');

    return {
      sucesso: true,
      dados: tarefas,
      erro: null,
      total: Number(countResult[0]?.count || 0),
    };
  } catch (error) {
    Util.Log.error(`${MODULO} | Erro ao consultar.`, error);

    return {
      sucesso: false,
      dados: null,
      erro: Util.Msg.erroInesperado,
      total: 0,
    };
  }
};

const consultarPrimeiroRegistro = async (filtros: IFiltro<ITarefa>[]): Promise<IRetorno<ITarefa>> => {
  try {
    const query = Knex.table(ETableNames.tarefas).select('*');

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

const atualizarDados = async (empresaId: number, data: Partial<ITarefa>): Promise<IRetorno<string>> => {
  try {
    const result = await Knex(ETableNames.tarefas)
      .where('id', '=', empresaId)
      .update({ ...data });

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

const historico = async (
  empresaId: number,
  pagina: number,
  limite: number,
  filtro: string,
  ordenarPor: string,
  ordem: string,
): Promise<IRetorno<IVwTarefaEmpresa[]>> => {
  try {
    const offset = (pagina - 1) * limite;

    // Valida se a coluna existe de fato na tabela
    const colunaOrdem = ordem && ordem.toLowerCase() === 'asc' ? 'asc' : 'desc';

    const colunasTabela = await Knex(ETableNames.vw_tarefas_historico).columnInfo();
    const nomesColunas = Object.keys(colunasTabela);
    const colunaOrdenada = nomesColunas.includes(ordenarPor) ? ordenarPor : 'te_id';

    // Dados
    const tarefas = (await Knex(ETableNames.vw_tarefas_historico)
      .select('*')
      .where('e_id', '=', empresaId)
      .modify((queryBuilder) => {
        if (filtro) {
          queryBuilder.where((qb) => {
            qb.where('t_nome', 'like', `%${filtro}%`).orWhere('t_descricao', 'like', `%${filtro}%`);
          });
        }
      })
      .orderBy(colunaOrdenada, colunaOrdem)
      .limit(limite)
      .offset(offset)) as IVwTarefaEmpresa[];

    // Total registros
    const countResult = await Knex(ETableNames.vw_tarefas_historico)
      .where('e_id', '=', empresaId)
      .modify((queryBuilder) => {
        if (filtro) {
          queryBuilder.where((qb) => {
            qb.where('t_nome', 'like', `%${filtro}%`).orWhere('t_descricao', 'like', `%${filtro}%`);
          });
        }
      })
      .count('t_id as count');

    return {
      sucesso: true,
      dados: tarefas,
      erro: null,
      total: Number(countResult[0]?.count || 0),
    };
  } catch (error) {
    Util.Log.error(`${MODULO} | Erro ao consultar histórico.`, error);

    return {
      sucesso: false,
      dados: null,
      erro: Util.Msg.erroInesperado,
      total: 0,
    };
  }
};

export const Tarefa = { cadastrar, consultar, consultarPrimeiroRegistro, atualizarDados, historico };
