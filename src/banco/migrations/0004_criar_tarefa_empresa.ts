import { Knex } from 'knex';

import { Util } from '../../util';

import { ETableNames } from '../eTableNames';

export async function up(knex: Knex) {
  return knex.schema
    .createTable(ETableNames.tarefa_empresa, (table) => {
      table.bigIncrements('id');

      table.bigInteger('tarefa_id').unsigned().notNullable().references('id').inTable(ETableNames.tarefas).onUpdate('RESTRICT').onDelete('RESTRICT');
      table.bigInteger('empresa_id').unsigned().notNullable().references('id').inTable(ETableNames.empresas).onUpdate('RESTRICT').onDelete('RESTRICT');

      /**
       * Parâmetros adicionais para customizações específicas.
       * Exemplo: versão, modelo, token específico, entre outros.
       */
      table.text('param_descricao').nullable(); // Descrição dos parâmetros adicionais
      table.string('param_01', 255).nullable();
      table.string('param_02', 255).nullable();
      table.string('param_03', 255).nullable();
      table.string('param_04', 255).nullable();
      table.string('param_05', 255).nullable();
      table.string('param_06', 255).nullable();
      table.string('param_07', 255).nullable();
      table.string('param_08', 255).nullable();
      table.string('param_09', 255).nullable();
      table.string('param_10', 255).nullable();
      table.string('param_11', 255).nullable();
      table.string('param_12', 255).nullable();
      table.string('param_13', 255).nullable();
      table.string('param_14', 255).nullable();
      table.string('param_15', 255).nullable();

      table.text('feedback').nullable();
      table.text('erro').nullable();

      table.enum('status', ['PENDENTE', 'PROCESSANDO', 'FINALIZADO', 'CONSULTAR', 'CANCELADA', 'ERRO']).notNullable().defaultTo('PENDENTE'); // Status da tarefa

      table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.raw('CURRENT_TIMESTAMP  ON UPDATE CURRENT_TIMESTAMP'));
    })
    .then(() => {
      Util.Log.info(`# Criado tabela ${ETableNames.tarefa_empresa}`);
    });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable(ETableNames.tarefa_empresa).then(() => {
    Util.Log.info(`# Excluído tabela ${ETableNames.tarefa_empresa}`);
  });
}
