import { apiClient } from './api-client';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  email: string;
  role: string;
}

export interface AuthResponse {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}

const ACCESS_KEY = 'vasundhara.accessToken';
const REFRESH_KEY = 'vasundhara.refreshToken';
const USER_KEY = 'vasundhara.user';

function syncAuthCookie(token: string | null) {
  if (typeof document === 'undefined') {
    return;
  }

  if (!token) {
    document.cookie = 'vasundhara_access_token=; path=/; max-age=0; samesite=lax';
    return;
  }

  document.cookie = `vasundhara_access_token=${encodeURIComponent(token)}; path=/; samesite=lax`;
}

function storeSession(session: AuthResponse) {
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.setItem(ACCESS_KEY, session.accessToken);
  localStorage.setItem(REFRESH_KEY, session.refreshToken);
  localStorage.setItem(USER_KEY, JSON.stringify(session.user));
  syncAuthCookie(session.accessToken);
}

function clearSession() {
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
  localStorage.removeItem(USER_KEY);
  syncAuthCookie(null);
}

function getRefreshToken(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }

  return localStorage.getItem(REFRESH_KEY);
}

export const authService = {
  async login(payload: LoginPayload) {
    const session = await apiClient.post<AuthResponse>('/auth/login', payload);
    storeSession(session);
    return session;
  },

  async refresh() {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token found');
    }

    const session = await apiClient.post<AuthResponse>('/auth/refresh', { refreshToken });
    storeSession(session);
    return session;
  },

  async getCurrentUser() {
    return apiClient.get<AuthUser>('/auth/me');
  },

  getSession() {
    if (typeof window === 'undefined') {
      return null;
    }

    const accessToken = localStorage.getItem(ACCESS_KEY);
    const refreshToken = localStorage.getItem(REFRESH_KEY);
    const userRaw = localStorage.getItem(USER_KEY);

    if (!accessToken || !refreshToken || !userRaw) {
      return null;
    }

    try {
      const user = JSON.parse(userRaw) as AuthUser;
      return { accessToken, refreshToken, user };
    } catch {
      clearSession();
      return null;
    }
  },

  logout() {
    clearSession();
  },
};
