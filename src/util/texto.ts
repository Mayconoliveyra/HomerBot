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
const tratarComoString = (valor: unknown): string | undefined => {
  return typeof valor === 'string' ? valor.trim() : undefined;
};

/**
 * Trata um valor como número, retornando `undefined` se não for numérico.
 * @param valor Valor a ser tratado
 * @returns número tratado ou undefined
 */
const tratarComoNumero = (valor: unknown): number | undefined => {
  const convertido = Number(valor);
  return isNaN(convertido) ? undefined : convertido;
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

// Exportando as funções dentro de um objeto Texto para facilitar a importação e organização.
export const Texto = { truncarTexto, ehTamanhoExato, tratarComoString, tratarComoNumero, tratarComoBoolean };
