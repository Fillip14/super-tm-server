import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Body, Brand, Micro, Mono } from '../../components/Typography';

const STATS = [
  { value: '99.9%', label: 'Uptime' },
  { value: '< 50ms', label: 'Latência' },
  { value: '24/7', label: 'Monitoramento' },
];

const TERMINAL_LINES = [
  { time: '[00:01]', mark: '✓', tone: 'success' as const, text: 'Conexão estabelecida' },
  { time: '[00:02]', mark: '✓', tone: 'success' as const, text: 'Bot iniciado' },
  { time: '[00:03]', mark: '→', tone: 'accent' as const, text: 'Hunt ativado' },
  { time: '[00:04]', mark: '→', tone: 'accent' as const, text: 'Heal monitorando HP' },
  { time: '[00:05]', mark: '●', tone: 'blink' as const, text: 'Aguardando...' },
];

export const Home = () => {
  const navigate = useNavigate();
  const gridRef = useRef<HTMLDivElement>(null);
  const { checking, authenticated } = useAuth();

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const handleMouseMove = (e: MouseEvent) => {
      const rect = grid.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      grid.style.setProperty('--mx', `${x}%`);
      grid.style.setProperty('--my', `${y}%`);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      ref={gridRef}
      className="relative flex min-h-screen flex-col items-stretch justify-center gap-10 overflow-x-clip bg-bg px-6 py-10 font-display hero:flex-row hero:items-center hero:gap-20 hero:px-10 hero:py-15"
    >
      <div className="pointer-events-none absolute inset-0 grid-bg mask-spotlight [--grid-alpha:0.03]" />
      <div className="pointer-events-none absolute top-1/2 left-[30%] h-150 w-150 -translate-x-1/2 -translate-y-1/2 animate-glow-pulse rounded-full glow-accent" />

      <div className="z-1 flex w-full max-w-120 min-w-0 animate-fade-up flex-col gap-7">
        <div className="flex w-fit max-w-full items-center gap-2 rounded-full border border-accent/15 bg-accent/6 px-3.5 py-1.5 font-mono text-micro tracking-[0.08em] text-accent">
          <span className="size-1.5 animate-blink rounded-full bg-accent" />
          <span>Automação Super TM</span>
        </div>

        <h1 className="m-0 flex items-baseline gap-x-4 text-[3.25rem] leading-none font-extrabold tracking-[-0.04em] xs:text-[4rem] hero:text-display">
          <Brand className="text-shadow-accent-lg" />
        </h1>

        <Body className="text-base leading-[1.7]">
          Controle total.
          <br />
          Monitoramento em tempo real, de qualquer lugar.
        </Body>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-3 hero:gap-6">
          {STATS.map((stat, index) => (
            <div key={stat.label} className="flex items-center gap-4 hero:gap-6">
              {index > 0 && <div className="h-9 w-px bg-line-soft" />}
              <div className="flex flex-col gap-0.5">
                <span className="font-mono text-subheading font-bold text-content">
                  {stat.value}
                </span>
                <Micro className="tracking-widest uppercase">{stat.label}</Micro>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {checking ? null : authenticated ? (
            <HeroButton label="Dashboard" onClick={() => navigate('/dashboard')} />
          ) : (
            <>
              <HeroButton label="Entrar" onClick={() => navigate('/login')} />
              <button
                type="button"
                onClick={() => navigate('/signup')}
                className="flex cursor-pointer items-center rounded-lg border border-line-soft bg-transparent px-7 py-3.5 font-display text-[0.9375rem] font-semibold text-muted transition-all duration-200 hover:border-white/15 hover:text-content"
              >
                Criar conta
              </button>
            </>
          )}
        </div>
      </div>

      <div className="z-1 w-full animate-fade-up overflow-hidden rounded-xl border border-line-soft bg-surface font-mono text-caption shadow-panel [animation-delay:0.15s] hero:mt-28 hero:w-75">
        <div className="flex items-center gap-1.5 border-b border-line-soft bg-white/3 px-3.5 py-2.5">
          <span className="size-2.5 rounded-full bg-[#ff5f57]" />
          <span className="size-2.5 rounded-full bg-warning" />
          <span className="size-2.5 rounded-full bg-success" />
          <Mono className="ml-auto text-micro">bot.log</Mono>
        </div>

        <div className="flex flex-col gap-2 px-3.5 py-4 leading-normal text-muted">
          {TERMINAL_LINES.map((line) => (
            <p key={line.time} className="m-0">
              <span className="text-muted/50">{line.time}</span>{' '}
              <span
                className={
                  line.tone === 'success'
                    ? 'text-success'
                    : line.tone === 'accent'
                      ? 'text-accent'
                      : 'animate-blink-fast text-accent'
                }
              >
                {line.mark}
              </span>{' '}
              {line.text}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

const HeroButton = ({ label, onClick }: { label: string; onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    className="group relative flex cursor-pointer items-center gap-2.5 overflow-hidden rounded-lg border-none bg-accent px-7 py-3.5 font-display text-[0.9375rem] font-bold text-bg transition-all duration-200 hover:-translate-y-px hover:shadow-glow-accent active:translate-y-0"
  >
    <span className="pointer-events-none absolute inset-0 bg-white opacity-0 transition-opacity duration-200 group-hover:opacity-10" />
    <span className="relative">{label}</span>
    <span className="relative text-subheading transition-transform duration-200 group-hover:translate-x-1">
      →
    </span>
  </button>
);
