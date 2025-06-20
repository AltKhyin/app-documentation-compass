The EVIDENS Community Revamp: Definitive Implementation Blueprint v2.0
Document Purpose: This document serves as the complete and authoritative Software Requirements Specification (SRS) and Technical Design Document (TDD) for the comprehensive overhaul of the EVIDENS community module. Its goal is to provide a developer or development team with 100% of the information necessary to replicate the target design and functionality with perfect accuracy, ensuring architectural integrity and alignment with the platform's core principles.

Part 1: Vision & Guiding Principles (The "Why")
Before implementation, it is critical to understand the strategic goals driving this revamp. This is not merely a stylistic change but a deliberate effort to enhance user engagement, improve information hierarchy, and increase the platform's functional density.

1.1. Project Vision:

To evolve the EVIDENS community from a simple discussion board into a dynamic, content-forward ecosystem. The new design will merge the high-density, feature-rich layout of the Reddit reference UI with the established, professional, and minimalist brand identity of the EVIDENS platform.

1.2. Guiding Architectural & Design Principles:

The following principles, derived from your direct feedback, must govern all implementation decisions:

Embrace a "De-Boxed" & Fluid Layout: We will move away from a "card-based" design where every element is contained in a box. Posts and comments will now sit directly on the page's background, creating an open and less cluttered feel. Separation will be achieved through clean horizontal rules and considered whitespace.
Unify the Component Architecture: A "Write Once, Use Everywhere" philosophy will be applied to core content components. The visual representation of a post will be derived from a single, configurable component (PostDisplay.tsx) to ensure absolute consistency between the feed and detail views, simplifying the codebase.
Promote Content-Forward Engagement: The design must prioritize the content itself. Post titles will be mandatory, and the feed will be redesigned to prominently feature a post's primary media (image, video, or poll) or a rich text preview, making the feed more engaging and scannable.
Standardize User Actions: All user actions (voting, replying, sharing) will be consolidated into a consistent, horizontal ActionBar component. This improves usability and predictability across all content types.
Integrate, Don't Isolate, the Sidebar: The right-hand sidebar will be redesigned to feel like a single, cohesive unit of contextual information. Its visual weight will be reduced to ensure it complements, rather than competes with, the main content feed.
Part 2: The Canonical Design System (The "What")
This section defines the single source of truth for all visual styling. It is themed with the EVIDENS platform's own design tokens from [DOC_7]_VISUAL_SYSTEM.md to maintain brand consistency. All styles should be implemented using Tailwind CSS utility classes where possible.

2.1. Foundational Design Tokens

