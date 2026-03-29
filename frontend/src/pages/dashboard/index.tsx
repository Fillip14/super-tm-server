import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './dashboard.css';

const DAYS_TOTAL = 30;

const getRingColor = (daysLeft: number) => {
  if (daysLeft <= 3) return 'danger';
  if (daysLeft <= 7) return 'warning';
  return '';
};

const getDashOffset = (daysLeft: number) => {
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const ratio = Math.max(0, Math.min(1, daysLeft / DAYS_TOTAL));
  return circumference * (1 - ratio);
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
  // !hasProduct && planInfo != null  → sem plano (conta nova)
  // planInfo == null                 → ainda carregando / erro de rede

  const daysLeft = planInfo?.days_left ?? 0;
  const ringColor = getRingColor(daysLeft);
  const circumference = 2 * Math.PI * 34;
  const planLabel = planInfo?.product ? (PLAN_LABELS[planInfo.product] ?? planInfo.product) : null;

  return (
    <div className="dashboard-root">
      <div className="dashboard-bg" />

      {/* Topbar */}
      <header className="dashboard-topbar">
        <span className="dashboard-logo">
          <span className="logo-main">Super</span>
          <span className="logo-accent">TM</span>
        </span>
        <div className="topbar-right">
          <button className="btn-logout" onClick={logout}>
            Sair
          </button>
        </div>
      </header>

      <main className="dashboard-content">
        {/* Header */}
        <div>
          <p className="section-eyebrow">Painel</p>
          <h1 className="section-title">Sua conta</h1>
        </div>

        {/* ── Plan card ── */}
        {isActive ? (
          /* ATIVO */
          <div className="plan-card">
            <div className="plan-icon-wrap">⚡</div>
            <div className="plan-info">
              <div className="plan-badge active">
                <span className="badge-dot pulse" />
                Ativo
              </div>
              <h2 className="plan-name">Plano {planLabel}</h2>
              <p className={`plan-expires${daysLeft <= 7 ? ' warning' : ''}`}>
                Expira em{' '}
                <span>
                  {daysLeft} {daysLeft === 1 ? 'dia' : 'dias'}
                </span>
              </p>
            </div>
            <div className="days-ring-wrap">
              <div className="days-ring">
                <svg width="80" height="80" viewBox="0 0 80 80">
                  <circle className="days-ring-bg" cx="40" cy="40" r="34" />
                  <circle
                    className={`days-ring-fill ${ringColor}`}
                    cx="40"
                    cy="40"
                    r="34"
                    strokeDasharray={circumference}
                    strokeDashoffset={getDashOffset(daysLeft)}
                  />
                </svg>
                <div className="days-ring-label">
                  <span className="days-ring-number">{daysLeft}</span>
                  <span className="days-ring-text">dias</span>
                </div>
              </div>
              <span className="days-ring-caption">restantes</span>
            </div>
          </div>
        ) : isExpired ? (
          /* EXPIRADO — teve plano mas venceu */
          <div className="plan-card plan-card--expired">
            <div className="plan-icon-wrap">🔒</div>
            <div className="plan-info">
              <div className="plan-badge expired">
                <span className="badge-dot" />
                Expirado
              </div>
              <h2 className="plan-name">Plano {planLabel}</h2>
              <p className="plan-expires">Sua assinatura expirou</p>
            </div>
          </div>
        ) : (
          /* SEM PLANO — conta nova */
          <div className="plan-card plan-card--expired">
            <div className="plan-icon-wrap">🔒</div>
            <div className="plan-info">
              <div className="plan-badge expired">
                <span className="badge-dot" />
                Sem plano
              </div>
              <h2 className="plan-name">Nenhum plano ativo</h2>
              <p className="plan-expires">Adquira um plano para utilizar o bot</p>
            </div>
          </div>
        )}

        {/* Aviso quando não há plano ativo */}
        {!isActive && (
          <div className="no-plan-notice">
            <span className="no-plan-icon">ℹ️</span>
            <span>
              O controle do bot está disponível apenas para assinantes com plano ativo.
              {isExpired ? ' Renove' : ' Adquira'} seu plano para continuar.
            </span>
          </div>
        )}

        {/* Download button — só aparece com plano ativo */}
        {isActive && (
          <a className="btn-download" href="LINK" download>
            ⬇ Baixar SuperTM.exe
          </a>
        )}

        {/* Action cards */}
        <div className="action-grid">
          <div
            className={`action-card${!isActive ? ' disabled' : ''}`}
            onClick={() => isActive && navigate('/status')}
          >
            <div className="action-card-icon">🤖</div>
            <div>
              <h3 className="action-card-title">Controle do Bot</h3>
              <p className="action-card-desc">
                Monitore e controle o bot em tempo real. Inicie hunts, healer e muito mais.
              </p>
            </div>
            <span className="action-card-arrow">→</span>
          </div>

          <div className="action-card" onClick={() => navigate('/payment')}>
            <div className="action-card-icon warning-icon">💳</div>
            <div>
              <h3 className="action-card-title">
                {isActive ? 'Renovar Plano' : isExpired ? 'Renovar Plano' : 'Adquirir Plano'}
              </h3>
              <p className="action-card-desc">
                {isActive
                  ? 'Renove sua assinatura para continuar com acesso total ao bot.'
                  : isExpired
                    ? 'Sua assinatura expirou. Renove para recuperar o acesso.'
                    : 'Escolha um plano e tenha acesso completo a todas as funcionalidades.'}
              </p>
            </div>
            <span className="action-card-arrow">→</span>
          </div>
        </div>
      </main>
    </div>
  );
};
