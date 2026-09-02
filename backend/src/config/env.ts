import dotenv from 'dotenv';

dotenv.config();

const REQUIRED = ['SUPABASE_URL', 'SUPABASE_SERVICE_KEY', 'JWT_SECRET'] as const;

type RequiredKey = (typeof REQUIRED)[number];

const missing = REQUIRED.filter((key) => !process.env[key]);

if (missing.length > 0) {
  console.error(
    `Variáveis de ambiente obrigatórias ausentes: ${missing.join(', ')}.\n` +
      'Defina-as no .env local ou no painel do serviço antes de iniciar.',
  );
  process.exit(1);
}

const required = (key: RequiredKey): string => process.env[key] as string;

export const env = {
  PORT: Number(process.env.PORT) || 4000,
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  SUPABASE_URL: required('SUPABASE_URL'),
  SUPABASE_SERVICE_KEY: required('SUPABASE_SERVICE_KEY'),
  JWT_SECRET: required('JWT_SECRET'),
  CORS_ORIGINS: process.env.CORS_ORIGINS,
};
