import { useWebSocket } from '../hooks/useWebSocket';
// import { useActions } from '../hooks/useActions';

export default function Dashboard() {
  const { status, logs, sendAction } = useWebSocket();
  // const { sendAction } = useActions();

  return (
    <div style={{ padding: 20, fontFamily: 'monospace' }}>
      <h2>Status do Bot</h2>
      {status ? (
        <div>
          <p>Programa: {status.pos_char ? 'Ativo' : 'Parado'}</p>
          <p>Heal: {status.heal ? 'Ativo' : 'Parado'}</p>
          <p>Hunt: {status.hunt ? 'Ativo' : 'Parado'}</p>
          <p>HP: {status.hp}%</p>
          <p>MP: {status.mp}%</p>
          {status.screenshot && (
            <div>
              <p>Minimap:</p>
              <img
                src={`data:image/jpeg;base64,${status.screenshot}`}
                alt="minimap"
                style={{ imageRendering: 'pixelated', border: '1px solid #0f0' }}
              />
            </div>
          )}
        </div>
      ) : (
        <p>Aguardando bot...</p>
      )}

      <h2>Ações</h2>
      <div style={{ display: 'flex', gap: 10 }}>
        <button onClick={() => sendAction('program', 'start')}>Iniciar Programa</button>
        <button onClick={() => sendAction('program', 'stop')}>Parar Programa</button>
        <button onClick={() => sendAction('hunt', 'start')}>Start Hunt</button>
        <button onClick={() => sendAction('hunt', 'stop')}>Stop Hunt</button>
        <button onClick={() => sendAction('heal', 'start')}>Iniciar Heal</button>
        <button onClick={() => sendAction('heal', 'stop')}>Parar Heal</button>
      </div>

      <h2>Logs</h2>
      <div
        style={{ background: '#111', color: '#0f0', padding: 10, height: 300, overflowY: 'auto' }}
      >
        {logs.map((log, i) => (
          <div key={i}>
            [{log.timestamp}] [{log.level}] {log.message}
          </div>
        ))}
      </div>
    </div>
  );
}
