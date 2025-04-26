import { Util } from '.';

function ehObjetoValido<T extends object>(objeto: T, colunasIgnoradas: Array<keyof T> = []): boolean {
  try {
    return Object.entries(objeto).every(([chave, valor]) => {
      if (colunasIgnoradas.includes(chave as keyof T)) return true;

      return valor !== null && valor !== '' && valor !== undefined;
    });
  } catch (error) {
    Util.Log.error('[ehObjetoValido] Erro ao validar objeto:', error);
    return false;
  }
}

// Função auxiliar para aguardar um intervalo
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const Outros = { ehObjetoValido, delay };
