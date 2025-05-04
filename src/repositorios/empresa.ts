import { ETableNames } from '../banco/eTableNames';
import { Knex } from '../banco/knex';
import { IEmpresa } from '../banco/models/empresa';

import { IBodyCadastrarProps } from '../controladores/empresa';

import { Util } from '../util';
import { IFiltro, IRetorno } from '../util/tipagens';

const MODULO = '[Empresa]';

const cadastrar = async (empresa: IBodyCadastrarProps): Promise<IRetorno<string>> => {
  try {
    const result = await Knex(ETableNames.empresas).insert(empresa);

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

const consultar = async (pagina: number, limite: number, filtro: string, ordenarPor: string, ordem: string): Promise<IRetorno<IEmpresa[]>> => {
  try {
    const offset = (pagina - 1) * limite;

    // Valida se a coluna existe de fato na tabela
    const colunaOrdem = ordem && ordem.toLowerCase() === 'desc' ? 'desc' : 'asc';

    const colunasTabela = await Knex(ETableNames.empresas).columnInfo();
    const nomesColunas = Object.keys(colunasTabela);
    const colunaOrdenada = nomesColunas.includes(ordenarPor) ? ordenarPor : 'nome';

    // Dados
    const empresas = (await Knex(ETableNames.empresas)
      .select('*')
      .modify((queryBuilder) => {
        if (filtro) {
          queryBuilder.where((qb) => {
            qb.where('nome', 'like', `%${filtro}%`).orWhere('registro', 'like', `%${filtro}%`).orWhere('cnpj_cpf', 'like', `%${filtro}%`);
          });
        }
      })
      .orderBy(colunaOrdenada, colunaOrdem)
      .limit(limite)
      .offset(offset)) as IEmpresa[];

    // Total registros
    const countResult = await Knex(ETableNames.empresas)
      .modify((queryBuilder) => {
        if (filtro) {
          queryBuilder.where((qb) => {
            qb.where('nome', 'like', `%${filtro}%`).orWhere('registro', 'like', `%${filtro}%`).orWhere('cnpj_cpf', 'like', `%${filtro}%`);
          });
        }
      })
      .count('id as count');

    return {
      sucesso: true,
      dados: empresas,
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

const consultarPrimeiroRegistro = async (filtros: IFiltro<IEmpresa>[]): Promise<IRetorno<IEmpresa>> => {
  try {
    const query = Knex.table(ETableNames.empresas).select('*');

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

const atualizarDados = async (empresaId: number, data: Partial<IEmpresa>): Promise<IRetorno<string>> => {
  try {
    const result = await Knex(ETableNames.empresas)
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

export const Empresa = { cadastrar, consultar, consultarPrimeiroRegistro, atualizarDados };
