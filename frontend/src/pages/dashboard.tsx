import { useWebSocket } from '../hooks/useWebSocket';

export default function Dashboard() {
  const { status, logs } = useWebSocket();

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
