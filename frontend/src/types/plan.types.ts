export type PlanState =
  | { kind: 'loading' }
  | { kind: 'noplan' }
  | { kind: 'expired'; product: string }
  | { kind: 'active'; product: string; daysLeft: number; expiresAt: string };

export interface PlanInfo {
  product: string | null;
  active: boolean;
  expires_at: string | null;
  days_left: number;
}

export const toPlanState = (info: PlanInfo | null): PlanState => {
  if (!info) return { kind: 'loading' };
  if (info.product == null) return { kind: 'noplan' };

  if (info.active && info.days_left > 0) {
    return {
      kind: 'active',
      product: info.product,
      daysLeft: info.days_left,
      expiresAt: info.expires_at ?? '',
    };
  }

  return { kind: 'expired', product: info.product };
};

const PLAN_LABELS: Record<string, string> = {
  god: 'God',
  basic: 'Basic',
  premium: 'Premium',
};

export const planLabel = (product: string) => PLAN_LABELS[product] ?? product;
