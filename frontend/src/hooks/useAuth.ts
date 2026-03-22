import { verifySession, signinRequest, logoutRequest, signupRequest } from '../services/auth';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
  const [checking, setChecking] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const check = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setAuthenticated(false);
        setChecking(false);
        return;
      }

      try {
        setAuthenticated(await verifySession(token));
      } catch {
        localStorage.removeItem('token');
        setAuthenticated(false);
      } finally {
        localStorage.removeItem('token');
        setChecking(false);
      }
    };
    check();
  }, []);

  const logout = useCallback(async () => {
    const token = localStorage.getItem('token');
    try {
      await logoutRequest(token);
    } catch {
      /* força logout local mesmo se falhar */
    }
    localStorage.removeItem('token');
    setAuthenticated(false);
    navigate('/');
  }, [navigate]);

  const signin = useCallback(async (email: string, password: string) => {
    const res = await signinRequest(email, password);
    if (res.ok) localStorage.setItem('token', res.token);
    return res;
  }, []);

  const signup = useCallback(async (email: string, password: string) => {
    return await signupRequest(email, password);
  }, []);

  return { checking, authenticated, logout, signin, signup };
};
