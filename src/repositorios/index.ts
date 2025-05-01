import * as empresa from './empresa';
import * as produtosERP from './produtosERP';
import * as produtosMC from './produtosMC';
import * as tarefa from './tarefa';
import * as tarefaEmpresa from './tarefaEmpresa';
import * as usuario from './usuario';

export const Repositorios = { ...usuario, ...empresa, ...produtosMC, ...produtosERP, ...tarefa, ...tarefaEmpresa };
