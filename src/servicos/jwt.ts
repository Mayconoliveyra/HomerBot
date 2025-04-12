import * as jwt from 'jsonwebtoken';

import { Util } from '../util';

interface IJwtData {
  id: number;
  name: string;
  email: string;
}

const entrar = (data: IJwtData): { token: string; exp: number } | 'JWT_SECRET_NOT_FOUND' => {
  if (!process.env.JWT_SECRET) {
    Util.Log.error('entrar > process.env.JWT_SECRET não está definido');
    return 'JWT_SECRET_NOT_FOUND';
  }

  // Definindo o tempo de expiração para 1 dia (24 horas)
  const expiresIn = '1d';

  // Gerando o token JWT
  const token = jwt.sign(data, process.env.JWT_SECRET, { expiresIn });

  // Calculando o tempo de expiração
  const exp = Math.floor(Date.now() / 1000) + 60 * 60 * 24; // 24 horas

  return { token, exp };
};

const verificar = (token: string): IJwtData | 'JWT_SECRET_NOT_FOUND' | 'INVALID_TOKEN' => {
  if (!process.env.JWT_SECRET) {
    Util.Log.error('verificar > process.env.JWT_SECRET não está definido');
    return 'JWT_SECRET_NOT_FOUND';
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (typeof decoded === 'string') {
      return 'INVALID_TOKEN';
    }

    return decoded as IJwtData;
  } catch (error) {
    return 'INVALID_TOKEN';
  }
};

export const JWT = { entrar, verificar };
