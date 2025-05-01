export interface ITarefa {
  id: number;

  nome: string;
  descricao_resumo: string;
  descricao: string;
  simultaneamente: boolean;
  ativo: boolean;

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

  param_ss: boolean;
  param_sh: boolean;
  param_mc: boolean;
  param_api_mkt: boolean;

  created_at: string;
  updated_at?: string;
}
