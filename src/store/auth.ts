import { create } from 'zustand';
import { authApi } from '../api/endpoints';
import { ApiError, getToken, setToken } from '../api/client';
import type { UserVO } from '../api/types';

interface AuthState {
  user: UserVO | null;
  ready: boolean;
  isAdmin: () => boolean;
  login: (account: string, password: string) => Promise<void>;
  register: (r: { username: string; email: string; password: string; nickname?: string }) => Promise<void>;
  logout: () => void;
  refresh: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  ready: false,
  isAdmin: () => {
    const u = get().user;
    if (!u) return false;
    return u.roles.some((r) => r === 'ROLE_ADMIN' || r === 'ROLE_SUPER_ADMIN');
  },
  async login(account, password) {
    const resp = await authApi.loginEmail(account, password);
    setToken(resp.token);
    set({ user: resp.user, ready: true });
  },
  async register(req) {
    const resp = await authApi.registerEmail(req);
    setToken(resp.token);
    set({ user: resp.user, ready: true });
  },
  logout() {
    setToken(null);
    set({ user: null });
  },
  async refresh() {
    if (!getToken()) {
      set({ user: null, ready: true });
      return;
    }
    try {
      const me = await authApi.me();
      set({ user: me, ready: true });
    } catch (e) {
      if (e instanceof ApiError && e.code === 401) setToken(null);
      set({ user: null, ready: true });
    }
  },
}));
