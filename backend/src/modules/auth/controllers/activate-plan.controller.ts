import { Request, Response } from 'express';
import { asyncHandler } from '../../../utils/asyncHandler';
import { HttpStatus } from '../../../constants/api.constants';
import { patchUserService } from '../../users/services/user.service';
import { Column } from '../../../constants/database.constants';
import logger from '../../../utils/log/logger';

export const activatePlanController = asyncHandler(async (req: Request, res: Response) => {
  const { userId, userType } = res.locals.user;

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30);

  await patchUserService(Column.PRODUCT, 'god', userId);
  await patchUserService(Column.ACTIVE, true, userId);
  await patchUserService(Column.EXPIRES_AT, expiresAt.toISOString(), userId);

  logger.info(`Plano ativado para userId=${userId}, expires_at=${expiresAt.toISOString()}`);

  res.status(HttpStatus.OK).json({
    message: 'Plano ativado com sucesso.',
    expires_at: expiresAt.toISOString(),
    days_left: 30,
  });
});
