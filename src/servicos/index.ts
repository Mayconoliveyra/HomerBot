import * as bcryptImp from './bcrypt';
import * as jwt from './jwt';
import * as meuCarrinho from './meuCarrinho';
import * as softcomshop from './softcomshop';

export const Servicos = { ...jwt, ...bcryptImp, ...softcomshop, ...meuCarrinho };
