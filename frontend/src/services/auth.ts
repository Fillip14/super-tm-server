const API_URL = import.meta.env.VITE_API_URL;

export const verifySession = async (token: string) => {
  const res = await fetch(`${API_URL}/api/auth/verify-session`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.ok;
};

export const signinRequest = async (email: string, password: string) => {
  const res = await fetch(`${API_URL}/api/auth/signin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'client-type': 'web' },
    body: JSON.stringify({ provider: email, password }),
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
