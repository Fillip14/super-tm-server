import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './home.css';

export const Home = () => {
  const navigate = useNavigate();
  const gridRef = useRef<HTMLDivElement>(null);
  const { checking, authenticated } = useAuth();

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const handleMouseMove = (e: MouseEvent) => {
      const rect = grid.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      grid.style.setProperty('--mx', `${x}%`);
      grid.style.setProperty('--my', `${y}%`);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="home-root" ref={gridRef}>
      {/* Animated grid background */}
      <div className="home-grid" />
      <div className="home-glow" />

      <div className="home-content">
        {/* Badge */}
        <div className="home-badge">
          <span className="badge-dot" />
          <span>Automação Super TM</span>
        </div>

        {/* Title */}
        <h1 className="home-title">
          <span className="title-line">Super</span>
          <span className="title-line accent">TM</span>
        </h1>

        {/* Subtitle */}
        <p className="home-subtitle">
          Controle total.
          <br />
          Monitoramento em tempo real, de qualquer lugar.
        </p>

        {/* Stats */}
        <div className="home-stats">
          <div className="stat-item">
            <span className="stat-value">99.9%</span>
            <span className="stat-label">Uptime</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <span className="stat-value">&lt; 50ms</span>
            <span className="stat-label">Latência</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <span className="stat-value">24/7</span>
            <span className="stat-label">Monitoramento</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="home-actions">
          {checking ? null : authenticated ? (
            <button className="btn-signin" onClick={() => navigate('/status')}>
              <span className="btn-text">Dashboard</span>
              <span className="btn-arrow">→</span>
            </button>
          ) : (
            <>
              <button className="btn-signin" onClick={() => navigate('/login')}>
                <span className="btn-text">Entrar</span>
                <span className="btn-arrow">→</span>
              </button>

              <button className="btn-signup">
                <span className="btn-text">Criar conta</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Decorative terminal card */}
      <div className="home-terminal">
        <div className="terminal-bar">
          <span className="dot red" />
          <span className="dot yellow" />
          <span className="dot green" />
          <span className="terminal-title">bot.log</span>
        </div>
        <div className="terminal-body">
          <p>
            <span className="log-time">[00:01]</span> <span className="log-ok">✓</span> Conexão
            estabelecida
          </p>
          <p>
            <span className="log-time">[00:02]</span> <span className="log-ok">✓</span> Bot iniciado
          </p>
          <p>
            <span className="log-time">[00:03]</span> <span className="log-info">→</span> Hunt
            ativado
          </p>
          <p>
            <span className="log-time">[00:04]</span> <span className="log-info">→</span> Heal
            monitorando HP
          </p>
          <p className="log-blink">
            <span className="log-time">[00:05]</span> <span className="log-ok">●</span>{' '}
            Aguardando...
          </p>
        </div>
      </div>
    </div>
  );
};
