import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/sonner'
import ErrorBoundary from '@/components/ErrorBoundary'
import { AppProviders } from '@/components/providers/AppProviders'

// Pages
import Index from './pages/Index'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import AcervoPage from './pages/AcervoPage'
import ReviewDetailPage from './pages/ReviewDetailPage'
import ComunidadePage from './pages/ComunidadePage'
import { SubmitPage } from './pages/community/SubmitPage'
import CommunityPostPage from './pages/CommunityPostPage'
import CommunityInfoPage from './pages/CommunityInfoPage'
import SavedPostsPage from './pages/SavedPostsPage'
import PerfilPage from './pages/PerfilPage'
import NotFound from './pages/NotFound'
import UnauthorizedPage from './pages/UnauthorizedPage'

// Components
import { ProtectedAppRoute } from '@/components/routes/ProtectedAppRoute'

function App() {
  return (
    <ErrorBoundary>
      <AppProviders>
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            
            {/* Protected routes */}
            <Route path="/" element={<ProtectedAppRoute><Index /></ProtectedAppRoute>} />
            <Route path="/acervo" element={<ProtectedAppRoute><AcervoPage /></ProtectedAppRoute>} />
            <Route path="/review/:slug" element={<ProtectedAppRoute><ReviewDetailPage /></ProtectedAppRoute>} />
            <Route path="/comunidade" element={<ProtectedAppRoute><ComunidadePage /></ProtectedAppRoute>} />
            <Route path="/comunidade/submit" element={<ProtectedAppRoute><SubmitPage /></ProtectedAppRoute>} />
            <Route path="/comunidade/:postId" element={<ProtectedAppRoute><CommunityPostPage /></ProtectedAppRoute>} />
            <Route path="/comunidade/info" element={<ProtectedAppRoute><CommunityInfoPage /></ProtectedAppRoute>} />
            <Route path="/salvos" element={<ProtectedAppRoute><SavedPostsPage /></ProtectedAppRoute>} />
            <Route path="/perfil" element={<ProtectedAppRoute><PerfilPage /></ProtectedAppRoute>} />
            
            {/* 404 route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </BrowserRouter>
      </AppProviders>
    </ErrorBoundary>
  )
}

export default App
