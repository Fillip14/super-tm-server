import express, { Request, Response } from 'express';
import { HttpStatus } from '../../../constants/api.constants';
import logger from '../../../utils/log/logger';

export const logoutController = (req: Request, res: Response) => {
  const isDesktop = req.headers['client-type'] === 'desktop';
  const isWeb = req.headers['client-type'] === 'web';

  logger.info(`Sessão ${isWeb ? 'web' : 'desktop'} encerrada com sucesso.`);
  res
    .status(HttpStatus.OK)
    .json({ message: `Sessão ${isWeb ? 'web' : 'desktop'} encerrada com sucesso.` });
};
