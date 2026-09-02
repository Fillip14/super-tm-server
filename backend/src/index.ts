import { env } from './config/env';
import logger from './utils/log/logger';
import { app } from './server';
import { createServer } from 'http';
import { initWebSocket } from './modules/websocket/websocket';
import { resetAllOnlineService } from './modules/users/services/user.service';

const server = createServer(app);

server.on('error', (err: NodeJS.ErrnoException) => {
  if (err.code === 'EADDRINUSE') {
    logger.error(`Porta ${env.PORT} já está em uso. Encerre o outro processo e tente de novo.`);
  } else {
    logger.error('Erro ao iniciar o servidor', err);
  }
  process.exit(1);
});

const start = async () => {
  try {
    await resetAllOnlineService();
    logger.info('Status online resetado no boot');
  } catch (err) {
    logger.error('Erro ao resetar status online no boot', err);
  }

  initWebSocket(server);

  server.listen(env.PORT, () => {
    logger.info(`Servidor rodando na porta ${env.PORT}`);
  });
};

start();
