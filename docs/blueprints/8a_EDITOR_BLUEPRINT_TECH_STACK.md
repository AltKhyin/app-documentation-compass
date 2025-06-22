# [Blueprint] 08a-T: Visual Composition Engine - Technical Specification

**Version:** 1.1
**Status:** Canonical Plan - Revised
**Parent Blueprint:** `[Blueprint] 08a-P: Visual Composition Engine - Product & Design Specification v1.1`
**Purpose:** To provide a definitive, highly granular, and stress-tested technical specification for implementing the Visual Composition Engine. This document dissects the chosen technology stack, defines the precise data contracts, and outlines the core implementation patterns and mitigation strategies for known risks. It is the single source of truth for all engineering work on the editor.

---

### **CHANGELOG (v1.1)**

* **CRITICAL ARCHITECTURAL REFACTOR:** Aligned the editor's architecture with the project's established patterns based on feedback from `08a_EDITOR_IMPLEMENTATION_CHANGELOG.md`.
* **STATE MANAGEMENT:** The state management strategy has been fundamentally revised. **Zustand** is now responsible for synchronous UI state *only*. All server state management (data fetching and mutations) **MUST** be handled by **TanStack Query** via dedicated custom hooks, in strict adherence to the project's Data Access Layer (DAL).
* **UI LAYOUT:** The UI has been simplified from a three-panel to a **two-panel layout** (Canvas + Contextual Sidebar), improving mobile-first viability.
* **APP STRUCTURE:** The editor is now explicitly defined as a **protected route (`/editor/[reviewId]`)** within the unified SPA, not a standalone application.

---

### **TABLE OF CONTENTS**

1.  **Technology Stack: Granular Orchestration**
    * 1.1. `React Flow`: The Controlled Canvas
    * 1.2. `dnd-kit`: The Block Injection System
    * 1.3. `Tiptap`: The Encapsulated Text Engine
    * 1.4. `Zustand`: The Synchronous UI State Machine
    * 1.5. `TanStack Query`: The Server State Manager

2.  **Data Contract: `structured_content` v2.0 (Strict)**
    * 2.1. Root Schema & Versioning
    * 2.2. Zod Schemas for Validation

3.  **Core Implementation Patterns & Data Flow**
    * 3.1. The `EditorPage` Component: The Orchestrator
    * 3.2. Revised Data Flow Diagram
    * 3.3. The "Sub-App" Modal Pattern for Complex Blocks
    * 3.4. Backend Save & Sync Logic

4.  **Stress Test & Pitfall Mitigation**
    * 4.1. State & Data Integrity
    * 4.2. Performance & Rendering
    * 4.3. User Experience & Interaction Edge Cases
    * 4.4. Security & Asset Management

---

## 1. Technology Stack: Granular Orchestration

### 1.1. `React Flow`: The Controlled Canvas

* **1.1.1. Core Function:** `React Flow` will manage a `<div>` viewport for rendering our custom React components as movable, selectable "nodes." It is responsible for the pan/zoom functionality and the underlying coordinate system.
* **1.1.2. State Control (CRITICAL):** The `<ReactFlow>` component **MUST** be implemented as a **fully controlled component**. Its state (`nodes`, `viewport`) will reside exclusively in our Zustand store.
    * **Data Flow:** `Zustand Store` → `EditorCanvas` → `<ReactFlow props={storeState}>`.
    * **Event Flow:** `<ReactFlow onNodesChange={handleNodesChange}>` → `handleNodesChange` dispatches a synchronous action to the Zustand Store.
    * **Rationale:** This pattern gives our application absolute authority over the state, enabling critical features like undo/redo, debounced saving, and reliable state synchronization, which would be impossible if state were managed internally by React Flow.
* **1.1.3. Custom Node Registration:** All block types **MUST** be defined as standard React components and registered with React Flow via the `nodeTypes` prop.
    ```typescript
    // In EditorCanvas.tsx
    import TextBlockNode from './nodes/TextBlockNode';
    import ImageBlockNode from './nodes/ImageBlockNode';

    const nodeTypes = {
      textBlock: TextBlockNode,
      imageBlock: ImageBlockNode,
      // ... other blocks
    };

    <ReactFlow nodeTypes={nodeTypes} ... />
    ```
* **1.1.4. Interaction Control:** Default interactions like node dragging and selection will be enabled. `panOnDrag` **MUST** be configured to only activate when the `Space` key is held down. The `nowheel` CSS class **MUST** be applied to the root element of any node with internal scrollable content to prevent the scroll wheel from zooming the canvas.

### 1.2. `dnd-kit`: The Block Injection System

