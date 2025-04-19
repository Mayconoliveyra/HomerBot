import { Axios } from '../servicos/axios';
import { IAutenticar, IGetEmpresa, IGetUsuario, IMCAutenticar, IMCErroValidacao, IMCGetEmpresa, IMCGetUsuario } from '../servicos/types/meuCarrinho';
import { IRetornoServico } from '../servicos/types/padroes';

import { Util } from '../util';

const BASE_URL_MC = 'https://api.meucarrinho.delivery';

const MODULO = '[Meu Carrinho]';

const formatarErroValidacao = (erro: any): string => {
  try {
    const responseData = erro?.response?.data as IMCErroValidacao;

    // Se for estrutura conhecida de validação
    if (responseData?.errors && typeof responseData.errors === 'object') {
      return Object.entries(responseData.errors)
        .map(([campo, mensagens]) => `${campo.toUpperCase()}: ${(mensagens as string[]).join(', ')}`)
        .join('; ');
    }

    // Se tiver título de erro HTTP padrão
    if (responseData?.title) return responseData.title;

    // Fallback
    return 'Erro desconhecido ao processar a requisição.';
  } catch (err) {
    return 'Erro inesperado ao tratar erro.';
  }
};

const autenticar = async (usuario: string, senha: string): Promise<IRetornoServico<IAutenticar>> => {
  try {
    const response = await Axios.defaultAxios.post<IMCAutenticar>(`${BASE_URL_MC}/auth/token`, {
      username: usuario,
      password: senha,
    });

    if (response?.data?.token && response?.data?.expiresIn) {
      // O token do meu carrinho expira em 4horas = "expiresIn: 14400" = 14400s
      // Logo, na minha aplicação era vai expirar em 3horas, isso evita erros na hora de fazer requisição.
      const newExpToken = Math.floor(Date.now() / 1000) + 3 * 60 * 60;

      return {
        sucesso: true,
        dados: { token: response.data.token, expiresAt: newExpToken },
        erro: null,
      };
    }

    throw response;
  } catch (error: any) {
    Util.Log.error(`${MODULO} | Erro ao autenticar usuário`, error);
    const erroTratado = formatarErroValidacao(error);

    return {
      sucesso: false,
      dados: null,
      erro: erroTratado,
    };
  }
};

const getUsuario = async (token: string): Promise<IRetornoServico<IGetUsuario>> => {
  try {
    const response = await Axios.defaultAxios.get<IMCGetUsuario>(`${BASE_URL_MC}/auth/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response?.data?.id) {
      return {
        sucesso: true,
        dados: { merchantId: response.data.id },
        erro: null,
      };
    }

    throw response;
  } catch (error: any) {
    Util.Log.error(`${MODULO} | Erro ao consultar dados do usuário`, error);
    const erroTratado = formatarErroValidacao(error);

    return {
      sucesso: false,
      dados: null,
      erro: erroTratado,
    };
  }
};

const getEmpresa = async (token: string, merchantId: string): Promise<IRetornoServico<IGetEmpresa>> => {
  try {
    const response = await Axios.defaultAxios.get<IMCGetEmpresa>(`${BASE_URL_MC}/merchants/${merchantId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response?.data?.id) {
      return {
        sucesso: true,
        dados: { nome: response.data.name || '', cnpj: response.data.cnpj || '' },
        erro: null,
      };
    }

    throw response;
  } catch (error: any) {
    Util.Log.error(`${MODULO} | Erro ao consultar dados da empresa`, error);
    const erroTratado = formatarErroValidacao(error);

    return {
      sucesso: false,
      dados: null,
      erro: erroTratado,
    };
  }
};

export const MeuCarrinho = {
  autenticar,
  getUsuario,
  getEmpresa,
};
