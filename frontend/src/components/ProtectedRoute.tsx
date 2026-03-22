import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface Props {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: Props) => {
  const { checking, authenticated } = useAuth();

  if (checking) return null;
  if (!authenticated) return <Navigate to="/login" />;

  return <>{children}</>;
};

export const ActivePlanRoute = ({ children }: Props) => {
  const { checking, authenticated, active } = useAuth();

  if (checking) return null;
  if (!authenticated) return <Navigate to="/login" />;
  if (!active) return <Navigate to="/dashboard" />;

  return <>{children}</>;
};
