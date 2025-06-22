# **\[Blueprint\] 08a-P: Visual Composition Engine \- Product & Design Specification**

Version: 1.0  
Status: Canonical Plan  
Technical Counterpart: \[Blueprint\] 08a-T: Visual Composition Engine \- Technical Specification  
Purpose: To provide a definitive, highly granular, and user-centric specification for the Visual Composition Engine. This document details the product philosophy, visual design, user experience (UX), and interaction design (IxD) of the editor. It is the single source of truth for the "what" and "why" of the feature, guiding the implementation to ensure a flawless, intuitive, and powerful end product.

### **TABLE OF CONTENTS**

1. **Core Philosophy: The Information Architecture Tool**  
   * 1.1. Design Tenets  
   * 1.2. The Target User: The Content Architect  
2. **Visual & Interaction Design (IxD) Blueprint**  
   * 2.1. The Editor Layout: A Professional Workspace  
   * 2.2. The Canvas: Core Interactions & Feel  
   * 2.3. The Inspector Panel: Context-Aware Control  
   * 2.4. Visual Language & Style Guide  
3. **Core User Workflows: A Detailed Breakdown**  
   * 3.1. Workflow: Creating and Placing a New Block  
   * 3.2. Workflow: Editing Inline Text  
   * 3.3. Workflow: Composing an Adaptive Layout (Desktop & Mobile)  
   * 3.4. Workflow: Saving and Publishing  
4. **V1 Block Library: Functional & UI Specification**  
   * 4.1. Text Blocks (headingBlock, textBlock, quoteBlock)  
   * 4.2. Media Blocks (imageBlock, videoEmbedBlock)  
   * 4.3. Data & Utility Blocks (dataTableBlock, separatorBlock)  
   * 4.4. Specialized EVIDENS Blocks (keyTakeawayBlock, referenceBlock)  
   * 4.5. Interactive Blocks (diagramBlock, interactivePollBlock)  
5. **Edge Case Handling & User Feedback**  
   * 5.1. Error States & Validation  
   * 5.2. Empty States  
   * 5.3. Loading & Saving Indicators

## **1\. Core Philosophy: The Information Architecture Tool**

### **1.1. Design Tenets**

The Visual Composition Engine is governed by three core design tenets:

1. **Freedom through Structure:** Provide the user with the creative freedom of a visual design tool (like Figma), while ensuring the output is perfectly structured, responsive, and semantically rich. The user feels like an artist; the system behaves like a disciplined engineer.  
2. **Focus on Flow:** The interface must be fast, intuitive, and unobtrusive. The goal is to create a "flow state" for the content creator, where the tool disappears, and their focus remains entirely on structuring and presenting their information.  
3. **Didactic by Design:** The editor is not just for writing; it's for *teaching*. The available tools and blocks must empower the author to create content that is not just aesthetically pleasing but also highly didactic and easy for the end-user to comprehend.

### **1.2. The Target User: The Content Architect**

The user of this tool is not a casual blogger. They are a **Content Architect**—a subject matter expert (the "Praticante de Alto Sinal") who is carefully constructing a high-value piece of educational content. The tool must respect their intelligence and their time by being powerful, efficient, and professional.

## **2\. Visual & Interaction Design (IxD) Blueprint**

### **2.1. The Editor Layout: A Professional Workspace**

The editor UI is a three-panel layout designed for efficiency.

* **Technical Ref:** \[Blueprint\] 08a-T, Section 1  
1. **Block Palette (Left, \~240px wide):** A static, scrollable panel.  
   * **UI:** Each block type is represented by a clear icon (from lucide-react) and a label (e.g., "Heading"). On hover, a tooltip provides a brief description of the block's purpose.  
   * **IxD:** Items are not clickable. They are exclusively drag-and-drop handles. Hovering changes the cursor to a "grab" icon.  
2. **Editor Canvas (Center, flexible width):** The main workspace.  
   * **UI:** Renders with a subtle dot-grid background to reinforce the "canvas" metaphor and aid in visual alignment. Displays clear, semi-transparent outlines representing the page boundaries for the selected viewport (Desktop or Mobile).  
3. **Inspector Panel (Right, \~280px wide):** A dynamic, context-aware panel.  
   * **UI:** When no block is selected, it shows "Document Settings" (Title, Slug, Tags, etc.). When a block is selected, the panel's content is replaced entirely with the specific settings for that block type. All controls (sliders, color pickers, dropdowns) must use our standard shadcn/ui components for consistency.