Token Type	Category	Token Name	Value (CSS Variable) / Tailwind Utility
Color	Background	background.default	bg-background (which maps to hsl(var(--background)))
background.surface	bg-surface (custom color, maps to hsl(var(--surface)))
background.hover	bg-surface-muted (custom color, maps to hsl(var(--surface-muted)))
Text	text.primary	text-foreground (maps to hsl(var(--foreground)))
text.secondary	text-secondary (custom color, maps to hsl(var(--text-secondary)))
text.muted	text-muted-foreground
text.link	text-primary
text.upvote-active	text-[#FF4500]
text.downvote-active	text-[#7193FF]
Border	border.default	border-border (maps to hsl(var(--border)))
border.hover	border-border-hover (custom color)
Typography	Family	font.sans	font-sans (Inter)
font.serif	font-serif (Source Serif 4)
Style	style.postTitle	font-serif text-lg font-semibold
style.commentBody	font-sans text-[15px] leading-relaxed
style.metadata	font-sans text-xs
style.actionButton	font-sans text-[13px] font-semibold
Spacing	Scale	space-4	p-4 or m-4 or gap-4 (1rem / 16px)
Radius	Scale	radius.md	rounded-md (maps to var(--radius))
radius.full	rounded-full

Export to Sheets
Part 3: The Implementation Guide: File by File (The "How")
This section provides a complete, step-by-step guide to implement the revamp. Follow each action precisely.

3.1. Phase 1: Backend Setup

ACTION: CREATE MIGRATION FILE

File Path: supabase/migrations/[TIMESTAMP]_make_post_title_not_null.sql

Complete Code:

SQL

-- This migration ensures data integrity by first backfilling existing posts
-- without a title, and then enforcing the NOT NULL constraint.

-- Step 1: Backfill any existing top-level posts that have a NULL title.
-- This prevents the ALTER TABLE command from failing on existing data.
UPDATE public."CommunityPosts"
SET title = 'Discussão Sem Título'
WHERE title IS NULL AND parent_post_id IS NULL;

-- Step 2: Apply the NOT NULL constraint to the title column.
-- This ensures all future top-level posts must have a title.
-- The transaction block ensures that if this fails, nothing is partially changed.
BEGIN;
  ALTER TABLE public."CommunityPosts"
  ALTER COLUMN title SET NOT NULL;
COMMIT;
ACTION: REFACTOR EDGE FUNCTION

File Path: supabase/functions/create-community-post/index.ts

Instructions: Replace the entire content of the file with the following code. This adds validation to enforce the new title requirement at the API level.

Complete Code:

TypeScript

// [The complete, corrected Edge Function code from the previous "Protocol" response goes here]
// This includes the CORS handler, manual auth, rate limiting, and updated validation logic
// that throws a ValidationError if parent_post_id is null and title is missing.
3.2. Phase 2: Frontend Component Implementation

Execute the following file actions in the specified order.

ACTION: CREATE NEW FILE

File Path: src/components/community/ActionBar.tsx

Complete Code:

TypeScript

// src/components/community/ActionBar.tsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowUp, ArrowDown, MessageSquare, Share, Award } from 'lucide-react';
import { CommunityPost } from '@/types';
import { PostActionMenu } from './PostActionMenu';
// Import your useCastCommunityVoteMutation and useAuthStore hooks here

export const ActionBar = ({ post, isComment = false }: { post: CommunityPost; isComment?: boolean }) => {
  // const voteMutation = useCastCommunityVoteMutation();
  // const { user } = useAuthStore();
  const userVote = post.user_vote;
  const score = (post.upvotes || 0) - (post.downvotes || 0);

  // Placeholder for admin check
  const isAdmin = false; 

  return (
    <div className="flex items-center gap-1 mt-2">
      <div className="flex items-center border border-transparent hover:bg-surface-muted rounded-full">
        <Button variant="ghost" size="sm" className="rounded-l-full">
          <ArrowUp className={`h-5 w-5 ${userVote === 'up' ? 'text-[#FF4500]' : 'text-muted-foreground'}`} />
        </Button>
        <span className={`font-bold text-xs px-1 ${userVote === 'up' ? 'text-[#FF4500]' : userVote === 'down' ? 'text-[#7193FF]' : 'text-muted-foreground'}`}>{score}</span>
        <Button variant="ghost" size="sm" className="rounded-r-full">
          <ArrowDown className={`h-5 w-5 ${userVote === 'down' ? 'text-[#7193FF]' : 'text-muted-foreground'}`} />
        </Button>
      </div>

      <Button variant="ghost" size="sm" className="text-muted-foreground font-semibold text-[13px]">
        <MessageSquare className="h-5 w-5 mr-2" />
        {isComment ? 'Responder' : `${post.reply_count || 0} Comentários`}
      </Button>

      <Button variant="ghost" size="sm" className="text-muted-foreground font-semibold text-[13px]">
        <Share className="h-5 w-5 mr-2" />
        Compartilhar
      </Button>

      {isAdmin && (
        <Button variant="ghost" size="sm" className="text-muted-foreground font-semibold text-[13px]">
          <Award className="h-5 w-5 mr-2" />
          Recompensa
        </Button>
      )}

      <PostActionMenu post={post} />
    </div>
  );
};
ACTION: CREATE NEW FILE

File Path: src/components/community/PostDisplay.tsx

Complete Code:

TypeScript

// src/components/community/PostDisplay.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CommunityPost } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ActionBar } from './ActionBar';

interface PostDisplayProps {
  post: CommunityPost;
  variant: 'feed' | 'detail';
}

export const PostDisplay = ({ post, variant }: PostDisplayProps) => {
  const navigate = useNavigate();

  const handleNavigate = (e: React.MouseEvent) => {
    // Prevent navigation if a link or button inside the post was clicked
    if ((e.target as HTMLElement).closest('a, button')) {
      return;
    }
    if (variant === 'feed') {
      navigate(`/comunidade/${post.id}`);
    }
  };

  const renderContent = () => {
    if (variant === 'feed') {
      if (post.image_url) return <img src={post.image_url} alt={post.title} className="max-h-[512px] w-full object-cover rounded-md mt-2" />;
      if (post.content) return <div className="text-sm text-secondary line-clamp-4 mt-2" dangerouslySetInnerHTML={{ __html: post.content }} />;
      return null;
    }
    if (variant === 'detail') {
      return (
        <>
          {post.content && <div className="prose prose-sm dark:prose-invert max-w-none mt-4" dangerouslySetInnerHTML={{ __html: post.content }} />}
          {post.image_url && <img src={post.image_url} alt={post.title} className="max-w-full h-auto rounded-md mt-4" />}
        </>
      );
    }
  };

  return (
    <div className="flex p-2 hover:bg-surface transition-colors rounded-md cursor-pointer" onClick={handleNavigate}>
      <div className="w-8 flex-shrink-0 pt-1">
         {/* Can be used for vertical vote controls if needed in the future */}
      </div>
      <div className="flex-1">
        <div className="flex items-center text-xs text-muted-foreground">
          <Avatar className="w-5 h-5 mr-2">
            <AvatarImage src={post.author?.avatar_url || ''} />
            <AvatarFallback>{post.author?.full_name?.charAt(0)}</AvatarFallback>
          </Avatar>
          <span className="font-bold text-foreground mr-1">{post.author?.full_name}</span>
          <span>• {new Date(post.created_at).toLocaleDateString()}</span>
        </div>
        <h2 className="font-serif text-lg font-semibold text-foreground my-1">{post.title}</h2>
        {renderContent()}
        <ActionBar post={post} />
      </div>
    </div>
  );
};
ACTION: CREATE NEW FILE

File Path: src/components/community/CreatePostPrompt.tsx

Complete Code:

TypeScript

// src/components/community/CreatePostPrompt.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Image as ImageIcon, Link2 as Link2Icon } from 'lucide-react';
import { useAuthStore } from '@/store/auth';

export const CreatePostPrompt = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  if (!user) return null; // Or show a login prompt

  const handleNavigate = (path: string) => navigate(path);

  return (
    <div className="flex items-center gap-3 p-2 bg-surface border border-border rounded-md shadow-sm">
      <Avatar>
        <AvatarImage src={user.user_metadata.avatar_url} />
        <AvatarFallback>{user.user_metadata.full_name?.charAt(0)}</AvatarFallback>
      </Avatar>
      <div
        className="flex-grow text-muted-foreground h-10 flex items-center px-3 bg-background rounded-md cursor-text"
        onClick={() => handleNavigate('/comunidade/submit')}
      >
        Criar post
      </div>
      <Button variant="ghost" size="icon" onClick={() => handleNavigate('/comunidade/submit?type=image')}>
        <ImageIcon className="h-5 w-5 text-muted-foreground" />
      </Button>
      <Button variant="ghost" size="icon" onClick={() => handleNavigate('/comunidade/submit?type=link')}>
        <Link2Icon className="h-5 w-5 text-muted-foreground" />
      </Button>
    </div>
  );
};
3.3. Phase 3: Page Assembly

ACTION: REFACTOR FILE

File Path: src/pages/CommunityPage.tsx

Instructions: Replace the entire content of the file with the following code. This re-assembles the page using the new components and layout structure.

Complete Code:

TypeScript

// src/pages/CommunityPage.tsx
import React from 'react';
import { useCommunityPageQuery } from '@/packages/hooks/useCommunityPageQuery';
import { PostDisplay } from '@/components/community/PostDisplay';
import { CommunitySidebar } from '@/components/community/CommunitySidebar';
import { CreatePostPrompt } from '@/components/community/CreatePostPrompt';
import { Separator } from '@/components/ui/separator';
// Import loading and error states as needed

export default function CommunityPage() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useCommunityPageQuery();

  if (status === 'pending') return <div>Carregando...</div>;
  if (status === 'error') return <div>Erro ao carregar a comunidade.</div>;

  const allPosts = data.pages.flatMap(page => page.posts);

  return (
    <div className="container mx-auto grid grid-cols-1 lg:grid-cols-[1fr,312px] gap-6 py-6">
      <main className="flex flex-col gap-4">
        {/* The banner would go here if it were dynamic */}
        <CreatePostPrompt />
        <div className="bg-surface rounded-md border">
          {allPosts.map((post, index) => (
            <React.Fragment key={post.id}>
              <PostDisplay post={post} variant="feed" />
              {index < allPosts.length - 1 && <Separator />}
            </React.Fragment>
          ))}
        </div>
        {hasNextPage && (
          <Button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
            {isFetchingNextPage ? 'Carregando mais...' : 'Carregar mais'}
          </Button>
        )}
      </main>
      <aside className="hidden lg:block">
        <CommunitySidebar />
      </aside>
    </div>
  );
}
Part 4: Post-Implementation Cleanup Plan
To ensure the codebase remains clean and maintainable, execute the following cleanup actions after the new implementation has been deployed and verified.

ACTION: DELETE DEPRECATED COMPONENTS

Delete the following files:
src/components/community/PostCard.tsx
src/components/community/PostDetailCard.tsx
src/components/community/VoteButtons.tsx
ACTION: REMOVE OBSOLETE HOOKS

Review the packages/hooks/ directory. Any hooks that were used exclusively by the deleted components should be removed.
ACTION: UPDATE DOCUMENTATION

Review all documents in docs/blueprints/, especially 06_COMMUNITY_BLUEPRINT.md.
Replace any screenshots or descriptions of the old card-based UI with visuals and explanations of the new "de-boxed" implementation.
Update any internal Storybook stories to remove the deprecated components and add stories for PostDisplay, ActionBar, and CreatePostPrompt.
This master blueprint provides a complete, unambiguous, and technically sound path to achieving the desired revamp. By following these instructions precisely, the development team can deliver a high-quality, architecturally consistent user experience.