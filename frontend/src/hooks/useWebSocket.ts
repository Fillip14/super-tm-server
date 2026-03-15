import { useEffect, useRef, useState } from 'react';
import type { BotStatus, LogEntry, WsMessage } from '../types/bot.types';

export function useWebSocket() {
  const [status, setStatus] = useState<BotStatus | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(import.meta.env.VITE_WS_URL);
    // const ws = new WebSocket('ws://localhost:4000');
    wsRef.current = ws;

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

  function sendAction(category: string, action: string) {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ category, action }));
    }
  }

  return { status, logs, sendAction };
}
