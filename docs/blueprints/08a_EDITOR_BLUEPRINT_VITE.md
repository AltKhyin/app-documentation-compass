# **[Blueprint] 08a: Visual Composition Engine - Vite Implementation**

**Version:** 2.0 (Vite-Adapted)  
**Date:** June 16, 2025  
**Purpose:** This document provides the definitive blueprint for implementing the Visual Composition Engine within the Vite + React Single-Page Application architecture.

---

## **1.0 Architectural Adaptation for Vite**

### **1.1 Implementation Strategy**

**Hosting Architecture:**
- The editor will be implemented as protected routes within the main Vite application
- Routes: `/editor` (dashboard) and `/editor/:reviewId` (composition interface)
- No separate application required - unified codebase approach

**Authentication & Authorization:**
- Enhanced `ProtectedRoute` component with role-based access control
- JWT custom claims verification for `admin` or `editor` roles
- Seamless integration with existing authentication system

### **1.2 Technical Feasibility Confirmation**

All originally specified technologies are fully compatible with Vite + React:

**Core Libraries:**
- ✅ **React Flow:** For node-based visual editing (fully client-side)
- ✅ **dnd-kit:** For drag-and-drop functionality (React-native)
- ✅ **Tiptap:** For rich text editing (React components)
- ✅ **Zustand:** For editor state management (already in use)
- ✅ **Canvas API:** For direct manipulation features

**Performance Libraries:**
- ✅ **React Virtual:** For large content virtualization
- ✅ **React Window:** For efficient list rendering
- ✅ **use-debounce:** For performance optimization

---

## **2.0 Route Structure & Protection**

### **2.1 Enhanced ProtectedRoute Component**

```typescript
// src/components/auth/ProtectedRoute.tsx enhancement
interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'practitioner' | 'moderator' | 'admin' | 'editor';
}

const ProtectedRoute = ({ children, requiredRole = 'practitioner' }: ProtectedRouteProps) => {
  const { user } = useAuthStore();
  const userRole = user?.app_metadata?.role || 'practitioner';
  
  // Role hierarchy check
  const hasPermission = checkRolePermission(userRole, requiredRole);
  
  if (!user) return <Navigate to="/login" />;
  if (!hasPermission) return <Navigate to="/unauthorized" />;
  
  return <>{children}</>;
};
```

### **2.2 Editor Route Definitions**

```typescript
// App.tsx additions
<Route path="/editor" element={
  <ProtectedRoute requiredRole="editor">
    <EditorDashboard />
  </ProtectedRoute>
} />
<Route path="/editor/:reviewId" element={
  <ProtectedRoute requiredRole="editor">
    <VisualCompositionEngine />
  </ProtectedRoute>
} />
```

---

## **3.0 Component Architecture**

### **3.1 Editor Dashboard (/editor)**

**Purpose:** Central hub for managing review content
**Components:**
- `EditorDashboard.tsx` - Main layout
- `ReviewStatusCards.tsx` - Draft, review, published status
- `ReviewTemplateLibrary.tsx` - Template selection
- `RecentEdits.tsx` - Recently modified content

### **3.2 Visual Composition Engine (/editor/:reviewId)**

**Purpose:** The main "Figma-like" editing interface
**Core Components:**

```typescript
// Editor shell structure
/src/components/editor/
├── VisualCompositionEngine.tsx    # Main container
├── Canvas/
│   ├── EditorCanvas.tsx          # React Flow implementation
│   ├── CanvasToolbar.tsx         # Tool selection
│   └── CanvasViewport.tsx        # Zoom, pan controls
├── Panels/
│   ├── ComponentPanel.tsx        # Drag source for components
│   ├── PropertiesPanel.tsx       # Selected element properties
│   └── LayersPanel.tsx           # Document structure
├── Nodes/
│   ├── TextNode.tsx              # Text content blocks
│   ├── ImageNode.tsx             # Image elements
│   ├── ChartNode.tsx             # Data visualization
│   └── ReferenceNode.tsx         # Citation blocks
└── Hooks/
    ├── useEditorState.tsx        # Zustand store integration
    ├── useCanvasOperations.tsx   # Canvas manipulation
    └── useAutoSave.tsx           # Periodic saving
```

---

## **4.0 State Management Strategy**

### **4.1 Editor-Specific Zustand Store**

