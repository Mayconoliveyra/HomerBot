import { ETableNames } from '../banco/eTableNames';
import { Knex } from '../banco/knex';
import { IProdutoERP } from '../banco/models/produtoERP';

import { Util } from '../util';

const MODULO = '[Produtos ERP]';

const apagarProdutosPorEmpresaId = async (empresaId: number) => {
  try {
    await Knex(ETableNames.produtos_erp).delete().where('empresa_id', '=', empresaId);
    return true;
  } catch (error) {
    Util.Log.error(`${MODULO} | Erro ao apagar produtos da empresa.`, error);
    return false;
  }
};

const inserir = async (produtos: Partial<IProdutoERP>[] | Partial<IProdutoERP>) => {
  try {
    if (Array.isArray(produtos)) {
      if (produtos.length === 0) throw 'Produtos não pode ser um array vazio.';
    }

    await Knex(ETableNames.produtos_erp).insert(produtos);

    return true;
  } catch (error) {
    Util.Log.error(`${MODULO} | Erro ao inserir produtos.`, error);
    return false;
  }
};

const consultarCategorias = async (empresaId: number) => {
  try {
    return await Knex(ETableNames.produtos_erp).where('empresa_id', '=', empresaId).andWhere('type', '=', 'CATEGORY');
  } catch (error) {
    Util.Log.error(`${MODULO} | Erro ao consultar categorias.`, error);
    return false;
  }
};

const consultarPrimeiroRegistroPorColuna = async (empresaId: number, type: IProdutoERP['type'], coluna: keyof IProdutoERP, valorBuscar: string) => {
  try {
    return await Knex.table(ETableNames.produtos_erp)
      .select()
      .where('empresa_id', '=', empresaId)
      .where(coluna, '=', valorBuscar)
      .andWhere('type', '=', type)
      .first();
  } catch (error) {
    Util.Log.error(
      `${MODULO} | Erro ao consultar primeiro registro por coluna: Type:${type.toLowerCase()}; coluna:${coluna.toLowerCase()}; valorBuscar:${valorBuscar.toLowerCase()};`,
      error,
    );
    return false;
  }
};

const consultar = async (
  empresaId: number,
  type: IProdutoERP['type'],
  orderBy: { coluna: keyof IProdutoERP; direcao?: 'asc' | 'desc' } = { coluna: 'id', direcao: 'asc' },
) => {
  try {
    return await Knex(ETableNames.produtos_erp)
      .where('empresa_id', '=', empresaId)
      .andWhere('type', '=', type)
      .orderBy(orderBy.coluna, orderBy.direcao || 'asc');
  } catch (error) {
    Util.Log.error(`${MODULO} | Erro ao consultar ${type.toLowerCase()}.`, error);
    return false;
  }
};
export const ProdutosERP = { inserir, apagarProdutosPorEmpresaId, consultarCategorias, consultar, consultarPrimeiroRegistroPorColuna };
