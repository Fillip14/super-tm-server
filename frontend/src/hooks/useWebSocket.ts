import { useEffect, useState } from 'react';

interface LogEntry {
  message: string;
  level: string;
  timestamp: string;
}

interface BotStatus {
  hp: number | null;
  mp: number | null;
  screenshot: boolean;
  hunt: boolean;
  heal: boolean;
  pos_char: string | null;
  lvl_map: number | null;
  last_update: string | null;
}

interface WsMessage {
  type: 'status' | 'log' | 'init';
  data: any;
}

export function useWebSocket() {
  const [status, setStatus] = useState<BotStatus | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);

  useEffect(() => {
    const ws = new WebSocket(import.meta.env.VITE_WS_URL || 'ws://localhost:4000');

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
