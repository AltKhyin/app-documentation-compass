
// ABOUTME: Dialog component for creating new community posts with form validation.

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Loader2 } from 'lucide-react';
import { useCreateCommunityPostMutation } from '../../../packages/hooks/useCreateCommunityPostMutation';
import { useAuthStore } from '../../store/auth';
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
  const { user } = useAuthStore();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState(defaultCategory);

  const createPostMutation = useCreateCommunityPostMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error('Você precisa estar logado para criar uma discussão');
      return;
    }

    if (!content.trim()) {
      toast.error('O conteúdo é obrigatório');
      return;
    }

    try {
      await createPostMutation.mutateAsync({
        title: title.trim() || undefined,
        content: content.trim(),
        category
      });

      toast.success('Discussão criada com sucesso!');
      
      // Reset form
      setTitle('');
      setContent('');
      setCategory(defaultCategory);
      onOpenChange(false);
    } catch (error) {
      toast.error('Erro ao criar discussão. Tente novamente.');
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen && createPostMutation.isPending) {
      return; // Don't close while submitting
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Nova Discussão</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
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
            <Label htmlFor="title">Título (opcional)</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Digite um título para sua discussão..."
              maxLength={200}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Conteúdo *</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Compartilhe sua opinião, faça uma pergunta, ou inicie uma discussão..."
              rows={6}
              maxLength={2000}
              required
            />
            <div className="text-xs text-muted-foreground text-right">
              {content.length}/2000 caracteres
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={createPostMutation.isPending}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={createPostMutation.isPending || !content.trim()}
            >
              {createPostMutation.isPending && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              Publicar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