* **1.2.1. Draggables (The Palette):** The `<BlockPalette>` component will render items wrapped in `dnd-kit`'s `useDraggable` hook. The `id` of each draggable **MUST** be the `NodeType` string (e.g., `'textBlock'`).
* **1.2.2. Droppable (The Canvas):** The `<EditorCanvas>` component will be wrapped in a `<DndContext>`. The `div` that acts as the React Flow viewport will be the droppable target, registered with `useDroppable`.
* **1.2.3. The `onDragEnd` Event Logic:** This handler **MUST** perform the following sequence:
    1.  Get the block `type` from the active draggable's `id`.
    2.  Use the current `viewport` transform from the Zustand store to convert the drop's screen pixel coordinates into the React Flow pane's coordinate system.
    3.  Snap the pane coordinates to the nearest integer-based grid cell.
    4.  Dispatch a single, synchronous `addNode` action to the Zustand store with the `type` and calculated grid position.

### 1.3. `Tiptap`: The Encapsulated Text Engine

* **1.3.1. Instantiation:** A separate, isolated Tiptap editor instance **MUST** be created inside each text-based node component (e.g., `<TextBlockNode>`) using the `useEditor` hook. This encapsulation is key to preventing state conflicts.
* **1.3.2. State Synchronization:** The Tiptap instance will be initialized with HTML content from the Zustand store. A **debounced** `onUpdate` event handler **MUST** be configured to get the latest HTML from Tiptap and dispatch a synchronous `updateNodeData` action back to the central Zustand store.

### 1.4. `Zustand`: The Synchronous UI State Machine

* **1.4.1. Sole Responsibility:** The `EditorStore`'s responsibility is **exclusively** the management of synchronous, client-side UI state. It **MUST NOT** contain any asynchronous logic or direct API calls.
* **1.4.2. State Interface:** The store will manage:
    * The "live" in-memory `structured_content` object (`nodes` and `layouts`).
    * `selectedNodeId: string | null`.
    * `activeViewport: 'desktop' | 'mobile'`.
    * `isDirty: boolean` (to track unsaved changes).
    * `undoStack: EditorState[]` and `redoStack: EditorState[]`.

### 1.5. `TanStack Query`: The Server State Manager

* **1.5.1. Sole Responsibility:** TanStack Query is the **exclusive** manager of all server state and asynchronous communication with the Supabase backend, in adherence with the project's DAL.
* **1.5.2. Required Hooks:** Two new hooks **MUST** be created in `/packages/hooks/`:
    * **`useReviewForEditorQuery(reviewId)`:** Uses `useQuery` to fetch the complete `Review` object. Provides `isLoading`, `isError`, and `data` to the UI.
    * **`useUpdateReviewMutation()`:** Uses `useMutation` to save the `structured_content`. It **MUST** call a dedicated Supabase Edge Function (`update-review`) and **MUST** invalidate the `useReviewForEditorQuery` cache on success.

---

## 2. Data Contract: `structured_content` v2.0 (Strict)

This data model is the canonical output of the editor. Its structure is non-negotiable.

### 2.1. Root Schema & Versioning
The root object **MUST** contain a `version: "2.0.0"` key for future-proofing and data migrations.

### 2.2. Zod Schemas for Validation
All data loaded from the database and all data sent to the backend **MUST** be parsed and validated by these Zod schemas. This is a non-negotiable security and data integrity measure.

