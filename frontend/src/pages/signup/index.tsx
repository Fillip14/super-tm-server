import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './signup.css';

const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const validatePassword = (password: string): string | null => {
  if (password.length < 6) return 'A senha deve ter no mínimo 8 caracteres';
  if (!/[A-Z]/.test(password)) return 'A senha deve ter pelo menos uma letra maiúscula';
  if (!/[a-z]/.test(password)) return 'A senha deve ter pelo menos uma letra minúscula';
  if (!/[\W_]/.test(password)) return 'A senha deve ter pelo menos um caractere especial';
  if (!/\d/.test(password)) return 'A senha deve ter pelo menos um número';
  return null;
};

export const Signup = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    general?: string;
  }>({});
  const { signup } = useAuth();

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!isValidEmail(email)) newErrors.email = 'Email inválido';
    const passwordError = validatePassword(password);
    if (passwordError) newErrors.password = passwordError;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    setErrors({});
    try {
      const result = await signup(email, password);
      if (result.ok) {
        setSuccess(true);
      } else {
        setLoading(false);
        setErrors({ general: result.message || 'Erro ao criar conta.' });
      }
    } catch {
      setLoading(false);
      setErrors({ general: 'Sem conexão com o servidor.' });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit();
  };

  if (success) {
    return (
      <div className="signup-root">
        <div className="signup-bg" />
        <div className="signup-card signup-card--success">
          <div className="success-icon">✓</div>
          <h2 className="success-title">Conta criada!</h2>
          <p className="success-desc">Sua conta foi criada com sucesso. Agora é só fazer login.</p>
          <button className="btn-primary" onClick={() => navigate('/login')}>
            Fazer login <span className="btn-arrow">→</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="signup-root">
      <div className="signup-bg" />

      <div className="signup-card">
        <div className="signup-header">
          <button className="signup-back" onClick={() => navigate('/')}>
            ← Voltar
          </button>
          <div className="signup-logo">
            <span className="logo-main">Super</span>
            <span className="logo-accent">TM</span>
          </div>
          <h2 className="signup-title">Criar conta</h2>
          <p className="signup-desc">Preencha os dados abaixo para criar sua conta.</p>
        </div>

        <div className="signup-form">
          <div className="field-group">
            <label className="field-label">
              Email {errors.email && <span className="field-error">* {errors.email}</span>}
            </label>
            <input
              className={`field-input ${errors.email ? 'field-input--error' : ''}`}
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>

          <div className="field-group">
            <label className="field-label">Senha</label>
            <input
              className={`field-input ${errors.password ? 'field-input--error' : ''}`}
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <p className={`field-hint${errors.password ? ' field-hint--error' : ''}`}>
              As senhas devem ter pelo menos 6 caracteres e incluir uma combinação de letras
              maiúsculas, letras minúsculas, números e símbolos.
            </p>
          </div>

          {errors.general && (
            <div className="signup-error">
              <span>⚠</span> {errors.general}
            </div>
          )}

          <div className="signup-actions">
            <button className="btn-secondary" onClick={() => navigate('/')}>
              Cancelar
            </button>
            <button className="btn-primary" onClick={handleSubmit} disabled={loading}>
              {loading ? (
                <span className="spinner" />
              ) : (
                <>
                  Criar conta <span className="btn-arrow">→</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
