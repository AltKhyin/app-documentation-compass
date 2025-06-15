
// ABOUTME: TanStack Query mutation hook for user signup.
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { z } from 'zod';

export const signupSchema = z.object({
  fullName: z.string().min(3, { message: 'Nome completo é obrigatório.' }),
  email: z.string().email({ message: 'Email inválido.' }),
  password: z.string().min(8, { message: 'Senha deve ter pelo menos 8 caracteres.' }),
});

export type SignupPayload = z.infer<typeof signupSchema>;

const signUpUser = async (payload: SignupPayload) => {
  const { error } = await supabase.auth.signUp({
    email: payload.email,
    password: payload.password,
    options: {
      data: {
        full_name: payload.fullName,
      },
      // This is critical for email confirmation flow
      emailRedirectTo: window.location.origin,
    },
  });

  if (error) {
    throw new Error(error.message);
  }
};

export const useSignupMutation = () => {
  return useMutation({
    mutationFn: signUpUser,
  });
};
