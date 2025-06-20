
// ABOUTME: Authentication page with login and signup forms following Blueprint 01

import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';
import SignupForm from '../components/auth/SignupForm';
import SplitScreenAuthLayout from '../components/auth/SplitScreenAuthLayout';
import { useAuthStore } from '../store/auth';
import { Button } from '../components/ui/button';

export default function AuthPage() {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const { user, isLoading } = useAuthStore();

  // Redirect authenticated users to main app
  if (user && !isLoading) {
    return <Navigate to="/" replace />;
  }

  return (
    <SplitScreenAuthLayout>
      <div className="w-full max-w-md mx-auto space-y-6">
        {/* Auth Forms */}
        {isLoginMode ? <LoginForm /> : <SignupForm />}

        {/* Toggle Mode */}
        <div className="text-center pt-4 border-t border-gray-200">
          <Button
            variant="ghost"
            onClick={() => setIsLoginMode(!isLoginMode)}
            className="text-blue-600 hover:text-blue-700"
          >
            {isLoginMode ? 'Criar conta' : 'Fazer login'}
          </Button>
        </div>
      </div>
    </SplitScreenAuthLayout>
  );
}
