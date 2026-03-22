import { Request, Response } from 'express';
import { asyncHandler } from '../../../utils/asyncHandler';
import { HttpStatus } from '../../../constants/api.constants';
import { patchUserService } from '../../users/services/user.service';
import { Column } from '../../../constants/database.constants';
import logger from '../../../utils/log/logger';

export const activatePlanController = asyncHandler(async (req: Request, res: Response) => {
  const { user_id } = res.locals.user;

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30);

  await patchUserService(Column.PRODUCT, 'god', user_id);
  await patchUserService(Column.ACTIVE, true, user_id);
  await patchUserService(Column.EXPIRES_AT, expiresAt.toISOString(), user_id);

  logger.info(`Plano ativado para user_id=${user_id}, expires_at=${expiresAt.toISOString()}`);

  res.status(HttpStatus.OK).json({
    message: 'Plano ativado com sucesso.',
    expires_at: expiresAt.toISOString(),
    days_left: 30,
  });
});
