import {
  validateSessionRequest,
  signinRequest,
  logoutRequest,
  signupRequest,
  fetchMe,
  activatePlanRequest,
  type PlanInfo,
} from '../services/auth';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
  const [checking, setChecking] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [planInfo, setPlanInfo] = useState<PlanInfo | null>(null);
  const navigate = useNavigate();

  const forceLogout = useCallback(() => {
    localStorage.removeItem('token');
    setAuthenticated(false);
    setPlanInfo(null);
    navigate('/');
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

      let info = null;
      try {
        await validateSessionRequest(token);
        setAuthenticated(true);
        info = await fetchMe(token);
        setPlanInfo(info);
      } catch (err: unknown) {
        const e = err as { status?: number };
        if (e.status === 401) forceLogout();
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
      setAuthenticated(true);
    }
    return res;
  }, []);

  const signup = useCallback(async (email: string, password: string) => {
    return await signupRequest(email, password);
  }, []);

  const activatePlan = useCallback(async (token: string) => {
    try {
      const res = await activatePlanRequest(token);
      return res;
    } catch {
      return null;
    }
  }, []);

  return { checking, authenticated, planInfo, signin, signup, logout, activatePlan };
};
