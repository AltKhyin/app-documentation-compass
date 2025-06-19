
// ABOUTME: Form component for creating new community posts with enhanced validation and comprehensive error handling.

import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { TiptapEditor } from './TiptapEditor';
import { useCreateCommunityPostMutation } from '../../../packages/hooks/useCreateCommunityPostMutation';
import { toast } from 'sonner';
import { Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '../ui/alert';

const CATEGORIES = [
  { value: 'general', label: 'Discussão Geral' },
  { value: 'review_discussion', label: 'Discussão de Review' },
  { value: 'question', label: 'Perguntas' },
  { value: 'announcement', label: 'Anúncios' }
];

interface PostFormData {
  title: string;
  category: string;
  content: string;
}

export const CreatePostForm = () => {
  const navigate = useNavigate();
  const createPostMutation = useCreateCommunityPostMutation();

  const form = useForm<PostFormData>({
    defaultValues: {
      title: '',
      category: 'general',
      content: '',
    },
    mode: 'onBlur', // Validate on blur for better UX
  });

  // Enhanced content validation function
  const validateContent = (value: string) => {
    if (!value || value.trim() === '' || value === '<p></p>') {
      return 'Conteúdo é obrigatório';
    }
    
    // Extract text content from HTML to validate meaningful content
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = value;
    const textContent = tempDiv.textContent || tempDiv.innerText || '';
    
    if (textContent.trim().length < 10) {
      return 'Conteúdo deve ter pelo menos 10 caracteres';
    }
    
    if (textContent.trim().length > 10000) {
      return 'Conteúdo deve ter no máximo 10.000 caracteres';
    }
    
    return true;
  };

  const onSubmit = async (data: PostFormData) => {
    console.log('Form submission started:', { 
      title: data.title, 
      category: data.category, 
      contentLength: data.content.length 
    });

    // Final validation before submission
    const contentValidation = validateContent(data.content);
    if (contentValidation !== true) {
      toast.error(contentValidation);
      return;
    }

    try {
      const result = await createPostMutation.mutateAsync({
        title: data.title.trim(),
        content: data.content,
        category: data.category,
        post_type: 'text',
      });

      console.log('Post creation successful:', result);
      
      // Show success feedback
      toast.success('Discussão criada com sucesso!', {
        description: 'Sua discussão foi publicada e está visível para a comunidade.',
      });
      
      // Reset form and navigate back to community feed
      form.reset();
      navigate('/comunidade');
      
    } catch (error) {
      console.error('Post creation failed:', error);
      
      // Enhanced error handling with specific messages
      if (error instanceof Error) {
        if (error.message.includes('Rate limit')) {
          toast.error('Muitas tentativas. Aguarde um momento antes de tentar novamente.');
        } else if (error.message.includes('VALIDATION')) {
          toast.error('Dados inválidos. Verifique o formulário e tente novamente.');
        } else if (error.message.includes('UNAUTHORIZED')) {
          toast.error('Sessão expirada. Faça login novamente.');
          navigate('/login');
        } else {
          toast.error('Erro ao criar discussão. Tente novamente em alguns instantes.');
        }
      } else {
        toast.error('Erro inesperado. Tente novamente.');
      }
    }
  };

  const handleCancel = () => {
    // Check if form has unsaved changes
    const hasChanges = form.formState.isDirty;
    
    if (hasChanges) {
      const shouldDiscard = window.confirm(
        'Você tem alterações não salvas. Deseja realmente cancelar?'
      );
      if (!shouldDiscard) return;
    }
    
    navigate('/comunidade');
  };

  // Get form errors for display
  const errors = form.formState.errors;
  const hasErrors = Object.keys(errors).length > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Criar Nova Discussão</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Display form-level errors */}
        {hasErrors && (
          <Alert className="mb-6" variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Por favor, corrija os erros abaixo antes de continuar.
            </AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Title Field */}
            <FormField
              control={form.control}
              name="title"
              rules={{
                required: 'Título é obrigatório',
                minLength: {
                  value: 5,
                  message: 'Título deve ter pelo menos 5 caracteres'
                },
                maxLength: {
                  value: 200,
                  message: 'Título deve ter no máximo 200 caracteres'
                },
                validate: (value) => {
                  const trimmed = value.trim();
                  if (trimmed.length < 5) {
                    return 'Título deve ter pelo menos 5 caracteres (sem contar espaços)';
                  }
                  return true;
                }
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Digite o título da sua discussão..."
                      {...field}
                      disabled={createPostMutation.isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Category Field */}
            <FormField
              control={form.control}
              name="category"
              rules={{ required: 'Categoria é obrigatória' }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoria *</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    value={field.value}
                    disabled={createPostMutation.isPending}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {CATEGORIES.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Rich Text Content Field */}
            <FormField
              control={form.control}
              name="content"
              rules={{
                required: 'Conteúdo é obrigatório',
                validate: validateContent
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Conteúdo *</FormLabel>
                  <FormControl>
                    <TiptapEditor
                      content={field.value}
                      onChange={field.onChange}
                      placeholder="Escreva o conteúdo da sua discussão aqui..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Form Actions */}
            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={createPostMutation.isPending}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={createPostMutation.isPending || hasErrors}
              >
                {createPostMutation.isPending && (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                )}
                {createPostMutation.isPending ? 'Publicando...' : 'Publicar Discussão'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
