import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as yup from 'yup';

import { IEmpresa } from '../banco/models/empresa';

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
};

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

const consultar = async (req: Request<{}, {}, {}, IQueryProps>, res: Response) => {
  const { pagina = 1, limite = 10, filtro = '', ordenarPor = 'nome', ordem = 'asc' } = req.query;

  const result = await Repositorios.Empresa.consultar(pagina, limite, filtro, ordenarPor, ordem);

  if (result === false) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errors: { default: 'Erro ao consultar empresas' },
    });
  }

  const totalPaginas = Math.ceil(result.total / limite);

  return res.status(StatusCodes.OK).json({
    dados: result.empresas,
    totalRegistros: result.total,
    totalPaginas: totalPaginas,
  });
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
    }),
  ),
}));
const cadastrar = async (req: Request<{}, {}, IBodyCadastrarProps>, res: Response) => {
  const { registro, nome, cnpj_cpf } = req.body;

  const existe = await Repositorios.Empresa.buscarPorRegistroOuDocumento(registro, cnpj_cpf);
  if (existe) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      errors: { default: 'Já existe uma empresa com este registro ou CNPJ/CPF.' },
    });
  }

  const result = await Repositorios.Empresa.cadastrar({ registro, nome, cnpj_cpf });

  if (result) {
    return res.status(StatusCodes.NO_CONTENT).send();
  } else {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errors: { default: 'Erro ao cadastrar empresa.' },
    });
  }
};

export const Empresa = {
  consultarValidacao,
  consultar,
  cadastrarValidacao,
  cadastrar,
};
