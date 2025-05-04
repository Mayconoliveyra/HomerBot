import { Knex } from 'knex';

import { Util } from '../../util';

import { ETableNames } from '../eTableNames';

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    CREATE VIEW ${ETableNames.vw_tarefas_nao_simultaneas} AS
    SELECT
      -- tarefa_empresa (prefixo te_)
      te.id AS te_id,
      te.tarefa_id AS te_tarefa_id,
      te.empresa_id AS te_empresa_id,
      te.param_descricao AS te_param_descricao,
      te.param_01 AS te_param_01,
      te.param_02 AS te_param_02,
      te.param_03 AS te_param_03,
      te.param_04 AS te_param_04,
      te.param_05 AS te_param_05,
      te.param_06 AS te_param_06,
      te.param_07 AS te_param_07,
      te.param_08 AS te_param_08,
      te.param_09 AS te_param_09,
      te.param_10 AS te_param_10,
      te.param_11 AS te_param_11,
      te.param_12 AS te_param_12,
      te.param_13 AS te_param_13,
      te.param_14 AS te_param_14,
      te.param_15 AS te_param_15,
      te.feedback AS te_feedback,
      te.status AS te_status,
      te.created_at AS te_created_at,
      te.updated_at AS te_updated_at,

      -- empresas (prefixo e_)
      e.id AS e_id,
      e.registro AS e_registro,
      e.nome AS e_nome,
      e.cnpj_cpf AS e_cnpj_cpf,
      e.erp AS e_erp,
      e.ss_qrcode_url AS e_ss_qrcode_url,
      e.ss_url AS e_ss_url,
      e.ss_client_id AS e_ss_client_id,
      e.ss_client_secret AS e_ss_client_secret,
      e.ss_empresa_nome AS e_ss_empresa_nome,
      e.ss_empresa_cnpj AS e_ss_empresa_cnpj,
      e.ss_token AS e_ss_token,
      e.ss_token_exp AS e_ss_token_exp,
      e.mc_usuario AS e_mc_usuario,
      e.mc_senha AS e_mc_senha,
      e.mc_empresa_id AS e_mc_empresa_id,
      e.mc_empresa_nome AS e_mc_empresa_nome,
      e.mc_empresa_cnpj AS e_mc_empresa_cnpj,
      e.mc_token AS e_mc_token,
      e.mc_token_exp AS e_mc_token_exp,
      e.sh_qrcode_url AS e_sh_qrcode_url,
      e.sh_url AS e_sh_url,
      e.sh_client_id AS e_sh_client_id,
      e.sh_client_secret AS e_sh_client_secret,
      e.sh_token AS e_sh_token,
      e.sh_token_exp AS e_sh_token_exp,
      e.ativo AS e_ativo,
      e.prox_sinc_sh_token AS e_prox_sinc_sh_token,
      e.created_at AS e_created_at,
      e.updated_at AS e_updated_at,

      -- tarefas (prefixo t_)
      t.id AS t_id,
      t.nome AS t_nome,
      t.descricao_resumo AS t_descricao_resumo,
      t.descricao AS t_descricao,
      t.simultaneamente AS t_simultaneamente,
      t.ativo AS t_ativo,
      t.param_descricao AS t_param_descricao,
      t.param_01 AS t_param_01,
      t.param_02 AS t_param_02,
      t.param_03 AS t_param_03,
      t.param_04 AS t_param_04,
      t.param_05 AS t_param_05,
      t.param_06 AS t_param_06,
      t.param_07 AS t_param_07,
      t.param_08 AS t_param_08,
      t.param_09 AS t_param_09,
      t.param_10 AS t_param_10,
      t.param_11 AS t_param_11,
      t.param_12 AS t_param_12,
      t.param_13 AS t_param_13,
      t.param_14 AS t_param_14,
      t.param_15 AS t_param_15,
      t.param_ss AS t_param_ss,
      t.param_sh AS t_param_sh,
      t.param_mc AS t_param_mc,
      t.param_api_mkt AS t_param_api_mkt,
      t.created_at AS t_created_at,
      t.updated_at AS t_updated_at,

      -- Apenas UM com prox_processar = true, o restante false
      (
        te.id = (
          SELECT MIN(te_inner.id)
          FROM tarefa_empresa te_inner
          JOIN tarefas t_inner ON te_inner.tarefa_id = t_inner.id
          WHERE
            t_inner.simultaneamente = false
            AND te_inner.status = 'PENDENTE'
            AND NOT EXISTS (
              SELECT 1
              FROM tarefa_empresa te_exec
              WHERE te_exec.empresa_id = te_inner.empresa_id
                AND te_exec.status IN ('PROCESSANDO', 'CONSULTAR')
            )
        )
      ) AS prox_processar

    FROM tarefa_empresa te
    JOIN empresas e ON te.empresa_id = e.id
    JOIN tarefas t ON te.tarefa_id = t.id
    WHERE t.simultaneamente = false;
  `);

  Util.Log.info(`# Criado view ${ETableNames.vw_tarefas_nao_simultaneas}`);
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`DROP VIEW IF EXISTS ${ETableNames.vw_tarefas_nao_simultaneas};`);
}
