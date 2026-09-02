import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
  AuthCard,
  AuthLayout,
  BackLink,
  BrandLogo,
  CardDesc,
  CardTitle,
  ErrorBox,
  Field,
  PrimaryButton,
} from '../../components/ui';

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
    <AuthLayout>
      <AuthCard>
        <div className="mb-8">
          <BackLink label="← Voltar" onClick={() => navigate('/')} />
          <BrandLogo />
          <CardTitle>Bem-vindo de volta</CardTitle>
          <CardDesc>Entre com suas credenciais para acessar o painel.</CardDesc>
        </div>

        <div className="flex flex-col gap-4">
          <Field
            label="Email"
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
          />

          <Field
            label="Senha"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
          />

          {error && <ErrorBox>{error}</ErrorBox>}

          <PrimaryButton onClick={handleLogin} loading={loading} className="mt-1">
            Entrar
          </PrimaryButton>
        </div>
      </AuthCard>
    </AuthLayout>
  );
};
