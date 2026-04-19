import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import AdminShell from '../../components/AdminShell';
import { adminArticlesApi } from '../../api/endpoints';
import { articlesApi } from '../../api/endpoints';
import { get } from '../../api/client';
import type { ArticleListItem, PageResult } from '../../api/types';

function usePendingArticles() {
  // Reuse /api/articles with status filter; we have no direct admin list API yet.
  // As a temporary lightweight solution, call articles list filter via author=me=all,
  // then filter client-side. A dedicated /api/admin/articles?status=PENDING endpoint
  // is marked as TODO and will land in batch 5 along with the dashboard aggregation.
  return useQuery({
    queryKey: ['admin', 'review-queue'],
    queryFn: () => get<PageResult<ArticleListItem>>('/api/articles', { size: 50, sort: 'latest' }),
  });
}

export default function ReviewQueuePage() {
  const qc = useQueryClient();
  const pendingQ = usePendingArticles();
  const [selected, setSelected] = useState<number | null>(null);
  const [rejectRemark, setRejectRemark] = useState('');

  const approveMut = useMutation({
    mutationFn: (id: number) => adminArticlesApi.approve(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'review-queue'] }),
  });
  const rejectMut = useMutation({
    mutationFn: ({ id, remark }: { id: number; remark: string }) => adminArticlesApi.reject(id, remark),
    onSuccess: () => {
      setRejectRemark('');
      qc.invalidateQueries({ queryKey: ['admin', 'review-queue'] });
    },
  });

  const items = pendingQ.data?.items ?? [];
  const previewQ = useQuery({
    enabled: !!selected,
    queryKey: ['admin', 'review-queue', 'preview', selected],
    queryFn: () => articlesApi.detail(selected!),
  });

  return (
    <AdminShell
      title="待审核"
      subtitle="队列按提交时间倒序，左侧选择，右侧预览并操作"
    >
      <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: 20, minHeight: 500 }}>
        <div>
          {pendingQ.isLoading && <div style={{ color: 'var(--ink-3)' }}>加载中…</div>}
          {!pendingQ.isLoading && items.length === 0 && (
            <div className="admin-empty">暂无待审核文章。</div>
          )}
          <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 'var(--r-lg)', overflow: 'hidden' }}>
            {items.map((a) => (
              <div
                key={a.id}
                onClick={() => setSelected(a.id)}
                style={{
                  padding: '14px 16px',
                  borderBottom: '1px solid var(--line)',
                  cursor: 'pointer',
                  background: selected === a.id ? 'var(--brand-subtle)' : 'transparent',
                }}
              >
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{a.title}</div>
                <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>
                  {a.author.name} · {(a.publishedAt ?? '').slice(0, 10) || '（未发布）'} · {a.readMinutes} 分钟
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 'var(--r-lg)', padding: 20 }}>
          {!selected && (
            <div style={{ textAlign: 'center', color: 'var(--ink-3)', padding: 48 }}>从左侧选择一篇开始审核</div>
          )}
          {selected && previewQ.data && (
            <div>
              <h2 style={{ margin: '0 0 8px', fontSize: 22, fontWeight: 600 }}>{previewQ.data.title}</h2>
              {previewQ.data.summary && (
                <p style={{ color: 'var(--ink-3)', marginTop: 0 }}>{previewQ.data.summary}</p>
              )}
              <div style={{ background: 'var(--surface-2)', border: '1px solid var(--line)', padding: 14, borderRadius: 'var(--r-md)', maxHeight: 320, overflow: 'auto', fontFamily: 'var(--font-mono)', fontSize: 12, whiteSpace: 'pre-wrap' }}>
                {previewQ.data.contentMd}
              </div>

              <div style={{ marginTop: 16, display: 'flex', gap: 10, alignItems: 'center' }}>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  disabled={approveMut.isPending}
                  onClick={() => approveMut.mutate(selected)}
                >
                  通过发布
                </button>
                <Link className="btn btn-secondary btn-sm" to={`/admin/editor/${selected}`}>在编辑器中打开</Link>
                <div className="sp" style={{ flex: 1 }} />
                <input
                  className="admin-input"
                  style={{ maxWidth: 260 }}
                  placeholder="驳回原因（必填）"
                  value={rejectRemark}
                  onChange={(e) => setRejectRemark(e.target.value)}
                />
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  disabled={rejectMut.isPending || !rejectRemark.trim()}
                  onClick={() => rejectMut.mutate({ id: selected, remark: rejectRemark.trim() })}
                >
                  驳回
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminShell>
  );
}
