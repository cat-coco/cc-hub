import { del, get, post, put } from './client';
import type { PageResult } from './types';

// ---------- Reports ----------
export interface ReportRow {
  id: number;
  reporterId: number;
  targetType: 'ARTICLE' | 'COMMENT';
  targetId: number;
  reasonType?: string | null;
  reasonDetail?: string | null;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  handlerId?: number | null;
  handleRemark?: string | null;
  handledAt?: string | null;
  createdAt: string;
}

export const reportsApi = {
  list: (params: { status?: string; targetType?: string; page?: number; size?: number } = {}) =>
    get<PageResult<ReportRow>>('/api/admin/reports', params),
  detail: (id: number) => get<ReportRow>(`/api/admin/reports/${id}`),
  handle: (id: number, decision: 'APPROVED' | 'REJECTED', remark?: string) =>
    post<ReportRow>(`/api/admin/reports/${id}/handle`, { decision, remark }),
};

// ---------- Dashboard ----------

export interface DashboardOverview {
  metrics: Record<string, number>;
  categoryDistribution: Array<{ name: string; count: number; percent: number }>;
  topArticles: Array<{ id: number; title: string; pv: number; likes: number; author: string }>;
  topAuthors: Array<{ id: number; name: string; articles: number; totalPv: number }>;
  trend: { pv: unknown[]; uv: unknown[]; newUsers: unknown[]; newArticles: unknown[] };
  hotKeywords: Array<{ keyword: string; count: number }>;
  refererDistribution: unknown[];
  regionDistribution: Array<{ province: string; count: number }>;
  deviceDistribution: Array<{ device: string; percent: number }>;
}

export const dashboardApi = {
  overview: () => get<DashboardOverview>('/api/admin/dashboard/overview'),
  onlineUsers: () => get<{ online: number }>('/api/admin/dashboard/online-users'),
  heartbeat: () => post<void>('/api/admin/dashboard/heartbeat'),
};

// ---------- Admin stats ----------

export const adminStatsApi = {
  articles: (params: { sort?: 'pv' | 'likes' | 'comments'; page?: number; size?: number } = {}) =>
    get<PageResult<Record<string, unknown>>>('/api/admin/stats/articles', params),
  categories: () => get<Record<string, unknown>[]>('/api/admin/stats/categories'),
  authors: (limit = 20) => get<Record<string, unknown>[]>('/api/admin/stats/authors', { limit }),
  keywords: () => get<Record<string, unknown>[]>('/api/admin/stats/keywords'),
};

// ---------- Audit logs ----------

export interface AuditLogRow {
  id: number;
  logType: string;
  userId?: number | null;
  userName?: string | null;
  action?: string | null;
  resourceType?: string | null;
  resourceId?: number | null;
  detail?: string | null;
  ip?: string | null;
  userAgent?: string | null;
  result?: string | null;
  createdAt: string;
}

export const auditLogsApi = {
  list: (
    params: {
      logType?: string;
      userId?: number;
      resourceType?: string;
      resourceId?: number;
      startDate?: string;
      endDate?: string;
      page?: number;
      size?: number;
    } = {},
  ) => get<PageResult<AuditLogRow>>('/api/admin/audit-logs', params),
};

// ---------- Admin categories / tags ----------

export const adminCategoriesApi = {
  mergePreview: (sourceId: number, targetId: number) =>
    post<{ affectedArticles: number }>('/api/admin/categories/merge/preview', { sourceId, targetId }),
  merge: (sourceId: number, targetId: number) =>
    post<{ affectedArticles: number }>('/api/admin/categories/merge', { sourceId, targetId }),
  reorder: (items: Array<{ id: number; parentId?: number | null; sortOrder?: number }>) =>
    post<void>('/api/admin/categories/reorder', items),
};

export const adminTagsApi = {
  merge: (sourceIds: number[], targetId: number) =>
    post<{ movedArticles: number }>('/api/admin/tags/merge', { sourceIds, targetId }),
  batchReplace: (fromTagId: number, toTagId: number) =>
    post<{ movedArticles: number }>('/api/admin/tags/batch-replace', { fromTagId, toTagId }),
  listAliases: (id: number) => get<Array<{ id: number; alias: string; tagId: number; createdAt: string }>>(
    `/api/admin/tags/${id}/aliases`),
  addAlias: (id: number, alias: string) => post(`/api/admin/tags/${id}/aliases`, { alias }),
  removeAlias: (aliasId: number) => del<void>(`/api/admin/tags/aliases/${aliasId}`),
};

// ---------- Sensitive words ----------
export interface SensitiveWordRow {
  id: number;
  word: string;
  level: 1 | 2 | 3;
  category?: string | null;
  enabled: boolean;
  createdAt: string;
}

export const sensitiveWordsApi = {
  list: (params: { category?: string; level?: number } = {}) =>
    get<SensitiveWordRow[]>('/api/admin/sensitive-words', params),
  create: (req: { word: string; level: number; category?: string; enabled?: boolean }) =>
    post<SensitiveWordRow>('/api/admin/sensitive-words', req),
  update: (id: number, req: { word: string; level: number; category?: string; enabled?: boolean }) =>
    put<SensitiveWordRow>(`/api/admin/sensitive-words/${id}`, req),
  remove: (id: number) => del<void>(`/api/admin/sensitive-words/${id}`),
  importText: (body: string) => post<number>('/api/admin/sensitive-words/import', body),
};
