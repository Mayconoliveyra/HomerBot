import moment from 'moment';

/**
 * Tipos de formatos suportados para formatação de datas e horas.
 */
type TFormatoDataHora =
  | 'YYYY-MM-DD HH:mm:ss' // Padrão completo (Data + Hora) → Ex: "2025-03-08 14:30:45"
  | 'YYYY-MM-DD' // Somente Data → Ex: "2025-03-08"
  | 'DD/MM/YYYY' // Data no formato brasileiro → Ex: "08/03/2025"
  | 'HH:mm:ss' // Somente Hora → Ex: "14:30:45"
  | 'HH:mm:00' // Hora:minutos e segundos fixo 00 → Ex: "14:30:00"
  | 'YYYY-MM-DDTHH:mm:ssZ' // Formato ISO 8601 → Ex: "2025-03-08T14:30:45Z"
  | 'MMMM Do YYYY, h:mm:ss a' // Formato longo → Ex: "March 8th 2025, 2:30:45 pm"
  | 'ddd, hA' // Dia abreviado e hora AM/PM → Ex: "Sat, 2PM"
  | 'DD-MM-YYYY' // Data no formato "DD-MM-YYYY" → Ex: "08-03-2025"
  | 'DD/MM/YY HH:mm'
  | 'DD/MM/YYYY HH:mm:ss'; // Data + Hora no formato brasileiro → Ex: "08/03/2025 14:30:45"

// Configuração global do Moment.js para definir o idioma padrão
moment.locale('pt-br');

/**
 * Formata uma data para um dos formatos predefinidos.
 * @param data - Data a ser formatada (string ou Date). Se não for fornecida, usa a data atual.
 * @param formato - Formato de saída conforme definido em `TFormatoDataHora`.
 * @returns Data formatada como string.
 */
const formatarDataHora = (data?: string | Date, formato: TFormatoDataHora = 'YYYY-MM-DD HH:mm:ss'): string => {
  if (!data) return moment().format(formato);
  return moment(data).format(formato);
};

/**
 * Retorna a data e hora atual no formato especificado.
 * @param formato - Formato da data/hora conforme `TFormatoDataHora`.
 * @returns Data atual formatada como string.
 */
const obterDataAtual = (formato: TFormatoDataHora = 'YYYY-MM-DD HH:mm:ss'): string => {
  return moment().format(formato);
};

/**
 * Retorna o timestamp Unix atual (número de segundos desde 01/01/1970).
 * @returns Timestamp Unix como número.
 */
const obterTimestampAtual = (): number => {
  return moment().unix();
};

/**
 * Verifica se uma data é anterior a outra.
 * @param data1 - Primeira data a ser comparada.
 * @param data2 - Segunda data a ser comparada.
 * @returns `true` se `data1` for antes de `data2`, senão `false`.
 */
const isAntes = (data1: string | Date, data2: string | Date): boolean => {
  return moment(data1).isBefore(moment(data2));
};

/**
 * Verifica se uma data é posterior a outra.
 * @param data1 - Primeira data a ser comparada.
 * @param data2 - Segunda data a ser comparada.
 * @returns `true` se `data1` for depois de `data2`, senão `false`.
 */
const isDepois = (data1: string | Date, data2: string | Date): boolean => {
  return moment(data1).isAfter(moment(data2));
};

/**
 * Verifica se duas datas são do mesmo dia.
 * @param data1 - Primeira data.
 * @param data2 - Segunda data.
 * @returns `true` se ambas as datas forem no mesmo dia, senão `false`.
 */
const isMesmoDia = (data1: string | Date, data2: string | Date): boolean => {
  return moment(data1).isSame(moment(data2), 'day');
};

/**
 * Obtém o índice do dia da semana de uma data.
 * @param data - Data no formato `string` ou `Date`.
 * @returns Índice do dia da semana (0 = Domingo, 6 = Sábado).
 */
const obterDiaSemana = (data: string | Date): number => {
  return moment(data, 'YYYY-MM-DD').day();
};

/**
 * Adiciona um número específico de dias a uma data e a formata.
 * @param data - Data base para a operação.
 * @param quantidade - Número de dias a adicionar (pode ser negativo para subtrair).
 * @param formato - Formato da saída conforme `TFormatoDataHora`.
 * @returns Nova data formatada como string.
 */
const adicionarDias = (data: string | Date, quantidade: number, formato: TFormatoDataHora = 'YYYY-MM-DD'): string => {
  return moment(data).add(quantidade, 'days').format(formato);
};

const gerarTimestampMM = (minutosMin: number, minutosMax: number, erroTentativas?: 0 | 1 | 2 | 3): number => {
  const agora = obterTimestampAtual();
  const segundosMin = minutosMin * 60;
  const segundosMax = minutosMax * 60;

  const incrementoAleatorio = Math.floor(Math.random() * (segundosMax - segundosMin + 1)) + segundosMin;
  let timestampFinal = agora + incrementoAleatorio;

  // Se for erro, ajusta apenas os últimos 2 dígitos (1 → ...01, 2 → ...02, 3 → ...03)
  if (erroTentativas && erroTentativas >= 1 && erroTentativas <= 3) {
    timestampFinal = Math.floor(timestampFinal / 100) * 100 + erroTentativas; // 🔹 Substitui os últimos 2 dígitos
  }

  return timestampFinal;
};

const getErroTentativaMM = (timestamp: number): 1 | 2 | 3 | 0 => {
  const ultimosDigitos = timestamp % 100; // Pega os últimos 2 dígitos do timestamp

  if (ultimosDigitos >= 1 && ultimosDigitos <= 3) {
    return ultimosDigitos as 1 | 2 | 3; // Retorna o número da tentativa de erro (1 a 3)
  }

  return 0; // Se não for um timestamp de erro, retorna 0
};

// Função que converte uma data no formato "YYYY-MM-DD HH:mm:ss" para timestamp (milissegundos)
const converterDataParaTimestamp = (data: string): number => {
  return moment(data, 'YYYY-MM-DD HH:mm:ss').unix();
};

export const DataHora = {
  formatarDataHora,
  obterDataAtual,
  obterTimestampAtual,
  isAntes,
  isDepois,
  isMesmoDia,
  obterDiaSemana,
  adicionarDias,
  gerarTimestampMM,
  getErroTentativaMM,
  converterDataParaTimestamp,
};
