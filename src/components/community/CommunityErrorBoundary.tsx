
// ABOUTME: Specialized error boundary for community module with standardized error handling and fallback UI.

import React from 'react';
import { Alert, AlertDescription } from '../ui/alert';
import { Button } from '../ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface CommunityErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>;
}

interface CommunityErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class CommunityErrorBoundary extends React.Component<
  CommunityErrorBoundaryProps,
  CommunityErrorBoundaryState
> {
  constructor(props: CommunityErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): CommunityErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Community Error Boundary caught an error:', error, errorInfo);
  }

  resetError = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const Fallback = this.props.fallback;
        return <Fallback error={this.state.error!} resetError={this.resetError} />;
      }

      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-6">
          <Alert variant="destructive" className="max-w-md">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="mt-2">
              Ocorreu um erro na comunidade. Tente recarregar a página ou entre em contato conosco se o problema persistir.
            </AlertDescription>
          </Alert>
          <Button
            variant="outline"
            onClick={this.resetError}
            className="mt-4"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Tentar Novamente
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
