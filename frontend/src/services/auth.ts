const API_URL = import.meta.env.VITE_API_URL;

export const validateSessionRequest = async (token: string): Promise<boolean> => {
  const res = await fetch(`${API_URL}/api/auth/validate-session`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'client-type': 'web' },
  });
  if (!res.ok) throw Object.assign(new Error(res.statusText), { status: res.status });

  return true;
};

export const signinRequest = async (email: string, password: string) => {
  const res = await fetch(`${API_URL}/api/auth/signin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'client-type': 'web' },
    body: JSON.stringify({ email, password }),
  });
  if (res.ok) {
    const data = await res.json();
    return { ok: true, token: data.token };
  }
  const data = await res.json().catch(() => ({}));
  return { ok: false, message: data.message };
};

export const logoutRequest = async (token: string | null) => {
  await fetch(`${API_URL}/api/auth/logout`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'client-type': 'web' },
  });
};

export const signupRequest = async (email: string, password: string) => {
  const res = await fetch(`${API_URL}/api/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'client-type': 'web' },
    body: JSON.stringify({ email, password }),
  });
  if (res.ok) return { ok: true };
  const data = await res.json().catch(() => ({}));
  return { ok: false, message: data.error || data.message };
};

export interface PlanInfo {
  product: string | null;
  active: boolean;
  expires_at: string | null;
  days_left: number;
}

export const fetchMe = async (token: string): Promise<PlanInfo | null> => {
  const res = await fetch(`${API_URL}/api/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (res.ok) return res.json();
  const data = await res.json().catch(() => ({}));
  throw new Error(data.message);
};

export const activatePlanRequest = async (token: string) => {
  const res = await fetch(`${API_URL}/api/auth/activate-plan`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (res.ok) return { ok: true, data: await res.json() };
  const data = await res.json().catch(() => ({}));
  throw new Error(data.message);
};
