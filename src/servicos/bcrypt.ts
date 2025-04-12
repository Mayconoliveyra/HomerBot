import { genSalt, hash, compare } from 'bcryptjs';

import { Util } from '../util';

const SALT_RANDOMS = 10;

const gerarHashSenha = async (senha: string) => {
  try {
    const saltGerado = await genSalt(SALT_RANDOMS);
    return await hash(senha, saltGerado);
  } catch (error) {
    Util.Log.error('Erro ao gerar hash da senha', error);
    return null;
  }
};

const verificarSenha = async (senha: string, senhaHasheada: string) => {
  try {
    return await compare(senha, senhaHasheada);
  } catch (error) {
    Util.Log.error('Erro ao verificar a senha', error);
    return false;
  }
};

export const Bcrypt = {
  gerarHashSenha,
  verificarSenha,
};
