import { HttpStatus } from '../../../constants/api.constants';
import express, { Request, Response } from 'express';
import logger from '../../../utils/log/logger';
import { asyncHandler } from '../../../utils/asyncHandler';
import { verifySessionService } from '../services/verify-session.service';

export const verifySessionController = asyncHandler(async (req: Request, res: Response) => {
  const { user_id, type } = res.locals.user;
  const { active, product } = await verifySessionService(user_id, type);

  if (active) {
    logger.info('Sessão verificada com sucesso.');
    res
      .status(HttpStatus.OK)
      .json({ message: 'Sessão verificada com sucesso.', user_plan: product });
  } else {
    logger.info('Sessão inválida.');
    res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Sessão inválida.' });
  }
});
