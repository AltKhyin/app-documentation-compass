
// ABOUTME: Main layout component for admin dashboard with navigation and consistent structure

import React from 'react';
import { Outlet } from 'react-router-dom';
import { AdminNavigation } from './AdminNavigation';
import { Card } from '@/components/ui/card';

export const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Painel Administrativo
          </h1>
          <p className="text-gray-600">
            Gerencie conteúdo, usuários e configurações da plataforma
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <Card className="p-4">
              <AdminNavigation />
            </Card>
          </div>
          
          <div className="lg:col-span-3">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};
