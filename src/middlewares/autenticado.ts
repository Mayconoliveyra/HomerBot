import { RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';

import { IUsuario } from '../banco/models/usuario';

import { Repositorios } from '../repositorios';

import { Servicos } from '../servicos';

import { Util } from '../util';

const autenticado: RequestHandler = async (req, res, next) => {
  try {
    const { authorization } = req.headers;

    if (!authorization) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        errors: { default: 'Não autenticado' },
      });
    }

    const [type, token] = authorization.split(' ');

    if (type !== 'Bearer') {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        errors: { default: 'Não autenticado' },
      });
    }

    const jwtData = Servicos.JWT.verificar(token);
    if (jwtData === 'JWT_SECRET_NOT_FOUND') {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        errors: { default: 'Erro ao verificar o token' },
      });
    } else if (jwtData === 'INVALID_TOKEN') {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        errors: { default: 'Não autenticado' },
      });
    }

    /*  const usuario = await Repositorios.Usuario.buscarPorEmail(jwtData.email);
    if (!usuario) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        errors: { default: 'Usuário não encontrado' },
      });
    }

    if (!usuario.ativo) {
      return res.status(StatusCodes.FORBIDDEN).json({
        errors: { default: 'Usuário inativo' },
      });
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { senha, ...usuarioSemSenha } = usuario;
    (req as any).usuario = usuarioSemSenha as IUsuario; */

    return next();
  } catch (error) {
    Util.Log.error('Falha ao executar: autenticado', error);
  }
};

export { autenticado };
