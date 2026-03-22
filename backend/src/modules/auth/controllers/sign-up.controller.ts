import { HttpStatus } from '../../../constants/api.constants';
import { registerNewUserService } from '../services/sing-up.service';
import express, { Request, Response } from 'express';
import { asyncHandler } from '../../../utils/asyncHandler';
import logger from '../../../utils/log/logger';

export const registerController = asyncHandler(async (req: Request, res: Response) => {
  const userDataValidated = res.locals.validated;

  const userRegistered = await registerNewUserService(userDataValidated);

  logger.info(`Usuario registrado com sucesso: ${userRegistered}`);
  return res.status(HttpStatus.CREATED).json({
    success: true,
    userID: userRegistered,
  });
});
