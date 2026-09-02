import { createContext } from 'react';
import type { PlanInfo, PlanState } from '../types/plan.types';

export interface AuthValue {
  checking: boolean;
  authenticated: boolean;
  planInfo: PlanInfo | null;
  plan: PlanState;
  signin: (email: string, password: string) => Promise<{ ok: boolean; message?: string }>;
  signup: (email: string, password: string) => Promise<{ ok: boolean; message?: string }>;
  logout: () => Promise<void>;
  activatePlan: () => Promise<boolean>;
  refreshPlan: () => Promise<void>;
}

export const AuthContext = createContext<AuthValue | null>(null);
