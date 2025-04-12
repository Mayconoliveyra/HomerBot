import { AxiosError } from 'axios';
import fs from 'fs';
import path from 'path';
import winston from 'winston';

import { DataHora } from './dataHora';

// Diretório de logs
const logDir = path.join('log');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// Variável para armazenar a data atual
let currentDate = DataHora.obterDataAtual('DD-MM-YYYY');

// Criar transporte de arquivo atualizado
const getLogFileTransport = () => {
  const logFile = path.join(logDir, `log-${currentDate}.log`);
  return new winston.transports.File({ filename: logFile, level: 'info' });
};

// Criar o transporte inicial
let fileTransport = getLogFileTransport();

// Função para formatar erros
const formatError = (error: any, truncateStack = false) => {
  if (error instanceof AxiosError) {
    return {
      status: error?.response?.status || 'Sem status',
      message: error.message,
      method: error.config?.method?.toUpperCase() || 'Método desconhecido',
      url: error.config?.url || 'URL desconhecida',
      queryParams: error.config?.params || 'Sem parâmetros',
      requestBody: error.config?.data ? JSON.parse(error.config.data) : 'Sem corpo',
      responseData: error.response?.data || 'Nenhum dado retornado',
      headers: error.response?.headers || 'Sem headers',
      errorCode: error.code || 'Sem código de erro',
      stack: truncateStack && error.stack ? error.stack : error.stack,
    };
  } else if (error instanceof Error) {
    return {
      message: error.message,
      stack: truncateStack && error.stack ? error.stack : error.stack,
      name: error.name,
    };
  }
  return error;
};

// Formatar exibição no console e arquivo
const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.printf(({ timestamp, level, message }) => {
    const time = DataHora.formatarDataHora(String(timestamp), 'DD/MM/YYYY HH:mm:ss');
    const emoji = level === 'error' ? '🔴' : level === 'warn' ? '🟠' : '🟢';
    return `${emoji} ${time} [${level.toUpperCase()}]: ${message}`;
  }),
);

// Criar o logger
const logger = winston.createLogger({
  level: 'info',
  format: logFormat,
  transports: [new winston.transports.Console(), fileTransport],
});

// Verificar se a data mudou e atualizar o arquivo de log
const checkAndRotateLogFile = () => {
  const newDate = DataHora.obterDataAtual('DD-MM-YYYY');
  if (newDate !== currentDate) {
    currentDate = newDate;
    fileTransport = getLogFileTransport();
    logger.clear();
    logger.add(fileTransport);
  }
};

// Função de log genérica
const customLogger = (level: string, message: string, additional?: any) => {
  checkAndRotateLogFile(); // Verifica se o log precisa ser rotacionado

  let formattedMessage = message;
  let formattedAdditional;

  if (additional !== undefined) {
    if (additional instanceof Error || additional instanceof AxiosError) {
      formattedAdditional = JSON.stringify(formatError(additional, true), null, 2); // Truncado para console
      logger.log({ level, message: `${message}\n${JSON.stringify(formatError(additional, false), null, 2)}` }); // Completo para arquivo
    } else {
      formattedAdditional = typeof additional === 'object' ? JSON.stringify(additional, null, 2) : String(additional);
    }
    formattedMessage += `\n${formattedAdditional}`;
  }

  logger.log({ level, message: formattedMessage });
};

// Funções específicas de log
export const Log = {
  info: (message: string, additional?: any) => customLogger('info', message, additional),
  error: (message: string, additional?: any) => customLogger('error', message, additional),
  warn: (message: string, additional?: any) => customLogger('warn', message, additional),
  debug: (message: string, additional?: any) => customLogger('debug', message, additional),
};
