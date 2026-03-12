import logger from './utils/log/logger';
import { app } from './server';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { initWebSocket } from './websocket/websocket';

dotenv.config();

const PORT = process.env.PORT || 4000;

const server = createServer(app);

initWebSocket(server);

server.listen(PORT, () => {
  logger.info(`Servidor rodando na porta ${PORT}`);
});
