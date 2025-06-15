
// ABOUTME: This is the main application component, handling routing and global providers.
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
} from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import AuthSessionProvider from './components/auth/AuthSessionProvider';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import IndexPage from './pages/Index';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/auth/ProtectedRoute';
import SplitScreenAuthLayout from './components/auth/SplitScreenAuthLayout';
import AppShell from './components/shell/AppShell';

const AppShellLayout = () => (
  <AppShell>
    <Outlet />
  </AppShell>
);

function App() {
  return (
    <Router>
      <Toaster />
      <TooltipProvider>
        <AuthSessionProvider>
          <Routes>
            <Route element={<SplitScreenAuthLayout />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
            </Route>

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
