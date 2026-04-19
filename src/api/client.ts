import axios, { type AxiosError, type AxiosInstance, type AxiosResponse } from 'axios';
import type { ApiResponse } from './types';

const TOKEN_KEY = 'cch.token';

/** Optional override, e.g. to talk to a backend on a different host. */
const API_BASE: string = (import.meta.env.VITE_API_BASE as string | undefined) ?? '';

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string | null) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

export class ApiError extends Error {
  code: number;
  constructor(code: number, message: string) {
    super(message);
    this.code = code;
    this.name = 'ApiError';
  }
}

function mapNetworkError(status: number, raw: string): string {
  if (status === 0) return '无法连接到后端服务，请先启动 backend（默认 http://localhost:8080）';
  if (status === 502 || status === 503 || status === 504) return '后端服务暂不可用，请确认 backend 已启动';
  if (status === 500 && !raw) return '请求到达 Vite 代理但 backend 未响应，请确认 backend 已启动';
  return raw || '网络错误，请稍后重试';
}

const instance: AxiosInstance = axios.create({
  baseURL: API_BASE || '/',
  timeout: 20_000,
});

instance.interceptors.request.use((config) => {
  const t = getToken();
  if (t) config.headers.Authorization = `Bearer ${t}`;
  return config;
});

instance.interceptors.response.use(
  (r: AxiosResponse<ApiResponse<unknown>>) => {
    const body = r.data;
    if (body && typeof body === 'object' && 'code' in body) {
      if (body.code === 0) return r;
      if (body.code === 401) {
        setToken(null);
      }
      return Promise.reject(new ApiError(body.code, body.message || '请求失败'));
    }
    return r;
  },
  (err: AxiosError<ApiResponse<unknown>>) => {
    // 1) Server returned an envelope error payload
    const body = err.response?.data;
    if (body && typeof body === 'object' && typeof (body as ApiResponse<unknown>).message === 'string') {
      return Promise.reject(new ApiError(
        (body as ApiResponse<unknown>).code ?? err.response!.status,
        (body as ApiResponse<unknown>).message,
      ));
    }
    // 2) Connection refused / DNS / timeout / proxy 5xx with no body
    const status = err.response?.status ?? 0;
    console.error('[api]', err.config?.method?.toUpperCase(), err.config?.url, '→', status, err.message);
    return Promise.reject(new ApiError(status, mapNetworkError(status, err.message)));
  },
);

/** Unwrap the `data` field from a standard envelope. */
export async function get<T>(url: string, params?: Record<string, unknown>): Promise<T> {
  const r = await instance.get<ApiResponse<T>>(url, { params });
  return r.data.data;
}

export async function post<T, B = unknown>(url: string, body?: B): Promise<T> {
  const r = await instance.post<ApiResponse<T>>(url, body);
  return r.data.data;
}

export async function put<T, B = unknown>(url: string, body?: B): Promise<T> {
  const r = await instance.put<ApiResponse<T>>(url, body);
  return r.data.data;
}

export async function del<T>(url: string): Promise<T> {
  const r = await instance.delete<ApiResponse<T>>(url);
  return r.data.data;
}

/** Probe the backend; returns true if reachable & healthy. */
export async function pingBackend(): Promise<boolean> {
  try {
    const r = await instance.get('/actuator/health', { timeout: 3000 });
    return r.status === 200 && r.data?.status === 'UP';
  } catch {
    return false;
  }
}

export default instance;
