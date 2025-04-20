import { ETableNames } from '../banco/eTableNames';
import { Knex } from '../banco/knex';
import { IProdutoMC } from '../banco/models/produtoMC';

import { Util } from '../util';

const MODULO = '[Produtos MC]';

const apagarProdutosPorEmpresaId = async (empresaId: number) => {
  try {
    await Knex(ETableNames.produtos_mc).delete().where('empresa_id', '=', empresaId);
    return true;
  } catch (error) {
    Util.Log.error(`${MODULO} | Erro ao apagar produtos da empresa.`, error);
    return false;
  }
};

const inserir = async (produtos: Partial<IProdutoMC>[] | Partial<IProdutoMC>) => {
  try {
    if (Array.isArray(produtos)) {
      if (produtos.length === 0) throw 'Produtos não pode ser um array vazio.';
    }

    await Knex(ETableNames.produtos_mc).insert(produtos);

    return true;
  } catch (error) {
    Util.Log.error(`${MODULO} | Erro ao inserir produtos meu carrinho.`, error);
    return false;
  }
};

const consultarCategorias = async (empresaId: number) => {
  try {
    return await Knex(ETableNames.produtos_mc).where('empresa_id', '=', empresaId).andWhere('type', '=', 'CATEGORY');
  } catch (error) {
    Util.Log.error(`${MODULO} | Erro ao consultar categorias.`, error);
    return false;
  }
};

export const ProdutosMC = { inserir, apagarProdutosPorEmpresaId, consultarCategorias };
