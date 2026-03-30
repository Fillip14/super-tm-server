import { WebSocketServer, WebSocket } from 'ws';
import { Server } from 'http';
import { IncomingMessage } from 'http';
import { patchUserService } from '../users/services/user.service';
import { Column } from '../../constants/database.constants';
import { validateUser } from '../../utils/validateUser';
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
    if (decoded.userId) return { userId: decoded.userId, isDesktop };
  } catch (err) {
    logger.error('Erro no token no websocket', err);
  }

  return { userId: null, isDesktop: false };
};

export const initWebSocket = (server: Server): void => {
  wss = new WebSocketServer({ server });

  wss.on('connection', async (ws: WebSocket, req: IncomingMessage) => {
    const { userId, isDesktop } = getUserIdFromRequest(req);

    if (!userId) {
      logger.warn('WebSocket recusado: token inválido ou ausente');
      ws.close();
      return;
    }

    if (isDesktop) {
      if (botSockets.has(userId)) {
        try {
          await validateUser(userId, 'desktop', true);
        } catch {
          ws.send(JSON.stringify({ error: 'duplicate_login' }));
          ws.close();
          return;
        }
      }

      const planCheck = setInterval(
        async () => {
          try {
            await validateUser(userId, 'desktop', false);
          } catch {
            sendToDesktop(userId, { error: 'plan_expired' });
          }
        },
        15 * 60 * 1000,
      );

      botSockets.set(userId, ws);

      (ws as any).isAlive = true;

      const connectionCheck = setInterval(async () => {
        if ((ws as any).isAlive === false) {
          logger.info(`Conexão perdida detectada: userId=${userId}`);
          ws.terminate();
          return;
        }

        (ws as any).isAlive = false;
        ws.ping();
      }, 30 * 1000);

      try {
        await patchUserService(Column.ONLINE, true, userId);
      } catch (err) {
        logger.error('Erro ao atualizar status online', err);
      }
      logger.info(`Desktop app conectado: userId=${userId}`);

      ws.on('pong', () => {
        (ws as any).isAlive = true;
      });

      ws.on('message', (raw) => {
        try {
          const { type, data } = JSON.parse(raw.toString());
          sendToClient(userId, { type, data });
        } catch (err) {
          logger.error('Erro processando mensagem websocket do desktop', err);
        }
      });

      ws.on('close', async () => {
        clearInterval(planCheck);
        clearInterval(connectionCheck);
        botSockets.delete(userId);
        try {
          await patchUserService(Column.ONLINE, false, userId);
        } catch (err) {
          logger.error('Erro ao atualizar status online', err);
        }
        logger.info(`Desktop app desconectado: userId=${userId}`);
      });
    } else {
      clientSockets.set(userId, ws);
      logger.info(`Web app conectado: userId=${userId}`);

      ws.on('message', (raw) => {
        try {
          const { category, action } = JSON.parse(raw.toString());
          sendToDesktop(userId, { type: 'action', category, action });
        } catch (err) {
          logger.error('Erro processando mensagem websocket do web', err);
        }
      });

      ws.on('close', () => {
        clientSockets.delete(userId);
        logger.info(`Web app desconectado: userId=${userId}`);
      });
    }
  });
};

// manda pro browser do userId específico
function sendToClient(userId: string, data: object): void {
  const client = clientSockets.get(userId);
  if (client?.readyState === WebSocket.OPEN) {
    try {
      client.send(JSON.stringify(data));
    } catch (err) {
      logger.error('Erro ao enviar mensagem para o web', err);
    }
  }
}

// manda pro desktop do userId específico
function sendToDesktop(userId: string, data: object): void {
  const bot = botSockets.get(userId);
  if (bot?.readyState === WebSocket.OPEN) {
    try {
      bot.send(JSON.stringify(data));
    } catch (err) {
      logger.error('Erro ao enviar mensagem para o desktop', err);
    }
  }
}
