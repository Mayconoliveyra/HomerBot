import { randomUUID } from 'crypto';

/* NUNCA ALTERAR ESSA REGEX. ELA ESTÁ SENDO UTILIZADA NA HORA DE CRIAR AS TABELAS COM ID UUID */
const regexUuidV4 = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;
const regexUuidV4String = '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$'; // String para o Knex

// Função para gerar um UUID v4 válido
const gerar = (): string => {
  return randomUUID();
};

const uuidV4Test = (value: string | undefined) => {
  if (!value) return false;
  return regexUuidV4.test(value);
};

export const UuidV4 = { regexUuidV4, regexUuidV4String, uuidV4Test, gerar };
