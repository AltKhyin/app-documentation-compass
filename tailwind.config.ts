
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        "border-hover": "hsl(var(--border-hover))", // Enhanced for Reddit-style interactions
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Enhanced surface colors for Reddit-style layouts
        surface: {
          DEFAULT: "hsl(var(--surface))",
          muted: "hsl(var(--surface-muted))",
          hover: "hsl(var(--surface-hover))", // For hover states on posts
        },
        // Reddit-style vote colors (preserving existing functionality)
        vote: {
          up: "hsl(16 100% 50%)", // Reddit orange for upvotes
          down: "hsl(231 58% 66%)", // Reddit blue for downvotes
          neutral: "hsl(var(--muted-foreground))", // Neutral state
        },
        // Community-specific colors
        community: {
          separator: "hsl(var(--border))", // For horizontal separators between posts
          metadata: "hsl(var(--muted-foreground))", // For timestamps, author names, etc.
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      spacing: {
        // Reddit-style spacing for compact layouts
        "reddit-compact": "0.75rem", // 12px - for tight spacing between elements
        "reddit-standard": "1rem", // 16px - for standard element spacing
        "reddit-loose": "1.5rem", // 24px - for section spacing
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        // Subtle hover animation for Reddit-style interactions
        "post-hover": {
          "0%": { backgroundColor: "hsl(var(--background))" },
          "100%": { backgroundColor: "hsl(var(--surface-hover))" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "post-hover": "post-hover 0.15s ease-out",
      },
      // Typography enhancements for Reddit-style content hierarchy
      fontSize: {
        "post-title": ["1.125rem", { lineHeight: "1.5", fontWeight: "600" }], // 18px for post titles
        "post-meta": ["0.75rem", { lineHeight: "1.25" }], // 12px for metadata
        "comment-body": ["0.875rem", { lineHeight: "1.5" }], // 14px for comment text
      },
      // Layout utilities for Reddit-style spacing
      gap: {
        "reddit-tight": "0.5rem", // 8px - for very compact layouts
        "reddit-normal": "0.75rem", // 12px - for normal spacing
        "reddit-wide": "1rem", // 16px - for wider spacing
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require('@tailwindcss/typography')
  ],
};

export default config;
