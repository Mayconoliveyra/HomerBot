import { Knex } from 'knex';

import { Util } from '../../util';

import { ETableNames } from '../eTableNames';

export async function up(knex: Knex) {
  return knex.schema
    .createTable(ETableNames.produtos_erp, (table) => {
      table.bigIncrements('id');
      table.bigInteger('empresa_id').unsigned().notNullable().references('id').inTable(ETableNames.empresas).onUpdate('RESTRICT').onDelete('RESTRICT');

      table.enu('type', ['CATEGORY', 'PRODUCT', 'VARIATION_HEADER', 'VARIATION_ITEM']).notNullable(); // CATEGORY | PRODUCT | VARIATION_HEADER | VARIATION_ITEM

      // Categoria
      table.string('erp_c_code').nullable();
      table.string('erp_c_name').nullable();
      table.enu('erp_c_availability', ['AVAILABLE', 'UNAVAILABLE']).nullable();

      // Produto
      table.string('erp_p_name').nullable();
      table.text('erp_p_description').nullable();
      table.string('erp_p_category_id').nullable();
      table.string('erp_p_code').nullable();
      table.decimal('erp_p_price', 10, 2).nullable();
      table.enu('erp_p_availability', ['AVAILABLE', 'UNAVAILABLE']).nullable();
      table.integer('erp_p_stock_current').nullable();
      table.boolean('erp_p_stock_active').nullable();
      table.boolean('erp_p_variations_grid').nullable();
      table.text('erp_p_images').nullable();

      // Variação
      table.string('erp_v_name').nullable();
      table.boolean('erp_v_required').nullable();
      table.integer('erp_v_items_min').nullable();
      table.integer('erp_v_items_max').nullable();
      table.enu('erp_v_availability', ['AVAILABLE', 'UNAVAILABLE']).nullable();
      table.integer('erp_v_ordem').nullable();
      table.string('erp_v_name_hash').nullable();

      // Item de Variação
      table.string('erp_vi_code').nullable();
      table.string('erp_vi_name').nullable();
      table.text('erp_vi_description').nullable();
      table.decimal('erp_vi_value', 10, 2).nullable();
      table.enu('erp_vi_availability', ['AVAILABLE', 'UNAVAILABLE']).nullable();
      table.integer('erp_vi_stock_current').nullable();
      table.boolean('erp_vi_stock_active').nullable();

      table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.raw('NULL ON UPDATE CURRENT_TIMESTAMP'));
    })
    .then(() => {
      Util.Log.info(`# Criado tabela ${ETableNames.produtos_erp}`);
    });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable(ETableNames.produtos_erp).then(() => {
    Util.Log.info(`# Excluído tabela ${ETableNames.produtos_erp}`);
  });
}
