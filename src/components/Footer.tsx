import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-inner">
          <div>
            <Link className="brand" to="/home" style={{ marginBottom: 12 }}>
              <span className="brand-mark" />
              <span className="brand-name">ClaudeCode</span>
              <span className="brand-slash">/</span>
              <span className="brand-sub">Hub</span>
            </Link>
            <p style={{ marginTop: 12, maxWidth: 320 }}>
              中国开发者的 Claude Code 技术学习社区。最佳实践、源码分析、实战案例与代码片段。
            </p>
          </div>
          <div>
            <h5>社区</h5>
            <Link to="/articles">文章</Link>
            <Link to="/cases">实战案例</Link>
            <Link to="/snippets">Snippets</Link>
            <Link to="/tools">工具导航</Link>
          </div>
          <div>
            <h5>账号</h5>
            <Link to="/login">登录</Link>
            <Link to="/login">注册</Link>
            <Link to="/profile">个人中心</Link>
            <Link to="/admin/dashboard">管理后台</Link>
          </div>
          <div>
            <h5>关于</h5>
            <a href="#">关于我们</a>
            <a href="#">加入贡献</a>
            <a href="#">行为准则</a>
            <a href="#">联系我们</a>
          </div>
        </div>
        <div className="footer-bottom">
          <div>© 2026 ClaudeCode Hub · 沪 ICP 备 2026000000 号</div>
          <div>原型演示 · Prototype preview</div>
        </div>
      </div>
    </footer>
  );
}
