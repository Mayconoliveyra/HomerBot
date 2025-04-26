import { ETableNames } from '../banco/eTableNames';
import { Knex } from '../banco/knex';
import { IEmpresa } from '../banco/models/empresa';

import { IBodyCadastrarProps } from '../controladores/empresa';

import { Util } from '../util';

const atualizarDados = async (empresaId: number, data: Partial<IEmpresa>) => {
  try {
    return await Knex(ETableNames.empresas)
      .where('id', '=', empresaId)
      .update({ ...data });
  } catch (error) {
    Util.Log.error('Erro ao atualizar dados da empresa', error);
    return false;
  }
};

const consultar = async (pagina: number, limite: number, filtro: string, ordenarPor: string, ordem: string) => {
  try {
    const offset = (pagina - 1) * limite;

    // Valida se a coluna existe de fato na tabela
    const colunaOrdem = ordem && ordem.toLowerCase() === 'desc' ? 'desc' : 'asc';

    const colunasTabela = await Knex(ETableNames.tarefas).columnInfo();
    const nomesColunas = Object.keys(colunasTabela);
    const colunaOrdenada = nomesColunas.includes(ordenarPor) ? ordenarPor : 'nome';

    // Dados
    const tarefas = await Knex(ETableNames.tarefas)
      .select('id', 'nome', 'descricao', 'modal_nome')
      .modify((queryBuilder) => {
        if (filtro) {
          queryBuilder.where((qb) => {
            qb.where('nome', 'like', `%${filtro}%`).orWhere('id', 'like', `%${filtro}%`);
          });
        }
      })
      .where('ativo', '=', true)
      .orderBy(colunaOrdenada, colunaOrdem)
      .limit(limite)
      .offset(offset);

    // Total registros
    const countResult = await Knex(ETableNames.tarefas)
      .modify((queryBuilder) => {
        if (filtro) {
          queryBuilder.where((qb) => {
            qb.where('nome', 'like', `%${filtro}%`).orWhere('id', 'like', `%${filtro}%`);
          });
        }
      })
      .where('ativo', '=', true)
      .count('id as count');

    return {
      total: Number(countResult[0]?.count || 0),
      tarefas,
    };
  } catch (error) {
    Util.Log.error('Erro ao consultar tarefas', error);
    return false;
  }
};

const buscarPorId = async (empresaId: number) => {
  return await Knex(ETableNames.empresas).where('id', '=', empresaId).first();
};

const buscarPorRegistroOuDocumento = async (registro: string, cnpj_cpf: string): Promise<IEmpresa | undefined> => {
  try {
    const result = await Knex(ETableNames.empresas).where('registro', registro).orWhere('cnpj_cpf', cnpj_cpf).first();

    return result;
  } catch (error) {
    Util.Log.error('Erro ao verificar empresa existente', error);
    return undefined;
  }
};

export const Tarefa = { consultar, buscarPorId, atualizarDados, buscarPorRegistroOuDocumento };
