# **\[Blueprint\] 08a-T: Visual Composition Engine \- Technical Specification**

Version: 1.0  
Status: Canonical Plan  
Parent Blueprint: \[Blueprint\] 08a: The Editor (Visual Composition Engine)  
Purpose: To provide a definitive, highly granular, and stress-tested technical specification for implementing the Visual Composition Engine. This document dissects the chosen technology stack, defines the precise data contracts, and outlines the core implementation patterns and mitigation strategies for known risks. It is the single source of truth for all engineering work on the editor.

### **TABLE OF CONTENTS**

1. **Technology Stack: Granular Orchestration**  
   * 1.1. React Flow: The Controlled Canvas  
   * 1.2. dnd-kit: The Block Injection System  
   * 1.3. Tiptap: The Encapsulated Text Engine  
   * 1.4. Zustand: The Central State Machine  
2. **Data Contract: structured\_content v2.0 (Strict)**  
   * 2.1. Root Schema & Versioning  
   * 2.2. Node Object Schema & Discriminated Union  
   * 2.3. Layouts Object Schema & Grid System  
   * 2.4. Zod Schemas for Validation  
3. **Core Implementation Patterns**  
   * 3.1. The Main State Reducer (Zustand)  
   * 3.2. Custom React Flow Node Implementation  
   * 3.3. The "Sub-App" Modal Pattern for Complex Blocks  
   * 3.4. Backend Save & Sync Logic  
4. **Stress Test & Pitfall Mitigation**  
   * 4.1. State & Data Integrity  
   * 4.2. Performance & Rendering  
   * 4.3. User Experience & Interaction Edge Cases  
   * 4.4. Security & Asset Management

## **1\. Technology Stack: Granular Orchestration**

This section details *how* the chosen libraries will be integrated and orchestrated.

### **1.1. React Flow: The Controlled Canvas**

* **1.1.1. Core Function:** React Flow will manage a \<div\> viewport. It will not use an HTML \<canvas\> element. Its responsibility is to render our custom React components as "nodes" at specific x/y positions and to manage the pan/zoom state of the viewport.  
* **1.1.2.** State **Control (CRITICAL):** The \<ReactFlow\> component will be implemented as a **fully controlled component**. Its internal state will be disabled. The canonical state for all nodes, edges (which we will not use), and the viewport transform will reside exclusively in our central Zustand store.  
  * **Data Flow:** Zustand Store → EditorCanvas → \<ReactFlow props={storeState}\>.  
  * **Event Flow:** \<ReactFlow onNodesChange={handleNodesChange}\> → handleNodesChange dispatches action to Zustand Store.  
  * **Rationale:** This pattern gives us absolute authority over the state, enabling features like undo/redo, debounced saving, and synchronization, which would be impossible if the state were managed internally by React Flow.  
* **1.1.3. Custom Node Registration:** All block types will be defined as standard React components and registered with React Flow via the nodeTypes prop.  
  // In EditorCanvas.tsx  
  import TextBlockNode from './nodes/TextBlockNode';  
  import ImageBlockNode from './nodes/ImageBlockNode';

  const nodeTypes \= {  
    textBlock: TextBlockNode,  
    imageBlock: ImageBlockNode,  
    // ... other blocks  
  };

  \<ReactFlow nodeTypes={nodeTypes} ... /\>

* **1.1.4. Interaction Control:** Default interactions like node dragging and selection will be enabled. However, panOnDrag will be configured to only activate when the Space key is held down, allowing for natural block dragging. The nowheel CSS class will be applied to the root element of any node with internal scrollable content (like a text block) to prevent the scroll wheel from zooming the canvas.

### **1.2. dnd-kit: The Block Injection System**

* **1.2.1. Draggables (The Palette):** The \<BlockPalette\> component will render a list of items. Each item will be wrapped in dnd-kit's useDraggable hook. The id of each draggable will be the NodeType string (e.g., 'textBlock'). The data attribute will contain initial default dimensions (e.g., { defaultW: 8, defaultH: 4 }).  
* **1.2.2. Droppable (The Canvas):** The \<EditorCanvas\> component will be wrapped in a \<DndContext\>. The div that acts as the React Flow viewport will be the droppable target, registered with useDroppable.  
* **1.2.3. The onDragEnd Event Logic:** This is the core of the block creation workflow. The onDragEnd handler will:  
  1. Verify the drop occurred on the canvas droppable.  
  2. Get the block type and defaultW/defaultH from the active draggable's id and data.  
  3. Get the raw x, y pixel coordinates of the drop event relative to the canvas viewport.  
  4. **Coordinate Translation (CRITICAL):** Use the current viewport transform state (from the Zustand store) to convert the raw pixel coordinates into the coordinate system of the React Flow pane.  
  5. **Grid Snapping:** Convert the translated pane coordinates into the nearest integer-based grid coordinates (gridX, gridY) based on the current grid column/row size.  
  6. Dispatch a single action to the Zustand store: addNode({ type: 'textBlock', position: { x: gridX, y: gridY }, dimensions: { w: 8, h: 4 } }).  
  7. The store's reducer handles the creation of the new node in the nodes array and its corresponding layout item in the layouts array.

