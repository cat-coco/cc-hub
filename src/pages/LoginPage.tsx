import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAuthStore } from '../store/auth';
import { ApiError } from '../api/client';
import '../styles/login.css';

type Tab = 'email' | 'phone' | 'github' | 'wechat';
type Mode = 'login' | 'register';

export default function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const register = useAuthStore((s) => s.register);

  const [tab, setTab] = useState<Tab>('email');
  const [mode, setMode] = useState<Mode>('login');
  const [account, setAccount] = useState('admin');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [agree, setAgree] = useState(true);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    if (!agree) {
      setErr('请先阅读并同意社区公约与隐私政策');
      return;
    }
    setBusy(true);
    try {
      if (mode === 'login') {
        await login(account.trim(), password);
      } else {
        await register({ username: username.trim(), email: email.trim(), password, nickname: nickname.trim() || undefined });
      }
      navigate('/home');
    } catch (e2) {
      setErr(e2 instanceof ApiError ? e2.message : '登录失败，请稍后重试');
    } finally {
      setBusy(false);
    }
  }

  return (
    <Layout active="" showFooter={false}>
      <div className="login-page">
        <div className="bg-deco" />

        <div className="login-wrap">
          <div className="login-card">
            <div className="login-brand">
              <span className="brand-mark" />
              <span className="name">
                ClaudeCode <span style={{ color: 'var(--ink-4)' }}>/</span> Hub
              </span>
            </div>
            <h2 className="login-title">{mode === 'login' ? '欢迎回来' : '创建新账号'}</h2>
            <p className="login-sub">
              {mode === 'login' ? '登录后可收藏文章、发表评论、参与社区贡献' : '免费注册，立即开始发表你的第一篇文章'}
            </p>

            <div className="login-tabs">
              <button type="button" className={`login-tab${tab === 'email' ? ' on' : ''}`} onClick={() => setTab('email')}>邮箱</button>
              <button type="button" className={`login-tab${tab === 'phone' ? ' on' : ''}`} onClick={() => setTab('phone')}>手机号</button>
              <button type="button" className={`login-tab${tab === 'github' ? ' on' : ''}`} onClick={() => setTab('github')}>GitHub</button>
              <button type="button" className={`login-tab${tab === 'wechat' ? ' on' : ''}`} onClick={() => setTab('wechat')}>微信扫码</button>
            </div>

            {tab === 'email' && (
              <form onSubmit={onSubmit}>
                {mode === 'register' && (
                  <>
                    <div className="login-field">
                      <label>用户名</label>
                      <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="3-32 位，字母或数字" required />
                    </div>
                    <div className="login-field">
                      <label>昵称（可选）</label>
                      <input value={nickname} onChange={(e) => setNickname(e.target.value)} placeholder="展示在文章与评论里的名字" />
                    </div>
                  </>
                )}
                <div className="login-field">
                  <label>{mode === 'login' ? '邮箱或用户名' : '邮箱地址'}</label>
                  <input
                    type={mode === 'register' ? 'email' : 'text'}
                    value={mode === 'register' ? email : account}
                    onChange={(e) => (mode === 'register' ? setEmail(e.target.value) : setAccount(e.target.value))}
                    placeholder={mode === 'register' ? 'you@example.com' : 'admin / you@example.com'}
                    required
                  />
                </div>
                <div className="login-field">
                  <label>密码</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="至少 8 位，含字母与数字"
                    required
                    minLength={8}
                  />
                </div>
                {mode === 'login' && (
                  <div className="login-row-between">
                    <label><input type="checkbox" defaultChecked /> 记住我</label>
                    <a href="#">忘记密码？</a>
                  </div>
                )}
                <div className="login-check">
                  <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} />{' '}
                  我已阅读并同意 <a href="#">《社区公约》</a> 与 <a href="#">《隐私政策》</a>
                </div>
                {err && (
                  <div style={{ marginBottom: 12, padding: '8px 12px', background: 'rgba(178,70,63,0.08)', border: '1px solid rgba(178,70,63,0.25)', color: 'var(--danger)', borderRadius: 'var(--r-md)', fontSize: 13 }}>
                    {err}
                  </div>
                )}
                <button type="submit" className="btn btn-primary btn-submit" disabled={busy}>
                  {busy ? '正在提交…' : mode === 'login' ? '登录' : '注册并登录'}
                </button>
                <p className="foot-link">
                  {mode === 'login' ? (
                    <>还没有账号？<a href="#" onClick={(e) => { e.preventDefault(); setMode('register'); setErr(null); }}>立即注册</a></>
                  ) : (
                    <>已有账号？<a href="#" onClick={(e) => { e.preventDefault(); setMode('login'); setErr(null); }}>去登录</a></>
                  )}
                </p>
              </form>
            )}

            {tab === 'phone' && (
              <div style={{ padding: '24px 0 12px', textAlign: 'center', color: 'var(--ink-3)', fontSize: 13 }}>
                短信登录需接入阿里云 / 腾讯云短信服务，敬请期待。
              </div>
            )}

            {tab === 'github' && (
              <div style={{ padding: '24px 0 12px', textAlign: 'center' }}>
                <div style={{ padding: '32px 0', background: 'var(--surface-2)', borderRadius: 'var(--r-md)', border: '1px dashed var(--line)' }}>
                  <p style={{ fontSize: 13, color: 'var(--ink-2)', margin: '0 0 14px' }}>GitHub OAuth 需在系统设置中配置 Client ID / Secret 后启用。</p>
                  <Link className="btn btn-secondary" to="/home">返回首页</Link>
                </div>
              </div>
            )}

            {tab === 'wechat' && (
              <div className="qr-box">
                <div className="qr"><div className="qr-grid" /></div>
                <p className="qr-hint">
                  打开 <b>微信</b> 扫一扫（需先在系统配置中接入微信开放平台）
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
