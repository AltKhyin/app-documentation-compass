
// ABOUTME: The login page for users to sign in.
import SplitScreenAuthLayout from '@/components/auth/SplitScreenAuthLayout';
import LoginForm from '@/components/auth/LoginForm';

const LoginPage = () => {
  return (
    <SplitScreenAuthLayout>
      <LoginForm />
    </SplitScreenAuthLayout>
  );
};

export default LoginPage;
