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

export type IBodySolicitarProps = {
  empresa_id: number;
  tarefa_id: number;
  param_01?: string | null;
  param_02?: string | null;
  param_03?: string | null;
  param_04?: string | null;
  param_05?: string | null;
  param_06?: string | null;
  param_07?: string | null;
  param_08?: string | null;
  param_09?: string | null;
  param_10?: string | null;
  param_11?: string | null;
  param_12?: string | null;
  param_13?: string | null;
  param_14?: string | null;
  param_15?: string | null;
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
const solicitarValidacao = Middlewares.validacao((getSchema) => ({
  body: getSchema<IBodySolicitarProps>(
    yup.object().shape({
      empresa_id: yup.number().required(),
      tarefa_id: yup.number().required(),

      param_01: yup.string().nullable(),
      param_02: yup.string().nullable(),
      param_03: yup.string().nullable(),
      param_04: yup.string().nullable(),
      param_05: yup.string().nullable(),
      param_06: yup.string().nullable(),
      param_07: yup.string().nullable(),
      param_08: yup.string().nullable(),
      param_09: yup.string().nullable(),
      param_10: yup.string().nullable(),
      param_11: yup.string().nullable(),
      param_12: yup.string().nullable(),
      param_13: yup.string().nullable(),
      param_14: yup.string().nullable(),
      param_15: yup.string().nullable(),
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
const solicitar = async (req: Request<{}, {}, IBodySolicitarProps>, res: Response) => {
  const {
    empresa_id,
    tarefa_id,
    param_01,
    param_02,
    param_03,
    param_04,
    param_05,
    param_06,
    param_07,
    param_08,
    param_09,
    param_10,
    param_11,
    param_12,
    param_13,
    param_14,
    param_15,
  } = req.body;

  const empresaExistente = await Repositorios.Empresa.consultarPrimeiroRegistro([{ coluna: 'id', operador: '=', valor: empresa_id }]);
  if (!empresaExistente.sucesso) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      errors: { default: 'Empresa não encontrada.' },
    });
  }

  const tarefaExistente = await Repositorios.Tarefa.consultarPrimeiroRegistro([{ coluna: 'id', operador: '=', valor: tarefa_id }]);
  if (!tarefaExistente.sucesso) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      errors: { default: 'Tarefa não encontrada.' },
    });
  }

  const resultSolicitar = await Repositorios.TarefaEmpresa.solicitar({ empresa_id, tarefa_id, status: 'PENDENTE' });

  if (resultSolicitar.sucesso) {
    return res.status(StatusCodes.NO_CONTENT).send();
  } else {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errors: { default: resultSolicitar.erro },
    });
  }
};

export const Tarefa = {
  consultarValidacao,
  consultarPorIdValidacao,
  solicitarValidacao,
  consultar,
  consultarPorId,
  solicitar,
};
