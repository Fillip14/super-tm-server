import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Home } from './pages/home';
import { Login } from './pages/login';
import { Signup } from './pages/signup';
import { Status } from './pages/status';
import { Dashboard } from './pages/dashboard';
import { Payment } from './pages/payment';
import { ProtectedRoute, ActivePlanRoute } from './components/ProtectedRoute';

export const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Dashboard e Payment: só exigem token válido,
          não importa se o plano está ativo ou não */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/payment"
        element={
          <ProtectedRoute>
            <Payment />
          </ProtectedRoute>
        }
      />

      {/* Status: acesso controlado pelo botão no dashboard (só aparece se active=true) */}
      <Route
        path="/status"
        element={
          <ActivePlanRoute>
            <Status />
          </ActivePlanRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  </BrowserRouter>
);
