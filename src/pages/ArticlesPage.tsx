import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import '../styles/articles.css';

interface Article {
  cat: string;
  title: string;
  excerpt: string;
  author: string;
  authorInitial: string;
  date: string;
  read: string;
  views: string;
  tags: string[];
  brand?: boolean;
}

const ARTICLES: Article[] = [
  {
    cat: '最佳实践',
    title: '用 Claude Code 重构一个十年历史的 Java 单体：完整复盘',
    excerpt: '在一个代码量 40 万行、依赖关系盘根错节的企业后台项目里，我们用 Claude Code 花了六周做了一次彻底的结构迁移，把决策、踩坑、工作流都记下来。',
    author: '张未未', authorInitial: 'Z', date: '2026-04-17', read: '12 分钟', views: '8.2k 阅读',
    tags: ['#重构', '#Java'], brand: true,
  },
  {
    cat: '源码分析',
    title: '读懂 MCP 协议：从握手到工具调用的一次完整走读',
    excerpt: 'MCP 的设计巧思藏在几个不起眼的字段里。我们顺着 TypeScript SDK 的入口把整个生命周期过了一遍，顺手画了十几张时序图。',
    author: '林秋白', authorInitial: 'L', date: '2026-04-15', read: '18 分钟', views: '5.4k 阅读',
    tags: ['#MCP', '#源码'],
  },
  {
    cat: '实战教学',
    title: '从零搭建自己的 MCP Server：一个可落地的最小模板',
    excerpt: '不讲原理，只讲怎么跑起来。用 250 行 TypeScript 完成一个能被 Claude 调用、带鉴权和限流的 MCP Server，适合作为团队内部 starter。',
    author: '吴桥', authorInitial: 'W', date: '2026-04-13', read: '9 分钟', views: '3.1k 阅读',
    tags: ['#MCP', '#教程'],
  },
  {
    cat: '技术洞察',
    title: 'Agent 时代的代码审查：我们重新定义了 PR 的意义',
    excerpt: '当 Agent 可以一次提交三千行代码，原有的 review 流程开始失效。这篇文章梳理了我们团队在半年里迭代出来的新工作流。',
    author: '宋行', authorInitial: 'S', date: '2026-04-10', read: '14 分钟', views: '6.7k 阅读',
    tags: ['#PR', '#工作流'],
  },
  {
    cat: '最佳实践',
    title: '把 CLAUDE.md 写到这个程度，团队新人上手只要一天',
    excerpt: '我们团队维护了一份 2,400 行的 CLAUDE.md，覆盖从提交规范到业务缩写表。新人一天上手不是段子。',
    author: '陈果', authorInitial: 'C', date: '2026-04-08', read: '11 分钟', views: '12.4k 阅读',
    tags: ['#CLAUDE.md', '#团队'],
  },
  {
    cat: '源码分析',
    title: 'Hook 机制读源码笔记（上）：生命周期与注入点',
    excerpt: '顺着 Hook 子系统的代码读下去，整理出一张完整的生命周期图，附带每个注入点的典型使用姿势。',
    author: '余声', authorInitial: 'Y', date: '2026-04-05', read: '22 分钟', views: '5.7k 阅读',
    tags: ['#Hooks', '#源码'],
  },
  {
    cat: '实战教学',
    title: 'Subagent 到底怎么用才不是玩具？六个真实场景',
    excerpt: '从代码审查、测试生成到数据迁移，六个能直接复用的 Subagent 模板。',
    author: '何迁', authorInitial: 'H', date: '2026-04-02', read: '15 分钟', views: '8.1k 阅读',
    tags: ['#Subagent', '#模板'],
  },
];

const TOP_AUTHORS = [
  { initial: 'Z', name: '张未未', meta: '127 篇 · 2.1k 粉丝' },
  { initial: 'L', name: '林秋白', meta: '89 篇 · 1.8k 粉丝' },
  { initial: 'C', name: '陈果', meta: '76 篇 · 1.5k 粉丝' },
  { initial: 'W', name: '吴桥', meta: '64 篇 · 1.2k 粉丝' },
  { initial: 'S', name: '宋行', meta: '52 篇 · 980 粉丝' },
  { initial: 'Y', name: '余声', meta: '48 篇 · 870 粉丝' },
];

const TAGS = ['#MCP', '#SDK', '#Prompt', '#源码', '#Agent', '#Subagent', '#Hooks', '#CLI', '#VS Code', '#Node', '#Python', '#CLAUDE.md', '#重构', '#测试'];

export default function ArticlesPage() {
  return (
    <Layout active="articles">
      <main className="container">
        <div className="articles-head">
          <h1>文章</h1>
          <p>2,847 篇来自社区开发者的第一手技术实录</p>
          <div className="articles-filters">
            <span className="chip chip-active">全部</span>
            <span className="chip">最佳实践 · 842</span>
            <span className="chip">技术洞察 · 316</span>
            <span className="chip">源码分析 · 127</span>
            <span className="chip">实战教学 · 489</span>
            <span className="chip">问答 · 1073</span>
            <div className="articles-filters-right">
              <span className="chip chip-active">最新</span>
              <span className="chip">最热</span>
              <span className="chip">精华</span>
            </div>
          </div>
          <div className="articles-tag-cloud">
            {TAGS.map((t) => <span className="tag" key={t}>{t}</span>)}
          </div>
        </div>

        <div className="articles-layout-2col">
          <div className="articles-list">
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
                    <span className="dot" />
                    <span className="atags">
                      {a.tags.map((t) => <span className="tag" key={t}>{t}</span>)}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
            <div className="articles-pager">
              <button type="button" className="articles-loadmore">加载更多 · 还有 2,840 篇</button>
            </div>
          </div>

          <aside>
            <div className="articles-side" style={{ position: 'static' }}>
              <h4>活跃作者 Top 10</h4>
              {TOP_AUTHORS.map((a) => (
                <div className="articles-author-row" key={a.name}>
                  <span className="ava">{a.initial}</span>
                  <div>
                    <div className="an">{a.name}</div>
                    <div className="am">{a.meta}</div>
                  </div>
                  <button type="button" className="btn btn-secondary btn-sm">关注</button>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </main>
    </Layout>
  );
}
