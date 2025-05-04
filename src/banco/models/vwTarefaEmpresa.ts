export interface IVwTarefaEmpresa {
  e_id: number;
  e_ativo: boolean;
  e_erp: string;
  t_id: number;
  t_ativo: boolean;
  t_nome: string;
  t_descricao_resumo: string;
  t_descricao: string;
  t_param_ss: boolean;
  t_param_sh: boolean;
  t_param_mc: boolean;
  t_param_api_mkt: boolean;
  te_id?: number | null;
  te_status: 'NOVO' | 'PENDENTE' | 'PROCESSANDO' | 'FINALIZADO' | 'CONSULTAR' | 'CANCELADA' | 'ERRO';
  te_feedback?: string | null;
  te_updated_at?: string | null;
  ss_autenticado: boolean;
  mc_autenticado: boolean;
  sh_autenticado: boolean;
}
