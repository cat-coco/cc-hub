import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Layout from '../components/Layout';
import Icon from '../components/Icon';
import { articlesApi, casesApi, statsApi, tagsApi } from '../api/endpoints';
import type { ArticleListItem, ShowcaseVO } from '../api/types';
import '../styles/home.css';

function formatDate(iso?: string | null) {
  if (!iso) return '';
  return iso.slice(0, 10);
}

function fmtCount(n: number) {
  if (n >= 10_000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

export default function HomePage() {
  const overviewQ = useQuery({
    queryKey: ['stats', 'overview'],
    queryFn: statsApi.publicOverview,
  });

  const latestQ = useQuery({
    queryKey: ['articles', 'latest'],
    queryFn: () => articlesApi.list({ sort: 'latest', page: 1, size: 4 }),
  });

  const hotQ = useQuery({
    queryKey: ['articles', 'hot'],
    queryFn: () => articlesApi.hot(6),
  });

  const tagsQ = useQuery({
    queryKey: ['tags', 'top'],
    queryFn: () => tagsApi.top(12),
  });

  const casesQ = useQuery({
    queryKey: ['cases', 'top'],
    queryFn: () => casesApi.top(3),
  });

  const overview = overviewQ.data;
  const articles: ArticleListItem[] = latestQ.data?.items ?? [];
  const hot: ArticleListItem[] = hotQ.data ?? [];
  const tags = tagsQ.data ?? [];
  const cases: ShowcaseVO[] = casesQ.data ?? [];

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
            <div><div className="m-num">{overview?.articles ?? '—'}</div><div className="m-lbl">技术文章</div></div>
            <div><div className="m-num">{overview?.cases ?? '—'}</div><div className="m-lbl">实战案例</div></div>
            <div><div className="m-num">{overview?.snippets ?? '—'}</div><div className="m-lbl">Snippets</div></div>
            <div><div className="m-num">{overview?.users ?? '—'}</div><div className="m-lbl">社区开发者</div></div>
          </div>
        </section>

        <section className="container">
          <div className="sec-head">
            <div>
              <h2>按方向探索</h2>
              <p>六个内容模块，覆盖从上手到精通</p>
            </div>
          </div>
          <div className="home-cats">
            <Link className="home-cat" to="/articles">
              <div className="home-cat-icon">
                <Icon><path d="M12 2 3 7v10l9 5 9-5V7z" /><path d="M3 7l9 5 9-5" /><path d="M12 12v10" /></Icon>
              </div>
              <div className="home-cat-title">最佳实践</div>
              <div className="home-cat-desc">社区精选高质量实战经验，来自一线开发者。</div>
              <div className="home-cat-meta">practice</div>
            </Link>
            <Link className="home-cat" to="/articles">
              <div className="home-cat-icon">
                <Icon><path d="M3 12h4l3-8 4 16 3-8h4" /></Icon>
              </div>
              <div className="home-cat-title">技术洞察</div>
              <div className="home-cat-desc">前沿趋势与深度分析，看懂行业走向。</div>
              <div className="home-cat-meta">insight</div>
            </Link>
            <Link className="home-cat" to="/articles">
              <div className="home-cat-icon">
                <Icon><path d="m9 18-6-6 6-6" /><path d="m15 6 6 6-6 6" /></Icon>
              </div>
              <div className="home-cat-title">源码分析</div>
              <div className="home-cat-desc">Claude Code / SDK / MCP 的关键代码剖析。</div>
              <div className="home-cat-meta">internals</div>
            </Link>
            <Link className="home-cat" to="/articles">
              <div className="home-cat-icon">
                <Icon><path d="M4 19V5l8 4 8-4v14l-8 4z" /><path d="M12 9v14" /></Icon>
              </div>
              <div className="home-cat-title">实战教学</div>
              <div className="home-cat-desc">手把手教程，跟着做就能跑起来的项目。</div>
              <div className="home-cat-meta">tutorial</div>
            </Link>
            <Link className="home-cat" to="/snippets">
              <div className="home-cat-icon">
                <Icon><path d="M8 6H4v4" /><path d="M16 6h4v4" /><path d="M8 18H4v-4" /><path d="M16 18h4v-4" /></Icon>
              </div>
              <div className="home-cat-title">Snippets</div>
              <div className="home-cat-desc">可复用的 Prompt、配置、脚本，即取即用。</div>
              <div className="home-cat-meta">snippets</div>
            </Link>
            <Link className="home-cat" to="/tools">
              <div className="home-cat-icon">
                <Icon><path d="M14.7 6.3a4 4 0 0 0-5.7 5.7l-6 6 3 3 6-6a4 4 0 0 0 5.7-5.7z" /></Icon>
              </div>
              <div className="home-cat-title">工具导航</div>
              <div className="home-cat-desc">MCP Servers、VS Code 扩展、CLI 集合。</div>
              <div className="home-cat-meta">tools</div>
            </Link>
            <Link className="home-cat" to="/articles">
              <div className="home-cat-icon">
                <Icon><path d="M21 11.5a8 8 0 0 1-8.5 8A9 9 0 0 1 3 12C3 6.5 7.5 3 12.5 3A8.5 8.5 0 0 1 21 11.5z" /><path d="M8 11h.01M12 11h.01M16 11h.01" /></Icon>
              </div>
              <div className="home-cat-title">社区问答</div>
              <div className="home-cat-desc">Stack Overflow 式问答，总有人比你早一步。</div>
              <div className="home-cat-meta">qa</div>
            </Link>
            <Link className="home-cat" to="/cases">
              <div className="home-cat-icon">
                <Icon><rect x="3" y="4" width="18" height="14" rx="2" /><path d="M8 20h8" /><path d="M12 18v2" /></Icon>
              </div>
              <div className="home-cat-title">案例馆</div>
              <div className="home-cat-desc">真实项目案例，从架构到落地全公开。</div>
              <div className="home-cat-meta">case</div>
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
              {latestQ.isLoading && <div style={{ color: 'var(--ink-3)' }}>正在加载…</div>}
              {!latestQ.isLoading && articles.length === 0 && (
                <div style={{ padding: 32, color: 'var(--ink-3)', border: '1px dashed var(--line)', borderRadius: 'var(--r-md)', textAlign: 'center' }}>
                  还没有发布的文章。<Link to="/editor" style={{ color: 'var(--brand)' }}>现在写一篇 →</Link>
                </div>
              )}
              {articles.map((a, idx) => (
                <Link className="aitem" to={`/article/${a.slug}`} key={a.id}>
                  <div className={`ph ${idx === 0 ? 'ph-brand' : ''}`}>cover · 4:3</div>
                  <div>
                    <div className="acat">{a.category || '未分类'}</div>
                    <h3 className="atitle">{a.title}</h3>
                    <p className="aexcerpt">{a.summary || ''}</p>
                    <div className="ameta">
                      <span className="ava">{a.author.initial}</span>
                      <span>{a.author.name}</span>
                      <span className="dot" />
                      <span>{formatDate(a.publishedAt)}</span>
                      <span className="dot" />
                      <span>{a.readMinutes} 分钟阅读</span>
                      <span className="dot" />
                      <span>{fmtCount(a.viewCount)} 阅读</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <aside>
              <div className="side-block">
                <h4>本周热门</h4>
                {hot.length === 0 && <div style={{ color: 'var(--ink-3)', fontSize: 13 }}>暂无数据</div>}
                {hot.map((h, i) => (
                  <Link className={`hot-item${i < 3 ? ' top' : ''}`} to={`/article/${h.slug}`} key={h.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div className="hot-num">{String(i + 1).padStart(2, '0')}</div>
                    <div className="hot-body">
                      <div className="hot-title">{h.title}</div>
                      <div className="hot-meta">{fmtCount(h.viewCount)} · {formatDate(h.publishedAt)}</div>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="side-block">
                <h4>热门标签</h4>
                <div className="tag-cloud">
                  {tags.length === 0 && <span style={{ color: 'var(--ink-3)', fontSize: 13 }}>暂无标签</span>}
                  {tags.map((t) => (
                    <span className="chip" key={t.id}>#{t.name}</span>
                  ))}
                </div>
              </div>

              <div className="side-block" style={{ background: 'var(--brand-subtle)', borderColor: 'transparent' }}>
                <h4 style={{ color: 'var(--brand-ink)' }}>成为作者</h4>
                <p style={{ margin: '0 0 14px', fontSize: 13, color: 'var(--brand-ink)', lineHeight: 1.6 }}>
                  把你的实战经验写成文章，影响下一位开发者。
                </p>
                <Link className="btn btn-primary btn-sm" to="/editor">开始写作 →</Link>
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
            {cases.length === 0 && (
              <div style={{ gridColumn: '1 / -1', padding: 32, color: 'var(--ink-3)', border: '1px dashed var(--line)', borderRadius: 'var(--r-md)', textAlign: 'center' }}>
                还没有发布的实战案例。
              </div>
            )}
            {cases.map((c, i) => (
              <Link className="case-card" to="/cases" key={c.id}>
                <div className={`ph ${i === 0 ? 'ph-brand' : ''}`}>project screenshot</div>
                <div className="case-body">
                  <h3 className="case-title">{c.title}</h3>
                  <p className="case-desc">{c.description}</p>
                  <div className="case-stack">
                    {c.techStack.map((s) => <span className="tag" key={s}>{s}</span>)}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="cta-strip">
            <h3>
              有你的故事，才有真正的社区。
              <br />
              把你的第一个 Claude Code 项目写下来。
            </h3>
            <Link className="btn btn-lg" to="/editor">投稿你的案例</Link>
          </div>
        </section>
      </main>
    </Layout>
  );
}
