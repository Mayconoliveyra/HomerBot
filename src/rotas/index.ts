import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';

import { Controladores } from '../controladores';

import { Middlewares } from '../middlewares';

const router = Router();

router.get('/teste-api', (req, res) => res.status(StatusCodes.OK).json('API TESTADA!.'));

router.get('/empresa', Controladores.Empresa.consultarValidacao, Controladores.Empresa.consultar);
router.get('/empresa/:empresaId', Controladores.Empresa.consultarPorIdValidacao, Controladores.Empresa.consultarPorId);

router.post('/empresa', Controladores.Empresa.cadastrarValidacao, Controladores.Empresa.cadastrar);
router.post('/configuracoes/softcomshop', Controladores.SoftcomShop.configuracaoValidacao, Controladores.SoftcomShop.configuracao);

export { router };
