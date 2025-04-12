import * as bcryptImp from './bcrypt';
import * as jwt from './jwt';

export const Servicos = { ...jwt, ...bcryptImp };
