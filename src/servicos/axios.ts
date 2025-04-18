// src/services/axios.ts
import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';

import { Util } from '../util';

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

// Instância padrão
export const defaultAxios: AxiosInstance = createAxiosInstance();

export const Axios = {
  createAxiosInstance,
  defaultAxios,
};
