import { useState } from 'react';
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
  SecondaryButton,
  SuccessIcon,
} from '../../components/ui';

const PASSWORD_HINT =
  'As senhas devem ter pelo menos 6 caracteres e incluir uma combinação de letras maiúsculas, letras minúsculas, números e símbolos.';

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
      <AuthLayout>
        <AuthCard centered>
          <SuccessIcon />
          <h2 className="m-0 text-[22px] font-bold text-content">Conta criada!</h2>
          <p className="m-0 text-sm leading-relaxed text-muted">
            Sua conta foi criada com sucesso. Agora é só fazer login.
          </p>
          <PrimaryButton onClick={() => navigate('/login')} className="grow-0">
            Fazer login
          </PrimaryButton>
        </AuthCard>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <AuthCard>
        <div className="mb-7">
          <BackLink label="← Voltar" onClick={() => navigate('/')} />
          <BrandLogo />
          <CardTitle>Criar conta</CardTitle>
          <CardDesc>Preencha os dados abaixo para criar sua conta.</CardDesc>
        </div>

        <div className="flex flex-col gap-4">
          <Field
            label="Email"
            error={errors.email}
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={handleKeyDown}
          />

          <Field
            label="Senha"
            error={errors.password}
            hint={PASSWORD_HINT}
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
          />

          {errors.general && <ErrorBox>{errors.general}</ErrorBox>}

          <div className="mt-1 flex gap-2.5">
            <SecondaryButton onClick={() => navigate('/')}>Cancelar</SecondaryButton>
            <PrimaryButton onClick={handleSubmit} loading={loading}>
              Criar conta
            </PrimaryButton>
          </div>
        </div>
      </AuthCard>
    </AuthLayout>
  );
};
