import { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import '../styles/login.css';

type Tab = 'email' | 'phone' | 'github' | 'wechat';

export default function LoginPage() {
  const [tab, setTab] = useState<Tab>('email');

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
            <h2 className="login-title">欢迎回来</h2>
            <p className="login-sub">登录后可收藏文章、发表评论、参与社区贡献</p>

            <div className="login-tabs">
              <button type="button" className={`login-tab${tab === 'email' ? ' on' : ''}`} onClick={() => setTab('email')}>邮箱</button>
              <button type="button" className={`login-tab${tab === 'phone' ? ' on' : ''}`} onClick={() => setTab('phone')}>手机号</button>
              <button type="button" className={`login-tab${tab === 'github' ? ' on' : ''}`} onClick={() => setTab('github')}>GitHub</button>
              <button type="button" className={`login-tab${tab === 'wechat' ? ' on' : ''}`} onClick={() => setTab('wechat')}>微信扫码</button>
            </div>

            {tab === 'email' && (
              <div>
                <div className="login-field">
                  <label>邮箱地址</label>
                  <input type="email" placeholder="you@example.com" />
                </div>
                <div className="login-field">
                  <label>密码</label>
                  <input type="password" placeholder="至少 8 位，含字母与数字" />
                </div>
                <div className="login-row-between">
                  <label>
                    <input type="checkbox" /> 记住我
                  </label>
                  <a href="#">忘记密码？</a>
                </div>
                <div className="login-check">
                  <input type="checkbox" defaultChecked /> 我已阅读并同意 <a href="#">《社区公约》</a> 与 <a href="#">《隐私政策》</a>
                </div>
                <Link className="btn btn-primary btn-submit" to="/home">登录</Link>
                <div className="login-divider">或</div>
                <div className="oauth-row">
                  <button type="button" className="oauth">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 .5C5.7.5.5 5.7.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.3.8-.6v-2c-3.2.7-3.9-1.5-3.9-1.5-.5-1.3-1.3-1.7-1.3-1.7-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.6-.3-5.3-1.3-5.3-5.7 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.2 1.2a11 11 0 0 1 5.8 0c2.2-1.5 3.2-1.2 3.2-1.2.6 1.6.2 2.8.1 3.1.7.8 1.2 1.8 1.2 3.1 0 4.4-2.7 5.4-5.3 5.7.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6 4.6-1.5 7.9-5.8 7.9-10.9C23.5 5.7 18.3.5 12 .5z" />
                    </svg>
                    GitHub
                  </button>
                  <button type="button" className="oauth">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="#07C160">
                      <path d="M8.5 3C4.4 3 1 5.8 1 9.3c0 2 1.1 3.8 2.9 5l-.7 2.2 2.6-1.3c.9.3 1.8.4 2.7.4.3 0 .5 0 .8-.1a5.5 5.5 0 0 1 5.3-7.2c.4 0 .7 0 1 .1C14.7 5 12 3 8.5 3zm-2.2 3c.5 0 .9.4.9.9a.9.9 0 0 1-1.8 0c0-.5.4-.9.9-.9zm4.4 0c.5 0 .9.4.9.9a.9.9 0 0 1-1.8 0c0-.5.4-.9.9-.9zM16 10c-3.6 0-6.5 2.5-6.5 5.5s2.9 5.5 6.5 5.5c.8 0 1.5-.1 2.2-.3l2 1-.5-1.8C21 18.8 22 17.2 22 15.5 22 12.5 19.6 10 16 10zm-2 2.5c.4 0 .7.3.7.7a.7.7 0 0 1-1.4 0c0-.4.3-.7.7-.7zm4 0c.4 0 .7.3.7.7a.7.7 0 0 1-1.4 0c0-.4.3-.7.7-.7z" />
                    </svg>
                    微信
                  </button>
                </div>
              </div>
            )}

            {tab === 'phone' && (
              <div>
                <div className="login-field">
                  <label>手机号码</label>
                  <input type="tel" placeholder="+86 · 请输入 11 位手机号" />
                </div>
                <div className="login-field">
                  <label>验证码</label>
                  <div className="login-field-row">
                    <input type="text" placeholder="6 位短信验证码" />
                    <button type="button" className="btn-code">获取验证码</button>
                  </div>
                </div>
                <div className="login-check">
                  <input type="checkbox" defaultChecked /> 我已阅读并同意 <a href="#">《社区公约》</a> 与 <a href="#">《隐私政策》</a>
                </div>
                <Link className="btn btn-primary btn-submit" to="/home">登录 / 注册</Link>
              </div>
            )}

            {tab === 'github' && (
              <div style={{ padding: '24px 0 12px', textAlign: 'center' }}>
                <div style={{ padding: '32px 0', background: 'var(--surface-2)', borderRadius: 'var(--r-md)', border: '1px dashed var(--line)' }}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="var(--ink)" style={{ margin: '0 auto 14px' }}>
                    <path d="M12 .5C5.7.5.5 5.7.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.3.8-.6v-2c-3.2.7-3.9-1.5-3.9-1.5-.5-1.3-1.3-1.7-1.3-1.7-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.6-.3-5.3-1.3-5.3-5.7 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.2 1.2a11 11 0 0 1 5.8 0c2.2-1.5 3.2-1.2 3.2-1.2.6 1.6.2 2.8.1 3.1.7.8 1.2 1.8 1.2 3.1 0 4.4-2.7 5.4-5.3 5.7.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6 4.6-1.5 7.9-5.8 7.9-10.9C23.5 5.7 18.3.5 12 .5z" />
                  </svg>
                  <p style={{ fontSize: 13, color: 'var(--ink-2)', margin: '0 0 14px' }}>用 GitHub 账号授权登录</p>
                  <Link className="btn btn-primary" to="/home" style={{ background: '#1F1A15' }}>使用 GitHub 继续</Link>
                </div>
              </div>
            )}

            {tab === 'wechat' && (
              <div className="qr-box">
                <div className="qr"><div className="qr-grid" /></div>
                <p className="qr-hint">
                  打开 <b>微信</b> 扫一扫，登录 ClaudeCode Hub
                </p>
                <p style={{ margin: '4px 0 0', fontSize: 12, color: 'var(--ink-3)' }}>二维码 3 分钟后失效</p>
              </div>
            )}

            <p className="foot-link">
              还没有账号？<a href="#">立即注册</a>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
