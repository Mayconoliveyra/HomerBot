import { existsSync, readdirSync, statSync, mkdirSync, copyFileSync } from 'fs';
import { mkdtempSync, rmSync } from 'fs-extra';
import { tmpdir } from 'os';
import path from 'path';
import puppeteer, { Page, Browser } from 'puppeteer';

import { Util } from '../util';

// Nome do provedor para logs
const PROVIDER_NAME = 'automations.puppeteer';

// Caminho base para o diretório _homer-bot
const homerBotDir = path.join(tmpdir(), '._homer-bot');

// Verifica se o diretório _homer-bot existe
if (existsSync(homerBotDir)) {
  // Remove o diretório e todo o seu conteúdo
  rmSync(homerBotDir, { recursive: true, force: true });
  Util.Log.info(`Diretório ${homerBotDir} removido com sucesso.`);
}

// Verifica se o diretório _homer-bot existe, caso contrário, cria
if (!existsSync(homerBotDir)) {
  mkdirSync(homerBotDir, { recursive: true });
  Util.Log.info(`Diretório ${homerBotDir} criado com sucesso.`);
}

const copiarDirIgnorandoEmUso = (source: string, destination: string): void => {
  const files = readdirSync(source);
  files.forEach((file) => {
    const srcPath = path.join(source, file);
    const destPath = path.join(destination, file);

    try {
      if (statSync(srcPath).isDirectory()) {
        mkdirSync(destPath, { recursive: true });
        copiarDirIgnorandoEmUso(srcPath, destPath);
      } else {
        copyFileSync(srcPath, destPath); // Copia arquivos
      }
    } catch (error: any) {
      if (error.code === 'EBUSY') {
        /* Util.Log.warn(`${PROVIDER_NAME}\nArquivo ocupado ignorado: ${srcPath}`); */
      } else {
        throw error;
      }
    }
  });
};

// Configurações padrão
const DEFAULTS = {
  headless: false,
  slowMo: 0,
  timeout: 1000 * 60 * 1, // 1 minuto
  userDataDir: 'C:/Dev/HomerBot/browser/user_data',
  executablePath: 'C:/Dev/HomerBot/browser/chrome_win/chrome.exe',
  extensionPath: 'C:/Dev/HomerBot/browser/2captcha',
};

// Cria uma instância do Puppeteer com configurações personalizadas
const pagina = async ({
  headless = DEFAULTS.headless,
  slowMo = DEFAULTS.slowMo,
}: {
  headless?: boolean;
  slowMo?: number;
}): Promise<{ page: Page; browser: Browser }> => {
  try {
    // Cria o diretório temporário dentro de _homer-bot
    const tempUserDataDir = mkdtempSync(path.join(homerBotDir, 'puppeteer-temp-'));

    // Copiar o conteúdo do diretório original para o temporário
    copiarDirIgnorandoEmUso(DEFAULTS.userDataDir, tempUserDataDir);
    Util.Log.info(`userDataDir: ${tempUserDataDir}`);

    const browser = await puppeteer.launch({
      headless,
      slowMo,
      executablePath: DEFAULTS.executablePath,
      userDataDir: tempUserDataDir,
      args: ['--no-sandbox', '--disable-setuid-sandbox', `--load-extension=${DEFAULTS.extensionPath}`, `--disable-extensions-except=${DEFAULTS.extensionPath}`],
    });

    // Abre uma nova aba específica
    const page = await browser.newPage();
    page.setDefaultTimeout(DEFAULTS.timeout);

    // Adicionar lógica para excluir o diretório temporário quando o browser fechar

    browser.on('disconnected', async () => {
      try {
        // Espera um breve período para garantir que todos os arquivos sejam liberados
        await aguardar(3000);
        rmSync(tempUserDataDir, { recursive: true, force: true });
        /* Util.Log.info(`${PROVIDER_NAME}\nDiretório temporário removido: ${userDataDir}`); */
      } catch (err: any) {
        Util.Log.error(`${PROVIDER_NAME}\nErro ao remover diretório temporário: ${err.message}`);
      }
    });

    return { browser, page };
  } catch (error: any) {
    Util.Log.error(`${PROVIDER_NAME}\nErro ao inicializar Puppeteer: ${error.message}`);
    throw new Error('Falha ao criar instância do Puppeteer');
  }
};

// Pausa a execução por um período
const aguardar = (ms = 3000): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

