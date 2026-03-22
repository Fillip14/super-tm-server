import type { LogEntry } from '../../../types/bot.types';

export const Logs = ({ logs }: { logs: LogEntry[] }) => {
  return (
    <div>
      <h2>Logs</h2>
      <div style={{ background: '#111', color: '#0f0', height: 300, overflowY: 'auto' }}>
        {logs.map((log, i) => (
          <div key={i}>{log.message}</div>
        ))}
      </div>
    </div>
  );
};
