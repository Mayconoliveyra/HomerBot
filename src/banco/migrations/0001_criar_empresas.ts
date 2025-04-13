import { Knex } from 'knex';

import { Util } from '../../util';

import { ETableNames } from '../eTableNames';

export async function up(knex: Knex) {
  return knex.schema
    .createTable(ETableNames.empresas, (table) => {
      table.bigIncrements('id');

      table.string('registro', 50).notNullable().unique();
      table.string('nome', 255).notNullable();
      table.string('cnpj_cpf', 50).notNullable().unique();

      table.text('sh_qrcode_url');
      table.string('sh_url', 255);
      table.string('sh_client_id', 255);
      table.string('sh_client_secret', 255);
      table.text('sh_token');
      table.bigInteger('sh_token_exp').notNullable().defaultTo(0);

      table.boolean('ativo').defaultTo(true);

      table.bigInteger('prox_sinc_sh_token').notNullable().defaultTo(0);

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
