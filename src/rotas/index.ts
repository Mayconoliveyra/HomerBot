import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';

import { Controladores } from '../controladores';

import { Middlewares } from '../middlewares';

const router = Router();

router.get('/teste-api', (req, res) => res.status(StatusCodes.OK).json('API TESTADA!.'));

router.get('/teste', Controladores.MeuCarrinho.teste);

router.get('/empresa', Controladores.Empresa.consultarValidacao, Controladores.Empresa.consultar);
router.post('/empresa', Controladores.Empresa.cadastrarValidacao, Controladores.Empresa.cadastrar);
router.put('/empresa/:empresaId', Controladores.Empresa.editarValidacao, Controladores.Empresa.editar);

router.get('/empresa/:empresaId', Controladores.Empresa.consultarPorIdValidacao, Controladores.Empresa.consultarPorId);

router.post('/configuracoes/softcomshop', Controladores.SoftcomShop.configuracaoValidacao, Controladores.SoftcomShop.configuracao);
router.post('/configuracoes/meu-carrinho', Controladores.MeuCarrinho.configuracaoValidacao, Controladores.MeuCarrinho.configuracao);

router.get('/tarefa', Controladores.Tarefa.consultarValidacao, Controladores.Tarefa.consultar);
router.post('/tarefa/solicitar', Controladores.Tarefa.solicitarValidacao, Controladores.Tarefa.solicitar);
router.patch('/tarefa/cancelar/:tarefaId', Controladores.Tarefa.cancelarValidacao, Controladores.Tarefa.cancelar);
router.get('/tarefa/historico', Controladores.Tarefa.historicoValidacao, Controladores.Tarefa.historico);

export { router };
