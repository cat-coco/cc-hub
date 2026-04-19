import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import AdminShell from '../../components/AdminShell';
import { articlesApi } from '../../api/endpoints';

const STATUS_LABEL: Record<string, string> = {
  DRAFT: '草稿',
  PENDING: '待审核',
  PUBLISHED: '已发布',
  OFFLINE: '已下架',
};

export default function AdminArticleListPage() {
  const q = useQuery({
    queryKey: ['admin', 'article-list'],
    queryFn: () => articlesApi.list({ size: 50, sort: 'latest' }),
  });

  const items = q.data?.items ?? [];

  return (
    <AdminShell
      title="文章列表"
      subtitle="仅显示已发布文章；批次 5 会增加按状态筛选的管理员列表接口"
      actions={
        <Link className="btn btn-primary btn-sm" to="/admin/editor">
          新建文章
        </Link>
      }
    >
      {items.length === 0 ? (
        <div className="admin-empty">
          暂无文章。<Link to="/admin/editor" style={{ color: 'var(--brand)' }}>现在写第一篇 →</Link>
        </div>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>标题</th>
              <th>作者</th>
              <th>状态</th>
              <th style={{ textAlign: 'right' }}>PV</th>
              <th style={{ textAlign: 'right' }}>赞</th>
              <th>发布时间</th>
              <th style={{ width: 180 }}>操作</th>
            </tr>
          </thead>
          <tbody>
            {items.map((a) => (
              <tr key={a.id}>
                <td>#{a.id}</td>
                <td>{a.title}</td>
                <td>{a.author.name}</td>
                <td><span className="status-pill pill-published">{STATUS_LABEL.PUBLISHED}</span></td>
                <td className="num-cell">{a.viewCount}</td>
                <td className="num-cell">{a.likeCount}</td>
                <td style={{ color: 'var(--ink-3)', fontSize: 12 }}>
                  {(a.publishedAt ?? '').slice(0, 16).replace('T', ' ')}
                </td>
                <td>
                  <Link className="btn btn-ghost btn-sm" to={`/admin/editor/${a.id}`}>编辑</Link>
                  <Link className="btn btn-ghost btn-sm" to={`/admin/article/versions/${a.id}`}>版本</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </AdminShell>
  );
}
