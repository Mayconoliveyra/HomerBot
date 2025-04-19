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

  availability: any[]; // Defina melhor se tiver estrutura

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
