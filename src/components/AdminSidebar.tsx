import { Link } from 'react-router-dom';
import Icon from './Icon';

interface Props {
  active?: 'dashboard' | 'articles' | 'categories' | 'tags' | 'cases' | 'snippets' | 'comments' | 'users' | 'roles' | 'stats' | 'settings';
}

export default function AdminSidebar({ active = 'dashboard' }: Props) {
  return (
    <aside className="admin-aside">
      <Link className="brand" to="/home">
        <span className="brand-mark" />
        <span className="brand-name">ClaudeCode</span>
        <span className="brand-slash" style={{ color: 'var(--ink-4)', fontWeight: 400 }}>/</span>
        <span className="brand-sub" style={{ color: 'var(--ink-3)', fontWeight: 500 }}>Admin</span>
      </Link>

      <nav className="amenu">
        <div className="amenu-group">概览</div>
        <Link to="/admin/dashboard" className={active === 'dashboard' ? 'on' : ''}>
          <Icon size="sm">
            <rect x="3" y="3" width="7" height="9" rx="1" />
            <rect x="14" y="3" width="7" height="5" rx="1" />
            <rect x="14" y="12" width="7" height="9" rx="1" />
            <rect x="3" y="16" width="7" height="5" rx="1" />
          </Icon>
          仪表盘
        </Link>

        <div className="amenu-group">内容管理</div>
        <Link to="/admin/editor" className={active === 'articles' ? 'on' : ''}>
          <Icon size="sm">
            <path d="M14 3v5h5M6 3h9l5 5v13a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" />
          </Icon>
          文章 <span className="n">2,847</span>
        </Link>
        <a href="#">
          <Icon size="sm">
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
          </Icon>
          分类 <span className="n">26</span>
        </a>
        <a href="#">
          <Icon size="sm">
            <path d="M20 12 12 20 3 11V3h8z" />
            <circle cx="7" cy="7" r="1.5" />
          </Icon>
          标签 <span className="n">184</span>
        </a>
        <a href="#">
          <Icon size="sm">
            <rect x="3" y="4" width="18" height="14" rx="2" />
          </Icon>
          实战案例 <span className="n">416</span>
        </a>
        <a href="#">
          <Icon size="sm">
            <path d="M8 6H4v4M16 6h4v4M8 18H4v-4M16 18h4v-4" />
          </Icon>
          Snippets <span className="n">1,203</span>
        </a>
        <a href="#">
          <Icon size="sm">
            <path d="M21 12a8 8 0 1 1-3-6l3-1-1 3a8 8 0 0 1 1 4z" />
          </Icon>
          评论审核 <span className="n" style={{ color: 'var(--brand)' }}>12</span>
        </a>

        <div className="amenu-group">权限</div>
        <a href="#">
          <Icon size="sm">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 21a8 8 0 0 1 16 0" />
          </Icon>
          用户管理 <span className="n">38.5k</span>
        </a>
        <a href="#">
          <Icon size="sm">
            <rect x="4" y="10" width="16" height="10" rx="2" />
            <path d="M8 10V6a4 4 0 0 1 8 0v4" />
          </Icon>
          角色权限
        </a>

        <div className="amenu-group">数据</div>
        <a href="#">
          <Icon size="sm">
            <path d="M3 12h4l3-8 4 16 3-8h4" />
          </Icon>
          数据统计
        </a>
        <a href="#">
          <Icon size="sm">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.2-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.2 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" />
          </Icon>
          系统设置
        </a>
      </nav>

      <div className="aside-foot">
        <span className="ava">Z</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, color: 'var(--ink)', fontWeight: 500 }}>张未未</div>
          <div style={{ fontSize: 11 }}>超级管理员</div>
        </div>
      </div>
    </aside>
  );
}
