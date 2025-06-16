
[DOC_7] EVIDENS Visual System
Version: 3.0
Date: June 14, 2025
Purpose: This document defines the canonical and complete visual design system for the EVIDENS platform. This version (3.0) establishes a new, clean, and professional "editorial" aesthetic inspired by the `manus.mn` visual language. It prioritizes typographic hierarchy, generous whitespace, and a nuanced neutral color palette. This system will govern both the default Light Theme and the new Dark Theme.

================================================================================
1.0. Core Philosophy (v3.0 - "Editorial Clarity")
================================================================================

*   PRINCIPLE 1 (Typography is Structure): The primary tool for creating hierarchy and communicating importance is a disciplined typographic scale, not color or ornamentation. A sophisticated serif font is used for display headings, while a clean sans-serif is used for all UI and body text.
*   PRINCIPLE 2 (Nuanced Neutrality): The color palette is built on a foundation of off-whites and layered grays. Color is used with extreme prejudice. The strongest visual accent is achieved through high-contrast black and white.
*   PRINCIPLE 3 (Space as a Tool): The layout is clean and uncluttered. Generous and consistent use of negative space is non-negotiable. It is used to guide the eye, group related items, and create a calm, focused reading environment.

================================================================================
2.0. Color System (v3.0 - Light & Dark Themes)
================================================================================

2.1. Color Tokens (CSS Variables)
RULE: The following CSS variables must be defined in the global stylesheet. The `.light` class defines the default theme. A `.dark` class will be added to the `<html>` or `<body>` tag to activate the dark theme.

/* /styles/globals.css */
.light {
  /* Light Theme Tokens (The "Manus" Reference) */
  --background: 220 20% 98%;   /* Very light, soft off-white */
  --foreground: 220 10% 15%;  /* Dark charcoal, not pure black */

  --surface: 220 20% 94%;      /* Subtle gray for cards, secondary backgrounds */
  --surface-muted: 220 20% 88%; /* Gray for input fields, disabled states */

  --border: 220 10% 85%;      /* Light gray border */
  --border-hover: 220 10% 75%; /* Slightly darker border on hover */

  /* Primary action color is high-contrast black */
  --primary: 220 10% 10%;
  --primary-foreground: 210 40% 98%;

  --text-primary: 220 10% 15%;
  --text-secondary: 220 10% 35%;
}

.dark {
  /* Dark Theme Tokens (The "Manus-Dark" Equivalent) */
  --background: 220 10% 7%;      /* Very dark charcoal */
  --foreground: 210 40% 96%;      /* Soft off-white */

  --surface: 220 10% 11%;     /* Lighter gray surface for cards */
  --surface-muted: 220 10% 15%; /* Darker gray for inputs */

  --border: 210 10% 20%;      /* Soft dark border */
  --border-hover: 210 10% 30%; /* Brighter border on hover */

  /* Primary action color is high-contrast white */
  --primary: 210 40% 98%;
  --primary-foreground: 220 10% 10%;

  --text-primary: 210 40% 96%;
  --text-secondary: 210 15% 65%;
}

/* Universal Semantic & Utility Tokens */
:root {
  --font-sans: 'Inter', sans-serif;
  --font-serif: 'Source Serif 4', serif; /* Or similar high-quality serif */

  --destructive: 0 84% 60%;
  --ring: 210 10% 40%;
  --radius: 8px; /* Updated to 8px for a softer feel */
}


2.2. Tailwind CSS Integration (v3.0)
RULE: The `tailwind.config.ts` file must be updated to reflect this new, more nuanced token system.

// tailwind.config.ts
// ...
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        'border-hover': 'hsl(var(--border-hover))', // New token
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--text-primary))', // Updated mapping
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: { // Secondary is now for text, not backgrounds
          DEFAULT: 'hsl(var(--text-secondary))',
        },
        surface: { // New surface colors
          DEFAULT: 'hsl(var(--surface))',
          muted: 'hsl(var(--surface-muted))',
        },
        destructive: 'hsl(var(--destructive))',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
        serif: ['var(--font-serif)'],
      },
      // ...
    },
// ...

================================================================================
3.0. Component Styling Rules (v3.0)
================================================================================

RULE: To achieve the desired "Manus" style, the AI developer must apply the new tokens as follows:

*   **Page Background:** Use `bg-background`.
*   **Main Surfaces (e.g., footers, large content sections):** Use `bg-surface`.
*   **Cards & Testimonials:** Use `bg-background` but with a `border border-border` and a soft `shadow-md`.
*   **Inputs:** Use `bg-surface-muted`.
*   **Primary Buttons (`Get Started`, `Explore`):** MUST use `bg-primary text-primary-foreground`.
*   **Secondary/Tag Buttons:** Use `bg-surface text-foreground`. The active state for these buttons becomes `bg-primary text-primary-foreground`.

================================================================================
4.0. Logo & Brand Identity (PRESERVED)
================================================================================

4.1. Current Logo Specification
RULE: The current "Reviews." logo MUST be preserved exactly as implemented. The following specifications document the existing implementation:

*   **Logo Text:** "Reviews." (with period)
*   **Typography:** Current font weight and family as implemented in the application
*   **Color:** Inherits from current text color tokens
*   **Placement:** Header/navigation as currently positioned
*   **Interactive States:** Current hover/focus states preserved

CRITICAL: This logo specification MUST NOT be altered during visual system updates. Any changes to the overall visual system must preserve the existing logo implementation exactly.

4.2. Authentication Pages Exception
RULE: Login and signup pages are explicitly excluded from v3.0 visual system updates. These pages must maintain their current styling and visual treatment to preserve existing user experience and branding consistency.
