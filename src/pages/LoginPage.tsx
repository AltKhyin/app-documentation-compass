
// ABOUTME: The login page for users to sign in.
import AuthLayout from '@/components/auth/AuthLayout';
import LoginForm from '@/components/auth/LoginForm';
import { Link } from 'react-router-dom';

const LoginPage = () => {
  return (
    <AuthLayout>
      <h2 className="text-2xl font-semibold text-center text-foreground mb-6">Login</h2>
      <LoginForm />
      <p className="text-center text-sm text-muted-foreground mt-6">
        Não tem uma conta?{' '}
        <Link to="/signup" className="font-semibold text-primary hover:underline">
          Cadastre-se
        </Link>
      </p>
    </AuthLayout>
  );
};

export default LoginPage;
