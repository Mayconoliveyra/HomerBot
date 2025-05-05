export interface ITarefaEmpresa {
  id: number;

  tarefa_id: number;
  empresa_id: number;

  param_descricao?: string | null;
  param_01?: string | null;
  param_02?: string | null;
  param_03?: string | null;
  param_04?: string | null;
  param_05?: string | null;
  param_06?: string | null;
  param_07?: string | null;
  param_08?: string | null;
  param_09?: string | null;
  param_10?: string | null;
  param_11?: string | null;
  param_12?: string | null;
  param_13?: string | null;
  param_14?: string | null;
  param_15?: string | null;

  feedback?: string | null;

  status: 'PENDENTE' | 'PROCESSANDO' | 'FINALIZADO' | 'CONSULTAR' | 'CANCELADA' | 'ERRO';

  created_at: string;
  updated_at?: string;
}
