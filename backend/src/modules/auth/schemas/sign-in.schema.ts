import { z } from 'zod';

export const signInSchema = z.object({
  provider: z.string(),
  password: z.string().min(1),
});

export type SignIn = z.infer<typeof signInSchema>;
