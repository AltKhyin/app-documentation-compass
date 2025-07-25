
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    // Ensure React is deduplicated to prevent multiple instances
    dedupe: ['react', 'react-dom', '@tanstack/react-query']
  },
  optimizeDeps: {
    // Force pre-bundling of these dependencies to ensure consistent versions
    include: ['react', 'react-dom', '@tanstack/react-query'],
    // Force Vite to re-optimize dependencies
    force: true
  }
}));
