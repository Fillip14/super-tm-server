import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
  AuthLayout,
  BackLink,
  BrandLogo,
  ErrorBox,
  PrimaryButton,
  SuccessIcon,
} from '../../components/ui';

const FEATURES = [
  'Cavebot com waypoints ilimitados',
  'Healer automático com hotkeys',
  'Controle remoto via web',
  'Auto relogin e anti-detecção',
  'Suporte prioritário',
];

export const Payment = () => {
  const navigate = useNavigate();
  const { activatePlan } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleActivate = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const res = await activatePlan(token);
      if (res) {
        setSuccess(true);
      } else {
        setError('Erro ao ativar plano.');
      }
    } catch {
      setError('Sem conexão com o servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="relative z-1 w-full max-w-110 animate-card-in rounded-[20px] border border-line bg-surface px-10 py-12 text-center shadow-[0_32px_80px_rgba(0,0,0,0.5)]">
        <div className="text-left">
          <BackLink label="← Voltar" onClick={() => navigate('/dashboard')} />
        </div>

        {success ? (
          <div className="flex flex-col items-center gap-4 py-4">
            <SuccessIcon />
            <h2 className="m-0 text-[22px] font-bold text-content">Plano ativado!</h2>
            <p className="m-0 text-sm leading-relaxed text-muted">
              Seu plano foi ativado com sucesso por mais 30 dias. Aproveite o bot!
            </p>
            <PrimaryButton onClick={() => navigate('/dashboard')} className="mt-2 grow-0">
              Ir para o painel
            </PrimaryButton>
          </div>
        ) : (
          <>
            <BrandLogo />

            <span className="inline-block rounded-full border border-warning/25 bg-warning/10 px-3 py-1 font-mono text-[10px] tracking-[0.08em] text-warning">
              ⚠ DEMONSTRAÇÃO — sem cobrança real
            </span>

            <h2 className="mt-6 mb-2 text-[22px] font-bold text-content">Plano Mensal</h2>
            <p className="mt-0 mb-8 text-sm leading-relaxed text-muted">
              Acesso completo a todas as funcionalidades do bot por 30 dias.
            </p>

            <div className="mb-6 rounded-xl border border-accent/15 bg-accent/6 p-5">
              <div className="mb-1 font-mono text-4xl leading-none font-bold text-accent">
                R$ 49,90
              </div>
              <div className="text-[13px] text-muted">por mês</div>
            </div>

            <ul className="m-0 mb-8 flex list-none flex-col gap-2.5 p-0 text-left">
              {FEATURES.map((feature) => (
                <li key={feature} className="flex items-center gap-2.5 text-sm text-muted">
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
    </AuthLayout>
  );
};
