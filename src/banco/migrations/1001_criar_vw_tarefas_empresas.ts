import { Knex } from 'knex';

import { Util } from '../../util';

import { ETableNames } from '../eTableNames';

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    CREATE VIEW ${ETableNames.vw_tarefas_empresas} AS
    SELECT 
      e.id AS e_id,
      e.ativo AS e_ativo,
      e.erp AS e_erp,
      t.id AS t_id,
      t.ativo AS t_ativo,
      t.nome AS t_nome,
      t.descricao AS t_descricao,
      t.modal_nome AS t_modal_nome,
      te.id AS te_id,
      COALESCE(te.status, 'NOVO') AS te_status,
      te.erro AS te_erro,

      -- Verificação dos tokens
      CASE WHEN e.ss_token_exp IS NOT NULL AND e.ss_token_exp > UNIX_TIMESTAMP() THEN TRUE ELSE FALSE END AS ss_autenticado,
      CASE WHEN e.mc_token_exp IS NOT NULL AND e.mc_token_exp > UNIX_TIMESTAMP() THEN TRUE ELSE FALSE END AS mc_autenticado,
      CASE WHEN e.sh_token_exp IS NOT NULL AND e.sh_token_exp > UNIX_TIMESTAMP() THEN TRUE ELSE FALSE END AS sh_autenticado
    FROM empresas e
    CROSS JOIN tarefas t
    LEFT JOIN (
        SELECT 
          te1.*
        FROM tarefa_empresa te1
        INNER JOIN (
          SELECT 
            tarefa_id,
            empresa_id,
            MAX(id) AS max_id
          FROM tarefa_empresa
          GROUP BY tarefa_id, empresa_id
        ) te2 ON te1.id = te2.max_id
    ) te ON te.tarefa_id = t.id AND te.empresa_id = e.id;
  `);

  Util.Log.info(`# Criado view ${ETableNames.vw_tarefas_empresas}`);
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`DROP VIEW IF EXISTS ${ETableNames.vw_tarefas_empresas};`);
}
