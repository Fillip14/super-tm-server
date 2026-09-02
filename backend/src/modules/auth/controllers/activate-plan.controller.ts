import { Request, Response } from 'express';
import { asyncHandler } from '../../../utils/asyncHandler';
import { HttpStatus } from '../../../constants/api.constants';
import { findUserService, patchUserService } from '../../users/services/user.service';
import { Column } from '../../../constants/database.constants';
import { AppError } from '../../../errors/AppError';
import logger from '../../../utils/log/logger';

const PLAN_DAYS = 30;
const MS_PER_DAY = 1000 * 60 * 60 * 24;

export const activatePlanController = asyncHandler(async (req: Request, res: Response) => {
  const { userId, userType } = res.locals.user;

  const userData = await findUserService(userId);
  if (!userData) throw new AppError('Usuário não encontrado.', HttpStatus.NOT_FOUND);

  const currentExpiration = userData.expires_at ? new Date(userData.expires_at) : null;
  const base =
    currentExpiration && currentExpiration.getTime() > Date.now() ? currentExpiration : new Date();

  const expiresAt = new Date(base);
  expiresAt.setDate(expiresAt.getDate() + PLAN_DAYS);

  await patchUserService(
    {
      [Column.PRODUCT]: 'god',
      [Column.ACTIVE]: true,
      [Column.EXPIRES_AT]: expiresAt.toISOString(),
    },
    userId,
  );

  const daysLeft = Math.ceil((expiresAt.getTime() - Date.now()) / MS_PER_DAY);

  logger.info(
    `Plano ativado para userId=${userId}, expires_at=${expiresAt.toISOString()}, days_left=${daysLeft}`,
  );

  res.status(HttpStatus.OK).json({
    message: 'Plano ativado com sucesso.',
    expires_at: expiresAt.toISOString(),
    days_left: daysLeft,
  });
});
