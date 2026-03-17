import { useCallback, useEffect, useRef, useState } from 'react';
import type { BotStatus, LogEntry, WsMessage } from '../types/bot.types';

export const useWebSocket = () => {
  const [status, setStatus] = useState<BotStatus | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const ws = new WebSocket(`${import.meta.env.VITE_WS_URL}?token=${token}&client=web`);

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

  const sendAction = useCallback((category: string, action: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ category, action }));
    }
  }, []);

  return { status, logs, sendAction };
};
