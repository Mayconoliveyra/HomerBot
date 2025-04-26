import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as yup from 'yup';

import { Middlewares } from '../middlewares';

import { Repositorios } from '../repositorios';

import { Servicos } from '../servicos';

import { Util } from '../util';

type IBodyProps = {
  empresa_id: number;
  mc_usuario: string;
  mc_senha: string;
};

const limparConfigSS = async (id: number) => {
  await Repositorios.Empresa.atualizarDados(id, {
    mc_usuario: null,
    mc_senha: null,
    mc_empresa_id: null,
    mc_empresa_nome: null,
    mc_empresa_cnpj: null,
    mc_token: null,
    mc_token_exp: 0,
  });
};

const configuracaoValidacao = Middlewares.validacao((getSchema) => ({
  body: getSchema<IBodyProps>(
    yup.object().shape({
      empresa_id: yup.number().required(),
      mc_usuario: yup.string().required().trim().max(255),
      mc_senha: yup.string().required().trim().max(255),
    }),
  ),
}));

const configuracao = async (req: Request<{}, {}, IBodyProps>, res: Response) => {
  const { empresa_id, mc_usuario, mc_senha } = req.body;

  const empresa = await Repositorios.Empresa.consultarPrimeiroRegistro([{ coluna: 'id', operador: '=', valor: empresa_id }]);

  if (!empresa.sucesso) {
    return res.status(StatusCodes.NOT_FOUND).json({ errors: { default: 'Empresa não encontrada.' } });
  }

  const resToken = await Servicos.MeuCarrinho.autenticar(mc_usuario, mc_senha);

  if (!resToken.sucesso || !resToken.dados) {
    await limparConfigSS(empresa_id);

    return res.status(StatusCodes.BAD_REQUEST).json({
      errors: { default: resToken.erro || Util.Msg.erroInesperado },
    });
  }

  const resUsuario = await Servicos.MeuCarrinho.getUsuario(resToken.dados.token);

  if (!resUsuario.sucesso || !resUsuario.dados) {
    await limparConfigSS(empresa_id);

    return res.status(StatusCodes.BAD_REQUEST).json({
      errors: { default: resUsuario.erro || Util.Msg.erroInesperado },
    });
  }

  const resEmpresa = await Servicos.MeuCarrinho.getEmpresa(resToken.dados.token, resUsuario.dados.merchantId);

  if (!resEmpresa.sucesso || !resEmpresa.dados) {
    await limparConfigSS(empresa_id);

    return res.status(StatusCodes.BAD_REQUEST).json({
      errors: { default: resEmpresa.erro || Util.Msg.erroInesperado },
    });
  }

  const resAtDados = await Repositorios.Empresa.atualizarDados(empresa_id, {
    mc_usuario: mc_usuario,
    mc_senha: mc_senha,
    mc_empresa_id: resUsuario.dados.merchantId,
    mc_empresa_nome: resEmpresa.dados.nome,
    mc_empresa_cnpj: resEmpresa.dados.cnpj,
    mc_token: resToken.dados.token,
    mc_token_exp: resToken.dados.expiresAt,
  });

  if (!resAtDados.sucesso) {
    await limparConfigSS(empresa_id);

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errors: { default: resAtDados.erro },
    });
  }

  return res.status(StatusCodes.NO_CONTENT).send();
};

const teste = async (req: Request, res: Response) => {
  const empresa_id = req.body?.empresa_id as number;

  const empresa = await Repositorios.Empresa.consultarPrimeiroRegistro([{ coluna: 'id', operador: '=', valor: empresa_id }]);

  if (!empresa.sucesso) {
    return res.status(StatusCodes.NOT_FOUND).json({ errors: { default: 'Empresa não encontrada.' } });
  }

  /* const teste = await Servicos.MeuCarrinho.criarProduto(empresa_id, {
    categoryId: '1bec277f-3e1a-4a92-98f0-ea09872bdfa4',
    merchantId: empresa.mc_empresa_id || '',
    name: 'agora 123',
    code: '8877',
    description: 'descricao',
    price: 1.55,
  }); */

  /*   const teste = await Servicos.MeuCarrinho.criarVariacaoItem(empresa_id, '07b4f087-f79a-43f1-b043-9f4c96414a3b', {
    name: 'teste 654',
    code: '11770',
    value: 99.99,
    description: '987',
  }); */

  // const mc = await Servicos.MeuCarrinho.zerarCadastros(empresa_id, empresa.mc_empresa_id || '');
  const mc = await Servicos.MeuCarrinho.exportarMercadoriasParaMeuCarrinho(empresa_id, empresa?.dados?.mc_empresa_id || '');

  console.log('mc', mc);

  return res.status(StatusCodes.NO_CONTENT).send();
};

export const MeuCarrinho = {
  configuracaoValidacao,
  configuracao,
  teste,
};
