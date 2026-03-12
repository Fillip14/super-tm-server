import { useEffect, useState } from 'react';
import type { BotStatus, LogEntry, WsMessage } from '../types/bot.types';

export function useWebSocket() {
  const [status, setStatus] = useState<BotStatus | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);

  useEffect(() => {
    const ws = new WebSocket(import.meta.env.NEXT_PUBLIC_RAILWAY_WS_URL);

    ws.onmessage = (event) => {
      const msg: WsMessage = JSON.parse(event.data);

      if (msg.type === 'status') {
        setStatus(msg.data);
      } else if (msg.type === 'log') {
        setLogs((prev) => [msg.data, ...prev].slice(0, 100));
      }
    };

    ws.onclose = () => console.log('WebSocket desconectado');
    ws.onerror = (e) => console.error('WebSocket erro:', e);

    return () => ws.close();
  }, []);

  return { status, logs };
}
