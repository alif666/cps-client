export class ApiError extends Error {
  constructor(public readonly status: number, message: string) { super(message); }
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`/api/cps${path}`, { ...init, credentials: 'include', headers: { 'Content-Type': 'application/json', ...init?.headers } });
  const body = await response.json().catch(() => ({}));
  if (response.status === 401 && typeof window !== 'undefined') {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.assign('/login');
  }
  if (!response.ok) throw new ApiError(response.status, body.error ?? 'The request could not be completed');
  return (body.data ?? body) as T;
}
