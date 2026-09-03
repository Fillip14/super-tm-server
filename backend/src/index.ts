import logger from './utils/log/logger';
import { app } from './server';
import { createServer } from 'http';
import { initWebSocket } from './modules/websocket/websocket';

const PORT = 4000;
const server = createServer(app);

initWebSocket(server);

server.listen(PORT, () => {
  logger.info(`Servidor rodando na porta ${PORT}`);
});
