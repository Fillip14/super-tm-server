import { WebSocketServer, WebSocket } from 'ws';
import { Server } from 'http';
import logger from '../utils/log/logger';

export let wss: WebSocketServer;

export function initWebSocket(server: Server): void {
  wss = new WebSocketServer({ server });

  wss.on('connection', (ws: WebSocket) => {
    logger.info('Browser conectado via WebSocket');
    ws.on('close', () => logger.info('Browser desconectado'));
  });
}

export function broadcast(data: object): void {
  const message = JSON.stringify(data);
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}
