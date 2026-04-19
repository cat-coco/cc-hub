import { get, post, put, del } from './client';
import type {
  ArticleCreateReq,
  ArticleDetail,
  ArticleListItem,
  CategoryVO,
  CommentVO,
  LoginResp,
  PageResult,
  ShowcaseVO,
  SnippetVO,
  TagVO,
  ToolVO,
  UserVO,
} from './types';

// ---------- Auth ----------
export const authApi = {
  loginEmail: (account: string, password: string) =>
    post<LoginResp>('/api/auth/login/email', { account, password }),
  registerEmail: (req: { username: string; email: string; password: string; nickname?: string }) =>
    post<LoginResp>('/api/auth/register/email', req),
  me: () => get<UserVO>('/api/auth/me'),
  logout: () => post<void>('/api/auth/logout'),
};

// ---------- Content ----------
export const articlesApi = {
  list: (params: { categoryId?: number; tag?: string; sort?: string; page?: number; size?: number } = {}) =>
    get<PageResult<ArticleListItem>>('/api/articles', params),
  hot: (limit = 6) => get<ArticleListItem[]>('/api/articles/hot', { limit }),
  detail: (slugOrId: string | number) => get<ArticleDetail>(`/api/articles/${slugOrId}`),
  comments: (id: number) => get<CommentVO[]>(`/api/articles/${id}/comments`),
  postComment: (id: number, content: string, parentId?: number) =>
    post<CommentVO>(`/api/articles/${id}/comments`, { content, parentId }),
  like: (id: number) => post<{ liked: boolean; total: number }>(`/api/articles/${id}/like`),
  collect: (id: number) => post<{ collected: boolean; total: number }>(`/api/articles/${id}/collect`),
};

export interface LockInfo {
  userId: number;
  userName: string;
  acquiredAt: string;
  lastHeartbeatAt: string;
}
export interface LockResult { acquired: boolean; info: LockInfo | null }

export interface ArticleVersionRow {
  id: number;
  articleId: number;
  versionNo: number;
  title: string;
  contentMd?: string | null;
  contentHtml?: string | null;
  editorId: number;
  editorName?: string | null;
  changeSummary?: string | null;
  createdAt: string;
}

/** Author-side (any logged-in user) article self-service endpoints. */
export const authorArticlesApi = {
  create: (req: ArticleCreateReq) => post<ArticleDetail>('/api/articles', req),
  update: (id: number, req: ArticleCreateReq) => put<ArticleDetail>(`/api/articles/${id}`, req),
  submitReview: (id: number) => post<ArticleDetail>(`/api/articles/${id}/submit-review`),
};

export const adminArticlesApi = {
  list: (params: { status?: string; categoryId?: number; sort?: string; page?: number; size?: number } = {}) =>
    get<PageResult<ArticleListItem>>('/api/admin/articles', params),
  create: (req: ArticleCreateReq) => post<ArticleDetail>('/api/admin/articles', req),
  update: (id: number, req: ArticleCreateReq) => put<ArticleDetail>(`/api/admin/articles/${id}`, req),
  remove: (id: number) => del<void>(`/api/admin/articles/${id}`),
  versions: (id: number) => get<ArticleVersionRow[]>(`/api/admin/articles/${id}/versions`),
  duplicate: (id: number) => post<ArticleDetail>(`/api/admin/articles/${id}/duplicate`),
  // lifecycle (batch 1)
  submitReview: (id: number) => post<ArticleDetail>(`/api/admin/articles/${id}/submit-review`),
  approve: (id: number) => post<ArticleDetail>(`/api/admin/articles/${id}/approve`),
  reject: (id: number, remark: string) => post<ArticleDetail>(`/api/admin/articles/${id}/reject`, { remark }),
  publish: (id: number) => post<ArticleDetail>(`/api/admin/articles/${id}/publish`),
  unpublish: (id: number) => post<ArticleDetail>(`/api/admin/articles/${id}/unpublish`),
  offline: (id: number) => post<ArticleDetail>(`/api/admin/articles/${id}/offline`),
  // edit lock (batch 2)
  acquireLock: (id: number) => post<LockResult>(`/api/admin/articles/${id}/acquire-lock`),
  heartbeat: (id: number) => post<void>(`/api/admin/articles/${id}/heartbeat`),
  releaseLock: (id: number) => post<void>(`/api/admin/articles/${id}/release-lock`),
  forceUnlock: (id: number) => post<void>(`/api/admin/articles/${id}/force-unlock`),
  peekLock: (id: number) => get<LockInfo | null>(`/api/admin/articles/${id}/lock`),
};

export const categoriesApi = {
  list: () => get<CategoryVO[]>('/api/categories'),
};

export const tagsApi = {
  all: () => get<TagVO[]>('/api/tags'),
  top: (limit = 12) => get<TagVO[]>('/api/tags/top', { limit }),
};

export const snippetsApi = {
  list: (params: { language?: string; sort?: string; page?: number; size?: number } = {}) =>
    get<PageResult<SnippetVO>>('/api/snippets', params),
  detail: (id: number) => get<SnippetVO>(`/api/snippets/${id}`),
  copy: (id: number) => post<void>(`/api/snippets/${id}/copy`),
};

export const casesApi = {
  list: (params: { sort?: string; page?: number; size?: number } = {}) =>
    get<PageResult<ShowcaseVO>>('/api/cases', params),
  top: (limit = 3) => get<ShowcaseVO[]>('/api/cases/top', { limit }),
};

export const toolsApi = {
  list: (category?: string) => get<ToolVO[]>('/api/tools', category ? { category } : undefined),
  grouped: () => get<Record<string, ToolVO[]>>('/api/tools/grouped'),
};

// ---------- Search / Stats ----------
export interface SearchResult {
  query: string;
  type: string;
  total: number;
  took: string;
  articles: Array<Partial<ArticleListItem> & { id: number }>;
  articlesTotal: number;
  snippets: SnippetVO[];
  snippetsTotal: number;
  cases: ShowcaseVO[];
  casesTotal: number;
  tools: ToolVO[];
  toolsTotal: number;
}

export const searchApi = {
  search: (q: string, type = 'all') => get<SearchResult>('/api/search', { q, type }),
};

export const statsApi = {
  publicOverview: () =>
    get<{ articles: number; cases: number; snippets: number; users: number }>(
      '/api/stats/public/overview',
    ),
  dashboard: () => get<Record<string, unknown>>('/api/admin/stats/dashboard'),
};
