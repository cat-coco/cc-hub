import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import AdminShell from '../../components/AdminShell';
import { reportsApi, type ReportRow } from '../../api/adminEndpoints';

const STATUS_LABEL: Record<string, string> = {
  PENDING: '待处理',
  APPROVED: '已判违规',
  REJECTED: '已驳回',
};

export default function ReportWorkbenchPage() {
  const [targetType, setTargetType] = useState<'' | 'ARTICLE' | 'COMMENT'>('');
  const [status, setStatus] = useState<string>('PENDING');
  const qc = useQueryClient();

  const q = useQuery({
    queryKey: ['admin', 'reports', targetType, status],
    queryFn: () => reportsApi.list({ targetType: targetType || undefined, status }),
  });

  const handleMut = useMutation({
    mutationFn: (p: { id: number; decision: 'APPROVED' | 'REJECTED'; remark: string }) =>
      reportsApi.handle(p.id, p.decision, p.remark),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'reports'] }),
  });

  const [remarks, setRemarks] = useState<Record<number, string>>({});

  const rows: ReportRow[] = q.data?.items ?? [];

  return (
    <AdminShell title="举报处理" subtitle="处理来自 C 端的举报，状态流转: PENDING → APPROVED / REJECTED">
      <div className="admin-toolbar">
        <span className="chip" onClick={() => setTargetType('')} style={{ cursor: 'pointer' }}>
          {targetType === '' ? '● ' : ''}全部类型
        </span>
        <span className="chip" onClick={() => setTargetType('ARTICLE')} style={{ cursor: 'pointer' }}>
          {targetType === 'ARTICLE' ? '● ' : ''}文章
        </span>
        <span className="chip" onClick={() => setTargetType('COMMENT')} style={{ cursor: 'pointer' }}>
          {targetType === 'COMMENT' ? '● ' : ''}评论
        </span>
        <div className="sp" />
        <select className="admin-select" style={{ maxWidth: 160 }} value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="PENDING">待处理</option>
          <option value="APPROVED">已判违规</option>
          <option value="REJECTED">已驳回</option>
          <option value="">全部</option>
        </select>
      </div>

      {q.isLoading && <div className="admin-empty">加载中…</div>}
      {!q.isLoading && rows.length === 0 && <div className="admin-empty">暂无举报记录。</div>}
      {rows.length > 0 && (
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>类型</th>
              <th>目标</th>
              <th>原因</th>
              <th>举报人</th>
              <th>状态</th>
              <th>提交时间</th>
              <th style={{ width: 280 }}>操作</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td>#{r.id}</td>
                <td>{r.targetType === 'ARTICLE' ? '文章' : '评论'}</td>
                <td>#{r.targetId}</td>
                <td style={{ maxWidth: 260 }}>
                  <div style={{ fontWeight: 500 }}>{r.reasonType ?? '—'}</div>
                  <div style={{ color: 'var(--ink-3)', fontSize: 12 }}>{r.reasonDetail ?? ''}</div>
                </td>
                <td>#{r.reporterId}</td>
                <td>
                  <span className={`status-pill pill-${r.status.toLowerCase()}`}>{STATUS_LABEL[r.status] ?? r.status}</span>
                </td>
                <td style={{ color: 'var(--ink-3)', fontSize: 12 }}>{r.createdAt?.slice(0, 16).replace('T', ' ')}</td>
                <td>
                  {r.status === 'PENDING' ? (
                    <div style={{ display: 'flex', gap: 6 }}>
                      <input
                        className="admin-input"
                        placeholder="备注"
                        value={remarks[r.id] ?? ''}
                        onChange={(e) => setRemarks({ ...remarks, [r.id]: e.target.value })}
                      />
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        disabled={handleMut.isPending}
                        onClick={() => handleMut.mutate({ id: r.id, decision: 'APPROVED', remark: remarks[r.id] ?? '' })}
                      >
                        判违规
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        disabled={handleMut.isPending}
                        onClick={() => handleMut.mutate({ id: r.id, decision: 'REJECTED', remark: remarks[r.id] ?? '' })}
                      >
                        驳回
                      </button>
                    </div>
                  ) : (
                    <div style={{ color: 'var(--ink-3)', fontSize: 12 }}>
                      {r.handleRemark ? `备注：${r.handleRemark}` : '—'}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </AdminShell>
  );
}
