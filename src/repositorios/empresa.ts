import { ETableNames } from '../banco/eTableNames';
import { Knex } from '../banco/knex';
import { IEmpresa } from '../banco/models/empresa';

import { Util } from '../util';

const consultar = async (pagina: number, limite: number, filtro: string) => {
  try {
    const offset = (pagina - 1) * limite;

    // Query de dados
    const empresas = await Knex(ETableNames.empresas)
      .select('*')
      .modify((queryBuilder) => {
        if (filtro) {
          queryBuilder.where((qb) => {
            qb.where('fantasia', 'like', `%${filtro}%`).orWhere('registro', 'like', `%${filtro}%`).orWhere('cnpj_cpf', 'like', `%${filtro}%`);
          });
        }
      })
      .limit(limite)
      .offset(offset);

    // Query de total
    const countResult = await Knex(ETableNames.empresas)
      .modify((queryBuilder) => {
        if (filtro) {
          queryBuilder.where((qb) => {
            qb.where('fantasia', 'like', `%${filtro}%`).orWhere('registro', 'like', `%${filtro}%`).orWhere('cnpj_cpf', 'like', `%${filtro}%`);
          });
        }
      })
      .count('id as count');

    return {
      total: Number(countResult[0]?.count || 0),
      empresas,
    };
  } catch (error) {
    Util.Log.error('Erro ao consultar empresas', error);
    return false;
  }
};

const buscarPorId = async (empresaId: number) => {
  return await Knex(ETableNames.empresas).where('id', '=', empresaId).first();
};

const atualizarDadosSelfHost = async (empresaId: number, data: Partial<IEmpresa>) => {
  try {
    return await Knex(ETableNames.empresas)
      .where('id', '=', empresaId)
      .update({ ...data });
  } catch (error) {
    Util.Log.error('Erro ao atualizar dados selfhost da empresa', error);
    return false;
  }
};

export const Empresa = { consultar, buscarPorId, atualizarDadosSelfHost };
