import {
  verifyToken,
  signinRequest,
  logoutRequest,
  signupRequest,
  fetchMe,
  type PlanInfo,
} from '../services/auth';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
  const [checking, setChecking] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [planInfo, setPlanInfo] = useState<PlanInfo | null>(null);
  const navigate = useNavigate();

  const active = (planInfo?.active ?? false) && (planInfo?.days_left ?? 0) > 0;

  const forceLogout = useCallback(() => {
    localStorage.removeItem('token');
    setAuthenticated(false);
    setPlanInfo(null);
    navigate('/login');
  }, [navigate]);

  const logout = useCallback(async () => {
    const token = localStorage.getItem('token');
    try {
      await logoutRequest(token);
    } catch {
      /* ignora falha de rede */
    }
    forceLogout();
  }, [forceLogout]);

  useEffect(() => {
    const check = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setAuthenticated(false);
        setChecking(false);
        return;
      }
      try {
        const valid = await verifyToken(token);
        if (!valid) {
          forceLogout();
          return;
        }

        setAuthenticated(true);
        const info = await fetchMe(token);
        setPlanInfo(info);
      } catch (err: unknown) {
        if ((err as Error)?.message === 'UNAUTHORIZED') forceLogout();
        else {
          localStorage.removeItem('token');
          setAuthenticated(false);
        }
      } finally {
        setChecking(false);
      }
    };
    check();
  }, [forceLogout]);

  const signin = useCallback(async (email: string, password: string) => {
    const res = await signinRequest(email, password);
    if (res.ok) {
      localStorage.setItem('token', res.token);
      try {
        const info = await fetchMe(res.token);
        setPlanInfo(info);
        setAuthenticated(true);
      } catch {
        localStorage.removeItem('token');
        return { ok: false, message: 'Erro inesperado. Tente novamente.' };
      }
    }
    return res;
  }, []);

  const signup = useCallback(async (email: string, password: string) => {
    return await signupRequest(email, password);
  }, []);

  const refreshPlan = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const info = await fetchMe(token);
      setPlanInfo(info);
    } catch (err: unknown) {
      if ((err as Error)?.message === 'UNAUTHORIZED') forceLogout();
    }
  }, [forceLogout]);

  return { checking, authenticated, active, planInfo, logout, signin, signup, refreshPlan };
};
