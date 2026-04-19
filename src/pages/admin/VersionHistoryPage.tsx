import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import AdminShell from '../../components/AdminShell';
import { adminArticlesApi } from '../../api/endpoints';

export default function VersionHistoryPage() {
  const { id } = useParams();
  const articleId = Number(id);
  const navigate = useNavigate();
  const [selected, setSelected] = useState<number | null>(null);

  const listQ = useQuery({
    queryKey: ['admin', 'versions', articleId],
    queryFn: () => adminArticlesApi.versions(articleId),
    enabled: !!articleId,
  });
  const versionQ = useQuery({
    queryKey: ['admin', 'versions', articleId, selected],
    queryFn: async () => {
      const all = listQ.data ?? [];
      return all.find((v) => v.versionNo === selected) ?? null;
    },
    enabled: selected != null && !!listQ.data,
  });

  const versions = listQ.data ?? [];

  return (
    <AdminShell title={`#${id} 版本历史`} subtitle="最多保留最近 10 条；点击右侧恢复到编辑器即可在保存时生效">
      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 20, minHeight: 500 }}>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 'var(--r-lg)', overflow: 'hidden' }}>
          {listQ.isLoading && <div className="admin-empty">加载中…</div>}
          {versions.map((v) => (
            <div
              key={v.id}
              onClick={() => setSelected(v.versionNo)}
              style={{
                padding: '14px 16px',
                borderBottom: '1px solid var(--line)',
                cursor: 'pointer',
                background: selected === v.versionNo ? 'var(--brand-subtle)' : 'transparent',
              }}
            >
              <div style={{ fontSize: 14, fontWeight: 600 }}>v{v.versionNo}</div>
              <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 4 }}>
                {v.editorName ?? `#${v.editorId}`} · {v.createdAt?.slice(0, 16).replace('T', ' ')}
              </div>
              {v.changeSummary && (
                <div style={{ fontSize: 12, color: 'var(--ink-2)', marginTop: 4 }}>{v.changeSummary}</div>
              )}
            </div>
          ))}
        </div>

        <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 'var(--r-lg)', padding: 20 }}>
          {!selected && <div style={{ textAlign: 'center', color: 'var(--ink-3)', padding: 48 }}>选择一个版本预览</div>}
          {selected && versionQ.data && (
            <div>
              <h2 style={{ margin: '0 0 8px', fontSize: 22, fontWeight: 600 }}>v{versionQ.data.versionNo} · {versionQ.data.title}</h2>
              <pre style={{
                background: 'var(--surface-2)', border: '1px solid var(--line)',
                padding: 14, borderRadius: 'var(--r-md)', maxHeight: 420, overflow: 'auto',
                fontFamily: 'var(--font-mono)', fontSize: 12, whiteSpace: 'pre-wrap',
              }}>
                {versionQ.data.contentMd ?? ''}
              </pre>
              <div style={{ marginTop: 16, display: 'flex', gap: 10 }}>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => {
                    // restore into editor via localStorage autosave key
                    const key = `cch.draft.${articleId}`;
                    localStorage.setItem(
                      key,
                      JSON.stringify({
                        value: {
                          title: versionQ.data!.title,
                          summary: '',
                          contentMd: versionQ.data!.contentMd ?? '',
                          tags: [],
                          seoTitle: '',
                          seoDescription: '',
                          seoKeywords: '',
                          isFeatured: false,
                          isTop: false,
                        },
                        savedAt: Date.now(),
                      }),
                    );
                    navigate(`/admin/editor/${articleId}`);
                  }}
                >
                  回填到编辑器
                </button>
                <Link to={`/admin/editor/${articleId}`} className="btn btn-secondary btn-sm">打开编辑器</Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminShell>
  );
}
