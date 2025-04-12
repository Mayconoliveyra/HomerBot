import { Express } from 'express';
import fs from 'fs';
import morganBody from 'morgan-body';
import path from 'path';

import { Util } from '../util';

// Diretório de logs
const logDir = path.join('log');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// Variável para armazenar a data atual
let currentDate = Util.DataHora.obterDataAtual('DD-MM-YYYY');

// Função para obter o stream de log atualizado
const getLogStream = () => {
  return fs.createWriteStream(path.join(logDir, `express-${currentDate}.log`), { flags: 'a' });
};

// Criação do stream inicial
let logStream = getLogStream();

// Função para verificar se a data mudou e atualizar o stream de log
const checkAndRotateLogFile = () => {
  const newDate = Util.DataHora.obterDataAtual('DD-MM-YYYY');
  if (newDate !== currentDate) {
    currentDate = newDate;
    logStream.end(); // Fecha o stream atual antes de criar outro
    logStream = getLogStream(); // Cria um novo stream com a nova data
  }
};

const setupMorganBody = (app: Express) => {
  morganBody(app, {
    noColors: true,
    stream: {
      write: (message: string) => {
        checkAndRotateLogFile(); // Checa se precisa trocar o arquivo de log
        logStream.write(message);
        return true; // ✅ Retorno booleano esperado pelo stream.write
      },
    },
    prettify: true,
    filterParameters: ['token', 'auth_id', 'auth_secret', 'Authorization'],
  });
};

export const MorganConfig = { setupMorganBody };
