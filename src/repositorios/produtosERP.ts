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

export const ProdutosERP = { inserir, apagarProdutosPorEmpresaId, consultarCategorias };
