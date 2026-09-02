import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ApiError,
  activatePlanRequest,
  fetchMe,
  logoutRequest,
  signinRequest,
  signupRequest,
} from '../services/auth';
import type { PlanInfo } from '../types/plan.types';
import { toPlanState } from '../types/plan.types';
import { AuthContext } from './auth-context';
import type { AuthValue } from './auth-context';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [checking, setChecking] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [planInfo, setPlanInfo] = useState<PlanInfo | null>(null);
  const navigate = useNavigate();

  const bootstrapped = useRef(false);

  const forceLogout = useCallback(() => {
    localStorage.removeItem('token');
    setAuthenticated(false);
    setPlanInfo(null);
    navigate('/');
  }, [navigate]);

  const loadPlan = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setAuthenticated(false);
      setPlanInfo(null);
      return;
    }

    try {
      setAuthenticated(true);
      setPlanInfo(await fetchMe(token));
    } catch (err: unknown) {
      if (err instanceof ApiError && (err.status === 401 || err.status === 404)) forceLogout();
    }
  }, [forceLogout]);

  useEffect(() => {
    if (bootstrapped.current) return;
    bootstrapped.current = true;

    loadPlan().finally(() => setChecking(false));
  }, [loadPlan]);

  const signin = useCallback(
    async (email: string, password: string) => {
      const res = await signinRequest(email, password);
      if (res.ok) {
        localStorage.setItem('token', res.token);
        setAuthenticated(true);
        await loadPlan();
      }
      return res;
    },
    [loadPlan],
  );

  const signup = useCallback(
    (email: string, password: string) => signupRequest(email, password),
    [],
  );

  const logout = useCallback(async () => {
    const token = localStorage.getItem('token');
    try {
      await logoutRequest(token);
    } catch {
      void 0;
    }
    forceLogout();
  }, [forceLogout]);

  const activatePlan = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) return false;

    try {
      await activatePlanRequest(token);
      await loadPlan();
      return true;
    } catch {
      return false;
    }
  }, [loadPlan]);

  const value = useMemo<AuthValue>(
    () => ({
      checking,
      authenticated,
      planInfo,
      plan: checking ? { kind: 'loading' } : toPlanState(planInfo),
      signin,
      signup,
      logout,
      activatePlan,
      refreshPlan: loadPlan,
    }),
    [checking, authenticated, planInfo, signin, signup, logout, activatePlan, loadPlan],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
