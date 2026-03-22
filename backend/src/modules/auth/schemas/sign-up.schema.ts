import { z } from 'zod';

export const signUpSchema = z.object({
  // email: z.string().email(),
  email: z.string(),
  password: z.string(),
  // .min(8, 'A senha deve ter no mínimo 8 caracteres')
  // .regex(/[A-Z]/, 'A senha deve ter pelo menos uma letra maiúscula')
  // .regex(/[a-z]/, 'A senha deve ter pelo menos uma letra minúscula')
  // .regex(/[\W_]/, 'A senha deve ter pelo menos um caractere especial')
  // .regex(/\d/, 'A senha deve ter pelo menos um número'),
  // [\W_] pega caracteres não alfanuméricos
});

export type SignUp = z.infer<typeof signUpSchema>;
