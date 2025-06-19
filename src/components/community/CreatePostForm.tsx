
// ABOUTME: Enhanced post creation form with tabbed interface and rich text support

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Card, CardContent } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '../ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { useCreateCommunityPostMutation } from '../../../packages/hooks/useCreateCommunityPostMutation';
import { useNavigate } from 'react-router-dom';
import { FileText, Image, Link, BarChart3 } from 'lucide-react';

const createPostSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório').max(300, 'Título muito longo'),
  content: z.string().min(1, 'Conteúdo é obrigatório').max(10000, 'Conteúdo muito longo'),
  category: z.string().min(1, 'Categoria é obrigatória'),
  post_type: z.enum(['text', 'image', 'link', 'poll']).default('text')
});

type CreatePostForm = z.infer<typeof createPostSchema>;

const CATEGORIES = [
  { value: 'general', label: 'Discussão Geral' },
  { value: 'review_discussion', label: 'Discussão de Review' },
  { value: 'question', label: 'Perguntas' },
  { value: 'announcement', label: 'Anúncios' }
];

export const CreatePostForm = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('text');
  const createPostMutation = useCreateCommunityPostMutation();

  const form = useForm<CreatePostForm>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      title: '',
      content: '',
      category: '',
      post_type: 'text'
    }
  });

  const onSubmit = async (data: CreatePostForm) => {
    try {
      await createPostMutation.mutateAsync({
        title: data.title,
        content: data.content,
        category: data.category,
        post_type: activeTab as 'text' | 'image' | 'link' | 'poll'
      });
      
      // Navigate back to community on success
      navigate('/comunidade');
    } catch (error) {
      console.error('Failed to create post:', error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Post Type Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="text" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Texto
            </TabsTrigger>
            <TabsTrigger value="image" className="flex items-center gap-2">
              <Image className="w-4 h-4" />
              Imagem
            </TabsTrigger>
            <TabsTrigger value="link" className="flex items-center gap-2">
              <Link className="w-4 h-4" />
              Link
            </TabsTrigger>
            <TabsTrigger value="poll" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Enquete
            </TabsTrigger>
          </TabsList>

          {/* Title and Category - Common to all types */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Digite o título da sua publicação..." 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoria *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
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
          </div>

          {/* Content Tabs */}
          <TabsContent value="text" className="space-y-4">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Conteúdo *</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Escreva o conteúdo da sua publicação..."
                      className="min-h-[200px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>

          <TabsContent value="image" className="space-y-4">
            <Card>
              <CardContent className="p-6">
                <p className="text-muted-foreground text-center">
                  Funcionalidade de upload de imagens em desenvolvimento.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="link" className="space-y-4">
            <Card>
              <CardContent className="p-6">
                <p className="text-muted-foreground text-center">
                  Funcionalidade de links em desenvolvimento.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="poll" className="space-y-4">
            <Card>
              <CardContent className="p-6">
                <p className="text-muted-foreground text-center">
                  Funcionalidade de enquetes em desenvolvimento.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Submit Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button 
            type="button" 
            variant="outline"
            onClick={() => navigate('/comunidade')}
          >
            Cancelar
          </Button>
          <Button 
            type="submit" 
            disabled={createPostMutation.isPending}
          >
            {createPostMutation.isPending ? 'Publicando...' : 'Publicar'}
          </Button>
        </div>
      </form>
    </Form>
  );
};
