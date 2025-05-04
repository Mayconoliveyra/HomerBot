import schedule from 'node-schedule';

import { ETableNames } from '../banco/eTableNames';
import { Knex } from '../banco/knex';
import { IVwTarefaProcessar } from '../banco/models/vwTarefaProcessar';

import { Repositorios } from '../repositorios';

import { Servicos } from '../servicos';

import { Util } from '../util';

const MODULO = '[Tarefas]';

let emExecucaoTarefas = false;

const executarTarefa = async (tarefa: IVwTarefaProcessar) => {
  Util.Log.info(`${MODULO} | executarTarefa | tId: ${tarefa.t_id} | teId: ${tarefa.te_id}`);

  try {
    if (tarefa.t_id === 1) {
      const result = await Servicos.MeuCarrinho.exportarMercadoriasParaMeuCarrinho(tarefa.e_id, tarefa.e_mc_empresa_id || '');

      if (!result.sucesso) {
        await Repositorios.TarefaEmpresa.atualizarDados(tarefa.te_id, {
          status: 'ERRO',
          feedback: result.erro,
        });
      } else {
        await Repositorios.TarefaEmpresa.atualizarDados(tarefa.te_id, {
          status: 'FINALIZADO',
          feedback: 'Processo realizado com sucesso.',
        });
      }
    } else if (tarefa.t_id === 2) {
      const result = await Servicos.MeuCarrinho.zerarCadastros(tarefa.e_id, tarefa.e_mc_empresa_id || '');

      if (!result.sucesso) {
        await Repositorios.TarefaEmpresa.atualizarDados(tarefa.te_id, {
          status: 'ERRO',
          feedback: result.erro,
        });
      } else {
        await Repositorios.TarefaEmpresa.atualizarDados(tarefa.te_id, {
          status: 'FINALIZADO',
          feedback: 'Processo realizado com sucesso.',
        });
      }
    } else {
      Util.Log.error(`${MODULO} | executarTarefa | Nenhuma execução definida para a tarefa: ${tarefa.t_nome}`);

      await Repositorios.TarefaEmpresa.atualizarDados(tarefa.te_id, {
        status: 'ERRO',
        feedback: 'Nenhuma execução definida para a tarefa.',
      });
    }
  } catch (error) {
    Util.Log.error(`${MODULO} | executarTarefa | Erro ao executar a tarefa: ${tarefa.t_nome}`, error);

    await Repositorios.TarefaEmpresa.atualizarDados(tarefa.te_id, {
      status: 'ERRO',
      feedback: 'Erro desconhecido ao executar a tarefa.',
    });
  }
};

const processarTarefas = () => {
  // Executa a cada 5 segundos
  schedule.scheduleJob('*/5 * * * * *', async () => {
    if (emExecucaoTarefas) {
      Util.Log.warn(`${MODULO} | Tarefas | Sincronização já está em execução.`);
      return;
    }

    emExecucaoTarefas = true;
    try {
      const tarefa = await Knex(ETableNames.vw_tarefas_simultaneas).where('prox_processar', '=', true).orderBy('te_id', 'ASC').first();

      if (tarefa) {
        await Repositorios.TarefaEmpresa.atualizarDados(tarefa.te_id, {
          status: 'PROCESSANDO',
          feedback: null,
        });

        executarTarefa(tarefa);

        emExecucaoTarefas = false;
      } else {
        emExecucaoTarefas = false;
      }
    } catch (error) {
      Util.Log.error(`${MODULO} | Tarefas | Erro inesperado ao processar.`, error);
    }
  });
};

export const Tarefas = { processarTarefas };
