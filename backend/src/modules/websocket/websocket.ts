import { WebSocketServer, WebSocket } from 'ws';
import { Server } from 'http';
import { IncomingMessage } from 'http';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { parse as parseCookie } from 'cookie';
import logger from '../../utils/log/logger';

export let wss: WebSocketServer;

const botSockets = new Map<string, WebSocket>();
const clientSockets = new Map<string, WebSocket>();

function verifyToken(token: string): string | null {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
    return decoded.user_id ?? null;
  } catch {
    return null;
  }
}

function getUserIdFromRequest(req: IncomingMessage): { userId: string | null; isDesktop: boolean } {
  // Bot: manda Authorization: Bearer <token>]
  const authHeader = req.headers['authorization'];
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    const userId = verifyToken(token);
    if (userId) return { userId, isDesktop: true };
  }

  // // Browser: manda cookie auth=<token>
  const cookieHeader = req.headers['cookie'];
  if (cookieHeader) {
    const cookies = parseCookie(cookieHeader);
    if (cookies.auth) {
      const userId = verifyToken(cookies.auth);
      if (userId) return { userId, isDesktop: false };
    }
  }
  return { userId: null, isDesktop: false };
}

export function initWebSocket(server: Server): void {
  wss = new WebSocketServer({ server });

  wss.on('connection', (ws: WebSocket, req: IncomingMessage) => {
    const { userId, isDesktop } = getUserIdFromRequest(req);

    if (!userId) {
      logger.warn('WebSocket recusado: token inválido ou ausente');
      ws.close(1008, 'Unauthorized');
      return;
    }

    if (isDesktop) {
      botSockets.set(userId, ws);
      logger.info(`Desktop app conectado: user_id=${userId}`);

      ws.on('message', (raw) => {
        try {
          const { type, data } = JSON.parse(raw.toString());
          if (type === 'status') {
            sendToClient(userId, { type: 'status', data });
          }
        } catch {}
      });

      ws.on('close', () => {
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
        clientSockets.delete(userId);
        logger.info(`Web app desconectado: user_id=${userId}`);
      });
    }
  });
}

// manda pro browser do user_id específico
export function sendToClient(userId: string, data: object): void {
  const client = clientSockets.get(userId);
  if (client?.readyState === WebSocket.OPEN) {
    client.send(JSON.stringify(data));
  }
}

// manda pro desktop do user_id específico
export function sendToDesktop(userId: string, data: object): void {
  const bot = botSockets.get(userId);
  if (bot?.readyState === WebSocket.OPEN) {
    bot.send(JSON.stringify(data));
  }
}
