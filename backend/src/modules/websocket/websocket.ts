import { WebSocketServer, WebSocket } from 'ws';
import { Server } from 'http';
import { IncomingMessage } from 'http';
import { findUserService } from '../users/services/user.service';
import { Column } from '../../constants/database.constants';
import jwt, { JwtPayload } from 'jsonwebtoken';
import logger from '../../utils/log/logger';

export let wss: WebSocketServer;

const botSockets = new Map<string, WebSocket>();
const clientSockets = new Map<string, WebSocket>();

const getUserIdFromRequest = (
  req: IncomingMessage,
): { userId: string | null; isDesktop: boolean } => {
  const url = new URL(req.url!, `http://localhost`);
  const queryToken = url.searchParams.get('token');
  const clientType = url.searchParams.get('client');

  const authHeader = req.headers['authorization'];
  const headerToken = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  const token = queryToken ?? headerToken;
  const isDesktop = clientType === 'desktop' || headerToken !== null;

  if (!token) return { userId: null, isDesktop: false };

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
    if (decoded.user_id) return { userId: decoded.user_id, isDesktop };
  } catch {}

  return { userId: null, isDesktop: false };
};

export const initWebSocket = (server: Server): void => {
  wss = new WebSocketServer({ server });

  wss.on('connection', (ws: WebSocket, req: IncomingMessage) => {
    const { userId, isDesktop } = getUserIdFromRequest(req);

    if (!userId) {
      logger.warn('WebSocket recusado: token inválido ou ausente');
      ws.close(1008, 'Unauthorized');
      return;
    }

    const activeCheck = setInterval(
      async () => {
        const user = await findUserService(Column.UUID, userId);
        if (!user.active) {
          ws.close(1008, 'Unauthorized');
        }
      },
      15 * 60 * 1000,
    );

    if (isDesktop) {
      botSockets.set(userId, ws);
      logger.info(`Desktop app conectado: user_id=${userId}`);

      ws.on('message', (raw) => {
        try {
          const { type, data } = JSON.parse(raw.toString());
          sendToClient(userId, { type, data });
        } catch {}
      });

      ws.on('close', () => {
        clearInterval(activeCheck);
        botSockets.delete(userId);
        logger.info(`Desktop app desconectado: user_id=${userId}`);
      });
    } else {
      clientSockets.set(userId, ws);
      logger.info(`Web app conectado: user_id=${userId}`);

      ws.on('message', (raw) => {
        try {
          const { category, action } = JSON.parse(raw.toString());
          sendToDesktop(userId, { type: 'action', category, action });
        } catch {}
      });

      ws.on('close', () => {
        clearInterval(activeCheck);
        clientSockets.delete(userId);
        logger.info(`Web app desconectado: user_id=${userId}`);
      });
    }
  });
};

// manda pro browser do user_id específico
function sendToClient(userId: string, data: object): void {
  const client = clientSockets.get(userId);
  if (client?.readyState === WebSocket.OPEN) {
    client.send(JSON.stringify(data));
  }
}

// manda pro desktop do user_id específico
function sendToDesktop(userId: string, data: object): void {
  const bot = botSockets.get(userId);
  if (bot?.readyState === WebSocket.OPEN) {
    bot.send(JSON.stringify(data));
  }
}
