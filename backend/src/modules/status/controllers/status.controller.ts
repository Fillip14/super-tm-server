import { Request, Response } from 'express';
import { asyncHandler } from '../../../utils/asyncHandler';
import { broadcast } from '../../../websocket/websocket';

export const statusController = asyncHandler(async (req: Request, res: Response) => {
  const { data } = req.body;

  broadcast({ type: 'status', data });

  res.json({ ok: true });
  return;
});
