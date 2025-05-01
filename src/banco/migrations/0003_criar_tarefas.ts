import { Knex } from 'knex';

import { Util } from '../../util';

import { ETableNames } from '../eTableNames';

export async function up(knex: Knex) {
  return knex.schema
    .createTable(ETableNames.tarefas, (table) => {
      table.bigIncrements('id');

      table.string('nome', 30).notNullable().index(); // Nome da tarefa
      table.string('descricao_resumo', 100).notNullable(); // Descrição resumida.
      table.text('descricao').notNullable(); // Descrição detalhada

      table.boolean('simultaneamente').defaultTo(false); // Define se pode executar simultaneamente
      table.boolean('ativo').defaultTo(false); // Indicador se a automação está ativa

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

      // Parâmetros de configurações necessárias
      table.boolean('param_ss').defaultTo(false);
      table.boolean('param_sh').defaultTo(false);
      table.boolean('param_mc').defaultTo(false);
      table.boolean('param_api_mkt').defaultTo(false);

      table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.raw('NULL ON UPDATE CURRENT_TIMESTAMP'));
    })
    .then(() => {
      Util.Log.info(`# Criado tabela ${ETableNames.tarefas}`);
    });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable(ETableNames.tarefas).then(() => {
    Util.Log.info(`# Excluído tabela ${ETableNames.tarefas}`);
  });
}
