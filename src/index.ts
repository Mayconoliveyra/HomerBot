import { Knex } from './banco/knex';

import { Configs } from './configs';

import { Tarefas } from './tarefas';

const { NODE_ENV } = process.env;

const PORT_HTTP = NODE_ENV === 'dev' ? 8081 : 80;
const PORT_HTTPS = 443;

const startServer = () => {
  Configs.ExpressConfig.serverHttp.listen(PORT_HTTP, () => {
    console.log(`App rodando na porta ${PORT_HTTP} (http)`);
  });

  Configs.ExpressConfig.serverHttps.listen(PORT_HTTPS, () => {
    console.log(`App rodando na porta ${PORT_HTTPS} (https)`);
  });

  Tarefas.Tarefas.processarTarefas();
};

Knex.migrate
  .latest()
  .then(() => {
    Knex.seed
      .run()
      .then(() => {
        // Inicia o serviço e as tarefas
        startServer();
      })
      .catch(console.log);
  })
  .catch(console.log);
