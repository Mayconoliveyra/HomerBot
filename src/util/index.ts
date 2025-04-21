import * as dataHora from './dataHora';
import * as log from './log';
import * as msg from './msg';
import * as outros from './outros';
import * as texto from './texto';
import * as uuidV4 from './uuidV4';

export const Util = { ...log, ...dataHora, ...uuidV4, ...texto, ...msg, ...outros };
