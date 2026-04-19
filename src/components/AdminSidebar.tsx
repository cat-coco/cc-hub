import { Link, useLocation } from 'react-router-dom';
import type { ReactElement } from 'react';
import Icon from './Icon';

type MenuItem =
  | { kind: 'group'; label: string }
  | { kind: 'link'; to: string; label: string; icon?: ReactElement; badge?: string };

const MENU: MenuItem[] = [
  { kind: 'group', label: '概览' },
  { kind: 'link', to: '/admin/dashboard', label: '仪表盘',
    icon: <Icon size="sm"><rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/></Icon> },

  { kind: 'group', label: '内容管理' },
  { kind: 'link', to: '/admin/article/list', label: '文章列表',
    icon: <Icon size="sm"><path d="M14 3v5h5M6 3h9l5 5v13a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"/></Icon> },
  { kind: 'link', to: '/admin/article/review', label: '待审核',
    icon: <Icon size="sm"><path d="M21 12a8 8 0 1 1-3-6l3-1-1 3a8 8 0 0 1 1 4z"/></Icon> },
  { kind: 'link', to: '/admin/article/category', label: '分类管理',
    icon: <Icon size="sm"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></Icon> },
  { kind: 'link', to: '/admin/article/tag', label: '标签管理',
    icon: <Icon size="sm"><path d="M20 12 12 20 3 11V3h8z"/><circle cx="7" cy="7" r="1.5"/></Icon> },

  { kind: 'group', label: '互动管理' },
  { kind: 'link', to: '/admin/comment/review', label: '评论审核',
    icon: <Icon size="sm"><path d="M21 12a8 8 0 1 1-3-6l3-1-1 3a8 8 0 0 1 1 4z"/></Icon> },
  { kind: 'link', to: '/admin/report', label: '举报处理',
    icon: <Icon size="sm"><path d="M4 4h13l3 4-3 4H4z"/><path d="M4 4v16"/></Icon> },

  { kind: 'group', label: '用户管理' },
  { kind: 'link', to: '/admin/user/list', label: '用户列表',
    icon: <Icon size="sm"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></Icon> },
  { kind: 'link', to: '/admin/user/sensitive-words', label: '敏感词库',
    icon: <Icon size="sm"><path d="M12 2 2 7l10 5 10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></Icon> },

  { kind: 'group', label: '数据统计' },
  { kind: 'link', to: '/admin/stats/articles', label: '文章分析',
    icon: <Icon size="sm"><path d="M3 12h4l3-8 4 16 3-8h4"/></Icon> },
  { kind: 'link', to: '/admin/stats/categories', label: '分类分析',
    icon: <Icon size="sm"><circle cx="12" cy="12" r="9"/><path d="M12 3v9l8 4"/></Icon> },
  { kind: 'link', to: '/admin/stats/authors', label: '作者分析',
    icon: <Icon size="sm"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></Icon> },
  { kind: 'link', to: '/admin/stats/keywords', label: '搜索词分析',
    icon: <Icon size="sm"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></Icon> },

  { kind: 'group', label: '运维' },
  { kind: 'link', to: '/admin/audit-log', label: '审计日志',
    icon: <Icon size="sm"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 8h10M7 12h10M7 16h6"/></Icon> },
];

export default function AdminSidebar({ active }: { active?: string }) {
  const location = useLocation();
  const onPath = (to: string) => {
    if (active && to.includes(active)) return true;
    return location.pathname === to || location.pathname.startsWith(to + '/');
  };

  return (
    <aside className="admin-aside">
      <Link className="brand" to="/home">
        <span className="brand-mark" />
        <span className="brand-name">ClaudeCode</span>
        <span className="brand-slash" style={{ color: 'var(--ink-4)', fontWeight: 400 }}>/</span>
        <span className="brand-sub" style={{ color: 'var(--ink-3)', fontWeight: 500 }}>Admin</span>
      </Link>

      <nav className="amenu">
        {MENU.map((m, i) =>
          m.kind === 'group' ? (
            <div key={`g${i}`} className="amenu-group">{m.label}</div>
          ) : (
            <Link key={m.to} to={m.to} className={onPath(m.to) ? 'on' : ''}>
              {m.icon}
              {m.label}
              {m.badge && <span className="n" style={{ color: 'var(--brand)' }}>{m.badge}</span>}
            </Link>
          ),
        )}
      </nav>

      <div className="aside-foot">
        <span className="ava">A</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, color: 'var(--ink)', fontWeight: 500 }}>管理员</div>
          <div style={{ fontSize: 11 }}>超级管理员</div>
        </div>
      </div>
    </aside>
  );
}
