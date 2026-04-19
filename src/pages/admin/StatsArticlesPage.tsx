import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import AdminShell from '../../components/AdminShell';
import { adminStatsApi } from '../../api/adminEndpoints';

export default function StatsArticlesPage() {
  const [sort, setSort] = useState<'pv' | 'likes' | 'comments'>('pv');
  const q = useQuery({
    queryKey: ['admin', 'stats', 'articles', sort],
    queryFn: () => adminStatsApi.articles({ sort, page: 1, size: 50 }),
  });
  const rows: Array<Record<string, unknown>> = q.data?.items ?? [];

  return (
    <AdminShell
      title="文章分析"
      subtitle="按 PV / 赞数 / 评论数排序 · 仅统计已发布"
      actions={
        <a className="btn btn-secondary btn-sm" href="/api/admin/stats/export" target="_blank" rel="noreferrer">
          导出 CSV
        </a>
      }
    >
      <div className="admin-toolbar">
        {(['pv', 'likes', 'comments'] as const).map((k) => (
          <span
            key={k}
            className={`chip${sort === k ? ' chip-active' : ''}`}
            style={{ cursor: 'pointer' }}
            onClick={() => setSort(k)}
          >
            {k === 'pv' ? 'PV' : k === 'likes' ? '点赞数' : '评论数'}
          </span>
        ))}
      </div>

      {rows.length === 0 ? (
        <div className="admin-empty">暂无数据</div>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>标题</th>
              <th>作者</th>
              <th style={{ textAlign: 'right' }}>PV</th>
              <th style={{ textAlign: 'right' }}>点赞</th>
              <th style={{ textAlign: 'right' }}>评论</th>
              <th>发布时间</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={String(r.id)}>
                <td>#{String(r.id)}</td>
                <td>{String(r.title ?? '')}</td>
                <td>{String(r.author ?? '-')}</td>
                <td className="num-cell">{Number(r.pv ?? 0)}</td>
                <td className="num-cell">{Number(r.likes ?? 0)}</td>
                <td className="num-cell">{Number(r.comments ?? 0)}</td>
                <td style={{ color: 'var(--ink-3)', fontSize: 12 }}>
                  {String(r.publishedAt ?? '—').slice(0, 16).replace('T', ' ')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </AdminShell>
  );
}
