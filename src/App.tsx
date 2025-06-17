
// ABOUTME: Main application router and providers configuration.
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CustomThemeProvider } from "@/components/theme/CustomThemeProvider";
import PWAProvider from "@/components/pwa/PWAProvider";
import Index from "./pages/Index";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import AcervoPage from "./pages/AcervoPage";
import ComunidadePage from "./pages/ComunidadePage";
import PerfilPage from "./pages/PerfilPage";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import NotFound from "./pages/NotFound";
import { AuthSessionProvider } from "./components/auth/AuthSessionProvider";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AppShell from "./components/shell/AppShell";
import { AppDataProvider } from "./contexts/AppDataContext";
import ErrorBoundary from "./components/ErrorBoundary";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <CustomThemeProvider defaultTheme="dark">
        <PWAProvider>
          <TooltipProvider>
            <Toaster />
            <BrowserRouter>
              <AuthSessionProvider>
                <Routes>
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/signup" element={<SignupPage />} />
                  <Route path="/unauthorized" element={<UnauthorizedPage />} />
                  <Route path="/*" element={
                    <ProtectedRoute>
                      <AppDataProvider>
                        <AppShell>
                          <Routes>
                            <Route path="/" element={<Index />} />
                            <Route path="/acervo" element={<AcervoPage />} />
                            <Route path="/comunidade" element={<ComunidadePage />} />
                            <Route path="/perfil" element={<PerfilPage />} />
                            
                            {/* Future Editor Routes - Protected by role-based access */}
                            {/* Placeholder routes for documentation purposes */}
                            {/* 
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
                            */}
                            
                            <Route path="*" element={<NotFound />} />
                          </Routes>
                        </AppShell>
                      </AppDataProvider>
                    </ProtectedRoute>
                  } />
                </Routes>
              </AuthSessionProvider>
            </BrowserRouter>
          </TooltipProvider>
        </PWAProvider>
      </CustomThemeProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
