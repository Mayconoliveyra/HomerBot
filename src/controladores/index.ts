import * as empresa from './empresa';
import * as softcomshop from './softcomshop';
import * as usuario from './usuario';

export const Controladores = { ...usuario, ...empresa, ...softcomshop };
