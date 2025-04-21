export type IRetornoServico<T = any> =
  | {
      sucesso: true;
      dados: T; // Aqui `dados` é obrigatório
      erro: null;
    }
  | {
      sucesso: false;
      dados: null; // Aqui `dados` deve ser null
      erro: string;
    };
