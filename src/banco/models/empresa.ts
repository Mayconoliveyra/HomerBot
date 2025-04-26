export interface IEmpresa {
  id: number;

  registro: string;
  nome: string;
  cnpj_cpf: string;

  erp: 'SOFTSHOP' | 'SOFTCOMSHOP';

  ss_qrcode_url?: string | null;
  ss_url?: string | null;
  ss_client_id?: string | null;
  ss_client_secret?: string | null;
  ss_empresa_nome?: string | null;
  ss_empresa_cnpj?: string | null;
  ss_token?: string | null;
  ss_token_exp: number;

  mc_usuario?: string | null;
  mc_senha?: string | null;
  mc_empresa_id?: string | null;
  mc_empresa_nome?: string | null;
  mc_empresa_cnpj?: string | null;
  mc_token?: string | null;
  mc_token_exp: number;

  sh_qrcode_url?: string | null;
  sh_url?: string | null;
  sh_client_id?: string | null;
  sh_client_secret?: string | null;
  sh_token?: string | null;
  sh_token_exp: number;

  ativo: boolean;

  prox_sinc_sh_token: number;

  created_at: string;
  updated_at?: string;
}