```typescript
// src/store/editorStore.ts
interface EditorState {
  currentReview: Review | null;
  selectedElements: string[];
  canvasState: CanvasState;
  undoStack: EditorAction[];
  redoStack: EditorAction[];
  
  // Actions
  setCurrentReview: (review: Review) => void;
  updateElement: (elementId: string, changes: Partial<Element>) => void;
  addElement: (element: Element) => void;
  deleteElement: (elementId: string) => void;
  undo: () => void;
  redo: () => void;
}
```

### **4.2 Real-time Collaboration Preparation**

```typescript
// Future Supabase Realtime integration
const useRealtimeCollaboration = (reviewId: string) => {
  // Subscribe to document changes
  // Broadcast user cursor positions
  // Handle conflict resolution
};
```

---

## **5.0 Data Schema Extensions**

### **5.1 Enhanced Review Schema**

```sql
-- Extension to Reviews table for editor support
ALTER TABLE Reviews ADD COLUMN IF NOT EXISTS
  editor_state JSONB DEFAULT '{}',
  canvas_data JSONB DEFAULT '{}',
  last_edited_by UUID REFERENCES Practitioners(id),
  last_edited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Index for editor queries
CREATE INDEX IF NOT EXISTS idx_reviews_editor_state 
ON Reviews USING GIN (editor_state);
```

### **5.2 Version History Table**

```sql
-- Track editing history
CREATE TABLE IF NOT EXISTS Review_Versions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  review_id UUID REFERENCES Reviews(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL,
  content_snapshot JSONB NOT NULL,
  created_by UUID REFERENCES Practitioners(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  change_summary TEXT
);
```

---

## **6.0 Performance Optimizations**

### **6.1 Canvas Virtualization**

```typescript
// Large document handling
const useCanvasVirtualization = () => {
  // Implement viewport-based rendering
  // Only render visible elements
  // Lazy load off-screen content
};
```

### **6.2 Auto-save Strategy**

```typescript
// Debounced saving to prevent API spam
const useAutoSave = (reviewId: string, content: EditorContent) => {
  const debouncedSave = useDebouncedCallback(
    (content) => saveReviewMutation.mutate({ reviewId, content }),
    2000 // 2 second delay
  );
  
  useEffect(() => {
    debouncedSave(content);
  }, [content]);
};
```

---

## **7.0 Implementation Phases**

### **Phase 1: Foundation (Core Editor Infrastructure)**
- ✅ Enhanced ProtectedRoute with role checking
- ✅ Basic editor routes and navigation
- ✅ Editor-specific Zustand store
- ✅ Database schema extensions

### **Phase 2: Canvas Implementation**
- 🔄 React Flow integration
- 🔄 Basic drag-and-drop functionality
- 🔄 Element creation and selection
- 🔄 Properties panel implementation

### **Phase 3: Advanced Features**
- 🔄 Rich text editing with Tiptap
- 🔄 Image handling and optimization
- 🔄 Undo/redo system
- 🔄 Auto-save implementation

### **Phase 4: Collaboration & Publishing**
- 🔄 Version history system
- 🔄 Review workflow (draft → review → published)
- 🔄 Real-time collaboration prep
- 🔄 Export functionality

---

## **8.0 Integration with Existing System**

### **8.1 Navigation Integration**

```typescript
// Add to src/config/navigation.ts
export const adminNavigationItems: NavigationItem[] = [
  { 
    icon: Edit, 
    label: 'Editor', 
    path: '/editor',
    requiredRole: 'editor'
  },
  // ... other admin items
];
```

### **8.2 User Interface Integration**

- Editor access button in user profile for qualified users
- "Edit Review" buttons on review detail pages (for authorized users)
- Status indicators for reviews in various editing states

---

## **9.0 Quality Assurance**

### **9.1 Testing Strategy**
- Unit tests for editor state management
- Integration tests for canvas operations  
- E2E tests for complete editing workflows
- Performance testing for large documents

### **9.2 Accessibility Compliance**
- Keyboard navigation for all editor functions
- Screen reader compatibility for panels
- High contrast mode support
- Focus management during editing

---

## **10.0 Future Enhancements**

### **10.1 Advanced Features (Post-MVP)**
- Real-time collaborative editing
- Advanced animation and transitions
- Custom component library expansion
- AI-assisted content suggestions

### **10.2 Integration Opportunities**
- PDF export with preserved layouts
- Integration with external design tools
- Advanced analytics for editor usage
- Template marketplace for community

---

This blueprint provides a comprehensive roadmap for implementing the Visual Composition Engine within the Vite + React architecture, maintaining all the ambitious functionality originally envisioned while being perfectly optimized for the current development environment.

*End of Vite-Adapted Editor Blueprint*
