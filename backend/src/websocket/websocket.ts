import { WebSocketServer, WebSocket } from 'ws';
import { Server } from 'http';
import logger from '../utils/log/logger';

export let wss: WebSocketServer;

let botSocket: WebSocket | null = null;

export function initWebSocket(server: Server, botSecret: string): void {
  wss = new WebSocketServer({ server });

  wss.on('connection', (ws: WebSocket, req) => {
    const secret = req.headers['x-bot-secret'];

    if (secret === botSecret) {
      botSocket = ws;
      logger.info('Bot conectado via WebSocket');

      ws.on('message', (raw) => {
        try {
          const { type, data } = JSON.parse(raw.toString());
          if (type === 'status') {
            broadcastFrontend({ type: 'status', data });
          }
        } catch {}
      });

      ws.on('close', () => {
        botSocket = null;
        logger.info('Bot desconectado');
      });
    } else {
      logger.info('Frontend conectado via WebSocket');
      ws.on('message', (raw) => {
        try {
          const { category, action } = JSON.parse(raw.toString());
          sendBot({ type: 'action', category, action });
        } catch {}
      });
      ws.on('close', () => logger.info('Frontend desconectado'));
    }
  });
}

// manda só para frontends
export function broadcastFrontend(data: object): void {
  const message = JSON.stringify(data);
  wss.clients.forEach((client) => {
    if (client !== botSocket && client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

// manda só para o bot
export function sendBot(data: object): void {
  if (botSocket?.readyState === WebSocket.OPEN) {
    botSocket.send(JSON.stringify(data));
  }
}
