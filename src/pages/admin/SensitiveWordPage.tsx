import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import AdminShell from '../../components/AdminShell';
import { sensitiveWordsApi, type SensitiveWordRow } from '../../api/adminEndpoints';

const LEVEL_LABEL: Record<number, string> = { 1: '提示', 2: '替换', 3: '拦截' };

export default function SensitiveWordPage() {
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ['admin', 'sensitive'], queryFn: () => sensitiveWordsApi.list() });

  const [editing, setEditing] = useState<SensitiveWordRow | null>(null);
  const [newWord, setNewWord] = useState({ word: '', level: 3, category: '', enabled: true });
  const [bulk, setBulk] = useState('');

  const createMut = useMutation({
    mutationFn: sensitiveWordsApi.create,
    onSuccess: () => {
      setNewWord({ word: '', level: 3, category: '', enabled: true });
      qc.invalidateQueries({ queryKey: ['admin', 'sensitive'] });
    },
  });
  const updateMut = useMutation({
    mutationFn: ({ id, req }: { id: number; req: Parameters<typeof sensitiveWordsApi.update>[1] }) =>
      sensitiveWordsApi.update(id, req),
    onSuccess: () => {
      setEditing(null);
      qc.invalidateQueries({ queryKey: ['admin', 'sensitive'] });
    },
  });
  const deleteMut = useMutation({
    mutationFn: sensitiveWordsApi.remove,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'sensitive'] }),
  });
  const importMut = useMutation({
    mutationFn: sensitiveWordsApi.importText,
    onSuccess: () => {
      setBulk('');
      qc.invalidateQueries({ queryKey: ['admin', 'sensitive'] });
    },
  });

  const rows = q.data ?? [];

  return (
    <AdminShell title="敏感词库" subtitle="CSV 格式：词,级别(1-3)[,分类]">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 20 }}>
        <div>
          {q.isLoading && <div className="admin-empty">加载中…</div>}
          {!q.isLoading && rows.length === 0 && <div className="admin-empty">暂未录入任何敏感词。</div>}
          {rows.length > 0 && (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>词</th>
                  <th style={{ width: 80 }}>级别</th>
                  <th style={{ width: 120 }}>分类</th>
                  <th style={{ width: 80 }}>启用</th>
                  <th style={{ width: 140 }}>操作</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) =>
                  editing?.id === r.id ? (
                    <tr key={r.id}>
                      <td>
                        <input
                          className="admin-input"
                          value={editing.word}
                          onChange={(e) => setEditing({ ...editing, word: e.target.value })}
                        />
                      </td>
                      <td>
                        <select
                          className="admin-select"
                          value={editing.level}
                          onChange={(e) => setEditing({ ...editing, level: Number(e.target.value) as 1 | 2 | 3 })}
                        >
                          <option value={1}>提示</option>
                          <option value={2}>替换</option>
                          <option value={3}>拦截</option>
                        </select>
                      </td>
                      <td>
                        <input
                          className="admin-input"
                          value={editing.category ?? ''}
                          onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                        />
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          checked={editing.enabled}
                          onChange={(e) => setEditing({ ...editing, enabled: e.target.checked })}
                        />
                      </td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-primary btn-sm"
                          onClick={() =>
                            updateMut.mutate({
                              id: r.id,
                              req: { word: editing.word, level: editing.level, category: editing.category ?? undefined, enabled: editing.enabled },
                            })
                          }
                        >
                          保存
                        </button>
                        <button type="button" className="btn btn-ghost btn-sm" onClick={() => setEditing(null)}>
                          取消
                        </button>
                      </td>
                    </tr>
                  ) : (
                    <tr key={r.id}>
                      <td>{r.word}</td>
                      <td>
                        <span className="status-pill" style={{ background: 'var(--surface-sunk)', color: 'var(--ink-2)' }}>
                          {LEVEL_LABEL[r.level]}
                        </span>
                      </td>
                      <td>{r.category ?? '—'}</td>
                      <td>{r.enabled ? '启用' : '禁用'}</td>
                      <td>
                        <button type="button" className="btn btn-ghost btn-sm" onClick={() => setEditing(r)}>
                          编辑
                        </button>
                        <button
                          type="button"
                          className="btn btn-ghost btn-sm"
                          onClick={() => {
                            if (confirm(`删除 "${r.word}"？`)) deleteMut.mutate(r.id);
                          }}
                        >
                          删除
                        </button>
                      </td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          )}
        </div>

        <aside>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 'var(--r-lg)', padding: 16, marginBottom: 16 }}>
            <h4 style={{ margin: '0 0 10px', fontSize: 14 }}>新增单条</h4>
            <div className="admin-form-row">
              <input className="admin-input" placeholder="词" value={newWord.word} onChange={(e) => setNewWord({ ...newWord, word: e.target.value })} />
            </div>
            <div className="admin-form-row">
              <select className="admin-select" value={newWord.level} onChange={(e) => setNewWord({ ...newWord, level: Number(e.target.value) })}>
                <option value={1}>提示</option>
                <option value={2}>替换</option>
                <option value={3}>拦截</option>
              </select>
              <input className="admin-input" placeholder="分类（可选）" value={newWord.category} onChange={(e) => setNewWord({ ...newWord, category: e.target.value })} />
            </div>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              disabled={createMut.isPending || !newWord.word.trim()}
              onClick={() => createMut.mutate({ word: newWord.word.trim(), level: newWord.level, category: newWord.category || undefined, enabled: newWord.enabled })}
            >
              新增
            </button>
          </div>

          <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 'var(--r-lg)', padding: 16 }}>
            <h4 style={{ margin: '0 0 10px', fontSize: 14 }}>批量导入</h4>
            <textarea
              className="admin-textarea"
              rows={6}
              placeholder={'词1,3\n词2,2,测试分类'}
              value={bulk}
              onChange={(e) => setBulk(e.target.value)}
            />
            <button
              type="button"
              className="btn btn-primary btn-sm"
              style={{ marginTop: 8 }}
              disabled={importMut.isPending || !bulk.trim()}
              onClick={() => importMut.mutate(bulk)}
            >
              {importMut.isPending ? '导入中…' : '导入'}
            </button>
            {importMut.data != null && (
              <div style={{ marginTop: 8, fontSize: 12, color: 'var(--success)' }}>成功导入 {importMut.data} 条</div>
            )}
          </div>
        </aside>
      </div>
    </AdminShell>
  );
}
