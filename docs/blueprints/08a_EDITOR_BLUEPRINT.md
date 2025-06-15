[Blueprint] 08a: The Visual Composition Engine
Version: 2.0
Date: June 14, 2025
Purpose: This document provides the canonical, exhaustive blueprint for the Visual Composition Engine (the "Editor") within the EVIDENS Admin Application. It defines the core paradigm, technology stack, data structures, component architecture, and implementation plan for creating a "Figma-like" content authoring experience.

================================================================================
1.0. Core Philosophy: The Paradigm Shift
================================================================================

*   We are building an "interface editor," not a text editor. The primary goal is to provide maximum creative and layout freedom.
*   The user interacts with a freeform canvas; the system thinks in a structured grid. This reconciles creative freedom with the need for clean, responsive, AI-readable output.
*   Complexity is encapsulated. Advanced features like diagrams are treated as "sub-apps" within their own nodes, preventing the main editor logic from becoming bloated.

================================================================================
2.0. Technology Stack & Data Model
================================================================================

2.1. Mandatory Technology Stack
*   Canvas Engine: React Flow. Used for the main canvas, node management, panning, and zooming.
*   Drag and Drop: dnd-kit. Used for dragging new blocks from the palette onto the canvas.
*   Rich Text Editing: Tiptap. Used *inside* text-based nodes to provide rich text formatting.
*   State Management: Zustand. For managing the complex, shared state of the editor.
*   Schema Validation: Zod. Used to validate the structure of the final JSON output.

2.2. The structured_content v2.0 Data Schema
*   RULE: The editor's state MUST be serializable to the following JSON structure, as defined in `[DOC_3]`.
    {
      "version": "2.0",
      "nodes": [ { "id": "...", "type": "...", "data": { ... } } ],
      "layouts": {
        "desktop": [ { "nodeId": "...", "position": { ... }, "size": { ... } } ],
        "mobile": [ { ... } ]
      },
      "canvasState": { "viewport": { ... } }
    }

================================================================================
3.0. Visual & Interaction Blueprint
================================================================================

3.1. Editor Layout
A three-panel layout:
1.  Left Panel (BlockPalette): A scrollable list of available content block types. Users drag blocks from this palette onto the canvas.
2.  Center Panel (EditorCanvas): The main interactive canvas, powered by React Flow. This is where the author arranges and edits the content blocks.
3.  Right Panel (InspectorPanel): A context-aware panel that displays customization options for the currently selected block type.

3.2. Key Interactions
*   Canvas Navigation: Pan and Zoom.
*   Block Creation: Drag and Drop from the palette.
*   Direct Manipulation: Move and resize blocks on the canvas.
*   Content Editing: Double-click a block to enter its specific editing mode (e.g., Tiptap for text, Diagram UI for diagrams).
*   Responsive Design Toggle: A toggle in the toolbar switches between editing the `desktop` and `mobile` layouts.
*   Import/Export: Buttons to export the content to JSON or a custom DSL.

================================================================================
4.0. Front-End Architecture
================================================================================

4.1. Component Breakdown & Contracts

    Component: EditorShell.js
        Type: Page
        Props: { initialContent: StructuredContent }
        Responsibilities: The root component. Initializes the editor state store. Orchestrates the three main panels. Handles saving data to the backend.

    Component: BlockPalette.js
        Type: Module
        Props: ()
        Responsibilities: Displays the list of available block types and provides Draggable handles.

    Component: EditorCanvas.js
        Type: Engine
        Props: ()
        Responsibilities: The core canvas. Renders all custom nodes based on the state store. Handles user interactions (drag, resize) and calls update functions in the store.

    Component: InspectorPanel.js
        Type: Module
        Props: ()
        Responsibilities: Subscribes to the selected node state. Renders the correct settings UI based on the selected node's type. Calls update functions in the store.

    Component: TextBlockNode.js, ImageBlockNode.js, DiagramNode.js
        Type: Custom Node
        Props: { id, data, selected }
        Responsibilities: The visual representation of each block type within the React Flow canvas.

4.2. [UPDATED] State Management & Data Flow
*   State Store: A single Zustand store (`useEditorStore`) will be the source of truth for the entire editor state. This is critical to prevent prop-drilling.
*   Store Shape:
    ```typescript
    {
      nodes: Node[];
      layouts: { desktop: LayoutItem[], mobile: LayoutItem[] };
      selectedNodeId: string | null;
      activeLayout: 'desktop' | 'mobile';
      // ...actions
    }
    ```
*   The Update Contract (Unambiguous Actions):
    *   `addNode(node: Node, position: {x, y})`: Adds a new node and creates its initial layout entries for both desktop and mobile.
    *   `updateNodeData(nodeId: string, newData: Partial<Data>)`: Updates the content `data` for a specific node.
    *   `updateNodeLayout(nodeId: string, newLayout: Partial<LayoutItem>)`: Updates the layout (position/size) for a specific node in the currently `activeLayout`.
    *   `setSelectedNode(nodeId: string | null)`: Sets the currently selected node.
*   Component Interaction with Store:
    *   `EditorCanvas`: Selects the `nodes` and the `activeLayout` array to render. It calls `updateNodeLayout` on drag/resize events and `setSelectedNode` on click events.
    *   `InspectorPanel`: Selects the `selectedNodeId` and the full `nodes` array. It calls `updateNodeData` when a user changes a setting in the panel.
    *   This granular action-based model ensures that a change in the Inspector only triggers updates to the relevant node data, preventing unnecessary re-renders of the entire canvas.

================================================================================
5.0. [NEW] Performance & Optimization
================================================================================

*   RULE 1 (Canvas Virtualization): The `EditorCanvas` implementation MUST use virtualization to ensure high performance with a large number of nodes. Only the nodes currently visible within the canvas viewport should be rendered in the DOM. This is a non-negotiable requirement.
*   RULE 2 (Debounced State Updates): All high-frequency state updates, specifically the `updateNodeLayout` action triggered by dragging or resizing nodes, MUST be debounced with a timeout of approximately 50ms. This prevents a flood of state updates and re-renders during direct manipulation, ensuring a smooth user experience.

================================================================================
6.0. Implementation Checklist
================================================================================

1.  [ ] **Setup:** Install `react-flow-renderer`, `dnd-kit`, `tiptap`, and `zustand`.
2.  [ ] **Store:** Create the `useEditorStore` (Zustand) with the full state shape and all action functions.
3.  [ ] **Canvas:** Set up the main `EditorCanvas.js` component, controlled by the Zustand store. Implement virtualization from the start.
4.  [ ] **Core Node & Selection:** Implement a basic `TextBlockNode.js` and the selection logic between the `EditorCanvas` and the `InspectorPanel` via the store.
5.  [ ] **Palette & DnD:** Implement the `BlockPalette.js` and use `dnd-kit` to call the `addNode` action in the store.
6.  [ ] **Inspector Logic:** Build the `InspectorPanel.js` to render different forms and call `updateNodeData`.
7.  [ ] **Layout Logic:** Implement the move/resize handlers, ensuring that the call to `updateNodeLayout` is debounced.
8.  [ ] **Tiptap Integration:** Integrate Tiptap into the `TextBlockNode.js`.
9.  [ ] **Advanced Nodes:** Build the `ImageNode.js` (with image upload to Supabase Storage) and `DiagramNode.js` (as a sub-app).
10. [ ] **Saving Logic:** Implement the "Save" button to read from the store and call the `update-review` Edge Function.
11. [ ] **Viewport Toggle:** Implement the Desktop/Mobile toggle to change the `activeLayout` in the store.


