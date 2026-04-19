import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import Icon from '../components/Icon';
import RichEditor from '../components/RichEditor';
import { adminArticlesApi, articlesApi, categoriesApi } from '../api/endpoints';
import { ApiError } from '../api/client';
import '../styles/admin-editor.css';
import '../styles/tiptap.css';
import 'highlight.js/styles/github.css';

type Mode = 'wysiwyg' | 'split' | 'html';

interface Draft {
  title: string;
  summary: string;
  contentMd: string;
  categoryId?: number;
  tags: string[];
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  isFeatured: boolean;
  isTop: boolean;
}

const emptyDraft: Draft = {
  title: '',
  summary: '',
  contentMd: '# 新文章标题\n\n从这里开始你的写作…',
  tags: [],
  seoTitle: '',
  seoDescription: '',
  seoKeywords: '',
  isFeatured: false,
  isTop: false,
};

function mdToBasicHtml(md: string): string {
  // Lightweight conversion — Tiptap will canonicalize when editing.
  if (!md) return '<p></p>';
  const lines = md.split('\n');
  const out: string[] = [];
  let inCode = false;
  for (const l of lines) {
    if (l.startsWith('```')) {
      out.push(inCode ? '</code></pre>' : '<pre><code>');
      inCode = !inCode;
      continue;
    }
    if (inCode) { out.push(l + '\n'); continue; }
    if (/^#\s/.test(l)) { out.push(`<h1>${l.slice(2)}</h1>`); continue; }
    if (/^##\s/.test(l)) { out.push(`<h2>${l.slice(3)}</h2>`); continue; }
    if (/^###\s/.test(l)) { out.push(`<h3>${l.slice(4)}</h3>`); continue; }
    if (/^>\s?/.test(l)) { out.push(`<blockquote>${l.replace(/^>\s?/, '')}</blockquote>`); continue; }
    if (/^-\s/.test(l)) { out.push(`<ul><li>${l.slice(2)}</li></ul>`); continue; }
    if (l.trim() === '') { out.push(''); continue; }
    out.push(`<p>${l}</p>`);
  }
  return out.join('\n');
}

function htmlToBasicMd(html: string): string {
  return html
    .replace(/<h1>(.*?)<\/h1>/g, '# $1\n')
    .replace(/<h2>(.*?)<\/h2>/g, '## $1\n')
    .replace(/<h3>(.*?)<\/h3>/g, '### $1\n')
    .replace(/<strong>(.*?)<\/strong>/g, '**$1**')
    .replace(/<em>(.*?)<\/em>/g, '*$1*')
    .replace(/<code>(.*?)<\/code>/g, '`$1`')
    .replace(/<blockquote>(.*?)<\/blockquote>/g, '> $1\n')
    .replace(/<li>(.*?)<\/li>/g, '- $1\n')
    .replace(/<\/?ul>/g, '')
    .replace(/<\/?ol>/g, '')
    .replace(/<br\s*\/?\s*>/g, '\n')
    .replace(/<p>(.*?)<\/p>/g, '$1\n\n')
    .replace(/<pre><code>([\s\S]*?)<\/code><\/pre>/g, '```\n$1```\n')
    .replace(/<[^>]+>/g, '')
    .trim();
}

export default function AdminEditorPage() {
  const { id } = useParams();
  const editingId = id ? Number(id) : undefined;
  const navigate = useNavigate();

  const [mode, setMode] = useState<Mode>('split');
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [newTag, setNewTag] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<Date | null>(null);

  // auto-save to localStorage every 10s
  const storageKey = useMemo(() => `cch.draft.${editingId ?? 'new'}`, [editingId]);

  useEffect(() => {
    document.body.classList.add('admin-editor-body');
    return () => document.body.classList.remove('admin-editor-body');
  }, []);

  const existingQ = useQuery({
    enabled: !!editingId,
    queryKey: ['admin', 'article', editingId],
    queryFn: () => articlesApi.detail(editingId!),
  });

  useEffect(() => {
    if (existingQ.data) {
      const a = existingQ.data;
      setDraft({
        title: a.title,
        summary: a.summary ?? '',
        contentMd: a.contentMd ?? '',
        categoryId: a.category?.id,
        tags: a.tags.map((t) => t.name),
        seoTitle: a.seoTitle ?? '',
        seoDescription: a.seoDescription ?? '',
        seoKeywords: a.seoKeywords ?? '',
        isFeatured: false,
        isTop: false,
      });
    } else if (!editingId) {
      // Restore local draft on fresh new-post page
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        try { setDraft({ ...emptyDraft, ...JSON.parse(saved) }); } catch { /* empty */ }
      }
    }
  }, [existingQ.data, editingId, storageKey]);

  useEffect(() => {
    const t = setInterval(() => {
      localStorage.setItem(storageKey, JSON.stringify(draft));
      setSavedAt(new Date());
    }, 10_000);
    return () => clearInterval(t);
  }, [draft, storageKey]);

  const categoriesQ = useQuery({ queryKey: ['categories'], queryFn: categoriesApi.list });

  const saveMut = useMutation({
    mutationFn: async (status: 'DRAFT' | 'PUBLISHED') => {
      const req = {
        title: draft.title,
        summary: draft.summary || undefined,
        contentMd: draft.contentMd,
        categoryId: draft.categoryId,
        tags: draft.tags,
        status,
        seoTitle: draft.seoTitle || undefined,
        seoDescription: draft.seoDescription || undefined,
        seoKeywords: draft.seoKeywords || undefined,
        isFeatured: draft.isFeatured,
        isTop: draft.isTop,
      };
      return editingId ? adminArticlesApi.update(editingId, req) : adminArticlesApi.create(req);
    },
    onSuccess: (a) => {
      localStorage.removeItem(storageKey);
      setErr(null);
      navigate(`/article/${a.slug}`);
    },
    onError: (e) => setErr(e instanceof ApiError ? e.message : '保存失败'),
  });

  function addTag() {
    const t = newTag.trim();
    if (!t) return;
    if (draft.tags.includes(t)) { setNewTag(''); return; }
    if (draft.tags.length >= 5) return;
    setDraft({ ...draft, tags: [...draft.tags, t] });
    setNewTag('');
  }

  function removeTag(t: string) {
    setDraft({ ...draft, tags: draft.tags.filter((x) => x !== t) });
  }

  const contentHtml = mdToBasicHtml(draft.contentMd);

  return (
    <div className="ed">
      <div className="etop">
        <Link className="brand" to="/admin/dashboard">
          <span className="brand-mark" />
        </Link>
        <Link className="back" to="/admin/dashboard">
          <Icon size="sm"><path d="m15 18-6-6 6-6" /></Icon>
          返回
        </Link>
        <input
          className="etitle-input"
          value={draft.title}
          onChange={(e) => setDraft({ ...draft, title: e.target.value })}
          placeholder="给你的文章起一个标题…"
        />
        <div className="save-ind">
          <span className="dot" />
          {savedAt ? `已保存 · ${Math.max(1, Math.floor((Date.now() - savedAt.getTime()) / 1000))} 秒前` : '尚未保存'}
        </div>

        <div className="modes">
          {(['wysiwyg', 'split', 'html'] as const).map((m) => (
            <button key={m} type="button" className={`mode${mode === m ? ' on' : ''}`} onClick={() => setMode(m)}>
              {m === 'wysiwyg' ? 'WYSIWYG' : m === 'split' ? '分栏' : 'HTML 源码'}
            </button>
          ))}
        </div>

        <div className="right">
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            disabled={saveMut.isPending}
            onClick={() => saveMut.mutate('DRAFT')}
          >
            {saveMut.isPending ? '保存中…' : '存为草稿'}
          </button>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            disabled={saveMut.isPending || !draft.title.trim()}
            onClick={() => saveMut.mutate('PUBLISHED')}
          >
            {saveMut.isPending ? '发布中…' : '发布'}
          </button>
        </div>
      </div>

      <div className="earea">
        {err && (
          <div style={{ padding: '8px 18px', background: 'rgba(178,70,63,0.08)', color: 'var(--danger)', fontSize: 13 }}>
            {err}
          </div>
        )}

        {mode === 'split' && (
          <div className="splits">
            <div className="pane">
              <div className="pane-label">
                <Icon size="sm">
                  <path d="M3 4h18v16H3z" />
                  <path d="M7 15V9l3 3 3-3v6" />
                  <path d="m17 9 3 3-3 3" />
                </Icon>
                Markdown
              </div>
              <textarea
                value={draft.contentMd}
                onChange={(e) => setDraft({ ...draft, contentMd: e.target.value })}
                style={{
                  width: '100%',
                  minHeight: 'calc(100vh - 220px)',
                  border: 'none',
                  outline: 'none',
                  padding: '24px 28px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 14,
                  lineHeight: 1.8,
                  resize: 'none',
                  background: 'var(--surface)',
                  color: 'var(--ink)',
                }}
              />
            </div>
            <div className="drag" />
            <div className="pane">
              <div className="pane-label">
                <Icon size="sm">
                  <path d="M2 12s4-8 10-8 10 8 10 8-4 8-10 8-10-8-10-8z" />
                  <circle cx="12" cy="12" r="3" />
                </Icon>
                预览 · 实时渲染
              </div>
              <div className="preview">
                <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
                  {draft.contentMd}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        )}

        {mode === 'wysiwyg' && (
          <RichEditor
            html={contentHtml}
            onChange={(html) => setDraft({ ...draft, contentMd: htmlToBasicMd(html) })}
            placeholder="从这里开始写作…"
          />
        )}

        {mode === 'html' && (
          <textarea
            value={contentHtml}
            onChange={(e) => setDraft({ ...draft, contentMd: htmlToBasicMd(e.target.value) })}
            style={{
              width: '100%',
              height: 'calc(100vh - 180px)',
              background: '#1F1A15',
              color: '#D9CFBD',
              padding: 24,
              fontFamily: 'var(--font-mono)',
              fontSize: 13,
              lineHeight: 1.8,
              border: 'none',
              outline: 'none',
              resize: 'none',
            }}
          />
        )}

        <div className="bottom-bar">
          <span>自动保存 · 每 10 秒</span>
          <span>· {draft.contentMd.length} 字符 / 约 {Math.max(1, Math.ceil(draft.contentMd.length / 400))} 分钟</span>
          <div className="sp" />
          <span>{editingId ? `编辑中 · #${editingId}` : '新建文章'}</span>
        </div>
      </div>

      <aside className="drawer">
        <div className="drawer-sec">
          <h4>分类与标签</h4>
          <div style={{ marginBottom: 12 }}>
            <div className="field-label">分类</div>
            <select
              className="field-in"
              value={draft.categoryId ?? ''}
              onChange={(e) => setDraft({ ...draft, categoryId: e.target.value ? Number(e.target.value) : undefined })}
            >
              <option value="">未选择</option>
              {(categoriesQ.data ?? []).map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <div className="field-label">标签 · 最多 5 个</div>
            <div className="tag-pick">
              {draft.tags.map((t) => (
                <span className="chip chip-active" key={t} onClick={() => removeTag(t)} title="点击移除">
                  #{t}
                </span>
              ))}
              <input
                className="field-in"
                style={{ width: 120, height: 28, fontSize: 13 }}
                value={newTag}
                placeholder="+ 标签"
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
                onBlur={addTag}
              />
            </div>
          </div>
        </div>

        <div className="drawer-sec">
          <h4>摘要</h4>
          <textarea
            className="field-ta"
            placeholder="一句话简介（会展示在列表页）"
            value={draft.summary}
            onChange={(e) => setDraft({ ...draft, summary: e.target.value })}
          />
        </div>

        <div className="drawer-sec">
          <h4>SEO 设置</h4>
          <div style={{ marginBottom: 10 }}>
            <div className="field-label">Meta Title</div>
            <input
              className="field-in"
              value={draft.seoTitle}
              onChange={(e) => setDraft({ ...draft, seoTitle: e.target.value })}
            />
          </div>
          <div style={{ marginBottom: 10 }}>
            <div className="field-label">Meta Description</div>
            <textarea
              className="field-ta"
              style={{ minHeight: 56 }}
              value={draft.seoDescription}
              onChange={(e) => setDraft({ ...draft, seoDescription: e.target.value })}
            />
          </div>
          <div>
            <div className="field-label">Keywords</div>
            <input
              className="field-in"
              value={draft.seoKeywords}
              onChange={(e) => setDraft({ ...draft, seoKeywords: e.target.value })}
            />
          </div>
        </div>

        <div className="drawer-sec">
          <h4>发布选项</h4>
          <div className="swc">
            <span className="lbl">设为精华</span>
            <span
              className={`switch${draft.isFeatured ? ' on' : ''}`}
              onClick={() => setDraft({ ...draft, isFeatured: !draft.isFeatured })}
            />
          </div>
          <div className="swc">
            <span className="lbl">置顶</span>
            <span
              className={`switch${draft.isTop ? ' on' : ''}`}
              onClick={() => setDraft({ ...draft, isTop: !draft.isTop })}
            />
          </div>
        </div>
      </aside>
    </div>
  );
}
