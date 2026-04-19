import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAuthStore } from '../store/auth';
import '../styles/profile.css';

type Tab = 'articles' | 'fav' | 'follow' | 'notif' | 'settings';

export default function ProfilePage() {
  const [tab, setTab] = useState<Tab>('articles');
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  if (!user) return null;

  const initial = (user.nickname ?? user.username).charAt(0).toUpperCase();

  return (
    <Layout active="">
      <div className="container" style={{ paddingTop: 24 }}>
        <div className="profile-banner" />

        <div className="prof-head">
          <div className="prof-ava">{initial}</div>
          <div className="prof-info">
            <h1>
              {user.nickname || user.username}
              {user.roles.includes('ROLE_SUPER_ADMIN') && (
                <span className="tag tag-brand" style={{ marginLeft: 8, verticalAlign: 'middle' }}>超级管理员</span>
              )}
            </h1>
            <p className="bio">{user.bio || '这个人很懒，还没有填写个人简介。'}</p>
            <div className="prof-stats">
              <span><b>{user.profile.articleCount}</b> 文章</span>
              <span><b>{user.profile.followersCount}</b> 粉丝</span>
              <span><b>{user.profile.followingCount}</b> 关注</span>
              <span><b>Lv.{user.profile.level}</b> 等级</span>
            </div>
          </div>
          <div className="prof-cta">
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => { logout(); navigate('/login'); }}>
              退出登录
            </button>
            <Link className="btn btn-primary btn-sm" to="/editor">写文章</Link>
          </div>
        </div>

        <div className="tabs-bar">
          {(
            [
              { k: 'articles', label: '我的文章' },
              { k: 'fav', label: '我的收藏' },
              { k: 'follow', label: '关注的人' },
              { k: 'notif', label: '消息通知' },
              { k: 'settings', label: '账号设置' },
            ] as const
          ).map((t) => (
            <button
              key={t.k}
              type="button"
              className={`ptab${tab === t.k ? ' on' : ''}`}
              onClick={() => setTab(t.k)}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="prof-panel">
          <div>
            {tab === 'articles' && (
              <div style={{ padding: 32, color: 'var(--ink-3)', border: '1px dashed var(--line)', borderRadius: 'var(--r-md)', textAlign: 'center' }}>
                你还没有发表过文章。<Link to="/editor" style={{ color: 'var(--brand)' }}>写第一篇 →</Link>
              </div>
            )}
            {tab === 'settings' && (
              <div style={{ padding: 24, color: 'var(--ink-3)' }}>
                账号设置将在后续版本开放（修改密码、绑定手机、第三方账号等）。
              </div>
            )}
            {tab !== 'articles' && tab !== 'settings' && (
              <div style={{ padding: 48, color: 'var(--ink-3)', textAlign: 'center' }}>
                该页签正在接入，当前仅展示已有数据。
              </div>
            )}
          </div>

          <aside>
            <div className="prof-side-block">
              <h4>账号信息</h4>
              <div style={{ fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.8 }}>
                <div>用户名：{user.username}</div>
                {user.email && <div>邮箱：{user.email}</div>}
                <div>角色：{user.roles.join(' · ')}</div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </Layout>
  );
}
