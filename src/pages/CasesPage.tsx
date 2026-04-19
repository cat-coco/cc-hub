import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Layout from '../components/Layout';
import { casesApi } from '../api/endpoints';
import '../styles/cases.css';

type Sort = 'latest' | 'hot';

export default function CasesPage() {
  const [sort, setSort] = useState<Sort>('latest');
  const q = useQuery({
    queryKey: ['cases', 'list', sort],
    queryFn: () => casesApi.list({ sort, page: 1, size: 24 }),
  });

  const items = q.data?.items ?? [];
  const total = q.data?.total ?? 0;

  return (
    <Layout active="cases">
      <main className="container">
        <div className="cases-head">
          <h1>实战案例馆</h1>
          <p>
            {total > 0
              ? `${total} 个真实项目，完整的技术决策过程与代码。`
              : '等待第一个实战案例投稿。从个人工具到服务百万用户的系统。'}
          </p>
          <div className="cases-filters">
            <span className="chip chip-active">全部</span>
            <div className="cases-filters-right">
              {(['latest', 'hot'] as const).map((k) => (
                <span
                  key={k}
                  className={`chip${sort === k ? ' chip-active' : ''}`}
                  onClick={() => setSort(k)}
                >
                  {k === 'latest' ? '最新' : '最热'}
                </span>
              ))}
            </div>
          </div>
        </div>

        {q.isLoading && <div style={{ color: 'var(--ink-3)' }}>加载中…</div>}

        {!q.isLoading && items.length === 0 && (
          <div style={{ padding: 64, color: 'var(--ink-3)', border: '1px dashed var(--line)', borderRadius: 'var(--r-md)', textAlign: 'center' }}>
            暂无实战案例。
          </div>
        )}

        <div className="masonry">
          {items.map((c, i) => (
            <a className="masonry-case" href="#" key={c.id}>
              <div className={`ph ${i % 3 === 0 ? 'ph-brand' : ''} ${['h-tall', 'h-mid', 'h-short'][i % 3]}`}>
                project screenshot
              </div>
              <div className="case-body">
                <h3 className="c-title">{c.title}</h3>
                {c.description && <p className="c-desc">{c.description}</p>}
                {c.techStack.length > 0 && (
                  <div className="c-stack">
                    {c.techStack.map((s) => <span className="tag" key={s}>{s}</span>)}
                  </div>
                )}
                <div className="c-foot">
                  <span className="ava">{c.author.initial}</span>
                  <span>{c.author.name}</span>
                  <span className="sp" />
                  <span>★ {c.starCount}</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </main>
    </Layout>
  );
}
