import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as yup from 'yup';

import { Middlewares } from '../middlewares';

import { Repositorios } from '../repositorios';

interface IQueryProps {
  pagina?: number;
  limite?: number;
  filtro?: string;
}

const consultarValidacao = Middlewares.validacao((getSchema) => ({
  query: getSchema<IQueryProps>(
    yup.object().shape({
      pagina: yup.number().integer().moreThan(0).default(1),
      limite: yup.number().integer().moreThan(0).max(500).default(10),
      filtro: yup.string().max(255).optional(),
    }),
  ),
}));

const consultar = async (req: Request<{}, {}, {}, IQueryProps>, res: Response) => {
  const { pagina = 1, limite = 10, filtro = '' } = req.query;

  const result = await Repositorios.Empresa.consultar(pagina, limite, filtro);

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

export const Empresa = {
  consultarValidacao,
  consultar,
};