// Extrai o próximo valor após o valor atual em uma mensagem
const extrairValorSeguinte = (message: string, currentValue: string): string | null => {
  const parts = message.trim().split(/\s+/);
  const index = parts.indexOf(currentValue);
  return index !== -1 && index + 1 < parts.length ? parts[index + 1] : null;
};

// Extrai o valor de uma chave específica em uma mensagem formatada
const extrairValorPorChave = (message: string, key: string) => {
  const lines = message.split('\n'); // Divide o conteúdo em linhas
  for (const line of lines) {
    const trimmedLine = line.trim(); // Remove espaços em branco no início e no final da linha
    if (trimmedLine.startsWith(key)) {
      const parts = trimmedLine.split(':');
      return parts[1]?.trim() || null; // Retorna o valor após o ":", removendo espaços extras
    }
  }
  return null; // Retorna null se a chave não for encontrada
};

// Aguarda e captura o primeiro seletor disponível
const capturarPrimeiroSeletor = async (page: Page, selectors: string[], timeout: number = DEFAULTS.timeout): Promise<string | null> => {
  try {
    const element = await page.waitForFunction((...selectors) => selectors.map((s) => document.querySelector(s)).find(Boolean), { timeout }, ...selectors);

    if (!element) return null;

    return await page.evaluate((el, selectors) => selectors.find((s) => el?.matches(s)) || null, element, selectors);
  } catch (error: any) {
    if (error.name === 'TimeoutError') {
      Util.Log.error(`${PROVIDER_NAME} | Timeout ao capturar seletores: ${selectors.join(', ')}`);
    } else {
      Util.Log.error(`${PROVIDER_NAME} | Erro ao capturar seletor: ${error.message}`);
    }
    return null;
  }
};

// Monitora seletor na página e executa callback ao encontrá-lo
const monitorarSeletor = (
  page: Page,
  selector: string,
  callback: () => Promise<void>,
  continueMonitoringAfterDisappear = false,
  checkInterval = 2000,
): void => {
  let isMonitoring = true;
  let isSelectorFound = false;

  const stopMonitoring = () => {
    isMonitoring = false;
    Util.Log.info(`${PROVIDER_NAME} | Monitoramento encerrado.`);
  };

  const checkSelector = async () => {
    if (!isMonitoring) return;

    try {
      const element = await page.$(selector);
      if (element && !isSelectorFound) {
        isSelectorFound = true;
        await callback();
        if (!continueMonitoringAfterDisappear) stopMonitoring();
      } else if (!element && isSelectorFound && continueMonitoringAfterDisappear) {
        isSelectorFound = false;
      }
    } catch (error: any) {
      if (error.message.includes('Execution context was destroyed')) {
        Util.Log.warn(`${PROVIDER_NAME} | Contexto destruído, reiniciando monitoramento.`);
      } else {
        Util.Log.error(`${PROVIDER_NAME} | Erro ao monitorar seletor: ${error.message}`);
      }
    }
  };

  setInterval(checkSelector, checkInterval);
};

// Aguarda e clica em um seletor
const aguardarEClicar = async (page: Page, selector: string, timeout: number = DEFAULTS.timeout): Promise<boolean> => {
  try {
    await page.waitForSelector(selector, { timeout });
    await page.click(selector);
    Util.Log.info(`${PROVIDER_NAME} | Clique realizado com sucesso no seletor: ${selector}`);
    return true;
  } catch (error: any) {
    Util.Log.error(`${PROVIDER_NAME} | Erro ao clicar no seletor: ${selector} | ${error.message}`);
    return false;
  }
};

// Aguarda e digita em um seletor
const aguardarEDigitar = async (page: Page, selector: string, text: string, timeout: number = DEFAULTS.timeout): Promise<boolean> => {
  try {
    await page.waitForSelector(selector, { timeout });
    await page.type(selector, text);
    Util.Log.info(`${PROVIDER_NAME} | Texto digitado com sucesso no seletor: ${selector}`);
    return true;
  } catch (error: any) {
    Util.Log.error(`${PROVIDER_NAME} | Erro ao digitar no seletor: ${selector} | ${error.message}`);
    return false;
  }
};

// Exporta funções reutilizáveis
export const Puppeteer = {
  pagina,
  aguardar,
  extrairValorSeguinte,
  extrairValorPorChave,
  capturarPrimeiroSeletor,
  monitorarSeletor,
  aguardarEClicar,
  aguardarEDigitar,
};
