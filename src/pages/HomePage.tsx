import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import Icon from '../components/Icon';
import '../styles/home.css';

interface Article {
  cat: string;
  title: string;
  excerpt: string;
  author: string;
  authorInitial: string;
  date: string;
  read: string;
  views: string;
  brand?: boolean;
}

const ARTICLES: Article[] = [
  {
    cat: '最佳实践 · practice',
    title: '用 Claude Code 重构一个十年历史的 Java 单体：完整复盘',
    excerpt:
      'Lorem ipsum 中文示意——在一个代码量 40 万行、依赖关系盘根错节的企业后台项目里，我们用 Claude Code 花了六周做了一次彻底的结构迁移。下面把关键决策、踩过的坑、以及最后沉淀下来的工作流一一记录。',
    author: '张未未',
    authorInitial: 'Z',
    date: '2026-04-17',
    read: '12 分钟阅读',
    views: '8.2k 阅读',
    brand: true,
  },
  {
    cat: '源码分析 · internals',
    title: '读懂 MCP 协议：从握手到工具调用的一次完整走读',
    excerpt:
      'MCP（Model Context Protocol）的设计巧思藏在几个不起眼的字段里。我们顺着 TypeScript SDK 的入口把整个生命周期过了一遍，顺手画了十几张时序图。',
    author: '林秋白',
    authorInitial: 'L',
    date: '2026-04-15',
    read: '18 分钟阅读',
    views: '5.4k 阅读',
  },
  {
    cat: '实战教学 · tutorial',
    title: '从零搭建自己的 MCP Server：一个可落地的最小模板',
    excerpt:
      '不讲原理，只讲怎么跑起来。用 250 行 TypeScript 完成一个能被 Claude 调用、带鉴权和限流的 MCP Server，适合作为团队内部 starter。',
    author: '吴桥',
    authorInitial: 'W',
    date: '2026-04-13',
    read: '9 分钟阅读',
    views: '3.1k 阅读',
  },
  {
    cat: '技术洞察 · insight',
    title: 'Agent 时代的代码审查：我们重新定义了 PR 的意义',
    excerpt:
      '当 Agent 可以一次提交三千行代码，原有的 review 流程开始失效。这篇文章梳理了我们团队在半年里迭代出来的新工作流，以及背后的权衡。',
    author: '宋行',
    authorInitial: 'S',
    date: '2026-04-10',
    read: '14 分钟阅读',
    views: '6.7k 阅读',
  },
];

const HOT = [
  { n: '01', title: '把 CLAUDE.md 写到这个程度，团队新人上手只要一天', meta: '12.4k · 3 天前', top: true },
  { n: '02', title: '我用 Claude Code 重写了自己 5 年前的毕业设计', meta: '9.8k · 5 天前', top: true },
  { n: '03', title: 'Subagent 到底怎么用才不是玩具？六个真实场景', meta: '8.1k · 2 天前', top: true },
  { n: '04', title: '一份被低估的 Prompt 审查 checklist', meta: '6.3k · 4 天前', top: false },
  { n: '05', title: 'Hook 机制读源码笔记（上）', meta: '5.7k · 6 天前', top: false },
  { n: '06', title: '为什么我们放弃了 Copilot 切到 Claude Code', meta: '4.9k · 7 天前', top: false },
];

const TAGS = ['#MCP', '#SDK', '#Prompt 工程', '#源码', '#Agent', '#Subagent', '#Hooks', '#CLI', '#VS Code', '#Node.js', '#Python SDK', '#Claude.md'];

