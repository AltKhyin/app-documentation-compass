
// ABOUTME: Branded community header component with banner, avatar, and action row per Community v2.0 design

import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Search, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '../../hooks/use-mobile';
import { cn } from '../../lib/utils';

interface Community {
  id: string;
  name: string;
  description: string | null;
  avatar_url: string | null;
  banner_url: string | null;
  member_count: number;
}

interface CommunityHeaderProps {
  community: Community;
}

export const CommunityHeader = ({ community }: CommunityHeaderProps) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const handleCreatePost = () => {
    navigate('/community/submit');
  };

  return (
    <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-primary/10 to-secondary/10">
      {/* Banner Background */}
      {community.banner_url && (
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${community.banner_url})` }}
        />
      )}
      
      {/* Dark Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
      
      {/* Content */}
      <div className="relative p-6 pb-20">
        <div className="flex items-start gap-4">
          {/* Community Avatar - overlapping the banner */}
          <div className="relative">
            <Avatar className={cn("border-4 border-background shadow-lg", isMobile ? "w-16 h-16" : "w-20 h-20")}>
              <AvatarImage src={community.avatar_url || undefined} />
              <AvatarFallback className="bg-primary text-primary-foreground text-xl font-bold">
                {community.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
          </div>
          
          {/* Community Info */}
          <div className="flex-1 min-w-0">
            <h1 className={cn("font-bold text-foreground mb-1", isMobile ? "text-xl" : "text-2xl")}>
              {community.name}
            </h1>
            {community.description && (
              <p className={cn("text-muted-foreground", isMobile ? "text-sm" : "text-base")}>
                {community.description}
              </p>
            )}
            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
              <span>{community.member_count.toLocaleString()} membros</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Action Row - positioned at bottom of header */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-background/95 backdrop-blur-sm border-t">
        <div className={cn("flex gap-4", isMobile ? "flex-col" : "flex-row items-center")}>
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Buscar discussões..." 
              className="pl-10 bg-background/80"
            />
          </div>
          
          {/* Create Post Button */}
          <Button onClick={handleCreatePost} className={cn(isMobile ? "w-full" : "")}>
            <Plus className="w-4 h-4 mr-2" />
            Nova Publicação
          </Button>
        </div>
      </div>
    </div>
  );
};
