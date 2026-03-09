import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import { createServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import cors from 'cors';

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

const PORT = process.env.PORT || 3000;
const API_KEY = process.env.API_KEY || 'minha-chave-secreta';

// ─── Types ─────────────────────────────────────────────────────────────────────
interface BotState {
  hp: number | null;
  mp: number | null;
  hunt: boolean;
  heal: boolean;
  floor: number | null;
  relogin_attempts: number;
  last_update: string | null;
}

interface LogEntry {
  message: string;
  level: 'info' | 'warning' | 'critical';
  timestamp: string;
}

// ─── Middlewares ───────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ─── Autenticação simples por API Key ─────────────────────────────────────────
function auth(req: Request, res: Response, next: NextFunction): void {
  const key = req.headers['x-api-key'];
  if (key !== API_KEY) {
    res.status(401).json({ error: 'Não autorizado' });
    return;
  }
  next();
}

// ─── Estado atual do bot ───────────────────────────────────────────────────────
let botState: BotState = {
  hp: null,
  mp: null,
  hunt: false,
  heal: false,
  floor: null,
  relogin_attempts: 0,
  last_update: null,
};

const MAX_LOGS = 100;
let logs: LogEntry[] = [];

// ─── Broadcast para todos os browsers conectados ───────────────────────────────
function broadcast(data: object): void {
  const message = JSON.stringify(data);
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

// ─── Rotas HTTP ────────────────────────────────────────────────────────────────

// Status geral do bot (HP, MP, hunt, heal, andar)
app.post('/api/status', auth, (req: Request, res: Response) => {
  const { hp, mp, hunt, heal, floor, relogin_attempts } = req.body;

  botState = {
    ...botState,
    ...(hp !== undefined && { hp }),
    ...(mp !== undefined && { mp }),
    ...(hunt !== undefined && { hunt }),
    ...(heal !== undefined && { heal }),
    ...(floor !== undefined && { floor }),
    ...(relogin_attempts !== undefined && { relogin_attempts }),
    last_update: new Date().toISOString(),
  };

  broadcast({ type: 'status', data: botState });
  res.json({ ok: true });
});

// Log de eventos
app.post('/api/log', auth, (req: Request, res: Response) => {
  const { message, level } = req.body;

  const entry: LogEntry = {
    message,
    level: level ?? 'info',
    timestamp: new Date().toISOString(),
  };

  logs.unshift(entry);
  if (logs.length > MAX_LOGS) logs.pop();

  broadcast({ type: 'log', data: entry });
  res.json({ ok: true });
});

// Estado atual completo (o frontend busca ao abrir a página)
app.get('/api/state', (_req: Request, res: Response) => {
  res.json({ status: botState, logs });
});

// Health check pro Railway
app.get('/health', (_req: Request, res: Response) => {
  res.json({ ok: true });
});

// ─── WebSocket ─────────────────────────────────────────────────────────────────
wss.on('connection', (ws: WebSocket) => {
  console.log('Browser conectado');

  // Envia o estado atual imediatamente ao conectar
  ws.send(JSON.stringify({ type: 'init', data: { status: botState, logs } }));

  ws.on('close', () => console.log('Browser desconectado'));
});

// ─── Inicia o servidor ─────────────────────────────────────────────────────────
server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
