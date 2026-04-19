import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Layout from '../components/Layout';
import { IconCopy } from '../components/Icon';
import { snippetsApi } from '../api/endpoints';
import '../styles/snippets.css';

type Sort = 'latest' | 'popular' | 'copied';

const LANGUAGES = ['TypeScript', 'Python', 'YAML', 'JSON', 'Bash'];

export default function SnippetsPage() {
  const [language, setLanguage] = useState<string | undefined>(undefined);
  const [sort, setSort] = useState<Sort>('latest');
  const [search, setSearch] = useState('');

  const q = useQuery({
    queryKey: ['snippets', language, sort],
    queryFn: () => snippetsApi.list({ language, sort, page: 1, size: 24 }),
  });

  const items = (q.data?.items ?? []).filter((s) =>
    !search.trim() ||
    s.title.toLowerCase().includes(search.toLowerCase()) ||
    (s.description ?? '').toLowerCase().includes(search.toLowerCase()),
  );

  async function onCopy(id: number, code: string) {
    try {
      await navigator.clipboard.writeText(code);
      await snippetsApi.copy(id).catch(() => {});
    } catch {
      /* ignored */
    }
  }

  return (
    <Layout active="snippets">
      <main className="container">
        <div className="snippets-head">
          <h1>Snippets 代码片段库</h1>
          <p>
            {q.data?.total ? `${q.data.total} 条可复用的 Prompt、配置、脚本。` : '等待第一个 Snippet 发布。'}
            点击复制，即取即用。
          </p>
        </div>

        <div className="snippets-layout">
          <aside className="snippets-tree">
            <h5>分类</h5>
            <div className={`tree-node${language === undefined ? ' on' : ''}`} onClick={() => setLanguage(undefined)}>
              全部
            </div>
            <div className="tree-group-title">按语言</div>
            {LANGUAGES.map((l) => (
              <div
                key={l}
                className={`tree-node${language === l ? ' on' : ''}`}
                onClick={() => setLanguage(l)}
              >
                {l}
              </div>
            ))}
          </aside>

          <div>
            <div className="snippets-toolbar">
              <input
                className="search-input"
                placeholder="搜索 Snippets…（支持语言、标签、关键词）"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {(['latest', 'popular', 'copied'] as const).map((k) => (
                <span
                  key={k}
                  className={`chip${sort === k ? ' chip-active' : ''}`}
                  onClick={() => setSort(k)}
                >
                  {k === 'latest' ? '最新' : k === 'popular' ? '最多收藏' : '最多复制'}
                </span>
              ))}
            </div>

            {q.isLoading && <div style={{ color: 'var(--ink-3)' }}>加载中…</div>}

            {!q.isLoading && items.length === 0 && (
              <div style={{ padding: 48, color: 'var(--ink-3)', border: '1px dashed var(--line)', borderRadius: 'var(--r-md)', textAlign: 'center' }}>
                暂无代码片段。
              </div>
            )}

            <div className="sgrid">
              {items.map((s) => (
                <div className="snip" key={s.id}>
                  <div className="snip-head">
                    <span className="snip-lang">{s.language}</span>
                    <span className="snip-sp" />
                    <button type="button" className="snip-copy" onClick={() => onCopy(s.id, s.code)}>
                      <IconCopy />复制
                    </button>
                  </div>
                  <div className="snip-title">{s.title}</div>
                  {s.description && <p className="snip-desc">{s.description}</p>}
                  <pre className="snip-code">{s.code}</pre>
                  <div className="snip-foot">
                    <span className="ava">{s.author.initial}</span>
                    <span>{s.author.name}</span>
                    <span className="sp" />
                    <span>★ {s.likeCount} 收藏</span>
                    <span>{s.copyCount} 复制</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}
