import type { ReactNode } from 'react';
import { Micro, Mono } from './Typography';

export const StatCard = ({
  label,
  icon,
  glow = false,
  wide = false,
  children,
}: {
  label: string;
  icon: string;
  glow?: boolean;
  wide?: boolean;
  children: ReactNode;
}) => (
  <div
    className={`flex flex-col gap-2.5 rounded-xl border bg-surface px-5 py-4.5 transition-colors duration-200 ${
      glow ? 'border-accent/20' : 'border-line'
    } ${wide ? 'col-span-2' : ''}`}
  >
    <div className="flex items-center justify-between">
      <Mono className="text-[0.625rem] tracking-widest uppercase">{label}</Mono>
      <span className="text-body opacity-70">{icon}</span>
    </div>
    {children}
  </div>
);

export const StatValue = ({
  value,
  tone,
}: {
  value: string | number;
  tone: 'accent' | 'success' | 'muted';
}) => (
  <div
    className={`font-mono text-heading leading-none font-bold ${
      tone === 'accent' ? 'text-accent' : tone === 'success' ? 'text-success' : 'text-muted'
    }`}
  >
    {value}
  </div>
);

export const StatCaption = ({ children }: { children: ReactNode }) => <Micro>{children}</Micro>;

export const OnOff = ({ on }: { on: boolean }) => (
  <span
    className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.75 font-mono text-[0.625rem] tracking-[0.06em] uppercase ${
      on ? 'border-success/20 bg-success/10 text-success' : 'border-muted/20 bg-muted/12 text-muted'
    }`}
  >
    <span className={`size-1 rounded-full bg-current ${on ? 'animate-blink' : ''}`} />
    {on ? 'Ativo' : 'Parado'}
  </span>
);

export const BarPct = ({ value, type }: { value: number | null; type: 'hp' | 'mp' }) => {
  const pct = value ?? 0;
  const color = type === 'mp' ? 'bg-accent' : pct > 40 ? 'bg-success' : 'bg-error';

  return (
    <div className="h-1 overflow-hidden rounded-sm bg-white/5">
      <div
        className={`h-full rounded-sm transition-[width] duration-600 ease-in-out ${color}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
};

export const ConnectionBadge = ({ connected }: { connected: boolean }) => (
  <div
    className={`flex items-center gap-2.5 rounded-full border px-4 py-2 transition-colors duration-300 ${
      connected ? 'border-success/25 bg-success/10' : 'border-line bg-white/3'
    }`}
  >
    <span
      className={`size-2.5 shrink-0 rounded-full ${
        connected ? 'animate-blink bg-success shadow-glow-success' : 'bg-muted'
      }`}
    />
    <span className={`font-mono text-caption ${connected ? 'text-success' : 'text-muted'}`}>
      {connected ? 'Bot online' : 'Aguardando bot'}
    </span>
  </div>
);
