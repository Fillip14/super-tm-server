import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useWebSocket } from '../../hooks/useWebSocket';
import { AppShell, TopbarButton } from '../../components/ui';
import { Eyebrow, Heading, Mono, PageTitle } from '../../components/Typography';
import {
  BarPct,
  ConnectionBadge,
  OnOff,
  StatCaption,
  StatCard,
  StatValue,
} from '../../components/stat';
import type { BotCommand } from '../../types/bot.types';

type ControlGroup = {
  name: string;
  desc: string;
  actions: { label: string; tone: 'start' | 'stop'; command: BotCommand }[];
};

const startStop = (category: 'program' | 'hunt' | 'heal'): ControlGroup['actions'] => [
  { label: '▶ Iniciar', tone: 'start', command: { category, action: 'start' } },
  { label: '■ Parar', tone: 'stop', command: { category, action: 'stop' } },
];

const CONTROLS: ControlGroup[] = [
  {
    name: 'Program',
    desc: 'Captura de tela e posição do char',
    actions: startStop('program'),
  },
  {
    name: 'Hunt',
    desc: 'Cavebot com waypoints configurados',
    actions: startStop('hunt'),
  },
  {
    name: 'Healer',
    desc: 'Cura automática de HP e MP',
    actions: startStop('heal'),
  },
  {
    name: 'Reopen tibia',
    desc: 'Reabre a janela do tibia',
    actions: [
      { label: '▶ Reabrir', tone: 'start', command: { category: 'client', action: 'reopen' } },
    ],
  },
];

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
      <main className="relative z-1 mx-auto flex max-w-250 animate-fade-up flex-col gap-6 px-4 py-6 sm:px-8 sm:py-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <Eyebrow>Controle</Eyebrow>
            <PageTitle>Status do bot</PageTitle>
          </div>
          <ConnectionBadge connected={botConnected} />
        </div>

        <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-[repeat(auto-fit,minmax(10rem,1fr))]">
          <StatCard label="Program" icon="⚙️" glow={!!status?.pos_char}>
            <div>
              <OnOff on={status?.pos_char ?? false} />
            </div>
            <StatCaption>Posição do char</StatCaption>
          </StatCard>

          <StatCard label="Hunt" icon="⚔️" glow={!!status?.hunt}>
            <div>
              <OnOff on={status?.hunt ?? false} />
            </div>
            <StatCaption>Cavebot</StatCaption>
          </StatCard>

          <StatCard label="Healer" icon="💊" glow={!!status?.heal}>
            <div>
              <OnOff on={status?.heal ?? false} />
            </div>
            <StatCaption>Cura automática</StatCaption>
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
            <StatCaption>Capacidade</StatCaption>
          </StatCard>

          <StatCard label="MP Pots" icon="🧪">
            <StatValue
              value={status?.amount_MP ?? '—'}
              tone={status?.amount_MP != null ? 'accent' : 'muted'}
            />
            <StatCaption>Poções de mana</StatCaption>
          </StatCard>

          {status?.minimap && (
            <StatCard label="Minimap" icon="🗺️" wide>
              <img
                src={`data:image/jpeg;base64,${status.minimap}`}
                alt="minimap"
                className="w-full max-w-50 rounded-md border border-accent/20 [image-rendering:pixelated]"
              />
            </StatCard>
          )}
        </div>

        {botConnected ? (
          <section className="overflow-hidden rounded-[0.875rem] border border-line bg-surface">
            <div className="flex items-center justify-between border-b border-line px-6 py-4.5">
              <Heading className="text-body">Ações</Heading>
            </div>

            <div className="flex flex-col gap-4 px-6 py-5">
              {CONTROLS.map((control, index) => (
                <div key={control.name}>
                  {index > 0 && <div className="mb-4 h-px bg-line" />}
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-body font-semibold text-content">{control.name}</span>
                      <Mono className="text-micro">{control.desc}</Mono>
                    </div>
                    <div className="flex w-full shrink-0 gap-2 sm:w-auto">
                      {control.actions.map((item) => (
                        <button
                          key={item.label}
                          type="button"
                          onClick={() => sendAction(item.command)}
                          className={`flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-[0.4375rem] border px-4 py-2 font-display text-caption font-semibold whitespace-nowrap transition-all duration-150 sm:flex-none ${
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
          <div className="flex flex-col items-center gap-3 rounded-[0.875rem] border border-line bg-surface px-6 py-10 text-center">
            <span className="text-[2rem] opacity-40">📡</span>
            <Heading className="text-body text-muted">Aguardando conexão do bot</Heading>
            <Mono className="opacity-60">Inicie o desktop app para habilitar os controles</Mono>
          </div>
        )}

        <section className="overflow-hidden rounded-[0.875rem] border border-line bg-surface">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-2.5">
              <Heading className="text-body">Logs</Heading>
              {logs.length > 0 && (
                <span className="rounded-full border border-line bg-white/5 px-2 py-0.5 font-mono text-[0.625rem] text-muted">
                  {logs.length}
                </span>
              )}
            </div>
          </div>

          <div className="flex h-70 flex-col gap-1 overflow-y-auto px-6 pb-5 [scrollbar-color:rgba(255,255,255,0.08)_transparent] scrollbar-thin">
            {logs.length === 0 ? (
              <Mono className="py-6 text-center opacity-50">Nenhum log registrado</Mono>
            ) : (
              logs.map((log, i) => (
                <div
                  key={i}
                  className="flex items-baseline gap-2 py-0.5 font-mono text-micro leading-relaxed"
                >
                  <span className="min-w-6 shrink-0 text-right text-[0.625rem] text-muted/50">
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
