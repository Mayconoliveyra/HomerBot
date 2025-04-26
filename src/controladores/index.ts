import * as empresa from './empresa';
import * as meuCarrinho from './meuCarrinho';
import * as softcomshop from './softcomshop';
import * as tarefa from './tarefa';
import * as usuario from './usuario';

export const Controladores = { ...usuario, ...empresa, ...softcomshop, ...meuCarrinho, ...tarefa };
