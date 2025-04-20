import qs from 'qs';

import { Axios } from '../servicos/axios';

import { Util } from '../util';

import { IRetornoServico } from './types/padroes';
import { ICriarDispositivo, ICriarToken, ISSCriarDispositivo, ISSResponseBase, ISSCriarToken, ISSGetProdutos } from './types/softcomshop';

const MODULO = '[Softcomshop]';

const criarDispositivo = async (erp_url: string): Promise<IRetornoServico<ICriarDispositivo>> => {
  try {
    const url = new URL(erp_url);

    const client_id = url.searchParams.get('client_id');
    const device_name = url.searchParams.get('device_name');

    if (!client_id || !device_name) {
      return {
        sucesso: false,
        dados: null,
        erro: 'Parâmetros obrigatórios ausentes na URL (client_id ou device_name)',
      };
    }

    const data = qs.stringify({
      client_id,
      device_id: device_name,
    });

    const response = await Axios.defaultAxios.post<ISSResponseBase<ISSCriarDispositivo>>(url.origin + url.pathname, data, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      maxBodyLength: Infinity,
    });

    if (response.data.code !== 1) {
      return {
        sucesso: false,
        dados: null,
        erro: response.data.human || 'Erro ao gerar dispositivo.',
      };
    }

    const dadosFormat = {
      url_base: response.data.data.resources.url_base,
      client_id: response.data.data.client_id,
      client_secret: response.data.data.client_secret,
      empresa_cnpj: response.data.data.empresa_cnpj,
      empresa_fantasia: response.data.data.empresa_fantasia,
    };

    return {
      sucesso: true,
      dados: dadosFormat,
      erro: null,
    };
  } catch (error: any) {
    Util.Log.error(`${MODULO} | Erro ao criar dispositivo | URL: ${erp_url}`, error);

    return {
      sucesso: false,
      dados: null,
      erro: Util.Msg.erroInesperado,
    };
  }
};

const criarToken = async (base_url: string, client_id: string, client_secret: string): Promise<IRetornoServico<ICriarToken>> => {
  try {
    const data = qs.stringify({
      grant_type: 'client_credentials',
      client_id,
      client_secret,
    });

    const response = await Axios.defaultAxios.post<ISSResponseBase<ISSCriarToken>>(`${base_url}/authentication/token`, data, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    if (response.data.code !== 1) {
      return {
        sucesso: false,
        dados: null,
        erro: response.data.human || 'Erro ao gerar token.',
      };
    }

    const expiresIn = response.data.data.expires_in; // segundos
    const expiresAt = Math.floor(Date.now() / 1000) + expiresIn;

    const dadosFormat = {
      token: response.data.data.token,
      expiresAt: expiresAt,
    };

    return {
      sucesso: true,
      dados: dadosFormat,
      erro: null,
    };
  } catch (error: any) {
    Util.Log.error(`${MODULO} | Erro ao gerar token | Client: ${client_id}`, error);

    return {
      sucesso: false,
      dados: null,
      erro: Util.Msg.erroInesperado,
    };
  }
};

const getProdutos = async (empresaId: number): Promise<IRetornoServico<ISSGetProdutos[]>> => {
  try {
    const apiAxiosSS = await Axios.axiosSoftcomshop(empresaId);
    if (typeof apiAxiosSS === 'string') {
      return {
        sucesso: false,
        dados: null,
        erro: apiAxiosSS,
      };
    }
    const result: ISSGetProdutos[] = [];

    let page = 1;
    let countPages = 1;
    let hasMore = true;

    while (hasMore) {
      const response = await apiAxiosSS.get<ISSResponseBase<ISSGetProdutos[]>>(`/api/produtos/produtos/page/${page}`);

      if (response.data.code !== 1) {
        return {
          sucesso: false,
          dados: null,
          erro: response.data.human || 'Erro ao consultar produtos',
        };
      }

      const produtos = response.data.data;
      const currentPage = response.data.meta.page.current;
      countPages = response.data.meta.page.count;

      result.push(...produtos);

      if (currentPage !== countPages) {
        page += 1;
      } else {
        hasMore = false;
      }
    }

    return {
      sucesso: true,
      dados: result,
      erro: null,
    };
  } catch (error) {
    Util.Log.error(`${MODULO} | Erro ao consultar produtos.`, error);

    return {
      sucesso: false,
      dados: null,
      erro: Util.Msg.erroInesperado,
    };
  }
};

export const SoftcomShop = {
  criarDispositivo,
  criarToken,
  getProdutos,
};
