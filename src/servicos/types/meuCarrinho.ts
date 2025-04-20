export interface IMCAutenticar {
  authenticated: boolean;
  message: string;
  token: string;
  tokenType: string;
  expiresIn: number;
}

export interface IMCErroValidacao {
  errors: {
    [key: string]: string[];
  };
  type: string;
  title: string;
  status: number;
  traceId: string;
}

export interface IMCGetUsuario {
  id: string;
  username: string;
  email: string;
  role: string;
}

export interface IMCGetEmpresa {
  id: string;
  urlCode: string;
  status: string;
  name: string;
  cnpj: string;
  phoneDdd: string;
  phoneNumber: string;
  email: string;
  logoPath: string;
  bannerPath: string;
  about: string | null;
  whatsappDdd: string;
  whatsappNumber: string;
  instagram: string;
  facebook: string;
  active: boolean;
  softcomCode: string;
  paymentInstructions: string;
  integrationApp: boolean;
  orderCpfIsRequired: boolean;
  variationsGrid: boolean;
  cardInstallmentsMax: number;
  cardInstallmentsMinValue: number;
  marketplace: boolean;
  showProductUnavailableInApp: boolean;
  sitefActive: boolean;
  sitefMerchantId: string;
  sitefMerchantKey: string;
  softcomPayActive: boolean;
  softcomPayClientId: string;
  softcomPayClientSecret: string;
  softcomPayKeyAliasId: string | null;

  address: {
    street: string;
    streetNumber: string;
    complement: string;
    neighborhood: string;
    city: string;
    cityCode: string;
    state: string;
    country: string;
    postalCode: string;
    reference: string;
    latitude: number;
    longitude: number;
  };

  marketSegment: {
    code: string;
    name: string;
    iconPath: string;
  };

  settings: {
    deliveryTimeMin: number;
    deliveryTimeMax: number;
    deliveryFeeMin: number;
    integrationApp: boolean;
    orderCpfIsRequired: boolean;
    variationsGrid: boolean;
    cardInstallmentsMax: number;
    cardInstallmentsMinValue: number;
    marketplace: boolean;
    showProductUnavailableInApp: boolean;
    timeZone: number;

    sitef: {
      active: boolean;
      merchantId: string;
      merchantKey: string;
    };

    softcomPay: {
      active: boolean;
      clientId: string;
      clientSecret: string;
      keyAliasId: string | null;
    };

    softcomShip: {
      active: boolean;
      clientId: string;
      clientSecret: string;
    };

    vendaMais: {
      active: boolean;
      companyId: string;
    };
  };

  ratings: {
    average: number;
    number: number;
  };

  availability: 'AVAILABLE' | 'UNAVAILABLE';

  deliveryMethods: {
    id: string;
    method: string;
    description: string;
    instructions: string;
    orderMinimumValue: number;
  }[];

  deliveryAreas: any[]; // Defina melhor se tiver estrutura

  payments: {
    id: string;
    code: string;
    description: string;
    prepaid: boolean;
    iconPath: string;
    active: boolean;
  }[];
}

export interface IMCGetCategorias {
  merchantId: string;
  id: string;
  code: string;
  name: string;
  priority: number;
  availability: 'AVAILABLE' | 'UNAVAILABLE';
  byIntegration: boolean;
  products: [];
}

export interface IMCGetProdutos {
  merchantId: string;
  categoryId: string;
  id: string;
  code: string;
  ean: string;
  priority: number;
  name: string;
  description: string;
  price: number;
  availability: 'AVAILABLE' | 'UNAVAILABLE';
  availabilityOrigin: 'AVAILABLE' | 'UNAVAILABLE';
  measure: string;
  merchantSuggestion: boolean;
  byIntegration: boolean;
  isPromotion: boolean;
  promotion: null;
  stock: {
    active: boolean;
    current: number;
    min: number;
    orderMax: number;
  };
  ship: {
    active: boolean;
    height: number;
    width: number;
    length: number;
    weight: number;
  };
  images: {
    id: string;
    default: boolean;
    description: string;
    path: string;
  }[];
  variationsGrid: boolean;
  variations: [];
}

