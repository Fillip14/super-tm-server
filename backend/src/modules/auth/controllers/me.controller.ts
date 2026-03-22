import { Request, Response } from 'express';
import { asyncHandler } from '../../../utils/asyncHandler';
import { HttpStatus } from '../../../constants/api.constants';
import { meService } from '../services/me.service';
import logger from '../../../utils/log/logger';

export const meController = asyncHandler(async (req: Request, res: Response) => {
  const { user_id } = res.locals.user;

  const { userData, daysLeft } = await meService(user_id);

  logger.info(
    `Me: user_id=${user_id}, product=${userData.product ?? 'none'}, daysLeft=${daysLeft}`,
  );

  res.status(HttpStatus.OK).json({
    product: userData.product ?? null,
    active: userData.active ?? false,
    expires_at: userData.expires_at ?? null,
    days_left: daysLeft,
  });
});