```typescript
import { z } from 'zod';

// Base layout and grid schemas
const LayoutItemSchema = z.object({
  nodeId: z.string().uuid(),
  x: z.number().int().min(1), // Grid is 1-indexed
  y: z.number().int().min(1),
  w: z.number().int().min(1),
  h: z.number().int().min(1),
});

const SingleLayoutSchema = z.object({
  gridSettings: z.object({ columns: z.number().int() }),
  items: z.array(LayoutItemSchema),
});

export const LayoutsSchema = z.object({
  desktop: SingleLayoutSchema,
  mobile: SingleLayoutSchema,
});

// Schemas for individual block data payloads
const TextBlockDataSchema = z.object({ htmlContent: z.string() });
const HeadingBlockDataSchema = z.object({ htmlContent: z.string(), level: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]) });
const ImageBlockDataSchema = z.object({ src: z.string().url(), caption: z.string(), alt: z.string() });
// ... other block data schemas will be added here

// Master Node Schema using a discriminated union for full type safety
export const NodeSchema = z.discriminatedUnion('type', [
  z.object({ id: z.string().uuid(), type: z.literal('textBlock'), data: TextBlockDataSchema }),
  z.object({ id: z.string().uuid(), type: z.literal('headingBlock'), data: HeadingBlockDataSchema }),
  z.object({ id: z.string().uuid(), type: z.literal('imageBlock'), data: ImageBlockDataSchema }),
  // ... other node schemas will be added here
]);

// The Root Schema for the entire document
export const StructuredContentV2Schema = z.object({
  version: z.literal('2.0.0'),
  nodes: z.array(NodeSchema),
  layouts: LayoutsSchema,
});
3. Core Implementation Patterns & Data Flow
3.1. The EditorPage Component: The Orchestrator
The <EditorPage> component is the central controller responsible for orchestrating the interaction between the server state (TanStack Query) and the UI state (Zustand).

Mount/Load Sequence:
The component mounts and calls useReviewForEditorQuery(reviewId).
It MUST render a full-page skeleton loader while the query's isLoading is true.
On isSuccess, it MUST call the editorStore.init(data) action once to populate the UI state.
Save Sequence:
It will use a useEffect hook to subscribe to changes in the isDirty flag from the EditorStore.
This effect MUST have a debounced callback. When isDirty is true, the callback will trigger after 3 seconds of inactivity.
The callback will get the latest content from the store via a selector, and then call useUpdateReviewMutation.mutate({ reviewId, content: ... }).
3.2. Revised Data Flow Diagram
Code snippet

sequenceDiagram
    participant User
    participant EditorPage as <EditorPage>
    participant TQ_Hooks as TanStack Query Hooks
    participant Supabase
    participant Zustand as EditorStore
    participant Canvas as <EditorCanvas>

    User->>EditorPage: Navigates to /editor/[reviewId]
    EditorPage->>TQ_Hooks: Calls useReviewForEditorQuery(reviewId)
    TQ_Hooks->>Supabase: GET /reviews?id=...
    Supabase-->>TQ_Hooks: Returns Review data
    TQ_Hooks-->>EditorPage: Provides data { isLoading, isSuccess, data }

    Note over EditorPage: Renders skeleton while isLoading

    EditorPage->>Zustand: On isSuccess, calls store.init(data)
    Zustand->>Canvas: Canvas reads initial state and renders

    User->>Canvas: Moves a block
    Canvas->>Zustand: Dispatches updateNodeLayout(...) action

    Note over EditorPage: A debounced useEffect watching Zustand's isDirty flag is triggered.

    EditorPage->>Zustand: Reads latest state via store.getLatestContent()
    EditorPage->>TQ_Hooks: Calls useUpdateReviewMutation.mutate(latestContent)
    TQ_Hooks->>Supabase: POST /functions/v1/update-review
    Supabase-->>TQ_Hooks: Returns success/error
3.3. The "Sub-App" Modal Pattern for Complex Blocks
This pattern is critical for encapsulating complexity. When a user clicks "Edit Diagram" on a <DiagramBlockNode>, the system MUST open a full-screen modal containing a dedicated <DiagramEditor />. When the user saves in the modal, the sub-app's state is serialized to JSON and the main EditorStore is updated.

3.4. Backend Save & Sync Logic
The useUpdateReviewMutation hook will call a Supabase Edge Function named update-review. This function MUST:

Verify the user is authenticated and has the required role (Admin or Editor).
Use Zod to parse and validate the incoming request body against the StructuredContentV2Schema.
Update the structured_content and updated_at columns for the given reviewId in the Reviews table.
4. Stress Test & Pitfall Mitigation
4.1. State & Data Integrity
Pitfall: Multi-tab editing conflicts.
Mitigation (V2): Use Supabase Realtime to broadcast updates. A client receiving a newer update will lock the UI and prompt for a reload to prevent overwrites.
Pitfall: Browser crash before auto-save.
Mitigation (V1): Implement a localStorage backup. A debounced useEffect MUST write the entire serialized store state to localStorage every ~5 seconds. On load, prompt the user to restore if a newer local version is found.
4.2. Performance & Rendering
Pitfall: Large images cripple page load.
Mitigation (Mandatory): Implement an automated image optimization pipeline using a Supabase Edge Function. All image uploads must be resized to multiple WebP formats. The front-end renderer MUST use the <picture> element with srcset and lazy-load all images below the fold.
Pitfall: Layout shift during load.
Mitigation: All image and media blocks MUST use the aspect-ratio CSS property to reserve space in the layout before the media has loaded.
4.3. User Experience & Interaction Edge Cases
Pitfall: Overlapping blocks in the editor break the CSS Grid renderer.
Mitigation: The editor MUST implement client-side collision detection. During drag/resize, if a block's new grid coordinates overlap another, its outline MUST turn red to provide immediate negative feedback.
Pitfall: User accidentally deletes a complex node.
Mitigation: Implement an undo/redo stack in the Zustand store. Deleting a node MUST be a "soft delete" (it is only removed from the layouts array), allowing the action to be perfectly undone.
4.4. Security & Asset Management
Pitfall: Malicious file uploads.
Mitigation: The image upload Edge Function MUST perform strict MIME type validation, rejecting any file that is not on an approved image/* allowlist.
Pitfall: Deleting a review leaves orphaned images in storage.
Mitigation: A delete-review Edge Function MUST delete the database row and then use the Storage admin client to recursively delete the entire folder associated with that reviewId.
<!-- end list -->