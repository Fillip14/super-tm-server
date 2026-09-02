import { useNavigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { AppShell, TopbarButton } from '../../components/ui';
import { Body, Eyebrow, Heading, Mono, PageTitle } from '../../components/Typography';
import { planLabel } from '../../types/plan.types';
import type { PlanState } from '../../types/plan.types';

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

export const Dashboard = () => {
  const navigate = useNavigate();
  const { plan, logout } = useAuth();

  const isActive = plan.kind === 'active';

  return (
    <AppShell
      onLogoClick={() => navigate('/dashboard')}
      actions={
        <TopbarButton onClick={logout} danger>
          Sair
        </TopbarButton>
      }
    >
      <main className="relative z-1 mx-auto flex max-w-215 animate-fade-up flex-col gap-7 px-4 py-7 sm:px-8 sm:py-12">
        <div>
          <Eyebrow>Painel</Eyebrow>
          <PageTitle>Sua conta</PageTitle>
        </div>

        <PlanSummary plan={plan} />

        {!isActive && plan.kind !== 'loading' && (
          <div className="flex items-center gap-3.5 rounded-xl border border-error/15 bg-error/5 px-6 py-5">
            <span className="shrink-0 text-heading">ℹ️</span>
            <Body>
              O controle do bot está disponível apenas para assinantes com plano ativo.
              {plan.kind === 'expired' ? ' Renove' : ' Adquira'} seu plano para continuar.
            </Body>
          </div>
        )}

        {isActive && (
          <a
            href="LINK"
            download
            className="inline-flex w-fit cursor-pointer items-center gap-2.5 rounded-lg border-none bg-accent px-6 py-3.25 font-display text-[0.9375rem] font-bold text-bg no-underline transition-all duration-200 hover:-translate-y-px hover:shadow-glow-accent"
          >
            ⬇ Baixar SuperTM.exe
          </a>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
            title={plan.kind === 'noplan' ? 'Adquirir Plano' : 'Renovar Plano'}
            desc={
              plan.kind === 'active'
                ? 'Renove sua assinatura para continuar com acesso total ao bot.'
                : plan.kind === 'expired'
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

const PlanSummary = ({ plan }: { plan: PlanState }) => {
  switch (plan.kind) {
    case 'loading':
      return <div className="h-35 animate-pulse rounded-2xl border border-line bg-surface" />;

    case 'active':
      return (
        <PlanCard
          icon="⚡"
          badge={
            <Badge tone="success">
              <span className="size-1.25 animate-blink rounded-full bg-current" />
              Ativo
            </Badge>
          }
          title={`Plano ${planLabel(plan.product)}`}
          aside={<DaysRing daysLeft={plan.daysLeft} />}
        >
          <Mono>
            Expira em{' '}
            <span className={`font-bold ${plan.daysLeft <= 7 ? 'text-warning' : 'text-content'}`}>
              {plan.daysLeft} {plan.daysLeft === 1 ? 'dia' : 'dias'}
            </span>
          </Mono>
        </PlanCard>
      );

    case 'expired':
      return (
        <PlanCard
          expired
          icon="🔒"
          badge={
            <Badge tone="error">
              <span className="size-1.25 rounded-full bg-current" />
              Expirado
            </Badge>
          }
          title={`Plano ${planLabel(plan.product)}`}
        >
          <Mono>Sua assinatura expirou</Mono>
        </PlanCard>
      );

    case 'noplan':
      return (
        <PlanCard
          expired
          icon="🔒"
          badge={
            <Badge tone="error">
              <span className="size-1.25 rounded-full bg-current" />
              Sem plano
            </Badge>
          }
          title="Nenhum plano ativo"
        >
          <Mono>Adquira um plano para utilizar o bot</Mono>
        </PlanCard>
      );
  }
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
  <div className="relative flex flex-wrap items-center gap-7 overflow-hidden rounded-2xl border border-line bg-surface p-8 sm:flex-nowrap">
    <span
      aria-hidden="true"
      className={`absolute inset-x-0 top-0 h-0.5 opacity-50 ${
        expired
          ? 'bg-[linear-gradient(90deg,transparent,var(--color-error),transparent)]'
          : 'bg-[linear-gradient(90deg,transparent,var(--color-accent),transparent)]'
      }`}
    />
    <div
      className={`flex size-16 shrink-0 items-center justify-center rounded-[0.875rem] border text-[1.625rem] ${
        expired ? 'border-error/20 bg-error/8' : 'border-accent/20 bg-accent/12'
      }`}
    >
      {icon}
    </div>
    <div className="flex-1">
      {badge}
      <Heading className="mb-1 font-extrabold tracking-[-0.02em] capitalize">{title}</Heading>
      {children}
    </div>
    {aside}
  </div>
);

const Badge = ({ tone, children }: { tone: 'success' | 'error'; children: ReactNode }) => (
  <div
    className={`mb-2.5 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-micro tracking-[0.06em] uppercase ${
      tone === 'success'
        ? 'border-success/25 bg-success/10 text-success'
        : 'border-error/25 bg-error/10 text-error'
    }`}
  >
    {children}
  </div>
);

const DaysRing = ({ daysLeft }: { daysLeft: number }) => (
  <div className="flex w-full shrink-0 flex-row items-center gap-3 sm:w-auto sm:flex-col sm:gap-1">
    <div className="relative size-20">
      <svg width="80" height="80" viewBox="0 0 80 80" className="-rotate-90">
        <circle cx="40" cy="40" r={RING_RADIUS} className="fill-none stroke-white/6 stroke-5" />
        <circle
          cx="40"
          cy="40"
          r={RING_RADIUS}
          strokeDasharray={RING_CIRCUMFERENCE}
          strokeDashoffset={getDashOffset(daysLeft)}
          className={`fill-none stroke-5 transition-[stroke-dashoffset] duration-1000 ease-in-out [stroke-linecap:round] ${getRingStroke(daysLeft)}`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-mono text-subheading leading-none font-bold text-content">
          {daysLeft}
        </span>
        <span className="text-[0.5625rem] tracking-wider text-muted uppercase">dias</span>
      </div>
    </div>
    <Mono className="text-[0.625rem]">restantes</Mono>
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
    className={`group flex cursor-pointer flex-col gap-3.5 rounded-[0.875rem] border border-line bg-surface p-6 transition-[border-color,background] duration-200 hover:border-accent/25 hover:bg-surface2 ${
      disabled ? 'pointer-events-none cursor-not-allowed opacity-40' : ''
    }`}
  >
    <div
      className={`flex size-10.5 items-center justify-center rounded-[0.625rem] border text-subheading ${
        iconTone === 'warning' ? 'border-warning/20 bg-warning/8' : 'border-accent/15 bg-accent/12'
      }`}
    >
      {icon}
    </div>
    <div>
      <h3 className="m-0 mb-1 text-[0.9375rem] font-bold text-content">{title}</h3>
      <p className="m-0 text-caption leading-normal text-muted">{desc}</p>
    </div>
    <span className="mt-auto text-subheading text-accent transition-transform duration-200 group-hover:translate-x-1">
      →
    </span>
  </div>
);
