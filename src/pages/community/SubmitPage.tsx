
// ABOUTME: Dedicated page for creating new community posts with rich editor

import React from 'react';
import { CreatePostForm } from '../../components/community/CreatePostForm';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { useNavigate } from 'react-router-dom';

const SubmitPage = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="space-y-6">
        {/* Header with back button */}
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/comunidade')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para Comunidade
          </Button>
        </div>

        <div className="border-l-4 border-primary bg-muted/50 p-6 rounded-r-lg">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Criar Nova Publicação
          </h1>
          <p className="text-muted-foreground">
            Compartilhe insights, faça perguntas ou inicie discussões com a comunidade.
          </p>
        </div>

        {/* Post Creation Form */}
        <div className="bg-surface rounded-lg p-6">
          <CreatePostForm />
        </div>
      </div>
    </div>
  );
};

export default SubmitPage;
