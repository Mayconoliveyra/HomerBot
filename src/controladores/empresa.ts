import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as yup from 'yup';

import { Middlewares } from '../middlewares';

import { Repositorios } from '../repositorios';

interface IQueryProps {
  pagina?: number;
  limite?: number;
  filtro?: string;
  ordenarPor?: string;
  ordem?: string;
}
export type IBodyCadastrarProps = {
  registro: string;
  nome: string;
  cnpj_cpf: string;
  erp: 'SOFTSHOP' | 'SOFTCOMSHOP';
};
export type IBodyEditarProps = {
  nome: string;
  cnpj_cpf: string;
  erp: 'SOFTSHOP' | 'SOFTCOMSHOP';
  ativo: boolean;
};

const formatarCpfCnpj = (valor: string): string => {
  if (valor.length === 11) {
    // Formata CPF: 000.000.000-00
    return valor.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  } else if (valor.length === 14) {
    // Formata CNPJ: 00.000.000/0000-00
    return valor.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  } else {
    return valor; // Se não for CPF nem CNPJ, retorna do jeito que está
  }
};
const isCpfOrCnpj = (valor: string): boolean => {
  if (!valor) return false;

  const onlyNumbers = valor.replace(/\D/g, '');

  return onlyNumbers.length === 11 || onlyNumbers.length === 14;
};

const cadastrarValidacao = Middlewares.validacao((getSchema) => ({
  body: getSchema<IBodyCadastrarProps>(
    yup.object().shape({
      registro: yup.string().required().trim().max(50),
      nome: yup.string().required().trim().max(255),
      cnpj_cpf: yup
        .string()
        .required()
        .trim()
        .test('cpf-cnpj', 'CPF ou CNPJ inválido', (valor) => !!valor && isCpfOrCnpj(valor)),
      erp: yup.string().oneOf(['SOFTSHOP', 'SOFTCOMSHOP']).required(),
    }),
  ),
}));
const consultarValidacao = Middlewares.validacao((getSchema) => ({
  query: getSchema<IQueryProps>(
    yup.object().shape({
      pagina: yup.number().integer().moreThan(0).default(1),
      limite: yup.number().integer().moreThan(0).max(500).default(10),
      filtro: yup.string().max(255).optional(),
      ordenarPor: yup.string().max(100).optional().default('nome'),
      ordem: yup.string().max(100).optional().default('asc'),
    }),
  ),
}));
const consultarPorIdValidacao = Middlewares.validacao((getSchema) => ({
  params: getSchema<{ empresaId: number }>(
    yup.object().shape({
      empresaId: yup.number().integer().required(),
    }),
  ),
}));
const editarValidacao = Middlewares.validacao((getSchema) => ({
  params: getSchema<{ empresaId: number }>(
    yup.object().shape({
      empresaId: yup.number().integer().required(),
    }),
  ),
  body: getSchema<IBodyEditarProps>(
    yup.object().shape({
      nome: yup.string().required().trim().max(255),
      cnpj_cpf: yup
        .string()
        .required()
        .trim()
        .test('cpf-cnpj', 'CPF ou CNPJ inválido', (valor) => !!valor && isCpfOrCnpj(valor)),
      erp: yup.string().oneOf(['SOFTSHOP', 'SOFTCOMSHOP']).required(),
      ativo: yup.boolean().required(),
    }),
  ),
}));

const cadastrar = async (req: Request<{}, {}, IBodyCadastrarProps>, res: Response) => {
  const { registro, nome, cnpj_cpf, erp } = req.body;

  const registroExistente = await Repositorios.Empresa.consultarPrimeiroRegistro([{ coluna: 'registro', operador: '=', valor: registro }]);
  if (registroExistente.sucesso) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      errors: { default: 'Já existe uma empresa com este registro.' },
    });
  }

  const cnpjCpfExistente = await Repositorios.Empresa.consultarPrimeiroRegistro([{ coluna: 'cnpj_cpf', operador: '=', valor: cnpj_cpf }]);
  if (cnpjCpfExistente.sucesso) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      errors: { default: 'Já existe uma empresa com este CNPJ/CPF.' },
    });
  }

  const resultCadastrar = await Repositorios.Empresa.cadastrar({ registro, nome, cnpj_cpf, erp });

  if (resultCadastrar.sucesso) {
    return res.status(StatusCodes.NO_CONTENT).send();
  } else {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errors: { default: resultCadastrar.erro },
    });
  }
};
const consultar = async (req: Request<{}, {}, {}, IQueryProps>, res: Response) => {
  const { pagina = 1, limite = 10, filtro = '', ordenarPor = 'nome', ordem = 'asc' } = req.query;

  const result = await Repositorios.Empresa.consultar(pagina, limite, filtro, ordenarPor, ordem);

  if (!result.sucesso) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errors: { default: result.erro },
    });
  }

  const totalPaginas = Math.ceil(result.total / limite);

  return res.status(StatusCodes.OK).json({
    dados: result.dados.map((item) => ({ ...item, cnpj_cpf: formatarCpfCnpj(item.cnpj_cpf) })),
    totalRegistros: result.total,
    totalPaginas: totalPaginas,
  });
};
const consultarPorId = async (req: Request<{ empresaId: string }>, res: Response) => {
  const empresaId = req.params.empresaId as unknown as number;

  const empresa = await Repositorios.Empresa.consultarPrimeiroRegistro([{ coluna: 'id', operador: '=', valor: empresaId }]);
  if (!empresa.sucesso) {
    return res.status(StatusCodes.NOT_FOUND).json({ errors: { default: empresa.erro } });
  }

  return res.status(StatusCodes.OK).json({ ...empresa.dados, cnpj_cpf: formatarCpfCnpj(empresa.dados.cnpj_cpf) });
};
const editar = async (req: Request<{ empresaId: string }, {}, IBodyEditarProps>, res: Response) => {
  const { nome, cnpj_cpf, erp, ativo } = req.body;
  const empresaId = req.params.empresaId as unknown as number;

  const empresaIdExiste = await Repositorios.Empresa.consultarPrimeiroRegistro([{ coluna: 'id', operador: '=', valor: empresaId }]);
  if (!empresaIdExiste.sucesso) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      errors: { default: empresaIdExiste.erro },
    });
  }

  const cnpCpfValido = await Repositorios.Empresa.consultarPrimeiroRegistro([
    { coluna: 'id', operador: '!=', valor: empresaId },
    { coluna: 'cnpj_cpf', operador: '=', valor: cnpj_cpf },
  ]);
  if (cnpCpfValido.sucesso) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      errors: { default: 'Já existe uma empresa com este CNPJ/CPF.' },
    });
  }

  const resultAtualizar = await Repositorios.Empresa.atualizarDados(empresaId, { nome, cnpj_cpf, erp, ativo });
  if (resultAtualizar.sucesso) {
    return res.status(StatusCodes.OK).send();
  } else {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errors: { default: resultAtualizar.erro },
    });
  }
};

export const Empresa = {
  cadastrarValidacao,
  consultarValidacao,
  consultarPorIdValidacao,
  editarValidacao,
  cadastrar,
  consultar,
  consultarPorId,
  editar,
};
