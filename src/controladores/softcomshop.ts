import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as yup from 'yup';

import { Middlewares } from '../middlewares';

import { Repositorios } from '../repositorios';

import { Servicos } from '../servicos';

import { Util } from '../util';

type IBodyProps = {
  empresa_id: number;
  erp_url: string;
};

const limparConfigSS = async (id: number) => {
  await Repositorios.Empresa.atualizarDados(id, {
    ss_qrcode_url: null,
    ss_url: null,
    ss_client_id: null,
    ss_client_secret: null,
    ss_empresa_nome: null,
    ss_empresa_cnpj: null,
    ss_token: null,
    ss_token_exp: 0,
  });
};

const configuracaoValidacao = Middlewares.validacao((getSchema) => ({
  body: getSchema<IBodyProps>(
    yup.object().shape({
      empresa_id: yup.number().required(),
      erp_url: yup.string().required().url().trim().max(255),
    }),
  ),
}));

const configuracao = async (req: Request<{}, {}, IBodyProps>, res: Response) => {
  const { empresa_id, erp_url } = req.body;

  const empresa = await Repositorios.Empresa.consultarPrimeiroRegistro([{ coluna: 'id', operador: '=', valor: empresa_id }]);

  if (!empresa.sucesso) {
    return res.status(StatusCodes.NOT_FOUND).json({ errors: { default: empresa.erro } });
  }

  if (erp_url === empresa.dados.ss_qrcode_url && empresa.dados.ss_url && empresa.dados.ss_client_id && empresa.dados.ss_client_secret) {
    const resToken = await Servicos.SoftcomShop.criarToken(empresa.dados.ss_url, empresa.dados.ss_client_id, empresa.dados.ss_client_secret);

    if (!resToken.sucesso || !resToken.dados) {
      await limparConfigSS(empresa_id);

      return res.status(StatusCodes.BAD_REQUEST).json({
        errors: { default: resToken.erro || Util.Msg.erroInesperado },
      });
    }

    const resAtDados = await Repositorios.Empresa.atualizarDados(empresa_id, {
      ss_token: resToken.dados.token,
      ss_token_exp: resToken.dados.expiresAt,
    });

    if (!resAtDados.sucesso) {
      await limparConfigSS(empresa_id);

      return res.status(StatusCodes.BAD_REQUEST).json({
        errors: { default: resAtDados.erro },
      });
    }

    return res.status(StatusCodes.NO_CONTENT).send();
  }

  const resDispositivo = await Servicos.SoftcomShop.criarDispositivo(erp_url);

  if (!resDispositivo.sucesso || !resDispositivo.dados) {
    await limparConfigSS(empresa_id);

    return res.status(StatusCodes.BAD_REQUEST).json({
      errors: { default: resDispositivo.erro || Util.Msg.erroInesperado },
    });
  }

  const resToken = await Servicos.SoftcomShop.criarToken(resDispositivo.dados.url_base, resDispositivo.dados.client_id, resDispositivo.dados.client_secret);

  if (!resToken.sucesso || !resToken.dados) {
    await limparConfigSS(empresa_id);

    return res.status(StatusCodes.BAD_REQUEST).json({
      errors: { default: resToken.erro || Util.Msg.erroInesperado },
    });
  }

  const resAtDados = await Repositorios.Empresa.atualizarDados(empresa_id, {
    ss_qrcode_url: erp_url,
    ss_url: resDispositivo.dados.url_base,
    ss_client_id: resDispositivo.dados.client_id,
    ss_client_secret: resDispositivo.dados.client_secret,
    ss_empresa_cnpj: resDispositivo.dados.empresa_cnpj,
    ss_empresa_nome: resDispositivo.dados.empresa_fantasia,
    ss_token: resToken.dados.token,
    ss_token_exp: resToken.dados.expiresAt,
  });

  if (!resAtDados.sucesso) {
    await limparConfigSS(empresa_id);

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errors: { default: resAtDados.erro },
    });
  }

  return res.status(StatusCodes.NO_CONTENT).send();
};

export const SoftcomShop = {
  configuracaoValidacao,
  configuracao,
};