export interface IMCGetProdutoVariacao {
  merchantId: string;
  categoryId: string;
  id: string;
  code: string;
  ean: string | null;
  priority: number;
  name: string;
  description: string;
  price: number;
  availability: 'AVAILABLE' | 'UNAVAILABLE';
  availabilityOrigin: 'AVAILABLE' | 'UNAVAILABLE';
  measure: string;
  merchantSuggestion: boolean;
  byIntegration: boolean;
  isPromotion: boolean;
  promotion: any | null;
  stock: {
    active: boolean;
    current: number;
    min: number;
    orderMax: number;
  };
  ship: {
    active: boolean;
    height: number;
    width: number;
    length: number;
    weight: number;
  };
  images: {
    id: string;
    default: boolean;
    description: string;
    path: string;
  }[];
  variationsGrid: boolean;
  variations: {
    productId: string;
    id: string;
    name: string;
    required: boolean;
    itemsMin: number;
    itemsMax: number;
    colorHex: string | null;
    priority: number;
    availability: 'AVAILABLE' | 'UNAVAILABLE';
    calcType: string;
    items: {
      variationId: string;
      id: string;
      code: string;
      ean: string | null;
      name: string;
      description: string;
      value: number;
      colorHex: string | null;
      availability: 'AVAILABLE' | 'UNAVAILABLE';
      priority: number;
      stock: {
        active: boolean;
        current: number;
        min: number;
      };
    }[];
  }[];
}

export interface IMCGetProdutoVariacaoResponse {
  productId: string;
  id: string;
  name: string;
  required: boolean;
  itemsMin: number;
  itemsMax: number;
  colorHex: string | null;
  priority: number;
  availability: 'AVAILABLE' | 'UNAVAILABLE';
  calcType: string;
  items: {
    variationId: string;
    id: string;
    code: string;
    ean: string | null;
    name: string;
    description: string;
    value: number;
    colorHex: string | null;
    availability: 'AVAILABLE' | 'UNAVAILABLE';
    priority: number;
    stock: {
      active: boolean;
      current: number;
      min: number;
    };
  }[];
}

export interface IMCAddImgPorUrl {
  id: string;
  default: boolean;
  description: string;
  path: string;
}

export interface IMCCriarCategoria {
  merchantId: string;
  name: string;
  code: string;
}

export interface IMCCriarProduto {
  categoryId: string;
  merchantId: string;
  name: string;
  code: string;
  description: string;
  price: number;
}

export interface IMCCriarVariacaoCabecalho {
  name: string;
  required: boolean;
  itemsMin: number;
  itemsMax: number;
}

export interface IMCCriarVariacaoCabecalhoResponse {
  productId: string;
  id: string;
  name: string;
  required: boolean;
  itemsMin: number;
  itemsMax: number;
  colorHex: string | null;
  priority: number;
  availability: 'AVAILABLE' | 'UNAVAILABLE';
  calcType: string;
  items: [];
}

export interface IMCCriarVariacaoItem {
  name: string;
  code: string;
  description: string;
  value: number;
}

export interface IMCCriarVariacaoItemResponse {
  variationId: string;
  id: string;
  code: string;
  ean: string | null;
  name: string;
  description: string;
  value: number;
  colorHex: string | null;
  availability: 'AVAILABLE' | 'UNAVAILABLE';
  priority: number;
  stock: {
    active: boolean;
    current: number;
    min: number;
  };
}

export interface IAutenticar {
  token: string;
  expiresAt: number;
}

export interface IGetUsuario {
  merchantId: string;
}

export interface IGetEmpresa {
  nome: string;
  cnpj: string;
}
