import { WebSocketServer, WebSocket } from 'ws';
import { Server } from 'http';
import { IncomingMessage } from 'http';
import { patchUserService } from '../users/services/user.service';
import { Column } from '../../constants/database.constants';
import { validateUser } from '../../utils/validateUser';
import { AppError } from '../../errors/AppError';
import { HttpStatus } from '../../constants/api.constants';
import { env } from '../../config/env';
import jwt, { JwtPayload } from 'jsonwebtoken';
import logger from '../../utils/log/logger';

export let wss: WebSocketServer;

interface TrackedSocket extends WebSocket {
  isAlive?: boolean;
}

const botSockets = new Map<string, WebSocket>();
const clientSockets = new Map<string, WebSocket>();
// userIds com uma conexão desktop em processo de validação (fecha a janela de corrida
// entre ler botSockets e gravar botSockets, que dura um round-trip de banco)
const pendingDesktop = new Set<string>();
const PING_INTERVAL = 10 * 1000;
const PLAN_CHECK_INTERVAL = 60 * 60 * 1000;

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
    const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    if (decoded.userId) return { userId: decoded.userId, isDesktop };
  } catch (err) {
    logger.error('Erro no token no websocket', err);
  }

  return { userId: null, isDesktop: false };
};

const startHeartbeat = (ws: TrackedSocket, label: string, userId: string) => {
  ws.isAlive = true;
  ws.on('pong', () => (ws.isAlive = true));

  const interval = setInterval(() => {
    // Socket já fechado nunca vai emitir 'close' de novo: o interval precisa se encerrar
    // sozinho, senão fica rodando para sempre em cima de um socket morto.
    if (ws.readyState === WebSocket.CLOSED) {
      clearInterval(interval);
      return;
    }

    if (ws.isAlive === false) {
      logger.info(`Conexão ${label} perdida detectada: userId=${userId}`);
      clearInterval(interval);
      ws.terminate();
      return;
    }

    ws.isAlive = false;
    ws.ping();
  }, PING_INTERVAL);

  return interval;
};

// Remove do mapa um socket desktop que já não está mais aberto. O mapa é a fonte de
// verdade de "está logado"; se ficar com socket morto, toda reconexão vira duplicate_login.
const dropDeadDesktopSocket = (userId: string): void => {
  const current = botSockets.get(userId);
  if (!current || current.readyState === WebSocket.OPEN) return;

  logger.info(`Socket desktop morto removido do mapa: userId=${userId}`);
  botSockets.delete(userId);
  current.terminate();
};

const setDesktopOffline = async (userId: string): Promise<void> => {
  try {
    await patchUserService({ [Column.ONLINE]: false }, userId);
  } catch (err) {
    logger.error('Erro ao atualizar status online', err);
  }
};

const handleDesktop = async (ws: WebSocket, userId: string): Promise<void> => {
  // Precisa existir antes de qualquer await: sem listener de 'error' o ws lança no EventEmitter.
  ws.on('error', (err) => logger.error(`Erro no websocket do desktop: userId=${userId}`, err));

  dropDeadDesktopSocket(userId);

  const alreadyConnected = botSockets.get(userId)?.readyState === WebSocket.OPEN;

  if (alreadyConnected || pendingDesktop.has(userId)) {
    ws.send(JSON.stringify({ error: 'duplicate_login' }));
    logger.warn(`Conexão desktop recusada, já logado: userId=${userId}`);
    ws.close();
    return;
  }

  pendingDesktop.add(userId);

  try {
    await validateUser(userId, 'desktop', false);
  } catch (err) {
    pendingDesktop.delete(userId);
    const status = err instanceof AppError ? err.statusCode : null;

    if (status === HttpStatus.UNAUTHORIZED) {
      ws.send(JSON.stringify({ error: 'plan_expired' }));
      logger.warn(`Conexão desktop recusada, plano expirado: userId=${userId}`);
    } else {
      logger.error(`Erro validando conexão desktop: userId=${userId}`, err);
    }

    ws.close();
    return;
  }

  pendingDesktop.delete(userId);

  // O socket pode ter morrido durante a validação. Se registrar agora, o 'close' já passou
  // e o mapa fica com socket morto + online=true preso no banco para sempre.
  if (ws.readyState !== WebSocket.OPEN) {
    logger.warn(`Socket desktop fechou durante a validação: userId=${userId}`);
    await setDesktopOffline(userId);
    return;
  }

  const planCheck = setInterval(async () => {
    try {
      await validateUser(userId, 'desktop', false);
    } catch (err) {
      if (err instanceof AppError && err.statusCode === HttpStatus.UNAUTHORIZED) {
        sendToDesktop(userId, { error: 'plan_expired' });
      } else {
        logger.error(`Erro no planCheck: userId=${userId}`, err);
      }
    }
  }, PLAN_CHECK_INTERVAL);

  botSockets.set(userId, ws);

  const connectionCheck = startHeartbeat(ws, 'desktop', userId);

  // Listeners registrados antes do próximo await: um 'close' que chegue durante o patch
  // precisa ser tratado, senão o socket fica órfão no mapa.
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

    if (botSockets.get(userId) !== ws) {
      logger.info(`Socket antigo encerrado, conexão nova ativa: userId=${userId}`);
      return;
    }

    botSockets.delete(userId);
    await setDesktopOffline(userId);
    logger.info(`Desktop app desconectado: userId=${userId}`);
  });

  try {
    await patchUserService({ [Column.ONLINE]: true }, userId);
  } catch (err) {
    logger.error('Erro ao atualizar status online', err);
  }

  // Se fechou durante o patch, o 'close' já rodou e limpou; não deixar online=true preso.
  if (ws.readyState !== WebSocket.OPEN) {
    logger.warn(`Socket desktop fechou logo após conectar: userId=${userId}`);
    await setDesktopOffline(userId);
    return;
  }

  logger.info(`Desktop app conectado: userId=${userId}`);
};

const handleWeb = (ws: WebSocket, userId: string): void => {
  const existing = clientSockets.get(userId);
  if (existing && existing !== ws) {
    logger.info(`Fechando conexão web antiga: userId=${userId}`);
    existing.terminate();
  }

  clientSockets.set(userId, ws);
  logger.info(`Web app conectado: userId=${userId}`);

  const connectionCheck = startHeartbeat(ws, 'web', userId);

  ws.on('message', (raw) => {
    try {
      const { category, action } = JSON.parse(raw.toString());
      sendToDesktop(userId, { type: 'action', category, action });
    } catch (err) {
      logger.error('Erro processando mensagem websocket do web', err);
    }
  });

  ws.on('error', (err) => logger.error(`Erro no websocket do web: userId=${userId}`, err));

  ws.on('close', () => {
    clearInterval(connectionCheck);
    if (clientSockets.get(userId) === ws) clientSockets.delete(userId);
    logger.info(`Web app desconectado: userId=${userId}`);
  });
};

export const initWebSocket = (server: Server): void => {
  wss = new WebSocketServer({ server });

  wss.on('error', (err) => logger.error('Erro no WebSocketServer', err));

  wss.on('connection', async (ws: WebSocket, req: IncomingMessage) => {
    const { userId, isDesktop } = getUserIdFromRequest(req);

    if (!userId) {
      logger.warn('WebSocket recusado: token inválido ou ausente');
      ws.close();
      return;
    }

    if (isDesktop) {
      try {
        await handleDesktop(ws, userId);
      } catch (err) {
        pendingDesktop.delete(userId);
        logger.error(`Erro inesperado na conexão desktop: userId=${userId}`, err);
        ws.close();
      }
    } else {
      handleWeb(ws, userId);
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
