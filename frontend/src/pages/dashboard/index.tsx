import { useNavigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { AppShell, TopbarButton } from '../../components/ui';

const DAYS_TOTAL = 30;
const RING_RADIUS = 34;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

const getRingStroke = (daysLeft: number) => {
  if (daysLeft <= 3) return 'stroke-error';
  if (daysLeft <= 7) return 'stroke-warning';
  return 'stroke-accent';
};

const getDashOffset = (daysLeft: number) => {
  const ratio = Math.max(0, Math.min(1, daysLeft / DAYS_TOTAL));
  return RING_CIRCUMFERENCE * (1 - ratio);
};

const PLAN_LABELS: Record<string, string> = {
  god: 'God',
  basic: 'Basic',
  premium: 'Premium',
};

export const Dashboard = () => {
  const navigate = useNavigate();
  const { planInfo, logout } = useAuth();

  // Três estados:
  // noplan  — product é null (conta nova, nunca teve plano)
  // expired — teve plano mas active=false ou days_left <= 0
  // active  — plano em dia
  const hasProduct = planInfo?.product != null;
  const isActive = hasProduct && (planInfo?.active ?? false) && (planInfo?.days_left ?? 0) > 0;
  const isExpired = hasProduct && !isActive;

  const daysLeft = planInfo?.days_left ?? 0;
  const planLabel = planInfo?.product ? (PLAN_LABELS[planInfo.product] ?? planInfo.product) : null;

  return (
    <AppShell
      onLogoClick={() => navigate('/dashboard')}
      actions={
        <TopbarButton onClick={logout} danger>
          Sair
        </TopbarButton>
      }
    >
      <main className="relative z-1 mx-auto flex max-w-215 animate-fade-up flex-col gap-7 px-8 py-12 max-[600px]:px-4 max-[600px]:py-7">
        <div>
          <p className="mb-1.5 font-mono text-[11px] tracking-[0.12em] text-accent uppercase">
            Painel
          </p>
          <h1 className="m-0 text-[28px] leading-tight font-extrabold tracking-[-0.02em] text-content">
            Sua conta
          </h1>
        </div>

        {isActive ? (
          <PlanCard
            icon="⚡"
            badge={
              <Badge tone="success">
                <span className="size-1.25 animate-blink rounded-full bg-current" />
                Ativo
              </Badge>
            }
            title={`Plano ${planLabel}`}
            aside={<DaysRing daysLeft={daysLeft} />}
          >
            <p className="font-mono text-xs text-muted">
              Expira em{' '}
              <span className={`font-bold ${daysLeft <= 7 ? 'text-warning' : 'text-content'}`}>
                {daysLeft} {daysLeft === 1 ? 'dia' : 'dias'}
              </span>
            </p>
          </PlanCard>
        ) : (
          <PlanCard
            expired
            icon="🔒"
            badge={
              <Badge tone="error">
                <span className="size-1.25 rounded-full bg-current" />
                {isExpired ? 'Expirado' : 'Sem plano'}
              </Badge>
            }
            title={isExpired ? `Plano ${planLabel}` : 'Nenhum plano ativo'}
          >
            <p className="font-mono text-xs text-muted">
              {isExpired ? 'Sua assinatura expirou' : 'Adquira um plano para utilizar o bot'}
            </p>
          </PlanCard>
        )}

        {!isActive && (
          <div className="flex items-center gap-3.5 rounded-xl border border-error/15 bg-error/5 px-6 py-5 text-sm leading-normal text-muted">
            <span className="shrink-0 text-[22px]">ℹ️</span>
            <span>
              O controle do bot está disponível apenas para assinantes com plano ativo.
              {isExpired ? ' Renove' : ' Adquira'} seu plano para continuar.
            </span>
          </div>
        )}

        {isActive && (
          <a
            href="LINK"
            download
            className="inline-flex w-fit cursor-pointer items-center gap-2.5 rounded-lg border-none bg-accent px-6 py-3.25 font-display text-[15px] font-bold text-bg no-underline transition-all duration-200 hover:-translate-y-px hover:shadow-[0_8px_24px_rgba(0,229,255,0.3)]"
          >
            ⬇ Baixar SuperTM.exe
          </a>
        )}

        <div className="grid grid-cols-2 gap-4 max-[600px]:grid-cols-1">
          <ActionCard
            icon="🤖"
            title="Controle do Bot"
            desc="Monitore e controle o bot em tempo real. Inicie hunts, healer e muito mais."
            disabled={!isActive}
            onClick={() => navigate('/status')}
          />

          <ActionCard
            icon="💳"
            iconTone="warning"
            title={isActive || isExpired ? 'Renovar Plano' : 'Adquirir Plano'}
            desc={
              isActive
                ? 'Renove sua assinatura para continuar com acesso total ao bot.'
                : isExpired
                  ? 'Sua assinatura expirou. Renove para recuperar o acesso.'
                  : 'Escolha um plano e tenha acesso completo a todas as funcionalidades.'
            }
            onClick={() => navigate('/payment')}
          />
        </div>
      </main>
    </AppShell>
  );
};

const PlanCard = ({
  icon,
  badge,
  title,
  children,
  aside,
  expired = false,
}: {
  icon: string;
  badge: ReactNode;
  title: string;
  children: ReactNode;
  aside?: ReactNode;
  expired?: boolean;
}) => (
  <div className="relative flex items-center gap-7 overflow-hidden rounded-2xl border border-line bg-surface p-8 max-[600px]:flex-wrap">
    <span
      aria-hidden="true"
      className={`absolute inset-x-0 top-0 h-0.5 opacity-50 ${
        expired
          ? 'bg-[linear-gradient(90deg,transparent,var(--color-error),transparent)]'
          : 'bg-[linear-gradient(90deg,transparent,var(--color-accent),transparent)]'
      }`}
    />
    <div
      className={`flex size-16 shrink-0 items-center justify-center rounded-[14px] border text-[26px] ${
        expired ? 'border-error/20 bg-error/8' : 'border-accent/20 bg-accent/12'
      }`}
    >
      {icon}
    </div>
    <div className="flex-1">
      {badge}
      <h2 className="m-0 mb-1 text-[22px] font-extrabold tracking-[-0.02em] text-content capitalize">
        {title}
      </h2>
      {children}
    </div>
    {aside}
  </div>
);

const Badge = ({ tone, children }: { tone: 'success' | 'error'; children: ReactNode }) => (
  <div
    className={`mb-2.5 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[11px] tracking-[0.06em] uppercase ${
      tone === 'success'
        ? 'border-success/25 bg-success/10 text-success'
        : 'border-error/25 bg-error/10 text-error'
    }`}
  >
    {children}
  </div>
);

const DaysRing = ({ daysLeft }: { daysLeft: number }) => (
  <div className="flex shrink-0 flex-col items-center gap-1 max-[600px]:w-full max-[600px]:flex-row max-[600px]:gap-3">
    <div className="relative size-20">
      <svg width="80" height="80" viewBox="0 0 80 80" className="-rotate-90">
        <circle cx="40" cy="40" r={RING_RADIUS} className="fill-none stroke-white/6 stroke-5" />
        <circle
          cx="40"
          cy="40"
          r={RING_RADIUS}
          strokeDasharray={RING_CIRCUMFERENCE}
          strokeDashoffset={getDashOffset(daysLeft)}
          className={`fill-none transition-[stroke-dashoffset] duration-1000 ease-in-out [stroke-linecap:round] stroke-5 ${getRingStroke(daysLeft)}`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-mono text-xl leading-none font-bold text-content">{daysLeft}</span>
        <span className="text-[9px] tracking-[0.05em] text-muted uppercase">dias</span>
      </div>
    </div>
    <span className="font-mono text-[10px] text-muted">restantes</span>
  </div>
);

const ActionCard = ({
  icon,
  iconTone = 'accent',
  title,
  desc,
  onClick,
  disabled = false,
}: {
  icon: string;
  iconTone?: 'accent' | 'warning';
  title: string;
  desc: string;
  onClick: () => void;
  disabled?: boolean;
}) => (
  <div
    onClick={disabled ? undefined : onClick}
    className={`group flex cursor-pointer flex-col gap-3.5 rounded-[14px] border border-line bg-surface p-6 transition-[border-color,background] duration-200 hover:border-accent/25 hover:bg-surface2 ${
      disabled ? 'pointer-events-none cursor-not-allowed opacity-40' : ''
    }`}
  >
    <div
      className={`flex size-10.5 items-center justify-center rounded-[10px] border text-lg ${
        iconTone === 'warning' ? 'border-warning/20 bg-warning/8' : 'border-accent/15 bg-accent/12'
      }`}
    >
      {icon}
    </div>
    <div>
      <h3 className="m-0 mb-1 text-[15px] font-bold text-content">{title}</h3>
      <p className="m-0 text-xs leading-normal text-muted">{desc}</p>
    </div>
    <span className="mt-auto text-lg text-accent transition-transform duration-200 group-hover:translate-x-1">
      →
    </span>
  </div>
);
