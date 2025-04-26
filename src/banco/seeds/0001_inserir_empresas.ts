import { Knex } from 'knex';

import { ETableNames } from '../eTableNames';
const { NODE_ENV } = process.env;

export const seed = async (knex: Knex) => {
  if (NODE_ENV === 'production') return;

  const result = await knex(ETableNames.empresas).first();
  if (result) return;

  await knex(ETableNames.empresas)
    .insert([
      {
        id: 1,
        registro: '1',
        nome: 'EMPRESA TESTE',
        cnpj_cpf: '1',
        erp: 'SOFTCOMSHOP',
        ativo: true,
      },
      {
        id: 2,
        registro: '2',
        nome: 'EMPRESA TESTE 002',
        cnpj_cpf: '2',
        erp: 'SOFTCOMSHOP',
        ativo: true,
      },
      {
        id: 3,
        registro: '3',
        nome: 'EMPRESA TESTE 003',
        cnpj_cpf: '3',
        erp: 'SOFTCOMSHOP',
        ativo: true,
      },
      {
        id: 4,
        registro: '4',
        nome: 'EMPRESA TESTE 004',
        cnpj_cpf: '4',
        erp: 'SOFTCOMSHOP',
        ativo: true,
      },
      {
        id: 5,
        registro: '5',
        nome: 'EMPRESA TESTE 005',
        cnpj_cpf: '5',
        erp: 'SOFTCOMSHOP',
        ativo: false,
      },
    ])
    .then(() => {
      console.log(`# Inserido dados na tabela ${ETableNames.empresas}`);
    });
};
