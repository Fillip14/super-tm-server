import { useEffect, useState } from 'react';
import type { BotStatus, LogEntry, WsMessage } from '../types/bot.types';

export function useWebSocket() {
  const [status, setStatus] = useState<BotStatus | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);

  useEffect(() => {
    const wsUrl = import.meta.env.RAILWAY_WS_URL || 'ws://localhost:4000';
    const ws = new WebSocket(wsUrl);

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
