import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import AdminShell from '../../components/AdminShell';
import { auditLogsApi } from '../../api/adminEndpoints';

export default function AuditLogPage() {
  const [logType, setLogType] = useState('');
  const [page, setPage] = useState(1);
  const q = useQuery({
    queryKey: ['admin', 'audit', logType, page],
    queryFn: () => auditLogsApi.list({ logType: logType || undefined, page, size: 30 }),
  });
  const rows = q.data?.items ?? [];
  const total = q.data?.total ?? 0;

  return (
    <AdminShell title="审计日志" subtitle="后台管理员操作轨迹；切面异步写入，不影响主流程">
      <div className="admin-toolbar">
        <select className="admin-select" style={{ maxWidth: 200 }} value={logType} onChange={(e) => { setLogType(e.target.value); setPage(1); }}>
          <option value="">全部类型</option>
          <option value="ARTICLE_OP">文章操作</option>
          <option value="ADMIN_LOGIN">管理员登录</option>
          <option value="USER_LOGIN">用户登录</option>
          <option value="USER_REGISTER">用户注册</option>
        </select>
        <div className="sp" />
        <span style={{ color: 'var(--ink-3)', fontSize: 12 }}>共 {total} 条</span>
      </div>

      {rows.length === 0 ? (
        <div className="admin-empty">暂无审计日志。对后台生命周期接口的任何调用都会被记录。</div>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>时间</th>
              <th>类型</th>
              <th>操作</th>
              <th>资源</th>
              <th>操作人</th>
              <th>IP</th>
              <th>结果</th>
              <th>详情</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>{r.createdAt?.replace('T', ' ').slice(0, 19)}</td>
                <td>{r.logType}</td>
                <td>{r.action ?? '—'}</td>
                <td>{r.resourceType ? `${r.resourceType}#${r.resourceId ?? '-'}` : '—'}</td>
                <td>{r.userName ?? `#${r.userId ?? '-'}`}</td>
                <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>{r.ip ?? '—'}</td>
                <td>
                  <span className={`status-pill ${r.result === 'SUCCESS' ? 'pill-approved' : 'pill-rejected'}`}>
                    {r.result}
                  </span>
                </td>
                <td style={{ maxWidth: 360, fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-3)' }}>
                  {r.detail}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {total > rows.length && (
        <div style={{ marginTop: 16, textAlign: 'center' }}>
          <button type="button" className="btn btn-secondary btn-sm" disabled={q.isFetching} onClick={() => setPage((p) => p + 1)}>
            加载更多
          </button>
        </div>
      )}
    </AdminShell>
  );
}
