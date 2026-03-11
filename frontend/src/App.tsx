import { useWebSocket } from './hooks/useWebSocket';

export default function App() {
  const { status, logs } = useWebSocket();

  return (
    <div style={{ padding: 20, fontFamily: 'monospace' }}>
      <h2>Status do Bot</h2>
      {status ? (
        <div>
          <p>HP: {status.hp}%</p>
          <p>MP: {status.mp}%</p>
          <p>Hunt: {status.hunt ? 'ativo' : 'parado'}</p>
          <p>Heal: {status.heal ? 'ativo' : 'parado'}</p>
          <p>Screenshot: {status.screenshot ? 'ativo' : 'parado'}</p>
          <p>Posição do char: {status.pos_char}</p>
          <p>Andar: {status.lvl_map}</p>
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
