import * as empresa from './empresa';
import * as produtosMC from './produtosMC';
import * as usuario from './usuario';

export const Repositorios = { ...usuario, ...empresa, ...produtosMC };
