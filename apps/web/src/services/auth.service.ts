import { apiClient } from './api-client';

// ====================
// REGISTER
// ====================

export interface RegisterPayload {
  name: string;
  aadharId: string;
  mobileNo: string;
  dob: string;
  stateId: string;
  districtId: string;
  tehsilId: string;
  password: string;
}

// ====================
// LOGIN
// ====================

export interface LoginPayload {
  aadharId: string;
  password: string;
}

// ====================
// USER
// ====================

export interface AuthUser {
  id: string;
  name: string;
  aadharId?: string;
  mobileNo: string;
  role: string;

  stateId?: string;
  districtId?: string;
  tehsilId?: string;
}

// ====================
// AUTH RESPONSE
// ====================

export interface AuthResponse {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}

// ====================
// STORAGE KEYS
// ====================

const ACCESS_KEY = 'vasundhara.accessToken';
const REFRESH_KEY = 'vasundhara.refreshToken';
const USER_KEY = 'vasundhara.user';

// ====================
// AUTH COOKIE
// ====================

function syncAuthCookie(token: string | null) {
  if (typeof document === 'undefined') {
    return;
  }

  if (!token) {
    document.cookie =
      'vasundhara_access_token=; path=/; max-age=0; samesite=lax';

    return;
  }

  document.cookie =
    `vasundhara_access_token=${encodeURIComponent(token)}; ` +
    'path=/; samesite=lax';
}

// ====================
// STORE SESSION
// ====================

function storeSession(session: AuthResponse) {
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.setItem(ACCESS_KEY, session.accessToken);
  localStorage.setItem(REFRESH_KEY, session.refreshToken);
  localStorage.setItem(USER_KEY, JSON.stringify(session.user));

  syncAuthCookie(session.accessToken);
}

// ====================
// CLEAR SESSION
// ====================

function clearSession() {
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
  localStorage.removeItem(USER_KEY);

  syncAuthCookie(null);
}

// ====================
// REFRESH TOKEN
// ====================

function getRefreshToken(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }

  return localStorage.getItem(REFRESH_KEY);
}

// ====================
// AUTH SERVICE
// ====================

export const authService = {
  // --------------------
  // Register
  // --------------------

  async register(payload: RegisterPayload) {
    const session = await apiClient.post<AuthResponse>(
      '/auth/register',
      payload,
    );

    storeSession(session);

    return session;
  },

  // --------------------
  // Login
  // --------------------

  async login(payload: LoginPayload) {
    const session = await apiClient.post<AuthResponse>(
      '/auth/login',
      payload,
    );

    storeSession(session);

    return session;
  },

  // --------------------
  // Refresh
  // --------------------

  async refresh() {
    const refreshToken = getRefreshToken();

    if (!refreshToken) {
      throw new Error('No refresh token found');
    }

    const session = await apiClient.post<AuthResponse>(
      '/auth/refresh',
      {
        refreshToken,
      },
    );

    storeSession(session);

    return session;
  },

  // --------------------
  // Current User
  // --------------------

  async getCurrentUser() {
    return apiClient.get<AuthUser>('/auth/me');
  },

  // --------------------
  // Get Local Session
  // --------------------

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

      return {
        accessToken,
        refreshToken,
        user,
      };
    } catch {
      clearSession();

      return null;
    }
  },

  // --------------------
  // Logout
  // --------------------

  logout() {
    clearSession();
  },
};