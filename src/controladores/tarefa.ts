import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as yup from 'yup';

import { Middlewares } from '../middlewares';

import { Repositorios } from '../repositorios';

interface IQueryProps {
  empresaId?: number;
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
      empresaId: yup.number().integer().moreThan(0).required(),
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

const consultar = async (req: Request<{}, {}, {}, IQueryProps>, res: Response) => {
  const { empresaId, pagina = 1, limite = 10, filtro = '', ordenarPor = 'nome', ordem = 'asc' } = req.query;

  const empresa = await Repositorios.Empresa.consultarPrimeiroRegistro([{ coluna: 'id', operador: '=', valor: empresaId as number }]);
  if (!empresa.sucesso) {
    return res.status(StatusCodes.NOT_FOUND).json({ errors: { default: 'Empresa não encontrada.' } });
  }

  const result = await Repositorios.Tarefa.consultar(empresaId as number, pagina, limite, filtro, ordenarPor, ordem);

  if (!result.sucesso) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errors: { default: result.erro },
    });
  }

  const totalPaginas = Math.ceil(result.total / limite);

  return res.status(StatusCodes.OK).json({
    dados: result.dados,
    totalRegistros: result.total,
    totalPaginas: totalPaginas,
  });
};

const consultarPorId = async (req: Request<{ empresaId: string }>, res: Response) => {
  const empresaId = req.params.empresaId as unknown as number;

  const empresa = await Repositorios.Empresa.consultarPrimeiroRegistro([{ coluna: 'id', operador: '=', valor: empresaId }]);
  if (!empresa.sucesso) {
    return res.status(StatusCodes.NOT_FOUND).json({ errors: { default: 'Empresa não encontrada.' } });
  }

  return res.status(StatusCodes.OK).json(empresa);
};

export const Tarefa = {
  consultarValidacao,
  consultar,
  consultarPorIdValidacao,
  consultarPorId,
};
