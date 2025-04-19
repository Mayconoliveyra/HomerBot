// src/services/axios.ts
import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';

import { Repositorios } from '../repositorios';

import { Util } from '../util';

import { Servicos } from '.';

const DEFAULT_TIMEOUT = 60 * 1000; // 60 segundos

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
    const empresa = await Repositorios.Empresa.buscarPorId(empresaId);

    if (!empresa) {
      return 'Empresa não encontrada.';
    }

    const timeCurrent = Math.floor(Date.now() / 1000);
    if (timeCurrent > empresa.mc_token_exp) {
      const resToken = await Servicos.MeuCarrinho.autenticar(empresa.mc_usuario || '', empresa.mc_senha || '');

      if (!resToken.sucesso || !resToken.dados) {
        return resToken.erro || Util.Msg.erroInesperado;
      }

      const resAtDados = await Repositorios.Empresa.atualizarDados(empresaId, {
        mc_token: resToken.dados.token,
        mc_token_exp: resToken.dados.expiresAt,
      });

      if (!resAtDados) {
        return Util.Msg.erroInesperado;
      }

      return Axios.createAxiosInstance({
        baseURL: 'https://api.meucarrinho.delivery',
        headers: { Authorization: `Bearer ${resToken.dados.token}`, 'Content-Type': 'application/json' },
      });
    }

    return Axios.createAxiosInstance({
      baseURL: 'https://api.meucarrinho.delivery',
      headers: { Authorization: `Bearer ${empresa.mc_token || ''}`, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    Util.Log.error(`[Meu Carrinho] | Erro ao criar/atualizar instância apiMc`, error);

    return Util.Msg.erroInesperado;
  }
};

// Instância padrão
export const defaultAxios: AxiosInstance = createAxiosInstance();

export const Axios = {
  createAxiosInstance,
  defaultAxios,
  axiosMeuCarrinho,
};
