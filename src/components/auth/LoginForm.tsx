
// ABOUTME: The user login form component, matching the visual replica.
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useLoginMutation, loginSchema } from '@/hooks/mutations/useLoginMutation';
import { toast } from 'sonner';
import { useNavigate, Link } from 'react-router-dom';
import { Checkbox } from '@/components/ui/checkbox';
import GoogleIcon from '@/components/icons/GoogleIcon';

const LoginForm = () => {
  const navigate = useNavigate();
  const mutation = useLoginMutation();
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = (values: z.infer<typeof loginSchema>) => {
    mutation.mutate(values, {
      onSuccess: () => {
        toast.success('Login bem-sucedido!');
        navigate('/');
      },
      onError: (error) => {
        toast.error('Email ou senha inválidos.');
        console.error(error);
      },
    });
  };

  return (
    <>
      <h2 className="text-3xl font-bold mb-8">Sign In</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="name@email.com" {...field} />
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
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <Checkbox id="remember-me" />
              <label
                htmlFor="remember-me"
                className="font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Remember me
              </label>
            </div>
            <Link to="#" className="font-semibold text-primary hover:underline">
              Forgot?
            </Link>
          </div>
          
          <Button type="submit" className="w-full !mt-8 bg-primary hover:bg-primary/90 text-primary-foreground" disabled={mutation.isPending}>
            {mutation.isPending ? 'Signing In...' : 'Sign In'}
          </Button>
        </form>
      </Form>

      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            or continue with
          </span>
        </div>
      </div>

      <Button variant="outline" className="w-full">
        <GoogleIcon className="mr-2 h-5 w-5" />
        Sign in with Google
      </Button>

      <p className="text-center text-sm text-muted-foreground mt-8">
        Don't have an account?{' '}
        <Link to="/signup" className="font-semibold text-primary hover:underline">
          Register
        </Link>
      </p>
    </>
  );
};

export default LoginForm;
