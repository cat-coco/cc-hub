import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Layout from '../components/Layout';
import { toolsApi } from '../api/endpoints';
import type { ToolVO } from '../api/types';
import '../styles/tools.css';

function iconFallback(name: string) {
  return name
    .split(/[-_\s]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w.charAt(0).toUpperCase())
    .join('') || '·';
}

function ToolGrid({ tools }: { tools: ToolVO[] }) {
  return (
    <div className="tgrid">
      {tools.map((t) => (
        <a className="tool" href={t.url || '#'} target="_blank" rel="noreferrer" key={t.id}>
          <div className="tool-ico">{t.icon || iconFallback(t.name)}</div>
          <div className="tool-b">
            <div className="tool-name">
              <h3>{t.name}</h3>
              {t.version && <span className="ver">{t.version}</span>}
            </div>
            {t.description && <p className="tool-desc">{t.description}</p>}
            {t.tags.length > 0 && (
              <div className="tool-tags">
                {t.tags.map((tag) => <span className="tag" key={tag}>#{tag}</span>)}
              </div>
            )}
            <div className="tool-foot">
              {t.stars && <span>{t.stars}</span>}
              {t.license && <span>{t.license}</span>}
              <span className="sp" />
              <span className="tool-arr">↗</span>
            </div>
          </div>
        </a>
      ))}
    </div>
  );
}

export default function ToolsPage() {
  const [filter, setFilter] = useState<string | undefined>(undefined);
  const q = useQuery({
    queryKey: ['tools', 'grouped'],
    queryFn: toolsApi.grouped,
  });

  const grouped = q.data ?? {};
  const categories = Object.keys(grouped);
  const visibleCats = filter ? categories.filter((c) => c === filter) : categories;
  const totalCount = categories.reduce((sum, c) => sum + grouped[c].length, 0);

  return (
    <Layout active="tools">
      <main className="container">
        <div className="tools-head">
          <h1>工具导航</h1>
          <p>
            {totalCount > 0 ? `${totalCount} 款` : '尚未录入'}社区精选的 Claude Code 生态工具。MCP
            Server、IDE 扩展、CLI、Agent 模板、生产力脚本。
          </p>
          <div className="tools-filters">
            <span
              className={`chip${filter === undefined ? ' chip-active' : ''}`}
              onClick={() => setFilter(undefined)}
            >
              全部
            </span>
            {categories.map((c) => (
              <span
                key={c}
                className={`chip${filter === c ? ' chip-active' : ''}`}
                onClick={() => setFilter(c)}
              >
                {c}
              </span>
            ))}
          </div>
        </div>

        {q.isLoading && <div style={{ color: 'var(--ink-3)' }}>加载中…</div>}

        {!q.isLoading && categories.length === 0 && (
          <div style={{ padding: 64, color: 'var(--ink-3)', border: '1px dashed var(--line)', borderRadius: 'var(--r-md)', textAlign: 'center' }}>
            暂未录入任何工具。
          </div>
        )}

        {visibleCats.map((cat) => (
          <section key={cat}>
            <div className="tools-sec-h">
              <h2>{cat}</h2>
              <span className="cnt">· {grouped[cat].length} 款</span>
            </div>
            <ToolGrid tools={grouped[cat]} />
          </section>
        ))}
      </main>
    </Layout>
  );
}
