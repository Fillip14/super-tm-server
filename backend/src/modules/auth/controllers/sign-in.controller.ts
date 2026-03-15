import { HttpStatus } from '../../../constants/api.constants';
import { signService } from '../services/sign-in.service';
import express, { Request, Response } from 'express';
import logger from '../../../utils/log/logger';
import { asyncHandler } from '../../../utils/asyncHandler';

export const loginController = asyncHandler(async (req: Request, res: Response) => {
  const userData = res.locals.validated;
  const isDesktop = req.headers['client-type'] === 'desktop';
  const isWeb = req.headers['client-type'] === 'web';

  const { authToken, product } = await signService(userData);

  logger.info('Login realizado com sucesso.');
  res.status(HttpStatus.OK).json({
    message: 'Login realizado com sucesso.',
    token: authToken,
    user_plan: product,
  });
});
