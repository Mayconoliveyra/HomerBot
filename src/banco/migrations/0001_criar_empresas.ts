import { Knex } from 'knex';

import { Util } from '../../util';

import { ETableNames } from '../eTableNames';

export async function up(knex: Knex) {
  return knex.schema
    .createTable(ETableNames.empresas, (table) => {
      table.bigIncrements('id');

      table.string('fantasia', 255).notNullable();
      table.string('razao', 255).notNullable();

      table.string('registro', 100).notNullable();
      table.string('cnpj_cpf', 14).notNullable().unique();

      table.boolean('sinc_nome').defaultTo(true);
      table.boolean('sinc_preco').defaultTo(true);
      table.boolean('sinc_preco_custo').defaultTo(true);
      table.boolean('sinc_estoque').defaultTo(true);
      table.boolean('sinc_fabricante').defaultTo(true);

      table.enum('sinc_preco_tipo', ['PADRAO', 'A', 'B', 'C']).defaultTo('PADRAO').notNullable();

      table.string('pm4_loja_id', 24); //ID da Loja no Marketplace (app.plug4market)
      table.string('pm4_seller_id_ml', 50); //Id da loja no Mercado Livre
      table.text('pm4_token');
      table.text('pm4_token_renovacao');
      table.bigInteger('pm4_token_exp').notNullable().defaultTo(0);

      table.integer('sh_empresa_id');
      table.integer('sh_usuario_id');
      table.string('sh_forma_pagamento').notNullable().defaultTo('ONLINE');

      table.text('sh_qrcode_url');
      table.string('sh_url', 255);
      table.string('sh_client_id', 255);
      table.string('sh_client_secret', 255);
      table.text('sh_token');
      table.bigInteger('sh_token_exp').notNullable().defaultTo(0);
      table.bigInteger('sh_ultima_sinc_produtos').notNullable().defaultTo(0);

      table.boolean('ativo').defaultTo(true);

      table.bigInteger('prox_sinc_sh_token').notNullable().defaultTo(0);
      table.bigInteger('prox_sinc_sh_produtos').notNullable().defaultTo(0);

      table.bigInteger('prox_sinc_p4m_token').notNullable().defaultTo(0);
      table.bigInteger('prox_sinc_p4m_produtos').notNullable().defaultTo(0);
      table.bigInteger('prox_sinc_p4m_pedidos').notNullable().defaultTo(0);

      table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.raw('NULL ON UPDATE CURRENT_TIMESTAMP'));
    })
    .then(() => {
      Util.Log.info(`# Criado tabela ${ETableNames.empresas}`);
    });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable(ETableNames.empresas).then(() => {
    Util.Log.info(`# Excluído tabela ${ETableNames.empresas}`);
  });
}
