import { Request, Response } from 'express';
import { asyncHandler } from '../../../utils/asyncHandler';
import { broadcast } from '../../../index';

export const statusController = asyncHandler(async (req: Request, res: Response) => {
  const { data } = req.body;
  // console.log(data);

  broadcast({ type: 'status', data });

  res.json({ ok: true });
  return;
});
