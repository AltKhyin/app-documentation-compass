
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

  // Use the existing optimized RPC function
  const { data, error } = await supabase.rpc('create_post_and_auto_vote', {
    p_author_id: user.id,
    p_title: payload.title?.trim() || null,
    p_content: payload.content.trim(),
    p_category: payload.category,
  });

  if (error) {
    console.error('Create post RPC error:', error);
    throw new Error(error.message || 'Failed to create post');
  }

  // If we have enhanced fields, update the post with additional data
  if (payload.post_type !== 'text' || payload.structured_content) {
    const { error: updateError } = await supabase
      .from('CommunityPosts')
      .update({
        post_type: payload.post_type || 'text',
        structured_content: payload.structured_content || null
      })
      .eq('id', data.id);

    if (updateError) {
      console.error('Failed to update post with enhanced fields:', updateError);
      // Don't throw here as the post was created successfully
    }
  }

  console.log('Community post created successfully:', data);
  return data;
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