export default function HomePage() {
  return (
    <Layout active="home">
      <main>
        <section className="container home-hero">
          <div className="home-hero-eyebrow">Made for Chinese developers</div>
          <h1>
            让每一次与 <em>Claude</em> 的对话，<br />
            都更有力量。
          </h1>
          <p>
            社区精选的最佳实践、源码剖析与实战案例。和一群把 AI 写进日常工作流的开发者一起，
            把 Claude Code 用到极致。
          </p>
          <div className="home-hero-ctas">
            <Link className="btn btn-primary btn-lg" to="/articles">开始探索</Link>
            <Link className="btn btn-secondary btn-lg" to="/cases">浏览实战案例</Link>
          </div>
          <div className="home-hero-meta">
            <div><div className="m-num">2,847</div><div className="m-lbl">技术文章</div></div>
            <div><div className="m-num">416</div><div className="m-lbl">实战案例</div></div>
            <div><div className="m-num">1,203</div><div className="m-lbl">Snippets</div></div>
            <div><div className="m-num">38,592</div><div className="m-lbl">社区开发者</div></div>
          </div>
        </section>

        <section className="container">
          <div className="sec-head">
            <div>
              <h2>按方向探索</h2>
              <p>八个内容模块，覆盖从上手到精通</p>
            </div>
          </div>
          <div className="home-cats">
            <Link className="home-cat" to="/articles">
              <div className="home-cat-icon">
                <Icon><path d="M12 2 3 7v10l9 5 9-5V7z" /><path d="M3 7l9 5 9-5" /><path d="M12 12v10" /></Icon>
              </div>
              <div className="home-cat-title">最佳实践</div>
              <div className="home-cat-desc">社区精选高质量实战经验，来自一线开发者。</div>
              <div className="home-cat-meta">842 篇</div>
            </Link>
            <Link className="home-cat" to="/articles">
              <div className="home-cat-icon">
                <Icon><path d="M3 12h4l3-8 4 16 3-8h4" /></Icon>
              </div>
              <div className="home-cat-title">技术洞察</div>
              <div className="home-cat-desc">前沿趋势与深度分析，看懂行业走向。</div>
              <div className="home-cat-meta">316 篇</div>
            </Link>
            <Link className="home-cat" to="/articles">
              <div className="home-cat-icon">
                <Icon><path d="m9 18-6-6 6-6" /><path d="m15 6 6 6-6 6" /></Icon>
              </div>
              <div className="home-cat-title">源码分析</div>
              <div className="home-cat-desc">Claude Code / SDK / MCP 的关键代码剖析。</div>
              <div className="home-cat-meta">127 篇</div>
            </Link>
            <Link className="home-cat" to="/articles">
              <div className="home-cat-icon">
                <Icon><path d="M4 19V5l8 4 8-4v14l-8 4z" /><path d="M12 9v14" /></Icon>
              </div>
              <div className="home-cat-title">实战教学</div>
              <div className="home-cat-desc">手把手教程，跟着做就能跑起来的项目。</div>
              <div className="home-cat-meta">489 篇</div>
            </Link>
            <Link className="home-cat" to="/snippets">
              <div className="home-cat-icon">
                <Icon><path d="M8 6H4v4" /><path d="M16 6h4v4" /><path d="M8 18H4v-4" /><path d="M16 18h4v-4" /></Icon>
              </div>
              <div className="home-cat-title">Snippets</div>
              <div className="home-cat-desc">可复用的 Prompt、配置、脚本，即取即用。</div>
              <div className="home-cat-meta">1,203 条</div>
            </Link>
            <Link className="home-cat" to="/tools">
              <div className="home-cat-icon">
                <Icon><path d="M14.7 6.3a4 4 0 0 0-5.7 5.7l-6 6 3 3 6-6a4 4 0 0 0 5.7-5.7z" /></Icon>
              </div>
              <div className="home-cat-title">工具导航</div>
              <div className="home-cat-desc">MCP Servers、VS Code 扩展、CLI 集合。</div>
              <div className="home-cat-meta">264 款</div>
            </Link>
            <Link className="home-cat" to="/articles">
              <div className="home-cat-icon">
                <Icon><path d="M21 11.5a8 8 0 0 1-8.5 8A9 9 0 0 1 3 12C3 6.5 7.5 3 12.5 3A8.5 8.5 0 0 1 21 11.5z" /><path d="M8 11h.01M12 11h.01M16 11h.01" /></Icon>
              </div>
              <div className="home-cat-title">社区问答</div>
              <div className="home-cat-desc">Stack Overflow 式问答，总有人比你早一步。</div>
              <div className="home-cat-meta">5,120 题</div>
            </Link>
            <Link className="home-cat" to="/cases">
              <div className="home-cat-icon">
                <Icon><rect x="3" y="4" width="18" height="14" rx="2" /><path d="M8 20h8" /><path d="M12 18v2" /></Icon>
              </div>
              <div className="home-cat-title">案例馆</div>
              <div className="home-cat-desc">真实项目案例，从架构到落地全公开。</div>
              <div className="home-cat-meta">416 例</div>
            </Link>
          </div>
        </section>

        <section className="container">
          <div className="sec-head">
            <div>
              <h2>最新文章</h2>
              <p>社区编辑部每日精选</p>
            </div>
            <Link className="sec-more" to="/articles">查看全部 →</Link>
          </div>

          <div className="layout-2col">
            <div className="alist">
              {ARTICLES.map((a) => (
                <Link className="aitem" to="/article" key={a.title}>
                  <div className={`ph ${a.brand ? 'ph-brand' : ''}`}>cover · 4:3</div>
                  <div>
                    <div className="acat">{a.cat}</div>
                    <h3 className="atitle">{a.title}</h3>
                    <p className="aexcerpt">{a.excerpt}</p>
                    <div className="ameta">
                      <span className="ava">{a.authorInitial}</span>
                      <span>{a.author}</span>
                      <span className="dot" />
                      <span>{a.date}</span>
                      <span className="dot" />
                      <span>{a.read}</span>
                      <span className="dot" />
                      <span>{a.views}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <aside>
              <div className="side-block">
                <h4>本周热门</h4>
                {HOT.map((h) => (
                  <div className={`hot-item${h.top ? ' top' : ''}`} key={h.n}>
                    <div className="hot-num">{h.n}</div>
                    <div className="hot-body">
                      <div className="hot-title">{h.title}</div>
                      <div className="hot-meta">{h.meta}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="side-block">
                <h4>热门标签</h4>
                <div className="tag-cloud">
                  {TAGS.map((t) => (
                    <span className="chip" key={t}>{t}</span>
                  ))}
                </div>
              </div>

              <div className="side-block" style={{ background: 'var(--brand-subtle)', borderColor: 'transparent' }}>
                <h4 style={{ color: 'var(--brand-ink)' }}>成为作者</h4>
                <p style={{ margin: '0 0 14px', fontSize: 13, color: 'var(--brand-ink)', lineHeight: 1.6 }}>
                  把你的实战经验写成文章，影响下一位开发者。
                </p>
                <Link className="btn btn-primary btn-sm" to="/admin/editor">开始写作 →</Link>
              </div>
            </aside>
          </div>
        </section>

        <section className="container">
          <div className="sec-head">
            <div>
              <h2>实战案例推荐</h2>
              <p>真实项目 · 完整代码 · 架构复盘</p>
            </div>
            <Link className="sec-more" to="/cases">浏览案例馆 →</Link>
          </div>

          <div className="case-row">
            <Link className="case-card" to="/cases">
              <div className="ph ph-brand">project screenshot</div>
              <div className="case-body">
                <h3 className="case-title">企业知识库 Agent：接入飞书 + 内部 Wiki</h3>
                <p className="case-desc">一个对接 12 种内部系统的 Agent，日均处理 3,200 次提问。</p>
                <div className="case-stack">
                  <span className="tag">TypeScript</span>
                  <span className="tag">MCP</span>
                  <span className="tag">Redis</span>
                </div>
              </div>
            </Link>
            <Link className="case-card" to="/cases">
              <div className="ph">project screenshot</div>
              <div className="case-body">
                <h3 className="case-title">Code Review Bot：替 Reviewer 读完所有 diff</h3>
                <p className="case-desc">接入 GitLab 流水线，每周节省 Reviewer 约 40 人时。</p>
                <div className="case-stack">
                  <span className="tag">Python</span>
                  <span className="tag">GitLab CI</span>
                  <span className="tag">Subagent</span>
                </div>
              </div>
            </Link>
            <Link className="case-card" to="/cases">
              <div className="ph">project screenshot</div>
              <div className="case-body">
                <h3 className="case-title">SQL 智能助手：让产品经理自己写报表</h3>
                <p className="case-desc">通过受控 MCP 接入只读数据库，一周上线。</p>
                <div className="case-stack">
                  <span className="tag">Go</span>
                  <span className="tag">PostgreSQL</span>
                  <span className="tag">MCP</span>
                </div>
              </div>
            </Link>
          </div>

          <div className="cta-strip">
            <h3>
              有你的故事，才有真正的社区。
              <br />
              把你的第一个 Claude Code 项目写下来。
            </h3>
            <Link className="btn btn-lg" to="/admin/editor">投稿你的案例</Link>
          </div>
        </section>
      </main>
    </Layout>
  );
}
