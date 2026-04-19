import { Link } from 'react-router-dom';
import '../styles/index-page.css';

const FRONTEND_PAGES = [
  { n: '01', to: '/home', title: '首页 Home', desc: 'Hero · 分类卡片网格 · 最新文章 · 本周热门 · 实战案例推荐', tag: 'home →' },
  { n: '02', to: '/articles', title: '文章列表页', desc: '分类 Tab · 标签云 · 排序 · 热门标签与活跃作者侧边栏', tag: 'articles →' },
  { n: '03', to: '/article', title: '文章详情页', desc: 'TOC · 代码块 · 左侧悬浮互动 · 作者卡 · 评论区', tag: 'article →' },
  { n: '04', to: '/cases', title: '实战案例馆', desc: '瀑布流布局 · 项目截图 · 技术栈标签', tag: 'cases →' },
  { n: '05', to: '/snippets', title: 'Snippets 代码片段库', desc: '左侧分类树 · 右侧代码卡片网格 · 一键复制', tag: 'snippets →' },
  { n: '06', to: '/tools', title: '工具导航', desc: 'MCP Servers · VS Code 扩展 · CLI 工具集合', tag: 'tools →' },
  { n: '07', to: '/login', title: '登录 / 注册', desc: '邮箱 · 手机 · GitHub · 微信扫码 四种方式 Tab 切换', tag: 'login →' },
  { n: '08', to: '/profile', title: '个人中心', desc: 'Banner · 我的文章 · 收藏 · 关注 · 消息通知', tag: 'profile →' },
  { n: '09', to: '/search', title: '搜索结果页', desc: '类型 Tab · 关键词高亮 · 聚合结果', tag: 'search →' },
];

const ADMIN_PAGES = [
  { n: '10', to: '/admin/dashboard', title: '仪表盘', desc: '4 数据卡 · 近 30 天折线 · 分类饼图 · 热门文章表格', tag: 'admin-dashboard →' },
  { n: '11', to: '/admin/editor', title: '文章编辑器', desc: 'WYSIWYG / 分栏 Markdown / HTML 源码 三模式切换', tag: 'admin-editor →' },
];

export default function IndexPage() {
  return (
    <>
      <div className="proto-banner">PROTOTYPE · 11 pages</div>

      <div className="container proto-head">
        <div className="proto-eyebrow">ClaudeCode Hub · design prototype</div>
        <h1>面向中国开发者的 Claude Code 技术学习社区。</h1>
        <p>
          本原型覆盖产品前台与后台核心页面，用于 review 信息架构、视觉语言与核心交互。
          所有页面均可点击跳转；右下角 <b>Tweaks</b> 面板可切换圆角风格。
        </p>
        <div className="proto-meta">
          <span>主色 <b>#B54A3A</b> 砖红</span>
          <span>字体 <b>PingFang SC</b> 系统栈</span>
          <span>圆角 <b>可切换</b></span>
          <span>视口 <b>PC · 1440</b></span>
        </div>
      </div>

      <div className="container">
        <div className="proto-section-title">前台 · Frontend</div>
        <div className="proto-grid">
          {FRONTEND_PAGES.map((p) => (
            <Link key={p.n} className="pcard" to={p.to}>
              <div className="pcard-num">{p.n}</div>
              <div className="pcard-title">{p.title}</div>
              <div className="pcard-desc">{p.desc}</div>
              <div className="pcard-tag">{p.tag}</div>
            </Link>
          ))}
        </div>

        <div className="proto-section-title">后台 · Admin</div>
        <div className="proto-grid">
          {ADMIN_PAGES.map((p) => (
            <Link key={p.n} className="pcard" to={p.to}>
              <div className="pcard-num">{p.n}</div>
              <div className="pcard-title">{p.title}</div>
              <div className="pcard-desc">{p.desc}</div>
              <div className="pcard-tag">{p.tag}</div>
            </Link>
          ))}
        </div>
      </div>

      <footer className="footer" style={{ marginTop: 100 }}>
        <div className="container">
          <div className="footer-bottom" style={{ margin: 0, padding: 0, border: 'none' }}>
            <div>© 2026 ClaudeCode Hub · 原型演示</div>
            <div style={{ fontFamily: 'var(--font-mono)' }}>v0.1 · prototype</div>
          </div>
        </div>
      </footer>
    </>
  );
}
