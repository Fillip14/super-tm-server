import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './login.css';

export const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { checking, authenticated, signin } = useAuth();

  useEffect(() => {
    if (!checking && authenticated) {
      navigate('/dashboard');
    }
  }, [checking, authenticated, navigate]);

  async function handleLogin() {
    setError('');
    if (!email || !password) {
      setError('Preencha todos os campos.');
      return;
    }

    setLoading(true);
    try {
      const result = await signin(email, password);
      if (result.ok) navigate('/dashboard');
      else setError(result.message || 'Email ou senha inválidos.');
    } catch {
      setError('Sem conexão com o servidor.');
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') handleLogin();
  }

  return (
    <div className="login-root">
      <div className="login-bg" />

      <div className="login-card">
        {/* Header */}
        <div className="login-header">
          <button className="login-back" onClick={() => navigate('/')}>
            ← Voltar
          </button>
          <div className="login-logo">
            <span className="logo-main">Super</span>
            <span className="logo-accent">TM</span>
          </div>
          <h2 className="login-title">Bem-vindo de volta</h2>
          <p className="login-desc">Entre com suas credenciais para acessar o painel.</p>
        </div>

        {/* Form */}
        <div className="login-form">
          <div className="field-group">
            <label className="field-label">Email</label>
            <input
              className="field-input"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
            />
          </div>

          <div className="field-group">
            <label className="field-label">Senha</label>
            <input
              className="field-input"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>

          {error && (
            <div className="login-error">
              <span>⚠</span> {error}
            </div>
          )}

          <button
            className={`login-btn ${loading ? 'loading' : ''}`}
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <span className="spinner" />
            ) : (
              <>
                <span>Entrar</span>
                <span className="btn-arrow">→</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
