import { ETableNames } from '../banco/eTableNames';
import { Knex } from '../banco/knex';
import { IEmpresa } from '../banco/models/empresa';

import { IBodyCadastrarProps } from '../controladores/empresa';

import { Util } from '../util';
import { IRetorno } from '../util/padroes';

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
    Util.Log.error('Erro ao consultar empresas', error);

    return {
      sucesso: false,
      dados: null,
      erro: Util.Msg.erroInesperado,
      total: 0,
    };
  }
};

const buscarPorId = async (empresaId: number): Promise<IRetorno<IEmpresa>> => {
  const result = await Knex(ETableNames.empresas).where('id', '=', empresaId).first();

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
      erro: 'Empresa não encontrada',
      total: 0,
    };
  }
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

const cadastrar = async (empresa: IBodyCadastrarProps) => {
  try {
    return await Knex(ETableNames.empresas).insert(empresa);
  } catch (error) {
    Util.Log.error('Erro ao cadastrar empresa', error);
    return false;
  }
};

export const Empresa = { consultar, buscarPorId, atualizarDados, buscarPorRegistroOuDocumento, cadastrar };
