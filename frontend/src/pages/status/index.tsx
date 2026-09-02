import { useNavigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useWebSocket } from '../../hooks/useWebSocket';
import { AppShell, TopbarButton } from '../../components/ui';

const CONTROLS = [
  {
    name: 'Program',
    desc: 'Captura de tela e posição do char',
    category: 'program',
    actions: [
      { label: '▶ Iniciar', action: 'start', tone: 'start' as const },
      { label: '■ Parar', action: 'stop', tone: 'stop' as const },
    ],
  },
  {
    name: 'Hunt',
    desc: 'Cavebot com waypoints configurados',
    category: 'hunt',
    actions: [
      { label: '▶ Iniciar', action: 'start', tone: 'start' as const },
      { label: '■ Parar', action: 'stop', tone: 'stop' as const },
    ],
  },
  {
    name: 'Healer',
    desc: 'Cura automática de HP e MP',
    category: 'heal',
    actions: [
      { label: '▶ Iniciar', action: 'start', tone: 'start' as const },
      { label: '■ Parar', action: 'stop', tone: 'stop' as const },
    ],
  },
  {
    name: 'Reopen tibia',
    desc: 'Reabre a janela do tibia',
    category: 'client',
    actions: [{ label: '▶ Reabrir', action: 'reopen', tone: 'start' as const }],
  },
];

