import { useState } from 'react';
import Layout from '../components/Layout';
import Icon from '../components/Icon';
import '../styles/search.css';

type SearchTab = 'all' | 'article' | 'case' | 'snippet' | 'tool' | 'qa' | 'user';

const TABS: { key: SearchTab; label: string; count: string }[] = [
  { key: 'all', label: '全部', count: '384' },
  { key: 'article', label: '文章', count: '127' },
  { key: 'case', label: '实战案例', count: '42' },
  { key: 'snippet', label: 'Snippets', count: '86' },
  { key: 'tool', label: '工具', count: '18' },
  { key: 'qa', label: '问答', count: '94' },
  { key: 'user', label: '用户', count: '17' },
];

export default function SearchPage() {
  const [tab, setTab] = useState<SearchTab>('all');
  const [query, setQuery] = useState('MCP Server');

  return (
    <Layout active="">
      <main className="container">
        <div className="search-head">
          <div className="search-box">
            <Icon size="md">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </Icon>
            <input value={query} onChange={(e) => setQuery(e.target.value)} />
            <kbd>Enter</kbd>
          </div>
          <div className="search-meta">
            找到 <b>384</b> 条结果 · 耗时 <b>0.04 秒</b> · 按相关度排序
          </div>
        </div>

        <div className="search-tabs">
          {TABS.map((t) => (
            <button
              type="button"
              key={t.key}
              className={`stab${tab === t.key ? ' on' : ''}`}
              onClick={() => setTab(t.key)}
            >
              {t.label} <span className="n">{t.count}</span>
            </button>
          ))}
        </div>

        <div className="results">
          <div className="res">
            <div className="res-type">
              <Icon size="sm">
                <path d="M14 3v5h5M6 3h9l5 5v13a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" />
              </Icon>
              文章 · 实战教学
            </div>
            <h3 className="res-title">
              从零搭建自己的 <span className="hl">MCP Server</span>：一个可落地的最小模板
            </h3>
            <p className="res-excerpt">
              不讲原理，只讲怎么跑起来。用 250 行 TypeScript 完成一个能被 Claude 调用、带鉴权和限流的{' '}
              <span className="hl">MCP Server</span>，适合作为团队内部 starter。本文覆盖项目初始化、接口定义、工具注册、鉴权中间件……
            </p>
            <div className="res-meta">
              <span>吴桥</span><span className="dot" />
              <span>2026-04-13</span><span className="dot" />
              <span>3.1k 阅读</span><span className="dot" />
              <span>9 分钟</span>
            </div>
          </div>

          <div className="res">
            <div className="res-type">
              <Icon size="sm">
                <path d="M14 3v5h5M6 3h9l5 5v13a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" />
              </Icon>
              文章 · 源码分析
            </div>
            <h3 className="res-title">
              读懂 <span className="hl">MCP</span> 协议：从握手到工具调用的一次完整走读
            </h3>
            <p className="res-excerpt">
              <span className="hl">MCP</span>（Model Context Protocol）的设计巧思藏在几个不起眼的字段里。我们顺着 TypeScript SDK 的入口把整个生命周期过了一遍，顺手画了十几张时序图……
            </p>
            <div className="res-meta">
              <span>林秋白</span><span className="dot" />
              <span>2026-04-15</span><span className="dot" />
              <span>5.4k 阅读</span>
            </div>
          </div>

          <div className="res">
            <div className="res-type">
              <Icon size="sm">
                <path d="M8 6H4v4M16 6h4v4M8 18H4v-4M16 18h4v-4" />
              </Icon>
              Snippets · JSON
            </div>
            <h3 className="res-title">
              <span className="hl">MCP</span> 配置：接入本地 PostgreSQL（只读）
            </h3>
            <p className="res-excerpt">安全的只读数据库接入，适合让 Agent 查询业务数据。</p>
            <div className="res-snip-code">
              {'{ "mcpServers": { "postgres": { "command": "'}<span className="hl">mcp-server</span>{'-pg", "args": ["--readonly"] } } }'}
            </div>
            <div className="res-meta">
              <span>陈果</span><span className="dot" />
              <span>★ 176 收藏</span><span className="dot" />
              <span>428 复制</span>
            </div>
          </div>

          <div className="res">
            <div className="res-type">
              <Icon size="sm">
                <path d="M14.7 6.3a4 4 0 0 0-5.7 5.7l-6 6 3 3 6-6a4 4 0 0 0 5.7-5.7z" />
              </Icon>
              工具 · MCP Server
            </div>
            <h3 className="res-title">
              postgres-<span className="hl">mcp</span> v1.4.2
            </h3>
            <p className="res-excerpt">
              只读 PostgreSQL 接入，支持 schema 查询、SQL 执行、结果格式化。社区最流行的数据库 <span className="hl">MCP</span>。
            </p>
            <div className="res-meta">
              <span>★ 12.4k</span><span className="dot" />
              <span>MIT</span><span className="dot" />
              <span>更新于 3 天前</span>
            </div>
          </div>

          <div className="res">
            <div className="res-type">
              <Icon size="sm">
                <rect x="3" y="4" width="18" height="14" rx="2" />
              </Icon>
              实战案例 · Open Source
            </div>
            <h3 className="res-title">
              Notion <span className="hl">MCP Server</span>：双向同步你的笔记
            </h3>
            <p className="res-excerpt">
              支持增量同步、冲突解决、版本历史。开源两周 GitHub 1.2k star，已被多个团队集成到内部知识库 Agent。
            </p>
            <div className="res-meta">
              <span>宋行</span><span className="dot" />
              <span>★ 1,204</span><span className="dot" />
              <span>TypeScript · Notion API</span>
            </div>
          </div>

          <div className="res">
            <div className="res-type">
              <Icon size="sm">
                <path d="M21 11.5a8 8 0 0 1-8.5 8A9 9 0 0 1 3 12C3 6.5 7.5 3 12.5 3A8.5 8.5 0 0 1 21 11.5z" />
              </Icon>
              问答 · 已解决
            </div>
            <h3 className="res-title">
              <span className="hl">MCP Server</span> 如何处理长连接断开重连？
            </h3>
            <p className="res-excerpt">
              最佳答案来自 @张未未：在 stdio 模式下其实不用你管，host 会重启进程。SSE 模式建议实现指数退避…… <b>12 个回答</b> · 已采纳
            </p>
            <div className="res-meta">
              <span>提问者 匿名</span><span className="dot" />
              <span>2026-04-11</span><span className="dot" />
              <span>1.8k 浏览</span>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}
