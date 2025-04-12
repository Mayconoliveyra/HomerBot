export interface IUsuario {
  uuid: string;

  nome: string;
  email: string;
  senha: string;
  ativo: boolean;
  empresa_id: number;

  created_at: string;
  updated_at?: string;
}
