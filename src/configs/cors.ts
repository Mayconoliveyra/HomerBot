import cors from 'cors';

const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // métodos permitidos
};
const corsMiddleware = cors(corsOptions);

export const CorsConfig = { corsMiddleware };
