import axios, { type AxiosError, type AxiosInstance, type AxiosResponse } from 'axios';
import type { ApiResponse } from './types';

const TOKEN_KEY = 'cch.token';

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
  }
}

const instance: AxiosInstance = axios.create({
  baseURL: '/',
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
        // stay on current page; auth store will react
      }
      throw new ApiError(body.code, body.message || '请求失败');
    }
    return r;
  },
  (err: AxiosError<ApiResponse<unknown>>) => {
    if (err.response?.data?.message) {
      throw new ApiError(err.response.data.code ?? err.response.status, err.response.data.message);
    }
    throw new ApiError(err.response?.status ?? 0, err.message || '网络错误');
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

export default instance;
