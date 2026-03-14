import { HttpStatus } from '../../../constants/api.constants';
import { signService } from '../services/sign-in.service';
import express, { Request, Response } from 'express';
import logger from '../../../utils/log/logger';
import { asyncHandler } from '../../../utils/asyncHandler';

export const loginController = asyncHandler(async (req: Request, res: Response) => {
  const userData = res.locals.validated;
  const isBot = req.headers['client-type'] === 'bot';

  const { authToken, product } = await signService(userData);

  if (isBot) {
    logger.info('Login bot realizado com sucesso.');
    res
      .status(HttpStatus.OK)
      .json({ message: 'Login bot realizado com sucesso.', token: authToken, user_plan: product });
  } else {
    res.cookie('auth', authToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 5 * 60 * 1000,
    });

    logger.info('Login web realizado com sucesso.');
    res.status(HttpStatus.OK).json({ message: 'Login web realizado com sucesso.' });
  }
});