### **1.3. Tiptap: The Encapsulated Text Engine**

* **1.3.1. Instantiation:** Inside the \<TextBlockNode\> component (and other text-based nodes), we will use Tiptap's useEditor hook. This will create a **separate,** isolated editor instance for every single text block on **the canvas.** This encapsulation is key to preventing state conflicts.  
* **1.3.2. State Synchronization:**  
  * **Initialization:** The useEditor hook will be initialized with the htmlContent from the central store: content: store.nodes.find(n \=\> n.id \=== props.id).data.htmlContent.  
  * **Update:** The useEditor configuration will include an onUpdate event handler. This handler will be **debounced** using a useCallback and a debounce utility (e.g., from lodash-es). When the debounced handler fires, it will get the latest HTML from the Tiptap instance via editor.getHTML() and dispatch an action to the central store: updateNodeData({ nodeId: props.id, newData: { htmlContent: '...' } }).  
* **1.3.3. The Bubble Menu:** The floating format toolbar will be implemented using Tiptap's BubbleMenu extension. This component will be conditionally rendered within \<TextBlockNode\> and will read the editor instance from context to control formatting (e.g., editor.chain().focus().toggleBold().run()).

### **1.4. Zustand: The Central State Machine**

* **Role:** The store acts as the **single source of truth** and the central command bus for the entire editor. No component should ever manage a piece of state that is shared with another component.  
* **Structure:** It will be created with create(devtools(...)) to enable Redux DevTools for easy time-travel debugging.  
* **Actions:** All state mutations will occur through well-defined actions (see section 6.2). These actions will be pure functions where possible, taking a payload and returning the new state. This makes the state logic predictable and testable.

## **2\. Data Contract: structured\_content v2.0 (Strict)**

This data model is the canonical output of the editor. Its structure is non-negotiable.

### **2.1. Root Schema & Versioning**

The root object must contain a version key (e.g., "2.0.0"). This is a mandatory safety feature that will allow us to write migration scripts in the future if the schema needs to evolve, preventing data loss for older reviews.

### **2.2. Node Object Schema & Discriminated Union**

The nodes array is the source of truth for all semantic content. Using a discriminatedUnion in Zod on the type field is a critical pattern that provides full TypeScript type safety. It ensures that if type is 'imageBlock', then TypeScript knows that data must have a src and alt property, preventing runtime errors.

### **2.3. Layouts Object Schema & Grid System**

The layouts object separates presentation from content. The items array maps a nodeId to its grid position. This design choice is deliberate:

* **It** supports soft **deletes:** A node can be "deleted" by simply removing its corresponding item from the layouts array without deleting the node's actual content from the nodes array. This makes the "undo" feature trivial to implement.  
* **It supports adaptive design:** The desktop and mobile objects are entirely independent, allowing a single set of nodes to be arranged in completely different ways.

### **2.4. Zod Schemas for Validation**

All data loaded from the database into the editor, and all data saved from the editor to the database, **MUST** be parsed and validated by these Zod schemas. This is our primary defense against data corruption.

import { z } from 'zod';

// Base layout and grid schemas  
const LayoutItemSchema \= z.object({  
  nodeId: z.string().uuid(),  
  x: z.number().int(),  
  y: z.number().int(),  
  w: z.number().int(),  
  h: z.number().int(),  
});

const SingleLayoutSchema \= z.object({  
  gridSettings: z.object({ columns: z.number().int() }),  
  items: z.array(LayoutItemSchema),  
});

export const LayoutsSchema \= z.object({  
  desktop: SingleLayoutSchema,  
  mobile: SingleLayoutSchema,  
});

// Schemas for individual block data payloads  
const TextBlockDataSchema \= z.object({ htmlContent: z.string() });  
const HeadingBlockDataSchema \= z.object({ htmlContent: z.string(), level: z.union(\[z.literal(1), z.literal(2), z.literal(3), z.literal(4)\]) });  
const ImageBlockDataSchema \= z.object({ src: z.string().url(), caption: z.string(), alt: z.string() });  
// ... other block data schemas

// Master Node Schema using a discriminated union for type safety  
export const NodeSchema \= z.discriminatedUnion('type', \[  
  z.object({ id: z.string().uuid(), type: z.literal('textBlock'), data: TextBlockDataSchema }),  
  z.object({ id: z.string().uuid(), type: z.literal('headingBlock'), data: HeadingBlockDataSchema }),  
  z.object({ id: z.string().uuid(), type: z.literal('imageBlock'), data: ImageBlockDataSchema }),  
  // ... other node schemas  
\]);

// The Root Schema for the entire document  
export const StructuredContentV2Schema \= z.object({  
  version: z.literal('2.0.0'),  
  nodes: z.array(NodeSchema),  
  layouts: LayoutsSchema,  
  globalStyles: z.record(z.any()).optional(), // Reserved for V2  
});

## **3\. Core Implementation Patterns**

