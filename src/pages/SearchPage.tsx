import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Layout from '../components/Layout';
import Icon from '../components/Icon';
import { searchApi } from '../api/endpoints';
import '../styles/search.css';

type Tab = 'all' | 'articles' | 'cases' | 'snippets' | 'tools';

function highlight(text: string | null | undefined, needle: string) {
  if (!text) return '';
  if (!needle) return text;
  const re = new RegExp(`(${needle.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')})`, 'gi');
  return text.split(re).map((part, i) =>
    re.test(part) ? <span className="hl" key={i}>{part}</span> : <span key={i}>{part}</span>,
  );
}

export default function SearchPage() {
  const [params, setParams] = useSearchParams();
  const initial = params.get('q') ?? '';
  const [query, setQuery] = useState(initial);
  const [tab, setTab] = useState<Tab>('all');

  const q = useQuery({
    enabled: !!initial.trim(),
    queryKey: ['search', initial, tab],
    queryFn: () => searchApi.search(initial, tab === 'all' ? 'all' : tab.slice(0, -1)),
  });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const t = query.trim();
    if (t) setParams({ q: t });
  }

  const data = q.data;
  const needle = data?.query ?? '';
  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: 'all', label: '全部', count: data?.total ?? 0 },
    { key: 'articles', label: '文章', count: data?.articlesTotal ?? 0 },
    { key: 'cases', label: '实战案例', count: data?.casesTotal ?? 0 },
    { key: 'snippets', label: 'Snippets', count: data?.snippetsTotal ?? 0 },
    { key: 'tools', label: '工具', count: data?.toolsTotal ?? 0 },
  ];

  return (
    <Layout active="">
      <main className="container">
        <div className="search-head">
          <form onSubmit={submit}>
            <div className="search-box">
              <Icon size="md">
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </Icon>
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="搜索文章、Snippets、工具…" />
              <kbd>Enter</kbd>
            </div>
          </form>
          {data && (
            <div className="search-meta">
              找到 <b>{data.total}</b> 条结果 · 耗时 <b>{data.took}</b> ms · 按相关度排序
            </div>
          )}
        </div>

        {!initial.trim() && (
          <div style={{ padding: 48, textAlign: 'center', color: 'var(--ink-3)' }}>
            输入关键词并回车开始搜索。
          </div>
        )}

        {q.isLoading && <div style={{ color: 'var(--ink-3)' }}>搜索中…</div>}

        {data && (
          <>
            <div className="search-tabs">
              {tabs.map((t) => (
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
              {(tab === 'all' || tab === 'articles') && data.articles.map((a) => (
                <Link className="res" to={`/article/${a.slug ?? a.id}`} key={`a${a.id}`} style={{ display: 'block', color: 'inherit' }}>
                  <div className="res-type">
                    <Icon size="sm">
                      <path d="M14 3v5h5M6 3h9l5 5v13a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" />
                    </Icon>
                    文章
                  </div>
                  <h3 className="res-title">{highlight(a.title, needle)}</h3>
                  <p className="res-excerpt">{highlight(a.summary ?? '', needle)}</p>
                  <div className="res-meta">
                    <span>{(a.publishedAt ?? '').slice(0, 10)}</span><span className="dot" />
                    <span>{a.viewCount ?? 0} 阅读</span>
                  </div>
                </Link>
              ))}

              {(tab === 'all' || tab === 'snippets') && data.snippets.map((s) => (
                <div className="res" key={`s${s.id}`}>
                  <div className="res-type">
                    <Icon size="sm">
                      <path d="M8 6H4v4M16 6h4v4M8 18H4v-4M16 18h4v-4" />
                    </Icon>
                    Snippets · {s.language}
                  </div>
                  <h3 className="res-title">{highlight(s.title, needle)}</h3>
                  <p className="res-excerpt">{highlight(s.description ?? '', needle)}</p>
                </div>
              ))}

              {(tab === 'all' || tab === 'cases') && data.cases.map((c) => (
                <div className="res" key={`c${c.id}`}>
                  <div className="res-type">
                    <Icon size="sm"><rect x="3" y="4" width="18" height="14" rx="2" /></Icon>
                    实战案例
                  </div>
                  <h3 className="res-title">{highlight(c.title, needle)}</h3>
                  <p className="res-excerpt">{highlight(c.description ?? '', needle)}</p>
                </div>
              ))}

              {(tab === 'all' || tab === 'tools') && data.tools.map((t) => (
                <div className="res" key={`t${t.id}`}>
                  <div className="res-type">
                    <Icon size="sm"><path d="M14.7 6.3a4 4 0 0 0-5.7 5.7l-6 6 3 3 6-6a4 4 0 0 0 5.7-5.7z" /></Icon>
                    工具 · {t.category}
                  </div>
                  <h3 className="res-title">{highlight(t.name, needle)}</h3>
                  <p className="res-excerpt">{highlight(t.description ?? '', needle)}</p>
                </div>
              ))}

              {data.total === 0 && (
                <div style={{ padding: 48, textAlign: 'center', color: 'var(--ink-3)' }}>
                  没有找到匹配的结果。
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </Layout>
  );
}
