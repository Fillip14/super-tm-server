import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';

const API_URL = import.meta.env.VITE_API_URL;
// const API_URL = 'http://localhost:4000';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setError('');
    if (!email || !password) {
      setError('Preencha todos os campos.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ provider: email, password }),
      });

      if (res.ok) {
        navigate('/status');
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.message || 'Email ou senha inválidos.');
      }
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
}
