import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Layout from '../components/Layout';
import { articlesApi, categoriesApi, tagsApi } from '../api/endpoints';
import '../styles/articles.css';

type SortKey = 'latest' | 'hot' | 'featured';

function formatDate(iso?: string | null) {
  return (iso ?? '').slice(0, 10);
}
function fmt(n: number) {
  return n >= 10_000 ? `${(n / 1000).toFixed(1)}k` : String(n);
}

export default function ArticlesPage() {
  const [categoryId, setCategoryId] = useState<number | undefined>(undefined);
  const [sort, setSort] = useState<SortKey>('latest');
  const [page, setPage] = useState(1);

  const categoriesQ = useQuery({ queryKey: ['categories'], queryFn: categoriesApi.list });
  const tagsQ = useQuery({ queryKey: ['tags', 'all'], queryFn: tagsApi.all });
  const articlesQ = useQuery({
    queryKey: ['articles', 'list', categoryId, sort, page],
    queryFn: () => articlesApi.list({ categoryId, sort, page, size: 10 }),
  });

  const items = articlesQ.data?.items ?? [];
  const total = articlesQ.data?.total ?? 0;
  const categories = categoriesQ.data ?? [];
  const tags = tagsQ.data ?? [];

  return (
    <Layout active="articles">
      <main className="container">
        <div className="articles-head">
          <h1>文章</h1>
          <p>{total} 篇来自社区开发者的第一手技术实录</p>
          <div className="articles-filters">
            <span
              className={`chip${categoryId === undefined ? ' chip-active' : ''}`}
              onClick={() => { setCategoryId(undefined); setPage(1); }}
            >
              全部
            </span>
            {categories.map((c) => (
              <span
                key={c.id}
                className={`chip${categoryId === c.id ? ' chip-active' : ''}`}
                onClick={() => { setCategoryId(c.id); setPage(1); }}
              >
                {c.name}
              </span>
            ))}
            <div className="articles-filters-right">
              {(['latest', 'hot', 'featured'] as const).map((k) => (
                <span
                  key={k}
                  className={`chip${sort === k ? ' chip-active' : ''}`}
                  onClick={() => { setSort(k); setPage(1); }}
                >
                  {k === 'latest' ? '最新' : k === 'hot' ? '最热' : '精华'}
                </span>
              ))}
            </div>
          </div>
          <div className="articles-tag-cloud">
            {tags.slice(0, 16).map((t) => <span className="tag" key={t.id}>#{t.name}</span>)}
          </div>
        </div>

        <div className="articles-layout-2col">
          <div className="articles-list">
            {articlesQ.isLoading && <div style={{ padding: 24, color: 'var(--ink-3)' }}>正在加载…</div>}
            {!articlesQ.isLoading && items.length === 0 && (
              <div style={{ padding: 48, color: 'var(--ink-3)', border: '1px dashed var(--line)', borderRadius: 'var(--r-md)', textAlign: 'center' }}>
                暂无文章。<Link to="/editor" style={{ color: 'var(--brand)' }}>写一篇 →</Link>
              </div>
            )}
            {items.map((a, i) => (
              <Link className="aitem" to={`/article/${a.slug}`} key={a.id}>
                <div className={`ph ${i === 0 ? 'ph-brand' : ''}`}>cover · 4:3</div>
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
                    <span>{a.readMinutes} 分钟</span>
                    <span className="dot" />
                    <span>{fmt(a.viewCount)} 阅读</span>
                    {a.tags.length > 0 && <span className="dot" />}
                    <span className="atags">
                      {a.tags.slice(0, 3).map((t) => <span className="tag" key={t}>#{t}</span>)}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
            {items.length > 0 && total > page * 10 && (
              <div className="articles-pager">
                <button
                  type="button"
                  className="articles-loadmore"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={articlesQ.isFetching}
                >
                  {articlesQ.isFetching ? '加载中…' : `加载更多 · 还有 ${total - page * 10} 篇`}
                </button>
              </div>
            )}
          </div>

          <aside>
            <div className="articles-side" style={{ position: 'static' }}>
              <h4>热门标签</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {tags.slice(0, 24).map((t) => <span className="tag" key={t.id}>#{t.name}</span>)}
                {tags.length === 0 && <span style={{ color: 'var(--ink-3)', fontSize: 13 }}>暂无标签</span>}
              </div>
            </div>
          </aside>
        </div>
      </main>
    </Layout>
  );
}