### **3.1. The Main State Reducer (Zustand)**

The Zustand store will be implemented with a reducer-like pattern. Instead of calling set with a function, actions will dispatch objects with a type and payload, which are handled by a central reducer function. This standardizes state changes and makes them easier to debug with Redux DevTools.

### **3.2. Custom React Flow Node Implementation**

Each custom node component (e.g., \<TextBlockNode /\>) will be wrapped in React.memo. Its logic will be minimal. It will receive its id and data from React Flow and use the id to select its layout and other state (like isSelected) from the Zustand store. This pattern ensures nodes only re-render when their specific data or layout changes, which is critical for performance.

### **3.3. The "Sub-App" Modal Pattern for Complex Blocks**

When a user clicks "Edit Diagram" on a \<DiagramBlockNode\>, the following will occur:

1. A full-screen modal (using shadcn/ui's \<Dialog /\>) will be opened.  
2. Inside this modal, a completely separate \<DiagramEditor /\> application will be rendered.  
3. This sub-app will be initialized with the diagramData JSON from the parent node.  
4. When the user clicks "Save & Close" in the modal, the \<DiagramEditor /\>'s state will be serialized into a new JSON object.  
5. An updateNodeData action will be dispatched to the main EditorStore to update the parent \<DiagramBlockNode\>'s data. This pattern perfectly encapsulates the complexity.

### **3.4. Backend Save & Sync Logic**

The saveToDatabase action in the store will be the single point of contact with the backend. It will:

1. Set isSaving: true.  
2. Serialize the current editor state (nodes and layouts) into a single StructuredContentV2 object.  
3. Call the useUpdateReviewMutation.mutate() function, passing the reviewId and the new content object.  
4. The useUpdateReviewMutation hook will handle the actual API call to a Supabase Edge Function (update-review).  
5. On success, the mutation hook will invalidate the TanStack Query cache for this review and the saveToDatabase action will set isSaving: false and isDirty: false.

## **4\. Stress Test & Pitfall Mitigation**

### **4.1. State & Data Integrity**

* **Pitfall:** User has two tabs open editing the same document, leading to data overwrites.  
* **Mitigation:** For V2, we will use **Supabase Realtime**. The editor will subscribe to the Reviews table for the current reviewId. If a UPDATE event is received, the client will check the new updated\_at timestamp. If it's newer than the client's last save, it will lock the UI and show a modal: "This document was updated in another tab. Reload to see the latest changes."  
* **Pitfall:** Browser crashes or connectivity loss before auto-save fires.  
* **Mitigation:** We will implement a **localStorage backup**. A debounced useEffect will write the entire serialized store state to localStorage every \~5 seconds. On editor load, if a local backup is found with a timestamp newer than the database updated\_at, the user will be prompted to restore it.

### **4.2. Performance & Rendering**

* **Pitfall:** A review with 100+ high-resolution images cripples page load.  
* **Mitigation:** An **automated image optimization pipeline** is mandatory. All image uploads must pass through a Supabase Edge Function that resizes the image to multiple formats (thumbnail, medium, large), converts it to WebP, and uploads all variants to Storage. The front-end renderer will use the \<picture\> element with srcset to let the browser choose the optimal image, and will lazy-load all images below the fold.  
* **Pitfall:** Re-arranging blocks in a 100-node document feels sluggish.  
* **Mitigation:** The onNodesChange handler will be optimized. Instead of re-calculating the entire layout on every drag event, we will use React Flow's applyNodeChanges utility, which provides a more performant way to update node positions. The full layout re-calculation will only happen on onMoveEnd.

### **4.3. User Experience & Interaction Edge Cases**

* **Pitfall:** User places two blocks that overlap, which is not supported by the CSS Grid renderer.  
* **Mitigation:** The editor will have **client-side collision detection**. During a drag or resize operation, the editor will constantly check if the node's new grid coordinates overlap with another node. If they do, the node's border will turn red, and snapping will be temporarily disabled until the conflict is resolved.  
* **Pitfall:** The user creates an "orphan" node by deleting it and then undoing the deletion, but its layout information is gone.  
* **Mitigation:** **Soft Deletes**. Deleting a node will only remove its LayoutItem from the layouts array. The node itself will remain in the nodes array with an isDeleted: true flag. The undo action simply re-adds the LayoutItem back to the layouts array.

### **4.4. Security & Asset Management**

* **Pitfall:** A malicious user uploads a non-image file (e.g., an HTML file with a malicious script) via the image uploader.  
* **Mitigation:** The image upload Edge Function **MUST** validate the file's MIME type and extension, rejecting anything that isn't on an approved list (e.g., image/jpeg, image/png, image/webp).  
* **Pitfall:** An author deletes a review, orphaning all the images they uploaded to Supabase Storage.  
* **Mitigation:** When a review is deleted, a delete-review Edge Function must be called. This function will delete the database row and then use the Supabase Storage admin client to delete the entire folder associated with that reviewId (e.g., /images/reviews/{reviewId}/), ensuring no orphaned files are left behind.