import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuthStore } from './store/auth';
import IndexPage from './pages/IndexPage';
import HomePage from './pages/HomePage';
import ArticlesPage from './pages/ArticlesPage';
import ArticlePage from './pages/ArticlePage';
import CasesPage from './pages/CasesPage';
import SnippetsPage from './pages/SnippetsPage';
import ToolsPage from './pages/ToolsPage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import SearchPage from './pages/SearchPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminEditorPage from './pages/AdminEditorPage';

function RequireAdmin({ children }: { children: React.ReactNode }) {
  const { user, ready, isAdmin } = useAuthStore();
  if (!ready) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (!isAdmin()) return <Navigate to="/home" replace />;
  return <>{children}</>;
}

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, ready } = useAuthStore();
  if (!ready) return null;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export default function App() {
  const location = useLocation();
  const refresh = useAuthStore((s) => s.refresh);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    const saved = localStorage.getItem('cch.radius') || 'soft';
    document.documentElement.setAttribute('data-radius', saved);
    refresh();
  }, [refresh]);

  return (
    <Routes>
      <Route path="/" element={<IndexPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/articles" element={<ArticlesPage />} />
      <Route path="/article" element={<ArticlePage />} />
      <Route path="/article/:slug" element={<ArticlePage />} />
      <Route path="/cases" element={<CasesPage />} />
      <Route path="/snippets" element={<SnippetsPage />} />
      <Route path="/tools" element={<ToolsPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/profile" element={<RequireAuth><ProfilePage /></RequireAuth>} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/admin" element={<RequireAdmin><AdminDashboardPage /></RequireAdmin>} />
      <Route path="/admin/dashboard" element={<RequireAdmin><AdminDashboardPage /></RequireAdmin>} />
      <Route path="/admin/editor" element={<RequireAdmin><AdminEditorPage /></RequireAdmin>} />
      <Route path="/admin/editor/:id" element={<RequireAdmin><AdminEditorPage /></RequireAdmin>} />
    </Routes>
  );
}
