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

export type IOperador = '=' | '!=' | '<' | '<=' | '>' | '>=' | 'like';

export interface IFiltro<T> {
  coluna: keyof T;
  operador: IOperador;
  valor: string | number;
}
