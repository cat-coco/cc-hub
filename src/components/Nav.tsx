import { Link } from 'react-router-dom';
import { IconSearch } from './Icon';
import { useAuthStore } from '../store/auth';

const LINKS = [
  { to: '/', key: 'home', label: '首页' },
  { to: '/articles', key: 'articles', label: '文章' },
  { to: '/cases', key: 'cases', label: '实战案例' },
  { to: '/snippets', key: 'snippets', label: 'Snippets' },
  { to: '/tools', key: 'tools', label: '工具导航' },
  { to: '/articles', key: 'qa', label: '问答' },
];

interface NavProps {
  active?: string;
}

export default function Nav({ active }: NavProps) {
  const user = useAuthStore((s) => s.user);
  const isAdmin = useAuthStore((s) => s.isAdmin());
  const initial =
    user?.nickname?.charAt(0)?.toUpperCase() ??
    user?.username?.charAt(0)?.toUpperCase() ??
    'Z';

  return (
    <nav className="nav">
      <div className="nav-inner">
        <Link className="brand" to="/">
          <span className="brand-mark" />
          <span className="brand-name">ClaudeCode</span>
          <span className="brand-slash">/</span>
          <span className="brand-sub">Hub</span>
        </Link>
        <div className="nav-links">
          {LINKS.map((l) => (
            <Link
              key={l.key + l.label}
              to={l.to}
              className={`nav-link ${l.key === active ? 'active' : ''}`}
            >
              {l.label}
            </Link>
          ))}
        </div>
        <div className="nav-spacer" />
        <Link className="nav-search" to="/search">
          <IconSearch />
          <span>搜索文章、工具…</span>
          <kbd>⌘K</kbd>
        </Link>
        {user ? (
          <>
            {isAdmin && (
              <Link className="nav-link" to="/admin/dashboard">
                后台
              </Link>
            )}
            <Link className="nav-avatar" to="/profile" title={user.nickname || user.username}>
              {initial}
            </Link>
          </>
        ) : (
          <>
            <Link className="nav-link" to="/login">
              登录
            </Link>
            <Link className="nav-avatar" to="/login" title="登录">
              {initial}
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
