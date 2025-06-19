
// ABOUTME: Form component for creating new community posts with enhanced multimedia support and comprehensive validation.

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { TiptapEditor } from './TiptapEditor';
import { ImageUploadZone } from './ImageUploadZone';
import { VideoUrlInput } from './VideoUrlInput';
import { PollCreator } from './PollCreator';
import { useCreateCommunityPostMutation } from '../../../packages/hooks/useCreateCommunityPostMutation';
import { toast } from 'sonner';
import { Loader2, AlertCircle, Type, Image, Video, BarChart3 } from 'lucide-react';
import { Alert, AlertDescription } from '../ui/alert';

const CATEGORIES = [
  { value: 'general', label: 'Discussão Geral' },
  { value: 'review_discussion', label: 'Discussão de Review' },
  { value: 'question', label: 'Perguntas' },
  { value: 'announcement', label: 'Anúncios' }
];

const POST_TYPES = [
  { value: 'text', label: 'Texto', icon: Type },
  { value: 'image', label: 'Imagem', icon: Image },
  { value: 'video', label: 'Vídeo', icon: Video },
  { value: 'poll', label: 'Enquete', icon: BarChart3 }
];

interface PostFormData {
  title: string;
  category: string;
  content: string;
  post_type: 'text' | 'image' | 'video' | 'poll';
}

interface PollData {
  question: string;
  options: Array<{ id: string; text: string }>;
  expiresAt?: string;
}

