import { Knex } from 'knex';

import { ETableNames } from '../eTableNames';
const { NODE_ENV } = process.env;

export const seed = async (knex: Knex) => {
  if (NODE_ENV === 'production') return;

  const result = await knex(ETableNames.tarefas).first();
  if (result) return;

  await knex(ETableNames.tarefas)
    .insert([
      {
        id: 1,
        nome: 'DataSyncFood - Meu Carrinho',
        descricao_resumo: 'DataSyncFood - Meu Carrinho',
        descricao:
          'Exporte facilmente as mercadorias do Softcomshop para o Meu Carrinho. Serão transferidas as informações cadastradas: categorias, produto principal, combos e variações.',
        simultaneamente: true,
        ativo: true,
        param_ss: true,
        param_mc: true,
      },
    ])
    .then(() => {
      console.log(`# Inserido dados na tabela ${ETableNames.tarefas}`);
    });
};
