
// ABOUTME: This is the main application component, handling routing and global providers.
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
} from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AuthSessionProvider } from './components/auth/AuthSessionProvider';
import { AppDataProvider } from './contexts/AppDataContext';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import IndexPage from './pages/Index';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AppShell from './components/shell/AppShell';

const AppShellLayout = () => (
  <AppDataProvider>
    <AppShell>
      <Outlet />
    </AppShell>
  </AppDataProvider>
);

function App() {
  return (
    <Router>
      <Toaster />
      <TooltipProvider>
        <AuthSessionProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            <Route element={<ProtectedRoute />}>
              <Route element={<AppShellLayout />}>
                <Route path="/" element={<IndexPage />} />
                {/* Add other protected routes here inside the AppShellLayout */}
                <Route path="/acervo" element={<div>Acervo Page</div>} />
                <Route path="/comunidade" element={<div>Comunidade Page</div>} />
                <Route path="/perfil" element={<div>Perfil Page</div>} />
              </Route>
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthSessionProvider>
      </TooltipProvider>
    </Router>
  );
}

export default App;
