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
        descricao_resumo: 'Exporta o cardápio do SOFTCOMSHOP para o Meu Carrinho, sem sincronização automática.',
        descricao:
          'Exporte facilmente o cardápio do SOFTCOMSHOP para o Meu Carrinho. Serão transferidas as informações já cadastradas, como grupos, produtos principais, combos e variações. Essa funcionalidade tem como objetivo facilitar o primeiro envio do cardápio, mas não substitui a necessidade de gerenciamento contínuo pela plataforma do Meu Carrinho. Importante: alterações futuras como preço, estoque, novos produtos e atualizações não serão sincronizadas automaticamente, sendo necessário realizar essas manutenções diretamente no painel do Meu Carrinho.',
        simultaneamente: true,
        ativo: true,
        param_ss: true,
        param_mc: true,
      },
      {
        id: 2,
        nome: 'Zerar Meu Carrinho',
        descricao_resumo: 'Remove todo catálogo atual do Meu Carrinho de forma permanente.',
        descricao:
          'Remove todo o catálogo atual do Meu Carrinho de forma permanente. Serão apagadas todas as informações cadastradas: categorias, produtos, variações e imagens. Essa ação é irreversível.',
        simultaneamente: true,
        ativo: true,
        param_mc: true,
      },
    ])
    .then(() => {
      console.log(`# Inserido dados na tabela ${ETableNames.tarefas}`);
    });
};