const OnOff = ({ on }: { on: boolean }) => (
  <span
    className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.75 font-mono text-[10px] tracking-[0.06em] uppercase ${
      on ? 'border-success/20 bg-success/10 text-success' : 'border-muted/20 bg-muted/12 text-muted'
    }`}
  >
    <span className={`size-1 rounded-full bg-current ${on ? 'animate-blink' : ''}`} />
    {on ? 'Ativo' : 'Parado'}
  </span>
);

const BarPct = ({ value, type }: { value: number | null; type: 'hp' | 'mp' }) => {
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

const StatCard = ({
  label,
  icon,
  glow = false,
  span2 = false,
  children,
}: {
  label: string;
  icon: string;
  glow?: boolean;
  span2?: boolean;
  children: ReactNode;
}) => (
  <div
    className={`flex flex-col gap-2.5 rounded-xl border bg-surface px-5 py-4.5 transition-colors duration-200 ${
      glow ? 'border-accent/20' : 'border-line'
    } ${span2 ? 'col-span-2' : ''}`}
  >
    <div className="flex items-center justify-between">
      <span className="font-mono text-[10px] tracking-widest text-muted uppercase">{label}</span>
      <span className="text-sm opacity-70">{icon}</span>
    </div>
    {children}
  </div>
);

const StatValue = ({
  value,
  tone,
}: {
  value: string | number;
  tone: 'accent' | 'success' | 'muted';
}) => (
  <div
    className={`font-mono text-[22px] leading-none font-bold ${
      tone === 'accent' ? 'text-accent' : tone === 'success' ? 'text-success' : 'text-muted'
    }`}
  >
    {value}
  </div>
);

const SubLabel = ({ children }: { children: ReactNode }) => (
  <span className="text-[11px] text-muted">{children}</span>
);

export const Status = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { status, logs, sendAction } = useWebSocket();

  const botConnected = status !== null;

  return (
    <AppShell
      gridAlpha="0.022"
      onLogoClick={() => navigate('/dashboard')}
      actions={
        <>
          <TopbarButton onClick={() => navigate('/dashboard')}>← Painel</TopbarButton>
          <TopbarButton onClick={logout} danger>
            Sair
          </TopbarButton>
        </>
      }
    >
      <main className="relative z-1 mx-auto flex max-w-250 animate-fade-up flex-col gap-6 px-8 py-10 max-[640px]:px-4 max-[640px]:py-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-1 font-mono text-[11px] tracking-[0.12em] text-accent uppercase">
              Controle
            </p>
            <h1 className="m-0 text-[26px] font-extrabold tracking-[-0.02em] text-content">
              Status do bot
            </h1>
          </div>

          <div
            className={`flex items-center gap-2.5 rounded-full border px-4 py-2 transition-colors duration-300 ${
              botConnected ? 'border-success/25 bg-success/10' : 'border-line bg-white/3'
            }`}
          >
            <span
              className={`size-2.5 shrink-0 rounded-full ${
                botConnected
                  ? 'animate-blink bg-success shadow-[0_0_8px_rgba(40,200,64,0.5)]'
                  : 'bg-muted'
              }`}
            />
            <span className={`font-mono text-xs ${botConnected ? 'text-success' : 'text-muted'}`}>
              {botConnected ? 'Bot online' : 'Aguardando bot'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-3.5 max-[640px]:grid-cols-2">
          <StatCard label="Program" icon="⚙️" glow={!!status?.pos_char}>
            <div>
              <OnOff on={status?.pos_char ?? false} />
            </div>
            <SubLabel>Posição do char</SubLabel>
          </StatCard>

          <StatCard label="Hunt" icon="⚔️" glow={!!status?.hunt}>
            <div>
              <OnOff on={status?.hunt ?? false} />
            </div>
            <SubLabel>Cavebot</SubLabel>
          </StatCard>

          <StatCard label="Healer" icon="💊" glow={!!status?.heal}>
            <div>
              <OnOff on={status?.heal ?? false} />
            </div>
            <SubLabel>Cura automática</SubLabel>
          </StatCard>

          <StatCard label="HP" icon="❤️">
            <StatValue
              value={status?.hp != null ? `${status.hp}%` : '—'}
              tone={status?.hp == null ? 'muted' : status.hp > 40 ? 'success' : 'accent'}
            />
            <BarPct value={status?.hp ?? null} type="hp" />
          </StatCard>

          <StatCard label="MP" icon="💙">
            <StatValue
              value={status?.mp != null ? `${status.mp}%` : '—'}
              tone={status?.mp != null ? 'accent' : 'muted'}
            />
            <BarPct value={status?.mp ?? null} type="mp" />
          </StatCard>

          <StatCard label="CAP" icon="🎒">
            <StatValue value={status?.cap ?? '—'} tone={status?.cap != null ? 'accent' : 'muted'} />
            <SubLabel>Capacidade</SubLabel>
          </StatCard>

          <StatCard label="MP Pots" icon="🧪">
            <StatValue
              value={status?.amount_MP ?? '—'}
              tone={status?.amount_MP != null ? 'accent' : 'muted'}
            />
            <SubLabel>Poções de mana</SubLabel>
          </StatCard>

          {status?.minimap && (
            <StatCard label="Minimap" icon="🗺️" span2>
              <img
                src={`data:image/jpeg;base64,${status.minimap}`}
                alt="minimap"
                className="w-full max-w-50 rounded-md border border-accent/20 [image-rendering:pixelated]"
              />
            </StatCard>
          )}
        </div>

        {botConnected ? (
          <section className="overflow-hidden rounded-[14px] border border-line bg-surface">
            <div className="flex items-center justify-between border-b border-line px-6 py-4.5">
              <span className="text-sm font-bold text-content">Ações</span>
            </div>

            <div className="flex flex-col gap-4 px-6 py-5">
              {CONTROLS.map((control, index) => (
                <div key={control.category}>
                  {index > 0 && <div className="mb-4 h-px bg-line" />}
                  <div className="flex items-center justify-between gap-4 max-[640px]:flex-wrap">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-sm font-semibold text-content">{control.name}</span>
                      <span className="font-mono text-[11px] text-muted">{control.desc}</span>
                    </div>
                    <div className="flex shrink-0 gap-2 max-[640px]:w-full">
                      {control.actions.map((item) => (
                        <button
                          key={item.action}
                          type="button"
                          onClick={() => sendAction(control.category, item.action)}
                          className={`flex cursor-pointer items-center gap-1.5 rounded-[7px] border px-4 py-2 font-display text-[13px] font-semibold whitespace-nowrap transition-all duration-150 max-[640px]:flex-1 max-[640px]:justify-center ${
                            item.tone === 'start'
                              ? 'border-accent/20 bg-accent/10 text-accent hover:border-accent/40 hover:bg-accent/18'
                              : 'border-error/20 bg-error/8 text-error hover:border-error/40 hover:bg-error/15'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : (
          <div className="flex flex-col items-center gap-3 rounded-[14px] border border-line bg-surface px-6 py-10 text-center">
            <span className="text-[32px] opacity-40">📡</span>
            <h3 className="m-0 text-base font-bold text-muted">Aguardando conexão do bot</h3>
            <p className="m-0 font-mono text-[13px] text-muted opacity-60">
              Inicie o desktop app para habilitar os controles
            </p>
          </div>
        )}

        <section className="overflow-hidden rounded-[14px] border border-line bg-surface">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-2.5">
              <span className="text-sm font-bold text-content">Logs</span>
              {logs.length > 0 && (
                <span className="rounded-full border border-line bg-white/5 px-2 py-0.5 font-mono text-[10px] text-muted">
                  {logs.length}
                </span>
              )}
            </div>
          </div>

          <div className="flex h-70 flex-col gap-1 overflow-y-auto px-6 pb-5 [scrollbar-color:rgba(255,255,255,0.08)_transparent] scrollbar-thin">
            {logs.length === 0 ? (
              <span className="py-6 text-center font-mono text-xs text-muted opacity-50">
                Nenhum log registrado
              </span>
            ) : (
              logs.map((log, i) => (
                <div
                  key={i}
                  className="flex items-baseline gap-2 py-0.5 font-mono text-[11px] leading-relaxed"
                >
                  <span className="min-w-6 shrink-0 text-right text-[10px] text-muted/50">
                    {logs.length - i}
                  </span>
                  <span>{log.time}</span>
                  <span>{log.type}</span>
                  <span className="break-all text-accent/75">{log.message}</span>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </AppShell>
  );
};
