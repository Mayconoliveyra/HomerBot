export interface IVwTarefaProcessar {
  // tarefa_empresa (te_)
  te_id: number;
  te_tarefa_id: number;
  te_empresa_id: number;

  te_param_descricao?: string | null;
  te_param_01?: string | null;
  te_param_02?: string | null;
  te_param_03?: string | null;
  te_param_04?: string | null;
  te_param_05?: string | null;
  te_param_06?: string | null;
  te_param_07?: string | null;
  te_param_08?: string | null;
  te_param_09?: string | null;
  te_param_10?: string | null;
  te_param_11?: string | null;
  te_param_12?: string | null;
  te_param_13?: string | null;
  te_param_14?: string | null;
  te_param_15?: string | null;

  te_feedback?: string | null;

  te_status: 'PENDENTE' | 'PROCESSANDO' | 'FINALIZADO' | 'CONSULTAR' | 'CANCELADA' | 'ERRO';

  te_created_at: string;
  te_updated_at?: string;

  // empresas (e_)
  e_id: number;
  e_registro: string;
  e_nome: string;
  e_cnpj_cpf: string;
  e_erp: 'SOFTSHOP' | 'SOFTCOMSHOP';

  e_ss_qrcode_url?: string | null;
  e_ss_url?: string | null;
  e_ss_client_id?: string | null;
  e_ss_client_secret?: string | null;
  e_ss_empresa_nome?: string | null;
  e_ss_empresa_cnpj?: string | null;
  e_ss_token?: string | null;
  e_ss_token_exp: number;

  e_mc_usuario?: string | null;
  e_mc_senha?: string | null;
  e_mc_empresa_id?: string | null;
  e_mc_empresa_nome?: string | null;
  e_mc_empresa_cnpj?: string | null;
  e_mc_token?: string | null;
  e_mc_token_exp: number;

  e_sh_qrcode_url?: string | null;
  e_sh_url?: string | null;
  e_sh_client_id?: string | null;
  e_sh_client_secret?: string | null;
  e_sh_token?: string | null;
  e_sh_token_exp: number;

  e_ativo: boolean;
  e_prox_sinc_sh_token: number;

  e_created_at: string;
  e_updated_at?: string;

  // tarefas (t_)
  t_id: number;
  t_nome: string;
  t_descricao_resumo: string;
  t_descricao: string;
  t_simultaneamente: boolean;
  t_ativo: boolean;

  t_param_descricao?: string | null;
  t_param_01?: string | null;
  t_param_02?: string | null;
  t_param_03?: string | null;
  t_param_04?: string | null;
  t_param_05?: string | null;
  t_param_06?: string | null;
  t_param_07?: string | null;
  t_param_08?: string | null;
  t_param_09?: string | null;
  t_param_10?: string | null;
  t_param_11?: string | null;
  t_param_12?: string | null;
  t_param_13?: string | null;
  t_param_14?: string | null;
  t_param_15?: string | null;

  t_param_ss: boolean;
  t_param_sh: boolean;
  t_param_mc: boolean;
  t_param_api_mkt: boolean;

  t_created_at: string;
  t_updated_at?: string;

  // campo calculado pela view
  prox_processar: boolean;
}
