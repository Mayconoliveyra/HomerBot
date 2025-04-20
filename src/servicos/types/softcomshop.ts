export interface ISSResponseBase<T = any> {
  code: number;
  message: string;
  human: string;
  data: T;
  meta: {
    page: {
      current: number;
      prev: number | null;
      next: number | null;
      count: 1;
    };
  };
  date_sync: number;
  current_page: number;
  last_page: number;
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

export interface ISSGetProdutos {
  id: number;
  empresa_id: string;
  produto_empresa_id: string;
  vinculo_fiscal: any[];
  sku: string;
  sku_atributo: string;
  codigo_barras_grade: string;
  estoque: number;
  fabricante: string | null;
  nome_original: string;
  nome: string;
  produto_id: string;
  fabricante_id: string | null;
  codigo_barras: string | null;
  referencia: string;
  grupo_id: string;
  observacao: string | null;
  unidade_medida: string;
  peso: string;
  kds_tempo_preparo: string | null;
  tributos_estaduais: string;
  tributos_federais: string;
  tributos_municipais: string;
  margem_lucro: string;
  ncm: string | null;
  cest: string | null;
  percentual_comissao_produto: string;
  agrupar_pedido: boolean;
  habilitar_grade: boolean;
  servico: string | null;
  promocao_preco: string;
  promocao_validade: string | null;
  promocao_quantidade: string | null;
  codigo_beneficio_fiscal: string | null;
  vender: boolean;
  origem: string;
  taxa_entrega: string;
  preco_venda: string;
  preco_compra: string;
  habilitar_acompanhamento: string;
  self_service: string | null;
  perguntar_adicionais: string | null;
  cobrar_taxa_entrega: string | null;
  nao_enviar_comanda: string | null;
  cobrar_taxa_servico: string;
  taxa_adicional_delivery: string;
  tipo_combo: string;
  tipo_faturamento: string;
  preco_a_partir_de: string;
  agrupar_impressao_item_combo: string;
  item_lista_servico: string | null;
  codigo_tributacao_municipal: string | null;
  data_atualizacao_preco: string; // ISO date string
  codigo_nfe: string;
  especifico: string | null;
  tabela_precos: any[]; // Ajuste o tipo do array conforme necessário
  produto_imagem: any[]; // Ajuste o tipo do array conforme necessário
}

export interface ISSGetGrupos {
  id: string;
  parent_id: number | null;
  nome: string;
  editavel: string; // Pode ser "SIM" ou outro valor (adicione tipos mais específicos se necessário)
  vender: string; // Pode ser "1" ou outro valor (adicione tipos mais específicos se necessário)
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
  deleted_at: string | null; // ISO date string ou null
  imagem: string;
  armacao: string; // Pode ser "0" ou outro valor
  lente: string; // Pode ser "0" ou outro valor
  restaurante_familia_id: number | null;
  habilitar_acompanhamento: string | null;
  acompanhamento_grupo_id: number | null;
  qtd_max: number | null;
  self_service: string | null;
  perguntar_adicionais: string | null;
  nao_enviar_comanda: string; // Pode ser "0" ou outro valor
  cobrar_taxa_servico: string | null;
  adicional: string; // Pode ser "0" ou outro valor
  marketplace_created_at: string | null; // ISO date string ou null
  marketplace_updated_at: string | null; // ISO date string ou null
  marketplace_code: string | null;
  restaurante_setor_id: number | null;
  observacoes: {
    id: number;
    descricao: string;
  }[]; // Array de objetos Observacao
  adicionais: any[]; // Ajuste o tipo se os dados de adicionais forem conhecidos
}

export interface ISSGetCombos {
  id: number;
  produto_id: string;
  descricao: string;
  quantidade_minima: number;
  quantidade_maxima: number;
  ordem: number;
  habilitar_pizza: number;
  tipo_calculo_preco: number;
  itens: ISSGetCombosItens[];
}

export interface ISSGetCombosItens {
  id: number;
  produto_combo_id: number;
  produto_id: string;
  preco_venda: string;
  quantidade: number;
  codigo_pdv: string;
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
