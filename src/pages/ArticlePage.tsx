import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import Layout from '../components/Layout';
import Icon from '../components/Icon';
import { articlesApi } from '../api/endpoints';
import { ApiError } from '../api/client';
import { useAuthStore } from '../store/auth';
import type { ArticleDetail, CommentVO } from '../api/types';
import '../styles/article.css';
import 'highlight.js/styles/github.css';

function formatDate(iso?: string | null) {
  return (iso ?? '').slice(0, 10);
}

function CommentItem({ c }: { c: CommentVO }) {
  return (
    <div className="cmt">
      <span className="ava">{c.userInitial}</span>
      <div style={{ flex: 1 }}>
        <div className="cmt-head">
          <span className="cmt-name">{c.userName}</span>
          <span className="cmt-time">{formatDate(c.createdAt)}</span>
        </div>
        <div className="cmt-text" dangerouslySetInnerHTML={{ __html: c.content }} />
        <div className="cmt-actions">
          <a href="#">👍 {c.likeCount}</a>
          <a href="#">回复</a>
        </div>
        {c.replies.length > 0 && (
          <div className="cmt-reply">
            {c.replies.map((r) => <CommentItem key={r.id} c={r} />)}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ArticlePage() {
  const { slug } = useParams();
  const key = slug ?? '1';
  const qc = useQueryClient();
  const user = useAuthStore((s) => s.user);
  const [draft, setDraft] = useState('');

  const articleQ = useQuery({
    queryKey: ['article', key],
    queryFn: () => articlesApi.detail(key),
  });

  const article: ArticleDetail | undefined = articleQ.data;

  const commentsQ = useQuery({
    enabled: !!article,
    queryKey: ['article', article?.id, 'comments'],
    queryFn: () => articlesApi.comments(article!.id),
  });

  const likeMut = useMutation({
    mutationFn: () => articlesApi.like(article!.id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['article', key] }),
    onError: (e) => alert(e instanceof ApiError ? e.message : '操作失败'),
  });
  const collectMut = useMutation({
    mutationFn: () => articlesApi.collect(article!.id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['article', key] }),
    onError: (e) => alert(e instanceof ApiError ? e.message : '操作失败'),
  });
  const commentMut = useMutation({
    mutationFn: (text: string) => articlesApi.postComment(article!.id, text),
    onSuccess: () => {
      setDraft('');
      qc.invalidateQueries({ queryKey: ['article', article?.id, 'comments'] });
      qc.invalidateQueries({ queryKey: ['article', key] });
    },
    onError: (e) => alert(e instanceof ApiError ? e.message : '发表失败'),
  });

  if (articleQ.isLoading) {
    return (
      <Layout active="articles">
        <main className="container" style={{ padding: '48px 0', color: 'var(--ink-3)' }}>
          正在加载文章…
        </main>
      </Layout>
    );
  }

  if (!article) {
    return (
      <Layout active="articles">
        <main className="container" style={{ padding: '48px 0' }}>
          <p style={{ color: 'var(--ink-3)' }}>文章不存在，或已被下架。</p>
          <Link to="/articles" className="btn btn-secondary btn-sm">返回文章列表</Link>
        </main>
      </Layout>
    );
  }

  const comments = commentsQ.data ?? [];

  return (
    <Layout active="articles">
      <main className="container">
        <div className="art-crumb">
          <Link to="/home">首页</Link>
          <span className="sep">/</span>
          <Link to="/articles">文章</Link>
          {article.category && (
            <>
              <span className="sep">/</span>
              <Link to="/articles">{article.category.name}</Link>
            </>
          )}
          <span className="sep">/</span>
          <span className="cur">{article.title}</span>
        </div>

        <div className="art-layout">
          <aside className="art-rail">
            <button
              type="button"
              className="rail-btn"
              title={user ? '点赞' : '登录后点赞'}
              onClick={() => (user ? likeMut.mutate() : alert('请先登录'))}
            >
              <Icon>
                <path d="M7 10v11H4V10zM20 9h-6l1-5c.2-1-.5-2-1.5-2-.5 0-1 .3-1.3.8L7 10v11h11a2 2 0 0 0 2-1.8l1-7A2 2 0 0 0 20 9z" />
              </Icon>
              <span>{article.likeCount}</span>
            </button>
            <button
              type="button"
              className="rail-btn"
              title={user ? '收藏' : '登录后收藏'}
              onClick={() => (user ? collectMut.mutate() : alert('请先登录'))}
            >
              <Icon>
                <path d="M19 21l-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
              </Icon>
              <span>{article.collectCount}</span>
            </button>
            <button
              type="button"
              className="rail-btn"
              title="分享"
              onClick={() => {
                navigator.clipboard?.writeText(window.location.href).catch(() => {});
              }}
            >
              <Icon>
                <circle cx="18" cy="5" r="2.5" />
                <circle cx="6" cy="12" r="2.5" />
                <circle cx="18" cy="19" r="2.5" />
                <path d="m8.2 10.8 7.6-4.6" />
                <path d="m8.2 13.2 7.6 4.6" />
              </Icon>
              <span>分享</span>
            </button>
            <button type="button" className="rail-btn" title="评论">
              <Icon>
                <path d="M21 12a8 8 0 1 1-3-6l3-1-1 3a8 8 0 0 1 1 4z" />
              </Icon>
              <span>{article.commentCount}</span>
            </button>
          </aside>

          <article className="art">
            <div className="art-cat">{article.category?.name ?? '未分类'}</div>
            <h1>{article.title}</h1>
            {article.summary && <p className="sub">{article.summary}</p>}

            <div className="art-byline">
              <span className="ava">{article.author.initial}</span>
              <div>
                <div className="bl-name">{article.author.name}</div>
                <div className="bl-meta">
                  {article.publishedAt ? `${formatDate(article.publishedAt)} 发布` : '草稿'}
                </div>
              </div>
              <div className="bl-spacer" />
              <div className="bl-stat">
                <span>{article.readMinutes} 分钟阅读</span>
                <span>{article.viewCount.toLocaleString()} 浏览</span>
              </div>
            </div>

            <div className="art-body">
              <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
                {article.contentMd || ''}
              </ReactMarkdown>
            </div>

            {article.tags.length > 0 && (
              <div style={{ margin: '32px 0', display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {article.tags.map((t) => <span className="tag" key={t.id}>#{t.name}</span>)}
              </div>
            )}

            <section className="comments">
              <h3>评论 · {comments.length}</h3>
              <div className="cmt-box">
                <textarea
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder={user ? '写下你的想法…（支持 Markdown）' : '请先登录后再发表评论'}
                  disabled={!user}
                />
                <div className="cmt-box-foot">
                  遵守 <a href="#" style={{ color: 'var(--brand)' }}>社区公约</a>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    disabled={!user || !draft.trim() || commentMut.isPending}
                    onClick={() => commentMut.mutate(draft.trim())}
                  >
                    {commentMut.isPending ? '提交中…' : '发表评论'}
                  </button>
                </div>
              </div>

              {commentsQ.isLoading && <div style={{ color: 'var(--ink-3)' }}>加载评论中…</div>}
              {!commentsQ.isLoading && comments.length === 0 && (
                <div style={{ padding: '24px 0', color: 'var(--ink-3)' }}>来做第一个发表评论的人吧。</div>
              )}
              {comments.map((c) => <CommentItem c={c} key={c.id} />)}
            </section>
          </article>

          <aside className="toc">
            <h5>目录</h5>
            <div style={{ color: 'var(--ink-3)', fontSize: 13 }}>
              阅读正文时根据 H2/H3 标题自动生成。
            </div>
          </aside>
        </div>
      </main>
    </Layout>
  );
}
