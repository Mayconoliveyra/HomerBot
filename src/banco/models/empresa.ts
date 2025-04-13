export interface IEmpresa {
  id: number;

  registro: string;
  nome: string;
  cnpj_cpf: string;

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
