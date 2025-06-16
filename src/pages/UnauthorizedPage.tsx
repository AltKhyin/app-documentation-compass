
// ABOUTME: Page shown when user lacks sufficient permissions for a protected route.
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Shield, ArrowLeft } from 'lucide-react';

const UnauthorizedPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { requiredRole, userRole } = location.state || {};

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <div className="p-4 bg-destructive/10 rounded-full">
            <Shield className="h-12 w-12 text-destructive" />
          </div>
        </div>
        
        <div className="space-y-3">
          <h1 className="text-2xl font-bold text-foreground font-serif">
            Acesso Negado
          </h1>
          <p className="text-muted-foreground">
            Você não possui permissão para acessar esta página.
          </p>
          {requiredRole && userRole && (
            <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
              <strong>Necessário:</strong> {requiredRole} <br />
              <strong>Seu nível:</strong> {userRole}
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button 
            variant="outline" 
            onClick={handleGoBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
          <Button 
            onClick={handleGoHome}
            className="flex items-center gap-2"
          >
            Ir para Início
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
