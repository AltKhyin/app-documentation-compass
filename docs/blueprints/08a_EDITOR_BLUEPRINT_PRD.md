# **Product Requirements Document: Visual Composition Engine (V1)**

Version: 1.0  
Status: Confirmed & Ready for Development  
Feature Name: Visual Composition Engine  
Related Blueprints: \[08a-P\] (Design), \[08a-T\] (Technical)

### **1\. Introduction/Overview**

This document outlines the requirements for the V1 implementation of the **Visual Composition Engine**, the new content editor for the EVIDENS platform.

* **The Problem:** The current content creation process is a significant bottleneck. It relies on a simplistic, linear block editor that cannot produce the visually rich, didactic, and highly-structured layouts that our "High-Signal Practitioner" audience requires. This limits the quality of our content and the efficiency of our Content Architects.  
* **The Solution:** We will build a "Figma-like" visual editor that treats content creation as an act of **Information Architecture**. It will provide the creative freedom of a canvas-based design tool while producing a perfectly structured, responsive, and AI-readable JSON output.  
* **The Goal:** The primary goal of V1 is to deliver a robust and usable editor that empowers Content Architects to create and publish reviews more efficiently and with a higher degree of visual and structural quality than is possible with the current system.

### **2\. Goals**

* **\[G-1\] Empower Creative Freedom:** Provide a canvas-based layout system that allows authors to freely arrange text, images, and other content blocks in multiple columns, creating visually engaging and didactic layouts.  
* **\[G-2\] Increase Content Velocity:** Introduce a suite of specialized, purpose-built blocks (e.g., for citations and key takeaways) that streamline the creation of academically rigorous and easy-to-digest reviews.  
* **\[G-3\] Ensure Full Adaptability:** Guarantee that any layout created in the editor renders perfectly on both desktop and mobile viewports through a dedicated adaptive design workflow.  
* **\[G-4\] Provide a Stable & Reliable Tool:** The editor must be robust, with clear state management (saving, loading) and data integrity checks to prevent data loss and build user trust.

### **3\. User Stories**

* **\[US-1\] Layout & Design:** "As a Content Architect, I want to freely arrange text and images in multiple columns so that I can create visually engaging layouts that break the monotony of a single-column article."  
* **\[US-2\] Workflow Efficiency:** "As a Content Architect, I want to use specialized blocks for citations and key takeaways so that I can create academically rigorous and easy-to-skim reviews much faster."

### **4\. Functional Requirements**

#### **General Editor & Shell**

* **\[FR-1\]** The system **MUST** provide a three-panel editor interface: a Block Palette (left), an Editor Canvas (center), and a context-aware Inspector Panel (right).  
* **\[FR-2\]** The Editor Canvas **MUST** be pannable (via Spacebar \+ Drag) and zoomable (via Ctrl/Cmd \+ Scroll).  
* **\[FR-3\]** All content blocks on the canvas **MUST** be selectable, movable via drag-and-drop, and resizable with handles.  
* **\[FR-4\]** The system **MUST** provide smart alignment guides (snap lines) when moving or resizing blocks.  
* **\[FR-5\]** The system **MUST** provide a Desktop/Mobile viewport toggle that allows the author to define two independent layouts for the same set of content blocks.  
* **\[FR-6\]** The system **MUST** automatically save the document on a debounced timer (e.g., every 3 seconds of inactivity).  
* **\[FR-7\]** The UI **MUST** display a clear and persistent status indicator for the document's save state (Unsaved changes..., Saving..., All changes saved).  
* **\[FR-8\]** The editor **MUST** provide a "Preview" button that opens the rendered review in a new tab.

#### **V1 Block Library & Functionality**

* **\[FR-9\]** The system **MUST** provide the following core content blocks from the Block Palette:  
  * a. headingBlock: With support for levels H1-H4.  
  * b. textBlock: With support for inline formatting.  
  * c. imageBlock: With support for image uploads to Supabase Storage.  
  * d. quoteBlock: For visually distinct quotations.  
  * e. separatorBlock: A horizontal rule for dividing content.  
* **\[FR-10\]** The system **MUST** provide the following specialized EVIDENS blocks:  
  * a. keyTakeawayBlock: A visually distinct callout box for summaries.  
  * b. referenceBlock: A structured block for creating consistently formatted academic citations.  
* **\[FR-11\]** The system **MUST** provide the following interactive block:  
  * a. videoEmbedBlock: For embedding YouTube and Vimeo videos via URL.  
* **\[FR-12\]** The system **MUST** provide an inline "bubble menu" for text formatting (Bold, Italic, Underline, Strikethrough, Hyperlink, Code, Text Color, Highlight Color).  
* **\[FR-13\]** The Inspector Panel **MUST** be context-aware, showing specific settings for the currently selected block type.

### **5\. Non-Goals (Out of Scope for V1)**

* **\[NG-1\]** Real-time, multi-user collaboration (e.g., Google Docs style). V1 is a single-user experience.  
* **\[NG-2\]** A public-facing version of the editor for community members. The editor is for internal Admin/Editor roles only.  
* **\[NG-3\]** The ability for users to define and create their own custom block types. The V1 block library is fixed.  
* **\[NG-4\]** Advanced block animations or page transitions.  
* **\[NG-5\]** The dataTableBlock, diagramBlock, and interactivePollBlock are explicitly deferred to a future version.

### **6\. Design Considerations**

* The primary source of truth for all visual, user experience, and interaction design is **\[Blueprint\] 08a-P: Visual Composition Engine \- Product & Design Specification**.  
* The UI must be minimalist, professional, and prioritize the user's content.  
* All new UI components (forms, controls in the Inspector) **MUST** be built using the existing shadcn/ui component library to ensure visual consistency with the rest of the application.

### **7\. Technical Considerations**

* The definitive engineering guide for this feature is **\[Blueprint\] 08a-T: Visual Composition Engine \- Technical Specification**.  
* The implementation **MUST** use the prescribed technology stack: React Flow for the canvas, dnd-kit for drag-and-drop, Tiptap for inline text editing, and Zustand for state management.  
* All output **MUST** conform strictly to the structured\_content v2.0 JSON schema defined in the technical blueprint.

### **8\. Success Metrics**

The success of the V1 editor will be measured internally over the first three months of use by the content team based on the following metrics:

* **\[SM-1\] Time-to-Create (Efficiency):** A measurable reduction in the average time (in hours) required to create and publish a complete review compared to the old system.  
* **\[SM-2\] Feature Adoption (Utility):** At least 75% of new reviews published via the new editor should utilize at least one of the specialized blocks (keyTakeawayBlock or referenceBlock).  
* **\[SM-3\] Architect Satisfaction (Qualitative):** Achieve a satisfaction score of at least 8/10 from a survey of the Content Architects who use the tool daily.

### **9\. Open Questions**

* For V2, should the priority be real-time collaboration or expanding the interactive block library (dataTable, diagram, poll)?  
* For V2, should we implement the "Global Styles" feature to allow document-wide style changes (e.g., changing all H2s at once)?