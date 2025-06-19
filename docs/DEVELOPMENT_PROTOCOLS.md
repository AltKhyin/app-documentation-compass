
# EVIDENS Development Protocols
Version: 1.0.0
Date: June 19, 2025
Purpose: Standardized development protocols to ensure code quality, type safety, and prevent integration issues.

## Core Development Principles

### 1. Single Source of Truth Protocol
**Rule**: All type definitions MUST reside in `src/types/index.ts`
**Rationale**: Prevents duplicate interfaces and type inconsistencies across components

**Implementation Guidelines**:
- All shared types belong in `src/types/index.ts`
- Components MUST import types from `src/types/`
- Hook-specific interfaces should extend from base types, not duplicate them
- Before creating a new interface, verify it doesn't exist in the global types

**Verification Checklist**:
- [ ] Search codebase for duplicate interface definitions
- [ ] Verify all imports reference `src/types/`
- [ ] Confirm TypeScript compilation passes
- [ ] No duplicate type warnings in IDE

### 2. TanStack Query Implementation Standards
**Rule**: All data-fetching hooks MUST follow TanStack Query v5 patterns
**Rationale**: Ensures consistent server state management and prevents API compatibility issues

**Required Patterns**:
```typescript
// useInfiniteQuery v5 Pattern
export const useExampleQuery = () => {
  return useInfiniteQuery({
    queryKey: ['example'],
    queryFn: fetchFunction,
    initialPageParam: 0, // REQUIRED in v5
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      // v5 signature with lastPageParam
      return lastPage.hasMore ? lastPageParam + 1 : undefined;
    },
  });
};

// useQuery v5 Pattern  
export const useSingleQuery = (id: string) => {
  return useQuery({
    queryKey: ['example', id],
    queryFn: () => fetchSingle(id),
    enabled: !!id, // Only run when id exists
  });
};
```

**Verification Checklist**:
- [ ] All infinite queries include `initialPageParam`
- [ ] `getNextPageParam` uses v5 signature
- [ ] Query keys are descriptive arrays
- [ ] Mutations invalidate relevant queries in `onSuccess`

### 3. Component Integration Protocol
**Rule**: Components using shared types MUST follow standardized import and usage patterns
**Rationale**: Prevents type mismatches and ensures components work together seamlessly

**Import Standards**:
```typescript
// Correct type imports
import type { CommunityPost, UserProfile } from '../../types';

// Correct icon imports
import { Bookmark, BookmarkCheck, Share2 } from 'lucide-react';

// Correct hook imports  
import { useSavePostMutation } from '../../../packages/hooks/useSavePostMutation';
```

**Component Structure**:
- Data fetching: Use custom hooks only (never direct supabase calls)
- State management: Follow [D3.3] decision algorithm
- Event handlers: Proper TypeScript event types
- Conditional rendering: Safe property access with optional chaining

**Verification Checklist**:
- [ ] All types imported from canonical source
- [ ] All icons explicitly imported
- [ ] No direct database calls in components
- [ ] Proper event handler typing

### 4. Multimedia Post Development Standards
**Rule**: Posts with multimedia content MUST follow standardized patterns
**Rationale**: Ensures consistent rendering and type safety across all post types

**Required Fields Check**:
```typescript
interface CommunityPost {
  post_type?: 'text' | 'image' | 'video' | 'poll';
  image_url?: string | null;
  video_url?: string | null;
  poll_data?: Record<string, any> | null;
}
```

**Rendering Pattern**:
```typescript
const renderMultimediaContent = () => {
  switch (post.post_type) {
    case 'image':
      return post.image_url ? <img src={post.image_url} /> : null;
    case 'video':
      return post.video_url ? <video src={post.video_url} /> : null;
    case 'poll':
      return post.poll_data ? <PollComponent data={post.poll_data} /> : null;
    default:
      return null;
  }
};
```

### 5. Error Prevention Protocols

**Pre-Commit Verification**:
1. TypeScript compilation passes without errors
2. No ESLint warnings
3. All imports resolve correctly
4. Component renders without console errors

**Integration Testing Requirements**:
- Critical user flows tested (save/unsave posts)
- Mobile responsiveness verified
- Type contracts validated across components
- Data access patterns confirmed

**Documentation Requirements**:
- All new features documented in README-BÍBLIA.md
- Type changes noted in change log
- Component interactions documented

## File Organization Standards

### Hook Directory Structure
```
packages/hooks/
├── use[Feature]Query.ts          # Data fetching
├── use[Feature]Mutation.ts       # Data modification
└── use[Feature]State.ts          # Local state management

src/hooks/
├── use-mobile.tsx                # UI-specific hooks
└── use-toast.ts                  # UI utility hooks
```

### Component Directory Structure
```
src/components/
├── ui/                           # Primitive components
├── [feature]/                    # Feature-specific components
│   ├── [Feature]Card.tsx         # Individual items
│   ├── [Feature]List.tsx         # Collections
│   └── [Feature]Actions.tsx      # Interactive elements
└── shell/                        # Layout components
```

## Type Safety Enforcement

### Required TypeScript Settings
```json
{
  "compilerOptions": {
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "exactOptionalPropertyTypes": true
  }
}
```

### ESLint Rules (Recommended)
```json
{
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "warn",
    "import/no-duplicates": "error",
    "import/order": "error"
  }
}
```

## Common Anti-Patterns to Avoid

### ❌ Direct Database Calls in Components
```typescript
// WRONG
const MyComponent = () => {
  const { data } = useQuery({
    queryKey: ['posts'],
    queryFn: () => supabase.from('CommunityPosts').select('*')
  });
};
```

### ✅ Proper Hook Abstraction
```typescript
// CORRECT
const MyComponent = () => {
  const { data } = useCommunityPostsQuery();
};
```

### ❌ Duplicate Type Definitions
```typescript
// WRONG - in hook file
interface CommunityPost {
  id: number;
  title: string;
}

// WRONG - in component file  
interface CommunityPost {
  id: number;
  title: string;
  content: string; // Different from hook!
}
```

### ✅ Single Source of Truth
```typescript
// CORRECT - only in src/types/index.ts
export interface CommunityPost {
  id: number;
  title: string;
  content: string;
  // All properties in one place
}
```

## Troubleshooting Guide

### Type Import Errors
**Symptom**: "Cannot find name 'CommunityPost'"
**Solution**: Verify import path points to `src/types/index.ts`

### TanStack Query Errors  
**Symptom**: "Property 'initialPageParam' is missing"
**Solution**: Add `initialPageParam: 0` to useInfiniteQuery config

### Icon Not Found Errors
**Symptom**: "Cannot find name 'Video'"
**Solution**: Add explicit import: `import { Video } from 'lucide-react';`

### Data Access Errors
**Symptom**: "Property 'posts' does not exist on type 'InfiniteData'"
**Solution**: Use `data.pages.flatMap(page => page.posts)` for infinite queries

## Version History
- v1.0.0 (June 19, 2025): Initial protocols established during Community stabilization
