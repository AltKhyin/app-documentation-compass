
// ABOUTME: Reddit-style detailed post card with horizontal votes and separator-based layout for individual post pages.

import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Pin, Lock, Bookmark, BookmarkCheck, Share2 } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '../../lib/utils';
import type { CommunityPost } from '@/types';
import { VoteButtons } from './VoteButtons';
import { PostActionMenu } from './PostActionMenu';
import { useSavePostMutation } from '../../../packages/hooks/useSavePostMutation';

interface PostDetailCardProps {
  post: CommunityPost;
}

const CATEGORY_LABELS: Record<string, string> = {
  general: 'Discussão Geral',
  review_discussion: 'Review',
  question: 'Pergunta',
  announcement: 'Anúncio'
};

const CATEGORY_COLORS: Record<string, string> = {
  general: 'default',
  review_discussion: 'secondary',
  question: 'outline',
  announcement: 'destructive'
};

export const PostDetailCard = ({ post }: PostDetailCardProps) => {
  const savePostMutation = useSavePostMutation();
  const categoryLabel = CATEGORY_LABELS[post.category] || post.category;
  const categoryColor = CATEGORY_COLORS[post.category] || 'default';

  const handleSave = async () => {
    try {
      await savePostMutation.mutateAsync({
        post_id: post.id,
        is_saved: !post.is_saved
      });
      
      toast.success(
        post.is_saved ? 'Post removido dos salvos' : 'Post salvo com sucesso'
      );
    } catch (error) {
      toast.error('Erro ao salvar post. Tente novamente.');
    }
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: post.title || 'Post da Comunidade EVIDENS',
        text: post.content ? post.content.substring(0, 200) + '...' : '',
        url: window.location.href
      });
    } catch (error) {
      // Fallback to copying URL to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Link copiado para a área de transferência');
      } catch (clipboardError) {
        toast.error('Erro ao compartilhar post');
      }
    }
  };

  return (
    <div className={cn(
      "reddit-post-item mb-6",
      post.is_pinned && "ring-2 ring-primary/20 bg-primary/5"
    )}>
      <div className="flex gap-6 p-8">
        {/* Vote buttons - now horizontal */}
        <div className="flex-shrink-0">
          <VoteButtons
            postId={post.id}
            upvotes={post.upvotes}
            downvotes={post.downvotes}
            userVote={post.user_vote}
          />
        </div>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Header with author info and metadata */}
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <Avatar className="w-10 h-10 flex-shrink-0">
                <AvatarImage src={post.author?.avatar_url || undefined} />
                <AvatarFallback>
                  {post.author?.full_name?.charAt(0) || '?'}
                </AvatarFallback>
              </Avatar>
              
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="font-semibold text-base">
                    {post.author?.full_name || 'Usuário Anônimo'}
                  </span>
                  
                  {/* Moderation indicators */}
                  {post.is_pinned && (
                    <>
                      <span className="text-muted-foreground text-sm">•</span>
                      <div className="flex items-center gap-1 text-primary">
                        <Pin className="w-4 h-4" />
                        <span className="text-sm font-medium">Fixado</span>
                      </div>
                    </>
                  )}
                  
                  {post.is_locked && (
                    <>
                      <span className="text-muted-foreground text-sm">•</span>
                      <div className="flex items-center gap-1 text-orange-500">
                        <Lock className="w-4 h-4" />
                        <span className="text-sm font-medium">Bloqueado</span>
                      </div>
                    </>
                  )}
                </div>
                
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <span>
                    {formatDistanceToNow(new Date(post.created_at), {
                      addSuffix: true,
                      locale: ptBR
                    })}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Custom flair */}
              {post.flair_text && (
                <Badge 
                  variant="secondary" 
                  className="text-sm"
                  style={{ 
                    backgroundColor: post.flair_color ? `${post.flair_color}20` : undefined,
                    borderColor: post.flair_color || undefined,
                    color: post.flair_color || undefined
                  }}
                >
                  {post.flair_text}
                </Badge>
              )}
              
              {/* Category badge */}
              <Badge variant={categoryColor as any} className="flex-shrink-0">
                {categoryLabel}
              </Badge>

              {/* Post Action Menu */}
              <PostActionMenu post={post} />
            </div>
          </div>

          {/* Title */}
          {post.title && (
            <h1 className="reddit-post-title text-2xl mb-4">
              {post.title}
            </h1>
          )}

          {/* Full content */}
          <div 
            className="prose dark:prose-invert prose-lg max-w-none text-foreground mb-6"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Media content */}
          {post.image_url && (
            <div className="mb-6">
              <img 
                src={post.image_url} 
                alt="Post image" 
                className="rounded-lg max-w-full h-auto"
              />
            </div>
          )}

          {post.video_url && (
            <div className="mb-6">
              <video 
                src={post.video_url} 
                controls 
                className="rounded-lg max-w-full h-auto"
              />
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {post.reply_count > 0 ? `${post.reply_count} respostas` : 'Nenhuma resposta'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSave}
                disabled={savePostMutation.isPending}
                className={cn(
                  "text-muted-foreground hover:text-foreground",
                  post.is_saved && "text-primary hover:text-primary"
                )}
              >
                {post.is_saved ? (
                  <BookmarkCheck className="w-4 h-4" />
                ) : (
                  <Bookmark className="w-4 h-4" />
                )}
                <span className="ml-1 text-sm">
                  {post.is_saved ? 'Salvo' : 'Salvar'}
                </span>
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleShare}
                className="text-muted-foreground hover:text-foreground"
              >
                <Share2 className="w-4 h-4" />
                <span className="ml-1 text-sm">Compartilhar</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
