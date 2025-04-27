export interface IVwTarefaEmpresa {
  e_id: number;
  e_ativo: boolean;
  e_erp: string;
  t_id: number;
  t_ativo: boolean;
  t_nome: string;
  t_descricao: string;
  t_modal_nome: string;
  te_id?: number | null;
  te_status: 'NOVO' | 'PENDENTE' | 'PROCESSANDO' | 'FINALIZADO' | 'CONSULTAR' | 'CANCELADA' | 'ERRO';
  te_erro?: string | null;
  ss_autenticado: boolean;
  mc_autenticado: boolean;
  sh_autenticado: boolean;
}