export const CreatePostForm = () => {
  const navigate = useNavigate();
  const createPostMutation = useCreateCommunityPostMutation();
  
  // Multimedia state
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [pollData, setPollData] = useState<PollData | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const form = useForm<PostFormData>({
    defaultValues: {
      title: '',
      category: 'general',
      content: '',
      post_type: 'text',
    },
    mode: 'onBlur',
  });

  const postType = form.watch('post_type');

  // Enhanced content validation function
  const validateContent = (value: string) => {
    // For polls, content is optional as the poll provides the main content
    if (postType === 'poll' && pollData) {
      return true;
    }
    
    if (!value || value.trim() === '' || value === '<p></p>') {
      return 'Conteúdo é obrigatório';
    }
    
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

  // Multimedia validation
  const validateMultimedia = () => {
    switch (postType) {
      case 'image':
        if (!selectedImage) {
          toast.error('Selecione uma imagem para o post.');
          return false;
        }
        break;
      case 'video':
        if (!videoUrl.trim()) {
          toast.error('Adicione uma URL de vídeo válida.');
          return false;
        }
        break;
      case 'poll':
        if (!pollData || !pollData.question.trim() || pollData.options.filter(opt => opt.text.trim()).length < 2) {
          toast.error('A enquete deve ter uma pergunta e pelo menos 2 opções.');
          return false;
        }
        break;
    }
    return true;
  };

  const handleImageSelect = (file: File) => {
    setSelectedImage(file);
  };

  const handleImageRemove = () => {
    setSelectedImage(null);
  };

  const handleVideoUrlChange = (url: string) => {
    setVideoUrl(url);
  };

  const handleVideoUrlRemove = () => {
    setVideoUrl('');
  };

  const handlePollDataChange = (data: PollData) => {
    setPollData(data);
  };

  const handlePollRemove = () => {
    setPollData(null);
  };

  const onSubmit = async (data: PostFormData) => {
    console.log('Form submission started:', { 
      title: data.title, 
      category: data.category, 
      postType: data.post_type,
      contentLength: data.content.length 
    });

    // Validate multimedia content
    if (!validateMultimedia()) {
      return;
    }

    // Final content validation
    const contentValidation = validateContent(data.content);
    if (contentValidation !== true) {
      toast.error(contentValidation);
      return;
    }

    try {
      // Prepare payload based on post type
      const payload: any = {
        title: data.title.trim() || null,
        content: data.content || '',
        category: data.category,
        post_type: data.post_type,
      };

      // Add multimedia data based on type
      switch (data.post_type) {
        case 'image':
          if (selectedImage) {
            // For now, we'll use a placeholder URL since we don't have storage setup
            // In a real implementation, you'd upload the image first
            payload.image_url = URL.createObjectURL(selectedImage);
          }
          break;
        case 'video':
          payload.video_url = videoUrl;
          break;
        case 'poll':
          if (pollData) {
            payload.poll_data = {
              question: pollData.question,
              options: pollData.options.filter(opt => opt.text.trim()).map(opt => opt.text.trim()),
              expires_at: pollData.expiresAt || null
            };
          }
          break;
      }

      const result = await createPostMutation.mutateAsync(payload);

      console.log('Post creation successful:', result);
      
      toast.success('Discussão criada com sucesso!', {
        description: `${data.post_type === 'poll' ? 'Enquete' : 'Post'} publicado e visível para a comunidade.`,
      });
      
      // Reset form and multimedia state
      form.reset();
      setSelectedImage(null);
      setVideoUrl('');
      setPollData(null);
      
      navigate('/comunidade');
      
    } catch (error) {
      console.error('Post creation failed:', error);
      
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
    const hasChanges = form.formState.isDirty || selectedImage || videoUrl || pollData;
    
    if (hasChanges) {
      const shouldDiscard = window.confirm(
        'Você tem alterações não salvas. Deseja realmente cancelar?'
      );
      if (!shouldDiscard) return;
    }
    
    navigate('/comunidade');
  };

  const errors = form.formState.errors;
  const hasErrors = Object.keys(errors).length > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Criar Nova Discussão</CardTitle>
      </CardHeader>
      <CardContent>
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
            {/* Post Type Selection */}
            <FormField
              control={form.control}
              name="post_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Post *</FormLabel>
                  <Tabs value={field.value} onValueChange={field.onChange} className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                      {POST_TYPES.map((type) => (
                        <TabsTrigger key={type.value} value={type.value} className="flex items-center gap-2">
                          <type.icon className="w-4 h-4" />
                          <span className="hidden sm:inline">{type.label}</span>
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </Tabs>
                </FormItem>
              )}
            />

            {/* Title Field */}
            <FormField
              control={form.control}
              name="title"
              rules={{
                minLength: {
                  value: 5,
                  message: 'Título deve ter pelo menos 5 caracteres'
                },
                maxLength: {
                  value: 200,
                  message: 'Título deve ter no máximo 200 caracteres'
                },
                validate: (value) => {
                  // Title is optional for polls if they have a question
                  if (postType === 'poll' && pollData?.question.trim() && !value?.trim()) {
                    return true;
                  }
                  if (value && value.trim().length < 5) {
                    return 'Título deve ter pelo menos 5 caracteres (sem contar espaços)';
                  }
                  return true;
                }
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Título {postType === 'poll' ? '(Opcional se a enquete tiver pergunta)' : '*'}
                  </FormLabel>
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

            {/* Multimedia Content based on post type */}
            {postType === 'image' && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Imagem *</label>
                <ImageUploadZone
                  onImageSelect={handleImageSelect}
                  selectedImage={selectedImage}
                  onImageRemove={handleImageRemove}
                  isUploading={isUploadingImage}
                />
              </div>
            )}

            {postType === 'video' && (
              <VideoUrlInput
                value={videoUrl}
                onChange={handleVideoUrlChange}
                onRemove={handleVideoUrlRemove}
              />
            )}

            {postType === 'poll' && (
              <PollCreator
                value={pollData || undefined}
                onChange={handlePollDataChange}
                onRemove={handlePollRemove}
              />
            )}

            {/* Rich Text Content Field */}
            <FormField
              control={form.control}
              name="content"
              rules={{
                validate: validateContent
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Conteúdo {postType === 'poll' ? '(Opcional)' : '*'}
                  </FormLabel>
                  <FormControl>
                    <TiptapEditor
                      content={field.value}
                      onChange={field.onChange}
                      placeholder={
                        postType === 'poll' 
                          ? "Adicione detalhes opcionais sobre a enquete..."
                          : "Escreva o conteúdo da sua discussão aqui..."
                      }
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
