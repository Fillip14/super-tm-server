import { Request, Response } from 'express';
import { asyncHandler } from '../../../utils/asyncHandler';
import { HttpStatus } from '../../../constants/api.constants';

export const verifyTokenController = asyncHandler(async (req: Request, res: Response) => {
  const { user_id, type } = res.locals.user;
  res.status(HttpStatus.OK).json({ user_id, type });
});
