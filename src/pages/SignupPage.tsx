
// ABOUTME: The signup page for new users to register.
import AuthLayout from '@/components/auth/AuthLayout';
import SignupForm from '@/components/auth/SignupForm';
import { Link } from 'react-router-dom';

const SignupPage = () => {
  return (
    <AuthLayout>
        <h2 className="text-2xl font-semibold text-center text-foreground mb-6">Criar Conta</h2>
        <SignupForm />
        <p className="text-center text-sm text-muted-foreground mt-6">
            Já tem uma conta?{' '}
            <Link to="/login" className="font-semibold text-primary hover:underline">
                Faça login
            </Link>
        </p>
    </AuthLayout>
  );
};

export default SignupPage;
