
// ABOUTME: Individual post card component with voting buttons, author information, moderation indicators, and integrated save functionality.

import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import type { CommunityPost } from '../../../packages/hooks/useCommunityPageQuery';
import { VoteButtons } from './VoteButtons';
import { PostActionMenu } from './PostActionMenu';
import { PostActionBar } from './PostActionBar';
import { MessageCircle, Pin, Lock, Bookmark, BookmarkCheck } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useSavePostMutation } from '../../../packages/hooks/useSavePostMutation';
import { toast } from 'sonner';
import { Button } from '../ui/button';

interface PostCardProps {
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

export const PostCard = ({ post }: PostCardProps) => {
  const navigate = useNavigate();
  const savePostMutation = useSavePostMutation();
  const categoryLabel = CATEGORY_LABELS[post.category] || post.category;
  const categoryColor = CATEGORY_COLORS[post.category] || 'default';

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking on interactive elements
    const target = e.target as HTMLElement;
    if (
      target.closest('button') || 
      target.closest('[role="button"]') ||
      target.closest('a')
    ) {
      return;
    }
    
    navigate(`/comunidade/${post.id}`);
  };

  const handleSave = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card navigation
    
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

  return (
    <Card 
      className={cn(
        "hover:shadow-md transition-all cursor-pointer",
        post.is_pinned && "ring-2 ring-primary/20 bg-primary/5"
      )}
      onClick={handleCardClick}
    >
      <CardContent className="p-6">
        <div className="flex gap-4">
          {/* Vote buttons */}
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
            {/* Header with moderation indicators and action menu */}
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <Avatar className="w-8 h-8 flex-shrink-0">
                  <AvatarImage src={post.author?.avatar_url || undefined} />
                  <AvatarFallback>
                    {post.author?.full_name?.charAt(0) || '?'}
                  </AvatarFallback>
                </Avatar>
                
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-sm truncate">
                      {post.author?.full_name || 'Usuário Anônimo'}
                    </span>
                    <span className="text-muted-foreground text-xs">•</span>
                    <span className="text-muted-foreground text-xs">
                      {formatDistanceToNow(new Date(post.created_at), {
                        addSuffix: true,
                        locale: ptBR
                      })}
                    </span>
                    
                    {/* Moderation indicators */}
                    {post.is_pinned && (
                      <>
                        <span className="text-muted-foreground text-xs">•</span>
                        <div className="flex items-center gap-1 text-primary">
                          <Pin className="w-3 h-3" />
                          <span className="text-xs font-medium">Fixado</span>
                        </div>
                      </>
                    )}
                    
                    {post.is_locked && (
                      <>
                        <span className="text-muted-foreground text-xs">•</span>
                        <div className="flex items-center gap-1 text-orange-500">
                          <Lock className="w-3 h-3" />
                          <span className="text-xs font-medium">Bloqueado</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                {/* Custom flair */}
                {post.flair_text && (
                  <Badge 
                    variant="secondary" 
                    className="text-xs"
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

                {/* Save button - NEW */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSave}
                  disabled={savePostMutation.isPending}
                  className={cn(
                    "h-8 w-8 p-0 transition-colors",
                    post.is_saved 
                      ? "text-primary hover:text-primary/80" 
                      : "text-muted-foreground hover:text-foreground"
                  )}
                  title={post.is_saved ? 'Remover dos salvos' : 'Salvar post'}
                >
                  {post.is_saved ? (
                    <BookmarkCheck className="w-4 h-4" />
                  ) : (
                    <Bookmark className="w-4 h-4" />
                  )}
                </Button>

                {/* Post Action Menu */}
                <PostActionMenu post={post} />
              </div>
            </div>

            {/* Title */}
            {post.title && (
              <h3 className="font-semibold text-foreground mb-2 leading-tight hover:text-primary transition-colors">
                {post.title}
              </h3>
            )}

            {/* Content preview */}
            <div 
              className="prose dark:prose-invert prose-sm max-w-none text-muted-foreground line-clamp-3 mb-3"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Footer with action bar */}
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <PostActionBar post={post} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
