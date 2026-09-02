import type { PlanInfo } from '../types/plan.types';

const API_URL = import.meta.env.VITE_API_URL;

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

const readError = async (res: Response, fallback: string) => {
  const data = await res.json().catch(() => ({}));
  return new ApiError(data.error || data.message || fallback, res.status);
};

export const signinRequest = async (email: string, password: string) => {
  const res = await fetch(`${API_URL}/api/auth/signin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'client-type': 'web' },
    body: JSON.stringify({ email, password }),
  });

  if (res.ok) {
    const data = await res.json();
    return { ok: true as const, token: data.token as string };
  }

  const data = await res.json().catch(() => ({}));
  return { ok: false as const, token: '', message: data.error || data.message };
};

export const signupRequest = async (email: string, password: string) => {
  const res = await fetch(`${API_URL}/api/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'client-type': 'web' },
    body: JSON.stringify({ email, password }),
  });

  if (res.ok) return { ok: true as const };

  const data = await res.json().catch(() => ({}));
  return { ok: false as const, message: data.error || data.message };
};

export const logoutRequest = async (token: string | null) => {
  await fetch(`${API_URL}/api/auth/logout`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'client-type': 'web' },
  });
};

export const fetchMe = async (token: string): Promise<PlanInfo> => {
  const res = await fetch(`${API_URL}/api/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (res.ok) return res.json();
  throw await readError(res, 'Falha ao carregar os dados da conta.');
};

export const activatePlanRequest = async (token: string): Promise<PlanInfo> => {
  const res = await fetch(`${API_URL}/api/auth/activate-plan`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });

  if (res.ok) return res.json();
  throw await readError(res, 'Falha ao ativar o plano.');
};

export type { PlanInfo };
