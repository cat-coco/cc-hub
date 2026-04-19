import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import AdminShell from '../../components/AdminShell';
import { adminArticlesApi } from '../../api/endpoints';

const STATUS_LABEL: Record<string, string> = {
  DRAFT: '草稿',
  PENDING: '待审核',
  PUBLISHED: '已发布',
  OFFLINE: '已下架',
};

type StatusFilter = '' | 'DRAFT' | 'PENDING' | 'PUBLISHED' | 'OFFLINE';

export default function AdminArticleListPage() {
  const [status, setStatus] = useState<StatusFilter>('');
  const q = useQuery({
    queryKey: ['admin', 'article-list', status],
    queryFn: () =>
      adminArticlesApi.list({
        status: status || undefined,
        sort: 'updated',
        size: 50,
      }),
  });

  const items = q.data?.items ?? [];
  const total = q.data?.total ?? 0;

  return (
    <AdminShell
      title="文章列表"
      subtitle={`共 ${total} 篇（跨所有状态；按更新时间排序）`}
      actions={
        <Link className="btn btn-primary btn-sm" to="/admin/editor">
          新建文章
        </Link>
      }
    >
      <div className="admin-toolbar">
        {(['', 'DRAFT', 'PENDING', 'PUBLISHED', 'OFFLINE'] as const).map((k) => (
          <span
            key={k || 'all'}
            className={`chip${status === k ? ' chip-active' : ''}`}
            style={{ cursor: 'pointer' }}
            onClick={() => setStatus(k)}
          >
            {k === '' ? '全部' : STATUS_LABEL[k]}
          </span>
        ))}
      </div>

      {q.isLoading ? (
        <div className="admin-empty">加载中…</div>
      ) : items.length === 0 ? (
        <div className="admin-empty">
          {status ? `当前筛选下没有文章。` : '暂无文章。'}
          <Link to="/admin/editor" style={{ color: 'var(--brand)', marginLeft: 6 }}>
            现在写一篇 →
          </Link>
        </div>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>标题</th>
              <th>作者</th>
              <th style={{ width: 90 }}>状态</th>
              <th style={{ textAlign: 'right' }}>PV</th>
              <th style={{ textAlign: 'right' }}>赞</th>
              <th>更新 / 发布</th>
              <th style={{ width: 180 }}>操作</th>
            </tr>
          </thead>
          <tbody>
            {items.map((a) => {
              const s = a.status ?? 'DRAFT';
              return (
                <tr key={a.id}>
                  <td>#{a.id}</td>
                  <td>{a.title}</td>
                  <td>{a.author.name}</td>
                  <td>
                    <span className={`status-pill pill-${s.toLowerCase()}`}>{STATUS_LABEL[s] ?? s}</span>
                  </td>
                  <td className="num-cell">{a.viewCount}</td>
                  <td className="num-cell">{a.likeCount}</td>
                  <td style={{ color: 'var(--ink-3)', fontSize: 12 }}>
                    {(a.publishedAt ?? a.updatedAt ?? '').slice(0, 16).replace('T', ' ')}
                  </td>
                  <td>
                    <Link className="btn btn-ghost btn-sm" to={`/admin/editor/${a.id}`}>编辑</Link>
                    <Link className="btn btn-ghost btn-sm" to={`/admin/article/versions/${a.id}`}>版本</Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </AdminShell>
  );
}
