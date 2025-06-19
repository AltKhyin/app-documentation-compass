
// ABOUTME: Enhanced community post creation mutation with support for new post types and structured content

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../src/integrations/supabase/client';
import { useToast } from '../../src/hooks/use-toast';

interface CreatePostPayload {
  title?: string;
  content: string;
  category: string;
  post_type?: 'text' | 'image' | 'link' | 'poll';
  structured_content?: Record<string, any>;
}

interface CreatePostResponse {
  id: number;
  title: string | null;
  content: string;
  category: string;
  post_type: string;
  structured_content: Record<string, any> | null;
  upvotes: number;
  created_at: string;
  author_id: string;
}

const createCommunityPost = async (payload: CreatePostPayload): Promise<CreatePostResponse> => {
  console.log('Creating community post with enhanced payload:', payload);
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('Authentication required');
  }

  // Call the edge function instead of RPC to avoid type issues
  const { data, error } = await supabase.functions.invoke('create-community-post', {
    body: {
      title: payload.title?.trim() || null,
      content: payload.content.trim(),
      category: payload.category,
    }
  });

  if (error) {
    console.error('Create post function error:', error);
    throw new Error(error.message || 'Failed to create post');
  }

  console.log('Community post created successfully:', data);
  return {
    id: data.post_id,
    title: payload.title || null,
    content: payload.content,
    category: payload.category,
    post_type: payload.post_type || 'text',
    structured_content: payload.structured_content || null,
    upvotes: 1, // Auto-vote applied
    created_at: new Date().toISOString(),
    author_id: user.id
  };
};

export const useCreateCommunityPostMutation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<CreatePostResponse, Error, CreatePostPayload>({
    mutationFn: createCommunityPost,
    onSuccess: () => {
      // Invalidate all relevant queries to reflect the new post
      queryClient.invalidateQueries({ queryKey: ['community-feed'] });
      queryClient.invalidateQueries({ queryKey: ['community-sidebar'] });
      
      toast({
        title: 'Post criado!',
        description: 'Sua publicação foi criada com sucesso.'
      });
    },
    onError: (error) => {
      console.error('Create post mutation error:', error);
      toast({
        title: 'Erro ao criar post',
        description: error.message || 'Falha ao criar publicação',
        variant: 'destructive'
      });
    }
  });
};
