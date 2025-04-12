declare namespace NodeJS {
  export interface ProcessEnv {
    NODE_ENV?: 'dev' | 'test' | 'production';

    DATABASE_HOST?: string;
    DATABASE_USER?: string;
    DATABASE_NAME?: string;
    DATABASE_PORT?: number;
    DATABASE_PASSWORD?: string;

    JWT_SECRET?: string;
  }
}
