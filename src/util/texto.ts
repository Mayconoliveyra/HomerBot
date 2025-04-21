import crypto from 'crypto';

import { Util } from '.';

/**
 * Trunca um texto para um número máximo de caracteres, garantindo que a saída tenha exatamente o limite especificado.
 * Se `adicionarReticencias` for `true`, os "..." contarão dentro do limite.
 *
 * @param texto - O texto a ser truncado.
 * @param limite - O número máximo de caracteres permitido.
 * @param adicionarReticencias - Se `true`, adiciona "..." ao final do texto, contando dentro do limite.
 * @returns O texto truncado ou `null` se o texto for inválido.
 *
 * @example
 * truncarTexto("Softcomhubs é incrível!", 10, false); // "Softcomhub"
 * truncarTexto("Softcomhubs é incrível!", 10, true);  // "Softco..."
 * truncarTexto("123456789123456", 15, false);         // "123456789123456"
 * truncarTexto("1234567891234567890", 15, true);      // "123456789123..."
 */
const truncarTexto = (texto: string | null | undefined, limite: number, adicionarReticencias = false): string | null => {
  if (!texto) return null;

  // Se o texto já for menor ou igual ao limite, retorna ele mesmo
  if (texto.length <= limite) return texto;

  // Determina o espaço disponível para o texto antes das reticências
  const ajusteLimite = adicionarReticencias ? limite - 3 : limite;

  return texto.substring(0, ajusteLimite) + (adicionarReticencias ? '...' : '');
};

/**
 * Verifica se um texto possui exatamente a quantidade esperada de caracteres.
 *
 * @param texto - O texto a ser analisado.
 * @param quantidadeEsperada - O número exato de caracteres esperado.
 * @returns `true` se o texto tiver exatamente a quantidade esperada de caracteres, `false` caso contrário.
 *
 * @example
 * ehTamanhoExato("Softcomhubs", 12); // true
 * ehTamanhoExato("123456789", 9);    // true
 * ehTamanhoExato("12345678", 9);     // false
 * ehTamanhoExato(null, 5);           // false
 * ehTamanhoExato(undefined, 5);      // false
 */
const ehTamanhoExato = (texto: string | null | undefined, quantidadeEsperada: number): boolean => {
  if (!texto) return false;
  return texto.length === quantidadeEsperada;
};

/**
 * Trata um valor como string, retornando `undefined` se não for string válida.
 * @param valor Valor a ser tratado
 * @returns string tratada ou undefined
 */
export const tratarComoString = (valor: unknown): string | undefined => {
  try {
    if (typeof valor === 'string') {
      return valor.trim();
    }

    if (typeof valor === 'number' || typeof valor === 'boolean' || typeof valor === 'bigint' || typeof valor === 'symbol') {
      return String(valor).trim();
    }

    // Se for objeto que pode ter .toString()
    if (valor !== null && typeof valor === 'object' && typeof (valor as any).toString === 'function') {
      return (valor as any).toString().trim();
    }

    return undefined;
  } catch (error) {
    Util.Log.error('[tratarComoString] Erro ao converter valor para string:', error);
    return undefined;
  }
};

/**
 * Trata um valor como número, retornando `undefined` se não for numérico.
 * @param valor Valor a ser tratado
 * @returns número tratado ou undefined
 */
export const tratarComoNumero = (valor: unknown, casasDecimais = 2): number | undefined => {
  try {
    let numero: number | undefined;

    if (typeof valor === 'number') {
      numero = valor;
    } else if (typeof valor === 'string') {
      const valorLimpo = valor
        .trim()
        .replace(/\s/g, '') // remove espaços
        .replace(/,/g, '') // remove vírgulas de milhar
        .replace(/[^\d.-]/g, ''); // remove tudo que não é número, ponto ou traço

      numero = Number(valorLimpo);
    } else if (
      typeof valor === 'boolean' ||
      typeof valor === 'bigint' ||
      (valor !== null && typeof valor === 'object' && typeof (valor as any).toString === 'function')
    ) {
      numero = Number((valor as any).toString());
    }

    if (numero === undefined || isNaN(numero)) return undefined;

    const fator = Math.pow(10, casasDecimais);
    return Math.round(numero * fator) / fator;
  } catch (error) {
    Util.Log.error('[tratarComoNumero] Erro ao converter valor para número:', error);
    return undefined;
  }
};

/**
 * Trata um valor como boolean, aceitando string 'true'/'false' ou boolean direto.
 * @param valor Valor a ser tratado
 * @returns boolean tratado ou undefined
 */
const tratarComoBoolean = (valor: unknown): boolean | undefined => {
  if (typeof valor === 'boolean') return valor;
  if (valor === 'true') return true;
  if (valor === 'false') return false;
  return undefined;
};

const formatarParaTextoSimples = (texto: string) => {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .toLowerCase()
    .replace(/[^\w\s]/gi, '') // Remove caracteres especiais
    .replace(/\s+/g, ' ') // Remove múltiplos espaços
    .trim();
};

function gerarHashTexto(nome: string): string {
  const nomeNormalizado = formatarParaTextoSimples(nome);
  return crypto.createHash('md5').update(nomeNormalizado).digest('hex');
}

// Exportando as funções dentro de um objeto Texto para facilitar a importação e organização.
export const Texto = { truncarTexto, ehTamanhoExato, tratarComoString, tratarComoNumero, tratarComoBoolean, formatarParaTextoSimples, gerarHashTexto };
