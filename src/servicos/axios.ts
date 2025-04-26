// src/services/axios.ts
import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';

import { Repositorios } from '../repositorios';

import { Util } from '../util';

import { Servicos } from '.';

const DEFAULT_TIMEOUT = 60 * 1000; // 60 segundos
const DEFAULT_TIMEOUT_MC = 60 * 1000; // 60 segundos
const DEFAULT_TIMEOUT_SS = 60 * 1000; // 60 segundos

// Interface para configurar novas instâncias
interface IAxiosInstanceParams {
  baseURL?: string;
  timeout?: number;
  headers?: Record<string, string>;
}

// Interceptor de resposta
const responseInterceptor = (response: AxiosResponse): AxiosResponse => {
  return response;
};

// Interceptor de erro
const errorInterceptor = (error: AxiosError): Promise<never> => {
  // Aqui você pode customizar o tratamento: exibir logs, throw custom error, etc.
  Util.Log.error('Erro na requisição Axios:', {
    url: error.config?.url,
    method: error.config?.method,
    message: error.message,
    response: error.response?.data,
  });

  return Promise.reject(error);
};

// Factory de instância de Axios
export const createAxiosInstance = ({ baseURL, timeout = DEFAULT_TIMEOUT, headers }: IAxiosInstanceParams = {}): AxiosInstance => {
  const instance = axios.create({
    baseURL,
    timeout,
    headers,
  });

  instance.interceptors.response.use(responseInterceptor, errorInterceptor);

  return instance;
};

const axiosMeuCarrinho = async (empresaId: number) => {
  try {
    const empresa = await Repositorios.Empresa.consultarPrimeiroRegistro([{ coluna: 'id', operador: '=', valor: empresaId }]);

    if (!empresa.sucesso) {
      return empresa.erro;
    }

    if (!empresa.dados.mc_usuario || !empresa.dados.mc_senha || !empresa.dados.mc_token) {
      return `Os parâmetros são obrigatórios: MC_USUARIO:${empresa.dados.mc_usuario}; MC_SENHA:${empresa.dados.mc_senha}; MC_TOKEN:${empresa.dados.mc_token};`;
    }

    const timeCurrent = Math.floor(Date.now() / 1000);
    if (timeCurrent > empresa.dados.mc_token_exp) {
      const resToken = await Servicos.MeuCarrinho.autenticar(empresa.dados.mc_usuario || '', empresa.dados.mc_senha || '');

      if (!resToken.sucesso) {
        return resToken.erro;
      }

      const resAtDados = await Repositorios.Empresa.atualizarDados(empresaId, {
        mc_token: resToken.dados.token,
        mc_token_exp: resToken.dados.expiresAt,
      });

      if (!resAtDados.sucesso) {
        return resAtDados.erro;
      }

      return Axios.createAxiosInstance({
        baseURL: 'https://api.meucarrinho.delivery',
        headers: { Authorization: `Bearer ${resToken.dados.token}`, 'Content-Type': 'application/json' },
        timeout: DEFAULT_TIMEOUT_MC,
      });
    }

    return Axios.createAxiosInstance({
      baseURL: 'https://api.meucarrinho.delivery',
      headers: { Authorization: `Bearer ${empresa.dados.mc_token || ''}`, 'Content-Type': 'application/json' },
      timeout: DEFAULT_TIMEOUT_MC,
    });
  } catch (error) {
    Util.Log.error(`[Meu Carrinho] | Erro ao criar ou atualizar instância axios.`, error);

    return Util.Msg.erroInesperado;
  }
};

const axiosSoftcomshop = async (empresaId: number) => {
  try {
    const empresa = await Repositorios.Empresa.consultarPrimeiroRegistro([{ coluna: 'id', operador: '=', valor: empresaId }]);

    if (!empresa.sucesso) {
      return empresa.erro;
    }

    if (!empresa.dados.ss_url || !empresa.dados.ss_client_id || !empresa.dados.ss_client_secret || !empresa.dados.ss_token) {
      return `Os parâmetros são obrigatórios: SS_URL:${empresa.dados.ss_url}; SS_CLIENT_ID:${empresa.dados.ss_client_id}; SS_CLIENT_SECRET:${empresa.dados.ss_client_secret} SS_TOKEN:${empresa.dados.ss_token};`;
    }

    const timeCurrent = Math.floor(Date.now() / 1000);
    if (timeCurrent > empresa.dados.ss_token_exp) {
      const resToken = await Servicos.SoftcomShop.criarToken(empresa.dados.ss_url, empresa.dados.ss_client_id, empresa.dados.ss_client_secret);

      if (!resToken.sucesso) {
        return resToken.erro;
      }

      const resAtDados = await Repositorios.Empresa.atualizarDados(empresaId, {
        ss_token: resToken.dados.token,
        ss_token_exp: resToken.dados.expiresAt,
      });

      if (!resAtDados.sucesso) {
        return resAtDados.erro;
      }

      return Axios.createAxiosInstance({
        baseURL: empresa.dados.ss_url,
        headers: { Authorization: `Bearer ${resToken.dados.token}`, 'Content-Type': 'application/json' },
        timeout: DEFAULT_TIMEOUT_SS,
      });
    }

    return Axios.createAxiosInstance({
      baseURL: empresa.dados.ss_url,
      headers: { Authorization: `Bearer ${empresa.dados.ss_token}`, 'Content-Type': 'application/json' },
      timeout: DEFAULT_TIMEOUT_SS,
    });
  } catch (error) {
    Util.Log.error(`[Softcomshop] | Erro ao criar ou atualizar instância axios.`, error);

    return Util.Msg.erroInesperado;
  }
};

// Instância padrão
export const defaultAxios: AxiosInstance = createAxiosInstance();

export const Axios = {
  createAxiosInstance,
  defaultAxios,
  axiosMeuCarrinho,
  axiosSoftcomshop,
};
