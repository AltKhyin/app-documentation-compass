
// ABOUTME: The main application shell controller with integrated error boundary protection.

import React from 'react';
import { Outlet } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAppData } from '@/contexts/AppDataContext';
import { ErrorBoundary } from '../ErrorBoundary';
import DesktopShell from './DesktopShell';
import MobileShell from './MobileShell';
import { Skeleton } from '@/components/ui/skeleton';

const AppShell = () => {
  const isMobile = useIsMobile();
  const { isLoading: isAppDataLoading, isError, error } = useAppData();

  console.log('AppShell render state:', { 
    isMobile, 
    isAppDataLoading, 
    isError, 
    error: error?.message 
  });

  // Show error state if data fetching failed
  if (isError) {
    console.error('AppShell: App data error:', error);
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="text-center space-y-4 max-w-md mx-auto p-6">
          <h1 className="text-2xl font-bold text-foreground">Erro ao carregar aplicativo</h1>
          <p className="text-muted-foreground">
            {error?.message || 'Ocorreu um erro inesperado. Tente novamente.'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-primary text-primary-foreground px-6 py-2 rounded-md font-semibold hover:bg-primary/90 transition-colors"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  // Data-Ready Guard - show skeleton while loading
  if (isAppDataLoading) {
    console.log('AppShell: Showing loading skeleton');
    return (
        <div className="flex h-screen w-full bg-background">
            {/* Sidebar Skeleton for Desktop */}
            <div className="hidden md:flex flex-col w-60 border-r p-4 space-y-4">
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <div className="mt-auto">
                    <Skeleton className="h-12 w-full" />
                </div>
            </div>
            {/* Main Content Skeleton */}
            <div className="flex-1 p-6 space-y-6">
                <div className="flex justify-end">
                    <Skeleton className="h-10 w-10 rounded-full" />
                </div>
                <Skeleton className="w-full h-96" />
                <Skeleton className="h-8 w-64" />
                <div className="flex gap-4">
                    <Skeleton className="w-64 h-48" />
                    <Skeleton className="w-64 h-48" />
                    <Skeleton className="w-64 h-48" />
                </div>
            </div>
        </div>
    );
  }

  console.log('AppShell: Rendering shell with data ready');

  // Shell Component Factory
  const ShellComponent = isMobile ? MobileShell : DesktopShell;
  
  return (
    <ShellComponent>
      {/* Tier 2: Page Content Error Boundary - Isolates page crashes from shell */}
      <ErrorBoundary 
        tier="page"
        context="conteúdo da página"
        showDetails={false}
        showHomeButton={true}
        showBackButton={true}
      >
        <Outlet />
      </ErrorBoundary>
    </ShellComponent>
  );
};

export default AppShell;
