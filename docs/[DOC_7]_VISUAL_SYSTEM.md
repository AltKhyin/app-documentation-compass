# **\[DOC\_7\] EVIDENS Visual System**

Version: 1.0  
Date: June 14, 2025  
Purpose: This document defines the canonical and complete visual design system for the EVIDENS platform (both Main and Admin applications). It is the single source of truth for all colors, typography, spacing, and other stylistic elements. The AI developer must adhere to this token-based system to ensure visual consistency, quality, and maintainability.

## **1.0 Core Philosophy**

* **PRINCIPLE 1 (Monochrome-First):** The default aesthetic is strictly monochromatic. Color is used purposefully and sparingly, reserved for semantic meaning (e.g., success, warning, destructive actions), not for decoration.  
* **PRINCIPLE 2 (Editorial Feel):** The design prioritizes clarity, legibility, and a sense of authority. This is achieved through a strong typographic hierarchy, generous use of negative space, and a clean, structured layout.  
* **PRINCIPLE 3 (Token-Based System):** All visual properties are defined as design tokens (CSS custom properties). The AI developer **MUST** use the provided tokens (via Tailwind utility classes) and **MUST NOT** use hard-coded or "magic number" values (e.g., \#FFFFFF, 22px).

## **2.0 Color System**

The system supports both a default dark theme and a light theme. The theme is controlled by the presence of a .light class on the \<html\> or \<body\> tag.

### **2.1 Color Tokens (CSS Variables)**

**RULE:** The following CSS variables must be defined in a global stylesheet. The :root scope defines the default **dark theme**. The .light scope overrides these tokens for the **light theme**.

/\* /styles/globals.css \*/  
:root {  
  /\* Dark Theme Tokens \*/  
  \--background: 0 0% 7%; /\* Almost black \*/  
  \--foreground: 0 0% 96%; /\* Almost white \*/

  \--card: 0 0% 10%;  
  \--card-foreground: 0 0% 96%;

  \--popover: 0 0% 10%;  
  \--popover-foreground: 0 0% 96%;

  \--primary: 0 0% 98%;  
  \--primary-foreground: 0 0% 7%;

  \--secondary: 0 0% 13%;  
  \--secondary-foreground: 0 0% 98%;

  \--muted: 0 0% 60%;  
  \--muted-foreground: 0 0% 85%;

  \--accent: 0 0% 13%;  
  \--accent-foreground: 0 0% 98%;

  \--destructive: 0 84% 60%; /\* Red \*/  
  \--destructive-foreground: 0 0% 100%;

  \--success: 142 76% 36%; /\* Green \*/  
  \--warning: 38 92% 50%; /\* Yellow \*/

  \--border: 0 0% 20%;  
  \--input: 0 0% 20%;  
  \--ring: 0 0% 40%; /\* Focus ring \*/

  \--radius: 6px;  
}

.light {  
  /\* Light Theme Overrides \*/  
  \--background: 0 0% 98%; /\* Almost white \*/  
  \--foreground: 0 0% 7%; /\* Almost black \*/

  \--card: 0 0% 100%;  
  \--card-foreground: 0 0% 7%;

  \--popover: 0 0% 100%;  
  \--popover-foreground: 0 0% 7%;

  \--primary: 0 0% 7%;  
  \--primary-foreground: 0 0% 98%;

  \--secondary: 0 0% 93%;  
  \--secondary-foreground: 0 0% 15%;

  \--muted: 0 0% 40%;  
  \--muted-foreground: 0 0% 25%;

  \--accent: 0 0% 93%;  
  \--accent-foreground: 0 0% 15%;

  \--destructive: 0 84% 60%;  
  \--destructive-foreground: 0 0% 100%;  
    
  \--success: 142 76% 36%;  
  \--warning: 38 92% 50%;

  \--border: 0 0% 87%;  
  \--input: 0 0% 87%;  
  \--ring: 0 0% 15%;  
}

### **2.2 Semantic Color Usage**

**RULE:** The destructive, success, and warning colors must only be used to convey their corresponding semantic meaning.

| Semantic Purpose | Tailwind Class | Use Case Examples |
| :---- | :---- | :---- |
| Destructive Action | bg-destructive, text-destructive | Delete buttons, error messages, critical warnings. |
| Success State | bg-success, text-success | Confirmation messages, "Published" status, online indicators. |
| Warning/Caution | bg-warning, text-warning | "Draft" status, non-critical alerts, prompts for user attention. |

## **3.0 Typography System**

### **3.1 Font Families**

**RULE:** The application will use two primary font families, defined as CSS variables.

/\* /styles/globals.css \*/  
:root {  
  \--font-sans: 'Inter', sans-serif; /\* For all UI and body text \*/  
  \--font-serif: 'Source Serif Pro', serif; /\* For display headings and editorial titles \*/  
}

### **3.2 Typographic Scale**

**RULE:** All text must adhere to the following typographic scale. The AI developer should use the corresponding utility classes, which will be configured in Tailwind.

| Use Case | Tailwind Class | Font Size (rem) | Font Weight | Line Height |
| :---- | :---- | :---- | :---- | :---- |
| Display | .text-display | 3rem (48px) | 700 (Bold) | 1.2 |
| Heading 1 | .text-h1 | 2.25rem (36px) | 700 (Bold) | 1.2 |
| Heading 2 | .text-h2 | 1.875rem (30px) | 700 (Bold) | 1.3 |
| Heading 3 | .text-h3 | 1.5rem (24px) | 600 (SemiBold) | 1.4 |
| Heading 4 | .text-h4 | 1.25rem (20px) | 600 (SemiBold) | 1.4 |
| Body (Lead) | .text-lead | 1.125rem (18px) | 400 (Regular) | 1.6 |
| **Body (Default)** | **.text-body** | **1rem (16px)** | **400 (Regular)** | **1.7** |
| Small / Meta | .text-small | 0.875rem (14px) | 400 (Regular) | 1.5 |
| Caption / Tiny | .text-caption | 0.75rem (12px) | 400 (Regular) | 1.4 |

## **4.0 Layout & Spacing**

**RULE:** The application must use an **8-point grid system**. All margins, paddings, gaps, and fixed dimensions must be a multiple of 4px. This ensures a consistent visual rhythm. Tailwind's default spacing scale, which uses 0.25rem (4px) increments, aligns with this rule and should be used.

| Token | Tailwind Class | Value |
| :---- | :---- | :---- |
| space-1 | p-1, m-1, gap-1 | 0.25rem (4px) |
| space-2 | p-2, m-2, gap-2 | 0.5rem (8px) |
| space-3 | p-3, m-3, gap-3 | 0.75rem (12px) |
| space-4 | p-4, m-4, gap-4 | 1rem (16px) |
| space-6 | p-6, m-6, gap-6 | 1.5rem (24px) |
| space-8 | p-8, m-8, gap-8 | 2rem (32px) |

## **5.0 Borders & Shadows**

* **RULE (Borders):** The standard border radius for all elements (cards, inputs, buttons) is defined by the \--radius token (6px). Use the rounded-md Tailwind utility.  
* **RULE (Shadows):** Use shadows sparingly to provide elevation for floating elements like modals and popovers.

## **6.0 Tailwind CSS Integration**

**RULE:** The following configuration must be used in tailwind.config.ts to integrate all design tokens into the utility class system. This is non-negotiable.

// tailwind.config.ts  
import type { Config } from 'tailwindcss';

const config: Config \= {  
  darkMode: \['class'\], // Enables class-based dark/light mode  
  content: \[  
    './pages/\*\*/\*.{js,ts,jsx,tsx,mdx}',  
    './components/\*\*/\*.{js,ts,jsx,tsx,mdx}',  
    './app/\*\*/\*.{js,ts,jsx,tsx,mdx}',  
  \],  
  theme: {  
    extend: {  
      colors: {  
        border: 'hsl(var(--border))',  
        input: 'hsl(var(--input))',  
        ring: 'hsl(var(--ring))',  
        background: 'hsl(var(--background))',  
        foreground: 'hsl(var(--foreground))',  
        primary: {  
          DEFAULT: 'hsl(var(--primary))',  
          foreground: 'hsl(var(--primary-foreground))',  
        },  
        secondary: {  
          DEFAULT: 'hsl(var(--secondary))',  
          foreground: 'hsl(var(--secondary-foreground))',  
        },  
        destructive: {  
          DEFAULT: 'hsl(var(--destructive))',  
          foreground: 'hsl(var(--destructive-foreground))',  
        },  
        success: {  
          DEFAULT: 'hsl(var(--success))',  
        },  
        warning: {  
          DEFAULT: 'hsl(var(--warning))',  
        },  
        muted: {  
          DEFAULT: 'hsl(var(--muted))',  
          foreground: 'hsl(var(--muted-foreground))',  
        },  
        accent: {  
          DEFAULT: 'hsl(var(--accent))',  
          foreground: 'hsl(var(--accent-foreground))',  
        },  
        card: {  
          DEFAULT: 'hsl(var(--card))',  
          foreground: 'hsl(var(--card-foreground))',  
        },  
        popover: {  
          DEFAULT: 'hsl(var(--popover))',  
          foreground: 'hsl(var(--popover-foreground))',  
        },  
      },  
      borderRadius: {  
        lg: 'var(--radius)',  
        md: 'calc(var(--radius) \- 2px)',  
        sm: 'calc(var(--radius) \- 4px)',  
      },  
      fontFamily: {  
        sans: \['var(--font-sans)'\],  
        serif: \['var(--font-serif)'\],  
      },  
    },  
  },  
  plugins: \[\],  
};

export default config;

## **7.0 Final Checklist for AI Developer**

**RULE:** Before committing code that generates UI, verify the following:

* \[ \] Are all colors applied using semantic Tailwind utility classes (e.g., bg-primary, text-foreground) instead of hard-coded values?  
* \[ \] Does all text adhere to the defined typographic scale via classes like .text-body or .text-h2?  
* \[ \] Is all spacing (margin, padding, gap) implemented using Tailwind's p-\*, m-\*, gap-\* utilities?  
* \[ \] Are all interactive elements (buttons, cards) using the standard border radius (rounded-md)?  
* \[ \] Does the generated component respect both light and dark themes correctly without custom theme logic?