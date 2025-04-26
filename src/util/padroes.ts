export type IRetorno<T = any> =
  | {
      sucesso: true;
      dados: T; // Aqui `dados` é obrigatório
      erro: null;
      total: number;
    }
  | {
      sucesso: false;
      dados: null; // Aqui `dados` deve ser null
      erro: string;
      total: number;
    };
