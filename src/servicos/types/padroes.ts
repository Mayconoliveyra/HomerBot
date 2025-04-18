export interface IRetornoServico<T = any> {
  sucesso: boolean;
  dados: T | null;
  erro: string | null;
}
