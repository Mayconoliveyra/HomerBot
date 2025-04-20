import { Knex } from 'knex';

import { Util } from '../../util';

import { ETableNames } from '../eTableNames';

export async function up(knex: Knex) {
  return knex.schema
    .createTable(ETableNames.produtos_mc, (table) => {
      table.bigIncrements('id');
      table.bigInteger('empresa_id').unsigned().notNullable().references('id').inTable(ETableNames.empresas).onUpdate('RESTRICT').onDelete('RESTRICT');

      table.enu('type', ['CATEGORY', 'PRODUCT', 'VARIATION_HEADER', 'VARIATION_ITEM']).notNullable(); // CATEGORY | PRODUCT | VARIATION_HEADER | VARIATION_ITEM

      // Categoria
      table.string('c_id').nullable();
      table.string('c_code').nullable();
      table.string('c_name').nullable();
      table.enu('c_availability', ['AVAILABLE', 'UNAVAILABLE']).nullable();

      // Produto
      table.string('p_id').nullable();
      table.string('p_name').nullable();
      table.text('p_description').nullable();
      table.string('p_category_id').nullable();
      table.decimal('p_price', 10, 2).nullable();
      table.string('p_code').nullable();
      table.enu('p_availability', ['AVAILABLE', 'UNAVAILABLE']).nullable();
      table.integer('p_stock_current').nullable();
      table.boolean('p_stock_active').nullable();
      table.boolean('p_variations_grid').nullable();

      // Variação
      table.string('v_id').nullable();
      table.string('v_name').nullable();
      table.boolean('v_required').nullable();
      table.integer('v_items_min').nullable();
      table.integer('v_items_max').nullable();
      table.enu('v_availability', ['AVAILABLE', 'UNAVAILABLE']).nullable();
      table.string('v_name_hash').nullable();

      // Item de Variação
      table.string('vi_id').nullable();
      table.string('vi_code').nullable();
      table.string('vi_name').nullable();
      table.text('vi_description').nullable();
      table.decimal('vi_value', 10, 2).nullable();
      table.enu('vi_availability', ['AVAILABLE', 'UNAVAILABLE']).nullable();
      table.integer('vi_stock_current').nullable();
      table.boolean('vi_stock_active').nullable();

      table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.raw('NULL ON UPDATE CURRENT_TIMESTAMP'));
    })
    .then(() => {
      Util.Log.info(`# Criado tabela ${ETableNames.produtos_mc}`);
    });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable(ETableNames.produtos_mc).then(() => {
    Util.Log.info(`# Excluído tabela ${ETableNames.produtos_mc}`);
  });
}
