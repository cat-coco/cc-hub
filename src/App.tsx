import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
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

export default function App() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    const saved = localStorage.getItem('cch.radius') || 'soft';
    document.documentElement.setAttribute('data-radius', saved);
  }, []);

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
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/admin" element={<AdminDashboardPage />} />
      <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
      <Route path="/admin/editor" element={<AdminEditorPage />} />
    </Routes>
  );
}
