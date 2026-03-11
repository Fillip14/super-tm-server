import logger from './utils/log/logger';
import { app } from './server';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';

dotenv.config();

const PORT = process.env.PORT || 4000;

// Cria o servidor HTTP em cima do app Express
const server = createServer(app);

// Cria o WebSocket em cima do servidor HTTP
export const wss = new WebSocketServer({ server });

wss.on('connection', (ws: WebSocket) => {
  logger.info('Browser conectado via WebSocket');
  ws.on('close', () => logger.info('Browser desconectado'));
});

// Exporta o broadcast pra usar nos controllers
export function broadcast(data: object): void {
  const message = JSON.stringify(data);
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

// Usa server.listen em vez de app.listen
server.listen(PORT, () => {
  logger.info(`Servidor rodando na porta ${PORT}`);
});
