import schedule from 'node-schedule';

import { ETableNames } from '../banco/eTableNames';
import { Knex } from '../banco/knex';

import { Repositorios } from '../repositorios';

import { Servicos } from '../servicos';

import { Util } from '../util';

const MODULO = '[Tarefas]';

let emExecucaoTarefas = false;

const processarTarefas = () => {
  // Executa a cada 5 segundos
  schedule.scheduleJob('*/5 * * * * *', async () => {
    if (emExecucaoTarefas) {
      Util.Log.warn(`${MODULO} | Tarefas | Sincronização já está em execução.`);
      return;
    }

    emExecucaoTarefas = true;
    try {
      // Buscar todas as empresas que precisam de renovação
      const empresas = await Knex(ETableNames.vw_tarefas_simultaneas).where('prox_processar', '=', true).orderBy('te_id', 'ASC').first();
      console.log(MODULO, Util.DataHora.obterDataAtual('DD/MM/YYYY HH:mm:ss'));

      if (empresas) {
        await Repositorios.TarefaEmpresa.atualizarDados(empresas.te_id, {
          status: 'PROCESSANDO',
          /*  feedback: 'Processo realizado com sucesso.', */
        });

        // const mc = await Servicos.MeuCarrinho.zerarCadastros(empresa_id, empresa.mc_empresa_id || '');
        const mc = await Servicos.MeuCarrinho.exportarMercadoriasParaMeuCarrinho(empresas.e_id, empresas.e_mc_empresa_id || '');

        console.log('mc', mc);

        if (!mc.sucesso) {
          await Repositorios.TarefaEmpresa.atualizarDados(empresas.te_id, {
            status: 'ERRO',
            erro: mc.erro,
          });
        } else {
          await Repositorios.TarefaEmpresa.atualizarDados(empresas.te_id, {
            status: 'FINALIZADO',
            feedback: 'Processo realizado com sucesso.',
          });
        }

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
