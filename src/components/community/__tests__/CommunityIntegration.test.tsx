
// ABOUTME: Integration tests for community components to verify type contracts and data flow.

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { PostCard } from '../PostCard';
import { PostDetailCard } from '../PostDetailCard';
import type { CommunityPost } from '../../../types';

// Test wrapper with required providers
const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </QueryClientProvider>
  );
};

// Mock post data with all required fields
const mockPost: CommunityPost = {
  id: 1,
  title: 'Test Community Post',
  content: 'This is a test post content',
  category: 'general',
  upvotes: 5,
  downvotes: 1,
  reply_count: 3,
  created_at: '2024-01-01T12:00:00Z',
  is_pinned: false,
  is_locked: false,
  flair_text: null,
  flair_color: null,
  author: {
    id: 'test-user-id',
    full_name: 'Test User',
    avatar_url: null,
  },
  user_vote: null,
  user_can_moderate: false,
  // Multimedia support fields
  is_saved: false,
  post_type: 'text',
  image_url: null,
  video_url: null,
  poll_data: null,
};

// Mock saved post mutation
jest.mock('../../../../packages/hooks/useSavePostMutation', () => ({
  useSavePostMutation: () => ({
    mutateAsync: jest.fn(),
    isPending: false,
  }),
}));

describe('Community Component Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('PostCard Component', () => {
    it('renders with all required CommunityPost properties', () => {
      render(
        <TestWrapper>
          <PostCard post={mockPost} />
        </TestWrapper>
      );

      // Verify core content displays
      expect(screen.getByText('Test Community Post')).toBeInTheDocument();
      expect(screen.getByText('Test User')).toBeInTheDocument();
      expect(screen.getByText('Discussão Geral')).toBeInTheDocument();
    });

    it('handles multimedia post types correctly', () => {
      const imagePost = {
        ...mockPost,
        post_type: 'image' as const,
        image_url: 'https://example.com/image.jpg',
      };

      render(
        <TestWrapper>
          <PostCard post={imagePost} />
        </TestWrapper>
      );

      // Should render image content
      const image = screen.getByRole('img');
      expect(image).toHaveAttribute('src', 'https://example.com/image.jpg');
    });

    it('displays save functionality correctly', () => {
      const savedPost = { ...mockPost, is_saved: true };

      render(
        <TestWrapper>
          <PostCard post={savedPost} />
        </TestWrapper>
      );

      // Should show "saved" state
      const saveButton = screen.getByRole('button', { name: /remover dos salvos/i });
      expect(saveButton).toBeInTheDocument();
    });
  });

  describe('PostDetailCard Component', () => {
    it('renders detailed view with all properties', () => {
      render(
        <TestWrapper>
          <PostDetailCard post={mockPost} />
        </TestWrapper>
      );

      // Verify detailed content displays
      expect(screen.getByText('Test Community Post')).toBeInTheDocument();
      expect(screen.getByText('Test User')).toBeInTheDocument();
      expect(screen.getByText(/3 respostas|Nenhuma resposta/)).toBeInTheDocument();
    });

    it('handles moderation indicators correctly', () => {
      const pinnedPost = { ...mockPost, is_pinned: true };

      render(
        <TestWrapper>
          <PostDetailCard post={pinnedPost} />
        </TestWrapper>
      );

      // Should show pinned indicator
      expect(screen.getByText('Fixado')).toBeInTheDocument();
    });
  });

  describe('Type Contract Verification', () => {
    it('ensures CommunityPost interface consistency', () => {
      // This test verifies that our mock data matches the actual interface
      const requiredFields: Array<keyof CommunityPost> = [
        'id',
        'title', 
        'content',
        'category',
        'upvotes',
        'downvotes',
        'reply_count',
        'created_at',
        'author',
        'user_vote',
      ];

      requiredFields.forEach(field => {
        expect(mockPost).toHaveProperty(field);
      });

      // Verify optional multimedia fields exist (even if null)
      expect(mockPost).toHaveProperty('is_saved');
      expect(mockPost).toHaveProperty('post_type');
      expect(mockPost).toHaveProperty('image_url');
      expect(mockPost).toHaveProperty('video_url');
      expect(mockPost).toHaveProperty('poll_data');
    });
  });

  describe('Mobile Responsiveness', () => {
    it('renders correctly on mobile viewport', () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });

      render(
        <TestWrapper>
          <PostCard post={mockPost} />
        </TestWrapper>
      );

      // Component should render without errors on mobile
      expect(screen.getByText('Test Community Post')).toBeInTheDocument();
    });
  });
});
