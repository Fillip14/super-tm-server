import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { AppShell, ErrorBox, PrimaryButton, SuccessIcon, TopbarButton } from '../../components/ui';
import { Body, Heading, Micro } from '../../components/Typography';

const FEATURES = [
  'Cavebot com waypoints ilimitados',
  'Healer automático com hotkeys',
  'Controle remoto via web',
  'Auto relogin e anti-detecção',
  'Suporte prioritário',
];

export const Payment = () => {
  const navigate = useNavigate();
  const { activatePlan, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleActivate = async () => {
    setLoading(true);
    setError('');

    const ok = await activatePlan();
    if (ok) setSuccess(true);
    else setError('Não foi possível ativar o plano. Tente novamente.');

    setLoading(false);
  };

  return (
    <AppShell
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
      <main className="relative z-1 flex justify-center px-4 py-8 sm:px-6 sm:py-12">
        <div className="w-full max-w-110 animate-card-in rounded-[1.25rem] border border-line bg-surface px-6 py-8 text-center shadow-card sm:px-10 sm:py-12">
          {success ? (
            <div className="flex flex-col items-center gap-4 py-4">
              <SuccessIcon />
              <Heading>Plano ativado!</Heading>
              <Body className="leading-relaxed">
                Seu plano foi ativado com sucesso por mais 30 dias. Aproveite o bot!
              </Body>
              <PrimaryButton onClick={() => navigate('/dashboard')} className="mt-2 grow-0">
                Ir para o painel
              </PrimaryButton>
            </div>
          ) : (
            <>
              <span className="inline-block rounded-full border border-warning/25 bg-warning/10 px-3 py-1 font-mono text-[0.625rem] tracking-[0.08em] text-warning">
                ⚠ DEMONSTRAÇÃO — sem cobrança real
              </span>

              <Heading className="mt-6 mb-2">Plano Mensal</Heading>
              <Body className="mb-8 leading-relaxed">
                Acesso completo a todas as funcionalidades do bot por 30 dias.
              </Body>

              <div className="mb-6 rounded-xl border border-accent/15 bg-accent/6 p-5">
                <div className="mb-1 font-mono text-4xl leading-none font-bold text-accent">
                  R$ 49,90
                </div>
                <Micro className="text-caption">por mês</Micro>
              </div>

              <ul className="m-0 mb-8 flex list-none flex-col gap-2.5 p-0 text-left">
                {FEATURES.map((feature) => (
                  <li key={feature} className="flex items-center gap-2.5 text-body text-muted">
                    <span className="shrink-0 text-base text-success">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>

              {error && (
                <div className="mb-4">
                  <ErrorBox>{error}</ErrorBox>
                </div>
              )}

              <PrimaryButton onClick={handleActivate} loading={loading} showArrow={false}>
                Ativar plano agora
              </PrimaryButton>
            </>
          )}
        </div>
      </main>
    </AppShell>
  );
};
