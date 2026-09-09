export type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';

interface RequestOptions {
  method?: HttpMethod;
  body?: unknown;
  headers?: Record<string, string>;
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, '') ?? 'http://localhost:5000';

function getStoredToken(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }

  return localStorage.getItem('vasundhara.accessToken');
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const token = getStoredToken();
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: options.method ?? 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `****** } : {}),
      ...(options.headers ?? {}),
    },
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
    cache: 'no-store',
    credentials: 'include',
  });

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;

    try {
      const errorPayload = (await response.json()) as { message?: string | string[] };
      if (Array.isArray(errorPayload.message)) {
        message = errorPayload.message.join(', ');
      } else if (errorPayload.message) {
        message = errorPayload.message;
      }
    } catch {
      // no-op
    }

    throw new Error(message);
  }

  return (await response.json()) as T;
}

export const apiClient = {
  get: <T>(path: string, headers?: Record<string, string>) =>
    request<T>(path, { method: 'GET', headers }),

  post: <T>(path: string, body?: unknown, headers?: Record<string, string>) =>
    request<T>(path, { method: 'POST', body, headers }),

  patch: <T>(path: string, body?: unknown, headers?: Record<string, string>) =>
    request<T>(path, { method: 'PATCH', body, headers }),

  put: <T>(path: string, body?: unknown, headers?: Record<string, string>) =>
    request<T>(path, { method: 'PUT', body, headers }),

  delete: <T>(path: string, body?: unknown, headers?: Record<string, string>) =>
    request<T>(path, { method: 'DELETE', body, headers }),
};
