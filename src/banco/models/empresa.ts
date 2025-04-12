export interface IEmpresa {
  id: number;

  fantasia: string;
  razao: string;
  registro: string;
  cnpj_cpf: string;

  sinc_nome: boolean;
  sinc_preco: boolean;
  sinc_preco_custo: boolean;
  sinc_estoque: boolean;
  sinc_fabricante: boolean;

  sinc_preco_tipo: 'PADRAO' | 'A' | 'B' | 'C';

  pm4_loja_id?: string | null; //ID da Loja no Marketplace (app.plug4market)
  pm4_seller_id_ml?: string | null; //Id da loja no Mercado Livre
  pm4_token?: string | null;
  pm4_token_renovacao?: string | null;
  pm4_token_exp: number;

  sh_empresa_id: number | null;
  sh_usuario_id: number | null;
  sh_forma_pagamento: string;

  sh_qrcode_url: string | null;
  sh_url: string | null;
  sh_client_id: string | null;
  sh_client_secret: string | null;
  sh_token: string | null;
  sh_token_exp: number;
  sh_ultima_sinc_produtos: number;

  ativo: boolean;

  prox_sinc_sh_token: number;
  prox_sinc_sh_produtos: number;

  prox_sinc_p4m_token: number;
  prox_sinc_p4m_produtos: number;
  prox_sinc_p4m_pedidos: number;

  created_at: string;
  updated_at?: string;
}
