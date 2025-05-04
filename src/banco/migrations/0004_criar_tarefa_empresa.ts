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

      table.enum('status', ['PENDENTE', 'PROCESSANDO', 'FINALIZADO', 'CONSULTAR', 'CANCELADA', 'ERRO']).notNullable().defaultTo('PENDENTE'); // Status da tarefa

      table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.raw('CURRENT_TIMESTAMP  ON UPDATE CURRENT_TIMESTAMP'));
    })
    .then(async () => {
      // Criando a trigger para impedir duplicidade condicional no insert
      await knex.raw(`
        CREATE TRIGGER trg_bloquear_status_duplicado_insert
        BEFORE INSERT ON tarefa_empresa
        FOR EACH ROW
        BEGIN
          IF NEW.status IN ('PENDENTE', 'PROCESSANDO', 'CONSULTAR') THEN
            IF EXISTS (
              SELECT 1 FROM tarefa_empresa
              WHERE tarefa_id = NEW.tarefa_id
                AND empresa_id = NEW.empresa_id
                AND status IN ('PENDENTE', 'PROCESSANDO', 'CONSULTAR')
            ) THEN
              SIGNAL SQLSTATE '45000'
              SET MESSAGE_TEXT = 'Já existe uma tarefa ativa para esta empresa';
            END IF;
          END IF;
        END;
      `);

      // Criando a trigger para impedir duplicidade condicional no update
      await knex.raw(`
        CREATE TRIGGER trg_bloquear_status_duplicado_update
        BEFORE UPDATE ON tarefa_empresa
        FOR EACH ROW
        BEGIN
          IF NEW.status IN ('PENDENTE', 'PROCESSANDO', 'CONSULTAR') THEN
            IF EXISTS (
              SELECT 1 FROM tarefa_empresa
              WHERE tarefa_id = NEW.tarefa_id
                AND empresa_id = NEW.empresa_id
                AND status IN ('PENDENTE', 'PROCESSANDO', 'CONSULTAR')
                AND id != NEW.id  -- evita bloquear atualização no próprio registro
            ) THEN
              SIGNAL SQLSTATE '45000'
              SET MESSAGE_TEXT = 'Já existe uma tarefa ativa para esta empresa';
            END IF;
          END IF;
        END;
      `);

      Util.Log.info(`# Criado tabela ${ETableNames.tarefa_empresa}`);
    });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable(ETableNames.tarefa_empresa).then(() => {
    Util.Log.info(`# Excluído tabela ${ETableNames.tarefa_empresa}`);
  });
}
