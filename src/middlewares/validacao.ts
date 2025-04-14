import { RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';
import { AnyObject, Maybe, ObjectSchema, ValidationError } from 'yup';

type TProperty = 'body' | 'header' | 'params' | 'query';

type TGetSchema = <T extends Maybe<AnyObject>>(schema: ObjectSchema<T>) => ObjectSchema<T>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TAllSchemas = Record<TProperty, ObjectSchema<any>>;

type TGetAllSchemas = (getSchema: TGetSchema) => Partial<TAllSchemas>;

type TValidacao = (getAllSchemas: TGetAllSchemas) => RequestHandler;

const validacao: TValidacao = (getAllSchemas) => async (req, res, next) => {
  const schemas = getAllSchemas((schema) => schema);

  const errorsResult: Record<string, Record<string, string>> = {};
  const flatErrorsArray: string[] = [];
  const flatErrorsArrayString: string[] = [];

  Object.entries(schemas).forEach(([key, schema]) => {
    try {
      schema.validateSync(req[key as TProperty], { abortEarly: false });
    } catch (err) {
      const yupError = err as ValidationError;
      const errors: Record<string, string> = {};

      yupError.inner.forEach((error) => {
        if (error.path === undefined) return;
        const message = error.message;
        errors[error.path] = message;
        flatErrorsArray.push(`${error.path}: ${message}`);
        flatErrorsArrayString.push(`${error.path.toUpperCase()}: ${message}`);
      });

      errorsResult[key] = errors;
    }
  });

  if (flatErrorsArray.length === 0) {
    return next();
  } else {
    return res.status(StatusCodes.BAD_REQUEST).json({
      errors: {
        fields: errorsResult,
        messages: flatErrorsArray,
        default: flatErrorsArrayString.join('; '),
      },
    });
  }
};

export { validacao };
