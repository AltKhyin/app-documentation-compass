
// ABOUTME: Form component for creating new community posts with rich text content, category selection, and single-submission workflow.

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
import { Loader2 } from 'lucide-react';

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
  });

  const onSubmit = async (data: PostFormData) => {
    if (!data.content.trim() || data.content === '<p></p>') {
      toast.error('Por favor, adicione conteúdo à sua discussão.');
      return;
    }

    try {
      await createPostMutation.mutateAsync({
        title: data.title,
        content: data.content,
        category: data.category,
        post_type: 'text',
        // Store HTML content directly in content field for simplicity
        // No structured_content JSON needed for this implementation
      });

      toast.success('Discussão criada com sucesso!');
      
      // Reset form and navigate back to community feed
      form.reset();
      navigate('/comunidade');
    } catch (error) {
      // Error handling is managed by the mutation hook
      console.error('Failed to create post:', error);
    }
  };

  const handleCancel = () => {
    navigate('/comunidade');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Criar Nova Discussão</CardTitle>
      </CardHeader>
      <CardContent>
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
                }
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Digite o título da sua discussão..."
                      {...field}
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
                  <FormLabel>Categoria</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
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
                validate: (value) => {
                  // Check if content is not just empty HTML
                  const tempDiv = document.createElement('div');
                  tempDiv.innerHTML = value;
                  const textContent = tempDiv.textContent || tempDiv.innerText;
                  return textContent.trim().length > 0 || 'Conteúdo não pode estar vazio';
                }
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Conteúdo</FormLabel>
                  <FormControl>
                    <TiptapEditor
                      content={field.value}
                      onChange={field.onChange}
                      placeholder="Escreva o conteúdo da sua discussão aqui..."
                      className="min-h-[300px]"
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
                disabled={createPostMutation.isPending}
              >
                {createPostMutation.isPending && (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                )}
                Publicar Discussão
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
