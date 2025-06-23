
// ABOUTME: Main content management page for admin users to manage publication workflow

import React from 'react';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { ContentQueue } from '@/components/admin/ContentManagement/ContentQueue';

const ContentManagement = () => {
  return (
    <ErrorBoundary 
      tier="page"
      context="gestão de conteúdo"
      showDetails={false}
      showHomeButton={true}
      showBackButton={true}
    >
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Content Management
          </h1>
          <p className="text-gray-600">
            Manage the publication workflow for all reviews and content.
          </p>
        </div>
        
        <ContentQueue />
      </div>
    </ErrorBoundary>
  );
};

export default ContentManagement;
