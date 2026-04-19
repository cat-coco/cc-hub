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
// Admin pages (batches 3-6)
import AdminArticleListPage from './pages/admin/AdminArticleListPage';
import ReviewQueuePage from './pages/admin/ReviewQueuePage';
import ReportWorkbenchPage from './pages/admin/ReportWorkbenchPage';
import SensitiveWordPage from './pages/admin/SensitiveWordPage';
import VersionHistoryPage from './pages/admin/VersionHistoryPage';
import DashboardV2Page from './pages/admin/DashboardV2Page';
import StatsArticlesPage from './pages/admin/StatsArticlesPage';
import StatsSimplePage from './pages/admin/StatsSimplePage';
import AuditLogPage from './pages/admin/AuditLogPage';

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

      {/* Admin — legacy */}
      <Route path="/admin" element={<RequireAdmin><AdminDashboardPage /></RequireAdmin>} />
      <Route path="/admin/editor" element={<RequireAdmin><AdminEditorPage /></RequireAdmin>} />
      <Route path="/admin/editor/:id" element={<RequireAdmin><AdminEditorPage /></RequireAdmin>} />

      {/* Admin — batches 3-6 */}
      <Route path="/admin/dashboard" element={<RequireAdmin><DashboardV2Page /></RequireAdmin>} />
      <Route path="/admin/article/list" element={<RequireAdmin><AdminArticleListPage /></RequireAdmin>} />
      <Route path="/admin/article/review" element={<RequireAdmin><ReviewQueuePage /></RequireAdmin>} />
      <Route path="/admin/article/versions/:id" element={<RequireAdmin><VersionHistoryPage /></RequireAdmin>} />
      <Route path="/admin/article/category" element={<RequireAdmin><StatsSimplePage kind="categories" title="分类管理" subtitle="批次 4 支持合并 / 重排；当前页展示只读视图" /></RequireAdmin>} />
      <Route path="/admin/article/tag" element={<RequireAdmin><StatsSimplePage kind="categories" title="标签管理" subtitle="批次 4 支持合并 / 别名 / 批量替换；接口已就绪，UI 为占位" /></RequireAdmin>} />
      <Route path="/admin/comment/review" element={<RequireAdmin><ReviewQueuePage /></RequireAdmin>} />
      <Route path="/admin/report" element={<RequireAdmin><ReportWorkbenchPage /></RequireAdmin>} />
      <Route path="/admin/user/sensitive-words" element={<RequireAdmin><SensitiveWordPage /></RequireAdmin>} />
      <Route path="/admin/stats/articles" element={<RequireAdmin><StatsArticlesPage /></RequireAdmin>} />
      <Route path="/admin/stats/categories" element={<RequireAdmin><StatsSimplePage kind="categories" title="分类分析" /></RequireAdmin>} />
      <Route path="/admin/stats/authors" element={<RequireAdmin><StatsSimplePage kind="authors" title="作者分析" /></RequireAdmin>} />
      <Route path="/admin/stats/keywords" element={<RequireAdmin><StatsSimplePage kind="keywords" title="搜索词分析" subtitle="待 search_keyword_stats 采集上线" /></RequireAdmin>} />
      <Route path="/admin/audit-log" element={<RequireAdmin><AuditLogPage /></RequireAdmin>} />
    </Routes>
  );
}
