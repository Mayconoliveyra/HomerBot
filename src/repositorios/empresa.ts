import { ETableNames } from '../banco/eTableNames';
import { Knex } from '../banco/knex';
import { IEmpresa } from '../banco/models/empresa';

import { Util } from '../util';

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

export const Empresa = { buscarPorId, atualizarDadosSelfHost };
