import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL;
// const API_URL = 'http://localhost:4000';

interface Props {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: Props) {
  const [checking, setChecking] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/api/auth/verify-session`, {
      method: 'POST',
      credentials: 'include',
    })
      .then((res) => {
        setAuthenticated(res.ok);
      })
      .catch(() => {
        setAuthenticated(false);
      })
      .finally(() => {
        setChecking(false);
      });
  }, []);

  if (checking) return null; // ou um spinner se preferires

  if (!authenticated) return <Navigate to="/login" />;

  return <>{children}</>;
}
