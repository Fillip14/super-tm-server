import { HttpStatus } from '../../../constants/api.constants';
import express, { Request, Response } from 'express';
import logger from '../../../utils/log/logger';
import { asyncHandler } from '../../../utils/asyncHandler';
import { validateSessionService } from '../services/validate-session.service';

export const validateSessionController = asyncHandler(async (req: Request, res: Response) => {
  const { userId, userType } = res.locals.user;
  const clienType = (req.headers['client-type'] as string) ?? '';

  const product = await validateSessionService(userId, clienType);

  logger.info('Sessão verificada com sucesso.');
  res.status(HttpStatus.OK).json({ message: 'Sessão verificada com sucesso.', userPlan: product });
});
