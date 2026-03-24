import express, { Request, Response } from 'express';
import { HttpStatus } from '../../../constants/api.constants';
import logger from '../../../utils/log/logger';

export const logoutController = (req: Request, res: Response) => {
  const clientType = (req.headers['client-type'] as string) ?? '';

  logger.info(`Sessão ${clientType} encerrada com sucesso.`);
  res.status(HttpStatus.OK).json({ message: `Sessão ${clientType} encerrada com sucesso.` });
};
