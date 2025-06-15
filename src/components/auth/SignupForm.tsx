
// ABOUTME: The user signup form component.
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useSignupMutation, signupSchema } from '@/hooks/mutations/useSignupMutation';
import { toast } from 'sonner';

const SignupForm = () => {
  const mutation = useSignupMutation();
  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: { fullName: '', email: '', password: '' },
  });

  const onSubmit = (values: z.infer<typeof signupSchema>) => {
    mutation.mutate(values, {
      onSuccess: () => {
        toast.success('Cadastro realizado!', {
          description: 'Verifique seu email para confirmar sua conta.',
        });
        form.reset();
      },
      onError: (error) => {
        const message = error.message.includes('unique constraint')
          ? 'Este email já está em uso.'
          : 'Ocorreu um erro no cadastro.';
        toast.error(message);
        console.error(error);
      },
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome Completo</FormLabel>
              <FormControl>
                <Input placeholder="Seu Nome" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="seu@email.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Senha</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={mutation.isPending}>
          {mutation.isPending ? 'Criando conta...' : 'Criar Conta'}
        </Button>
      </form>
    </Form>
  );
};

export default SignupForm;
