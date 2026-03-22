import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useWebSocket } from '../../hooks/useWebSocket';
import './status.css';

const OnOff = ({ on }: { on: boolean }) => (
  <span className={`program-badge ${on ? 'on' : 'off'}`}>
    <span className={`badge-dot-sm${on ? ' pulse' : ''}`} />
    {on ? 'Ativo' : 'Parado'}
  </span>
);

const BarPct = ({ value, type }: { value: number | null; type: 'hp' | 'mp' }) => {
  const pct = value ?? 0;
  const colorClass = type === 'hp' ? (pct > 40 ? 'hp ok' : 'hp') : 'mp';
  return (
    <div className="bar-wrap">
      <div className={`bar-fill ${colorClass}`} style={{ width: `${pct}%` }} />
    </div>
  );
};

export const Status = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { status, logs, sendAction } = useWebSocket();
  const [logsOpen, setLogsOpen] = useState(false);

  const botConnected = status !== null;

  return (
    <div className="status-root">
      <div className="status-bg" />

      {/* Topbar */}
      <header className="status-topbar">
        <span className="status-logo" onClick={() => navigate('/dashboard')}>
          <span className="logo-main">Super</span>
          <span className="logo-accent">TM</span>
        </span>

        <div className="topbar-right">
          <span className={`topbar-status-dot ${botConnected ? 'connected' : 'disconnected'}`} />
          <span className="topbar-status-label">
            {botConnected ? 'Bot online' : 'Aguardando bot'}
          </span>
          <div className="topbar-divider" />
          <button className="btn-topbar" onClick={() => navigate('/dashboard')}>
            ← Painel
          </button>
          <button className="btn-topbar logout" onClick={logout}>
            Sair
          </button>
        </div>
      </header>

      <main className="status-content">
        {/* Header */}
        <div>
          <p className="section-eyebrow">Controle</p>
          <h1 className="section-title">Status do bot</h1>
        </div>

        {/* Stats overview */}
        <div className="status-overview">
          {/* Programa */}
          <div className={`stat-card${status?.pos_char ? ' active-glow' : ''}`}>
            <div className="stat-card-header">
              <span className="stat-card-label">Programa</span>
              <span className="stat-card-icon">⚙️</span>
            </div>
            <div>
              <OnOff on={status?.pos_char ?? false} />
            </div>
            <span className="stat-card-sub">Posição do char</span>
          </div>

          {/* Hunt */}
          <div className={`stat-card${status?.hunt ? ' active-glow' : ''}`}>
            <div className="stat-card-header">
              <span className="stat-card-label">Hunt</span>
              <span className="stat-card-icon">⚔️</span>
            </div>
            <div>
              <OnOff on={status?.hunt ?? false} />
            </div>
            <span className="stat-card-sub">Cavebot</span>
          </div>

          {/* Heal */}
          <div className={`stat-card${status?.heal ? ' active-glow' : ''}`}>
            <div className="stat-card-header">
              <span className="stat-card-label">Healler</span>
              <span className="stat-card-icon">💊</span>
            </div>
            <div>
              <OnOff on={status?.heal ?? false} />
            </div>
            <span className="stat-card-sub">Cura automática</span>
          </div>

          {/* HP */}
          <div className="stat-card">
            <div className="stat-card-header">
              <span className="stat-card-label">HP</span>
              <span className="stat-card-icon">❤️</span>
            </div>
            <div
              className={`stat-card-value${status?.hp != null ? (status.hp > 40 ? ' success' : ' accent') : ' muted'}`}
            >
              {status?.hp != null ? `${status.hp}%` : '—'}
            </div>
            <BarPct value={status?.hp ?? null} type="hp" />
          </div>

          {/* MP */}
          <div className="stat-card">
            <div className="stat-card-header">
              <span className="stat-card-label">MP</span>
              <span className="stat-card-icon">💙</span>
            </div>
            <div className={`stat-card-value${status?.mp != null ? ' accent' : ' muted'}`}>
              {status?.mp != null ? `${status.mp}%` : '—'}
            </div>
            <BarPct value={status?.mp ?? null} type="mp" />
          </div>

          {/* CAP */}
          <div className="stat-card">
            <div className="stat-card-header">
              <span className="stat-card-label">CAP</span>
              <span className="stat-card-icon">🎒</span>
            </div>
            <div className={`stat-card-value${status?.cap != null ? ' accent' : ' muted'}`}>
              {status?.cap ?? '—'}
            </div>
            <span className="stat-card-sub">Capacidade</span>
          </div>

          {/* Mana pots */}
          <div className="stat-card">
            <div className="stat-card-header">
              <span className="stat-card-label">MP Pots</span>
              <span className="stat-card-icon">🧪</span>
            </div>
            <div className={`stat-card-value${status?.amount_MP != null ? ' accent' : ' muted'}`}>
              {status?.amount_MP ?? '—'}
            </div>
            <span className="stat-card-sub">Poções de mana</span>
          </div>
        </div>

        {/* Controls */}
        {botConnected ? (
          <div className="controls-section">
            <div className="controls-header">
              <span className="controls-header-title">Ações</span>
            </div>
            <div className="controls-body">
              {/* Programa */}
              <div className="control-group">
                <div className="control-group-label">
                  <span className="control-group-name">Programa</span>
                  <span className="control-group-desc">Captura de tela e posição do char</span>
                </div>
                <div className="control-btn-group">
                  <button
                    className="btn-control start"
                    onClick={() => sendAction('program', 'start')}
                  >
                    ▶ Iniciar
                  </button>
                  <button
                    className="btn-control stop"
                    onClick={() => sendAction('program', 'stop')}
                  >
                    ■ Parar
                  </button>
                </div>
              </div>

              <div className="control-divider" />

              {/* Hunt */}
              <div className="control-group">
                <div className="control-group-label">
                  <span className="control-group-name">Hunt</span>
                  <span className="control-group-desc">Cavebot com waypoints configurados</span>
                </div>
                <div className="control-btn-group">
                  <button className="btn-control start" onClick={() => sendAction('hunt', 'start')}>
                    ▶ Iniciar
                  </button>
                  <button className="btn-control stop" onClick={() => sendAction('hunt', 'stop')}>
                    ■ Parar
                  </button>
                </div>
              </div>

              <div className="control-divider" />

              {/* Heal */}
              <div className="control-group">
                <div className="control-group-label">
                  <span className="control-group-name">Healler</span>
                  <span className="control-group-desc">Cura automática de HP e MP</span>
                </div>
                <div className="control-btn-group">
                  <button className="btn-control start" onClick={() => sendAction('heal', 'start')}>
                    ▶ Iniciar
                  </button>
                  <button className="btn-control stop" onClick={() => sendAction('heal', 'stop')}>
                    ■ Parar
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="waiting-state">
            <span className="waiting-icon">📡</span>
            <h3 className="waiting-title">Aguardando conexão do bot</h3>
            <p className="waiting-desc">Inicie o desktop app para habilitar os controles</p>
          </div>
        )}

        {/* Logs — collapsible */}
        <div className="logs-section">
          <div className="logs-header" onClick={() => setLogsOpen((v) => !v)}>
            <div className="logs-header-left">
              <span className="logs-header-title">Logs</span>
              {logs.length > 0 && <span className="logs-count">{logs.length}</span>}
            </div>
            <span className={`logs-chevron${logsOpen ? ' open' : ''}`}>▼</span>
          </div>

          <div className={`logs-body${logsOpen ? ' open' : ''}`}>
            <div className="logs-inner">
              {logs.length === 0 ? (
                <span className="logs-empty">Nenhum log registrado</span>
              ) : (
                logs.map((log, i) => (
                  <div key={i} className="log-entry">
                    <span className="log-index">{logs.length - i}</span>
                    <span className="log-msg">{log.message}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
