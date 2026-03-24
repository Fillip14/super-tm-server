import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface Props {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: Props) => {
  const { checking, authenticated } = useAuth();

  if (checking) return null;
  if (!authenticated) return <Navigate to="/" />;

  return <>{children}</>;
};
