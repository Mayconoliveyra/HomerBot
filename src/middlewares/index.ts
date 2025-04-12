import * as autenticado from './autenticado';
import * as JSONParseError from './JSONParseError';
import * as validacao from './validacao';

export const Middlewares = { ...JSONParseError, ...autenticado, ...validacao };
