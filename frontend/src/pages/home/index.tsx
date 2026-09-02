import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const STATS = [
  { value: '99.9%', label: 'Uptime' },
  { value: '< 50ms', label: 'Latência' },
  { value: '24/7', label: 'Monitoramento' },
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
      className="relative flex min-h-screen items-center justify-center gap-20 overflow-x-clip bg-bg px-10 py-15 font-display max-[900px]:flex-col max-[900px]:items-stretch max-[900px]:gap-10 max-[900px]:px-6 max-[900px]:py-10"
    >
      <div className="pointer-events-none absolute inset-0 grid-bg mask-spotlight [--grid-alpha:0.03]" />
      <div className="pointer-events-none absolute top-1/2 left-[30%] h-150 w-150 -translate-x-1/2 -translate-y-1/2 animate-glow-pulse rounded-full bg-[radial-gradient(circle,rgba(0,229,255,0.06)_0%,transparent_70%)]" />

      <div className="z-1 flex w-full max-w-120 min-w-0 animate-fade-up flex-col gap-7">
        <div className="flex w-fit max-w-full items-center gap-2 rounded-full border border-accent/15 bg-accent/6 px-3.5 py-1.5 font-mono text-[11px] tracking-[0.08em] text-accent">
          <span className="size-1.5 animate-blink rounded-full bg-accent" />
          <span>Automação Super TM</span>
        </div>

        <h1 className="m-0 flex items-baseline gap-x-4 text-[88px] leading-none font-extrabold tracking-[-0.04em] max-[900px]:text-[64px] max-[480px]:text-[52px]">
          <span className="text-content">Super</span>
          <span className="text-accent [text-shadow:0_0_40px_rgba(0,229,255,0.4)]">TM</span>
        </h1>

        <p className="m-0 text-base leading-[1.7] font-normal text-muted">
          Controle total.
          <br />
          Monitoramento em tempo real, de qualquer lugar.
        </p>

        <div className="flex flex-wrap items-center gap-6 max-[900px]:gap-x-4 max-[900px]:gap-y-3">
          {STATS.map((stat, index) => (
            <div key={stat.label} className="flex items-center gap-6 max-[900px]:gap-4">
              {index > 0 && <div className="h-9 w-px bg-line-soft" />}
              <div className="flex flex-col gap-0.5">
                <span className="font-mono text-lg font-bold text-content">{stat.value}</span>
                <span className="text-[11px] tracking-widest text-muted uppercase">
                  {stat.label}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {checking ? null : authenticated ? (
            <PrimaryButton label="Dashboard" onClick={() => navigate('/dashboard')} />
          ) : (
            <>
              <PrimaryButton label="Entrar" onClick={() => navigate('/login')} />
              <button
                type="button"
                onClick={() => navigate('/signup')}
                className="flex cursor-pointer items-center rounded-lg border border-line-soft bg-transparent px-7 py-3.5 font-display text-[15px] font-semibold text-muted transition-all duration-200 hover:border-white/15 hover:text-content"
              >
                Criar conta
              </button>
            </>
          )}
        </div>
      </div>

      <div className="z-1 w-75 animate-fade-up overflow-hidden rounded-xl border border-line-soft bg-surface font-mono text-xs shadow-[0_24px_64px_rgba(0,0,0,0.4)] [animation-delay:0.15s] min-[901px]:mt-28 max-[900px]:w-full">
        <div className="flex items-center gap-1.5 border-b border-line-soft bg-white/3 px-3.5 py-2.5">
          <span className="size-2.5 rounded-full bg-[#ff5f57]" />
          <span className="size-2.5 rounded-full bg-warning" />
          <span className="size-2.5 rounded-full bg-success" />
          <span className="ml-auto text-[11px] text-muted">bot.log</span>
        </div>

        <div className="flex flex-col gap-2 px-3.5 py-4 leading-normal text-muted">
          <p className="m-0">
            <span className="text-[#3a4050]">[00:01]</span> <span className="text-success">✓</span>{' '}
            Conexão estabelecida
          </p>
          <p className="m-0">
            <span className="text-[#3a4050]">[00:02]</span> <span className="text-success">✓</span>{' '}
            Bot iniciado
          </p>
          <p className="m-0">
            <span className="text-[#3a4050]">[00:03]</span> <span className="text-accent">→</span>{' '}
            Hunt ativado
          </p>
          <p className="m-0">
            <span className="text-[#3a4050]">[00:04]</span> <span className="text-accent">→</span>{' '}
            Heal monitorando HP
          </p>
          <p className="m-0">
            <span className="text-[#3a4050]">[00:05]</span>{' '}
            <span className="animate-blink-fast text-accent">●</span> Aguardando...
          </p>
        </div>
      </div>
    </div>
  );
};

const PrimaryButton = ({ label, onClick }: { label: string; onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    className="group relative flex cursor-pointer items-center gap-2.5 overflow-hidden rounded-lg border-none bg-accent px-7 py-3.5 font-display text-[15px] font-bold text-bg transition-all duration-200 hover:-translate-y-px hover:shadow-[0_8px_24px_rgba(0,229,255,0.3)] active:translate-y-0"
  >
    <span className="pointer-events-none absolute inset-0 bg-white opacity-0 transition-opacity duration-200 group-hover:opacity-10" />
    <span className="relative">{label}</span>
    <span className="relative text-lg transition-transform duration-200 group-hover:translate-x-1">
      →
    </span>
  </button>
);
