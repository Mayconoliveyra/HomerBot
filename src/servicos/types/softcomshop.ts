export interface ISSResponseBase<T = any> {
  code: number;
  message: string;
  human: string;
  data: T;
  meta: any[];
  date_sync?: number;
}

export interface ISSCriarDispositivo {
  client_id: string;
  client_secret: string;
  device_id: string;
  device_name: string;
  resources: {
    url_base: string;
    path_api: string;
    path_device: string;
    path_authentication: string;
    retaguarda: string;
  };
  empresa_id: number;
  empresa_name: string;
  empresa_fantasia: string;
  empresa_razao_social: string;
  empresa_cnpj: string;
  empresa_email: string;
  empresa_inscricao_estadual: string;
  empresa_inscricao_municipal: string;
  empresa_cep: string;
  empresa_endereco: string;
  empresa_numero: string;
  empresa_complemento: string | null;
  empresa_bairro: string;
  empresa_cidade: string;
  empresa_c_cidade: string;
  empresa_uf: string;
  empresa_c_uf: string;
  empresa_pais: string;
  empresa_c_pais: string;
  empresa_mensagem_pedido: string | null;
  empresa_troca_prazo: string | null;
  empresa_troca_mensagem: string | null;
  empresa_mfe_chave_validador: string | null;
  empresa_regime_tributario: string;
  empresa_nfce_valor_minimo: string | null;
  empresa_logomarca: string;
  empresa_logomarca_extensao: string;
  empresa_csc_token: string;
  empresa_csc_id: string;
  empresa_certificado: string;
  empresa_certificado_senha: string;
  empresa_certificado_validade: string;
  empresa_modulo_fiscal: string;
  empresa_mei: string;
  empresa_sat: string;
  taxa_servico: string;
  versao_memoria_restaurante: string;
  empresa_fone_ddd: string;
  empresa_fone: string;
  empresa_nfce_serie: number;
  empresa_nfce_numero_caixa: number;
  empresa_nfce_ambiente: number;
  empresa_nfce_modelo: number;
  empresa_nfce_proximo_numero: number;
}

export interface ISSCriarToken {
  token: string;
  expires_in: number;
  type: string;
  scope: string | null;
}

export interface ICriarDispositivo {
  url_base: string;
  client_id: string;
  client_secret: string;
  empresa_cnpj: string;
  empresa_fantasia: string;
}

export interface ICriarToken {
  token: string;
  expiresAt: number;
}
