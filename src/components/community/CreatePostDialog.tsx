
// ABOUTME: Dialog component for creating new community posts with form validation and category selection.

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Label } from '../ui/label';
import { Loader2 } from 'lucide-react';
import { useCreateCommunityPostMutation } from '../../../packages/hooks/useCreateCommunityPostMutation';
import { toast } from 'sonner';

interface CreatePostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultCategory?: string;
}

const CATEGORIES = [
  { value: 'general', label: 'Discussão Geral' },
  { value: 'review_discussion', label: 'Discussão de Review' },
  { value: 'question', label: 'Pergunta' },
  { value: 'announcement', label: 'Anúncio' }
];

export const CreatePostDialog = ({ open, onOpenChange, defaultCategory = 'general' }: CreatePostDialogProps) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState(defaultCategory);
  
  const createPostMutation = useCreateCommunityPostMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      toast.error('O conteúdo da discussão é obrigatório');
      return;
    }

    try {
      await createPostMutation.mutateAsync({
        title: title.trim() || undefined,
        content: content.trim(),
        category
      });
      
      toast.success('Discussão criada com sucesso!');
      setTitle('');
      setContent('');
      setCategory(defaultCategory);
      onOpenChange(false);
    } catch (error) {
      toast.error('Erro ao criar discussão. Tente novamente.');
    }
  };

  const handleClose = () => {
    if (!createPostMutation.isPending) {
      setTitle('');
      setContent('');
      setCategory(defaultCategory);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Nova Discussão</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="category">Categoria</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map(cat => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Título (Opcional)</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Dê um título para sua discussão..."
              maxLength={200}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Conteúdo *</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Compartilhe suas ideias, perguntas ou insights..."
              rows={6}
              required
              maxLength={2000}
            />
            <p className="text-xs text-muted-foreground">
              {content.length}/2000 caracteres
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={createPostMutation.isPending}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={!content.trim() || createPostMutation.isPending}
            >
              {createPostMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Criando...
                </>
              ) : (
                'Criar Discussão'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
