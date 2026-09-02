import logger from './utils/log/logger';
import { app } from './server';
import { createServer } from 'http';
import { initWebSocket } from './modules/websocket/websocket';
import { resetAllOnlineService } from './modules/users/services/user.service';

const PORT = 4000;
const server = createServer(app);

const start = async () => {
  try {
    await resetAllOnlineService();
    logger.info('Status online resetado no boot');
  } catch (err) {
    logger.error('Erro ao resetar status online no boot', err);
  }

  initWebSocket(server);

  server.listen(PORT, () => {
    logger.info(`Servidor rodando na porta ${PORT}`);
  });
};

start();
