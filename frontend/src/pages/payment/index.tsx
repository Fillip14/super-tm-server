import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './payment.css';

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
    <div className="payment-root">
      <div className="payment-bg" />

      <div className="payment-card">
        <button className="payment-back" onClick={() => navigate('/dashboard')}>
          ← Voltar
        </button>

        {success ? (
          <div className="payment-success">
            <div className="success-icon">✓</div>
            <h2 className="success-title">Plano ativado!</h2>
            <p className="success-desc">
              Seu plano foi ativado com sucesso por 30 dias. Aproveite o bot!
            </p>
            <button
              className="btn-activate"
              onClick={() => navigate('/dashboard')}
              style={{ marginTop: 8 }}
            >
              Ir para o painel →
            </button>
          </div>
        ) : (
          <>
            <div className="payment-logo">
              <span className="logo-main">Super</span>
              <span className="logo-accent">TM</span>
            </div>

            <span className="demo-badge">⚠ DEMONSTRAÇÃO — sem cobrança real</span>

            <h2 className="payment-title">Plano Mensal</h2>
            <p className="payment-desc">
              Acesso completo a todas as funcionalidades do bot por 30 dias.
            </p>

            <div className="price-tag">
              <div className="price-value">R$ 49,90</div>
              <div className="price-period">por mês</div>
            </div>

            <ul className="feature-list">
              <li>
                <span className="check">✓</span>
                Cavebot com waypoints ilimitados
              </li>
              <li>
                <span className="check">✓</span>
                Healer automático com hotkeys
              </li>
              <li>
                <span className="check">✓</span>
                Controle remoto via web
              </li>
              <li>
                <span className="check">✓</span>
                Auto relogin e anti-detecção
              </li>
              <li>
                <span className="check">✓</span>
                Suporte prioritário
              </li>
            </ul>

            {error && (
              <div className="payment-error">
                <span>⚠</span> {error}
              </div>
            )}

            <button className="btn-activate" onClick={handleActivate} disabled={loading}>
              {loading ? <span className="spinner" /> : 'Ativar plano agora'}
            </button>
          </>
        )}
      </div>
    </div>
  );
};