### **2.2. The Canvas: Core Interactions & Feel**

The "Figma-like" feel is achieved through the following precise interactions:

* **Pan:** The user can pan the canvas by holding the Spacebar key (which changes the cursor to a "hand" icon) and dragging the mouse.  
* **Zoom:** The user can zoom using Ctrl/Cmd \+ Scroll Wheel or a trackpad pinch gesture.  
* **Selection:**  
  * A single click on a block selects it.  
  * **UI Feedback:** A selected block MUST be outlined with a 2px solid line using the primary color from our Tailwind config. It MUST also display 8 square resize handles (4 corners, 4 sides).  
  * Clicking on the canvas background deselects any active block.  
* **Movement:**  
  * Clicking and dragging a selected block moves it across the canvas.  
  * **UI Feedback:** During the drag, the block's opacity should be reduced to \~80%. Red "smart guides" MUST appear dynamically to help the user align the edges or center of the dragged block with other blocks on the canvas.  
* **Resizing:**  
  * Dragging any of the 8 resize handles on a selected block resizes it.  
  * **UI Feedback:** As the block is resized, its dimensions MUST snap to the underlying grid columns and rows. A tooltip showing the current grid dimensions (e.g., "8 cols x 5 rows") should appear.

### **2.3. The Inspector Panel: Context-Aware Control**

* **Behavior:** The Inspector is the primary interface for customization. Its content MUST re-render instantly when the user selects a different block on the canvas.  
* **State Binding:** Every control in the Inspector (e.g., a color picker) is directly bound to the corresponding property in the selected node's data object within the Zustand store. Changing a value in the Inspector should be reflected on the canvas block in real-time.

### **2.4. Visual Language & Style Guide**

* **Consistency:** All UI elements—panels, buttons, inputs—MUST adhere to the existing EVIDENS design system defined in \[DOC\_7\]\_VISUAL\_SYSTEM.md and implemented with shadcn/ui.  
* **Clarity:** The editor UI itself should be minimalist and use a monochrome color scheme (grays, whites, blacks) to ensure that the user's content is always the primary focus. The only prominent use of color should be for selection outlines and smart guides.

## **3\. Core User Workflows: A Detailed Breakdown**

### **3.1. Workflow: Creating and Placing a New Block**

1. **User Action:** The user moves their cursor over the "Image" block in the Block Palette.  
2. **System Feedback:** The cursor changes to a "grab" icon.  
3. **User Action:** The user clicks and drags the "Image" block from the palette onto the Editor Canvas.  
4. **System Feedback:** A semi-transparent preview of a new image block follows the cursor.  
5. **User Action:** The user releases the mouse button over the canvas.  
6. **System Action (Internal):** The onDragEnd event fires. The system translates the drop coordinates, snaps them to the grid, and dispatches an addNode action to the store.  
   * **Technical Ref:** \[Blueprint\] 08a-T, Section 1.2.3  
7. **System Feedback:** A new, solid image block appears on the canvas at the drop location, automatically selected. The Inspector Panel updates to show the "Image Block Settings."

### **3.2. Workflow: Editing Inline Text**

1. **User Action:** The user double-clicks inside a \<TextBlockNode\> on the canvas.  
2. **System Feedback:** The block's text becomes editable, and a blinking cursor appears. The resize/move handles for the block disappear to reduce visual clutter.  
3. **User Action:** The user selects the words "scientific evidence".  
4. **System Feedback:** A small, floating toolbar (a Tiptap "Bubble Menu") appears just above the selected text.  
5. **User Action:** The user clicks the "Bold" button on the toolbar.  
6. **System Feedback:** The text "scientific evidence" instantly becomes bold.  
7. **System Action (Internal):** The Tiptap editor's onUpdate event fires. After a 3-second debounce, the system dispatches an updateNodeData action to the Zustand store with the new HTML content. The "All changes saved" indicator appears in the header.

### **3.3. Workflow: Composing an Adaptive Layout (Desktop & Mobile)**

1. **Initial State:** The editor loads with the Desktop viewport toggle selected. The user arranges several blocks into a two-column layout.  
2. **User Action:** The user clicks the Mobile toggle in the header.  
3. **System Feedback:** The canvas resizes to a mobile width. The blocks on the canvas rearrange themselves into a single vertical column (their default mobile layout).  
4. **User Action:** The user selects the image block and resizes it to be full-width (4 cols). They move a text block to appear *below* the image.  
5. **User Action:** The user clicks the Desktop toggle again.  
6. **System Feedback:** The canvas resizes back to desktop width. The blocks instantly revert to their previously defined two-column desktop layout. The mobile layout changes are saved and will be reapplied when the user switches back to the Mobile view.

### **3.4. Workflow: Saving and Publishing**

1. **Initial State:** The header shows "All changes saved".  
2. **User Action:** The user changes the color of a heading in the Inspector Panel.  
3. **System Feedback:** The heading on the canvas changes color instantly. The header indicator changes to "Unsaved changes...".  
4. **System Action (Internal):** The user does not interact with the editor for 3 seconds. The debounced auto-save triggers.  
5. **System Feedback:** The header indicator changes to "Saving...".  
6. **System Action (Internal):** The save operation completes successfully.  
7. **System Feedback:** The header indicator changes back to "All changes saved".

## **4\. V1 Block Library: Functional & UI Specification**

This catalogue defines the V1 block set from the user's and designer's perspective.

### **4.1. Text Blocks**

* **Heading Block (headingBlock):** For creating document structure.  
  * **Inspector Settings:**  
    * Level: A dropdown (\<Select\>) for H1, H2, H3, H4.  
    * Alignment: A button group (\<ToggleGroup\>) for Left, Center, Right.  
    * Color: A color picker (\<Input type="color"\>) for text color.  
* **Text Block (textBlock):** The primary block for all body content.  
  * **Inspector Settings:** Alignment, Color, Font Size (a slider or input).  
* **Quote Block (quoteBlock):** For highlighting text from other sources.  
  * **Inspector Settings:** Citation (a text input), Style Variant (a dropdown for "Default Indent" or "Large Quotation Mark").

### **4.2. Media Blocks**

* **Image Block (imageBlock):** For all visual media.  
  * **Inspector Settings:** An Image Upload component (with drag-and-drop zone), Caption text field, Alt Text text field, Border Radius slider.  
* **Video Embed Block (videoEmbedBlock):** For YouTube/Vimeo content.  
  * **Inspector Settings:** URL text input, Caption text field. The component will auto-detect the source and render the correct embed.

### **4.3. Data & Utility Blocks**

* **Data Table Block (dataTableBlock):** For presenting structured data.  
  * **Interaction:** The block itself is interactive. Hovering over it reveals \+ icons to add rows/columns. Cells are directly editable.  
  * **Inspector Settings:** Controls for Header Row Color, Alternating Row Color.  
* **Separator Block (separatorBlock):** A visual divider.  
  * **Inspector Settings:** Style (dropdown for Solid, Dashed, Dotted), Color picker, Thickness slider.

### **4.4. Specialized EVIDENS Blocks**

* **Key Takeaway Block (keyTakeawayBlock):** A visually distinct callout box.  
  * **UI:** Renders with a predefined background color, border, and a lucide-react icon (e.g., \<Lightbulb /\>).  
  * **Inspector Settings:** Icon (dropdown to select from a curated list of icons), Color Theme (dropdown to select from predefined themes like "Informational" (blue) or "Success" (green)).  
* **Reference Block (referenceBlock):** For academic citations.  
  * **Inspector Settings:** A form with fields for Authors, Year, Title, Source. The rendered block automatically formats this data into a consistent APA 7 style.

### **4.5. Interactive Blocks**

* **Diagram Block (diagramBlock):** For custom flowcharts and mind maps.  
  * **Inspector Settings:** A single large button: **"Edit Diagram"**. Clicking this opens the full-screen "sub-app" modal containing the diagramming tool.  
* **Interactive Poll Block (interactivePollBlock):** For engaging the reader.  
  * **Inspector Settings:** A text input for the Poll Question and a dynamic list of text inputs for the Options, with \+ / \- buttons to add or remove options.

## **5\. Edge Case Handling & User Feedback**

* **Error States:** If a block fails to render or an image fails to load, the block area MUST NOT collapse. It must display an inline error component (e.g., a red box with an error icon and a brief message like "Image could not be loaded"). This prevents layout shifts.  
* **Empty States:** When the editor is opened for a brand new review, the canvas should not be blank. It should contain a single, centered TextBlock with placeholder text like "Comece a escrever sua review aqui..." to guide the user.  
* **Loading States:** When the editor page is first loading a review, the entire canvas area should be overlaid with our standard \<Skeleton\> component, matching the three-panel layout to prevent any flashes of unstyled content.