import { Request, Response } from 'express';
import { asyncHandler } from '../../../utils/asyncHandler';
import { broadcastFrontend } from '../../../websocket/websocket';

export const statusController = asyncHandler(async (req: Request, res: Response) => {
  const { data } = req.body;

  broadcastFrontend({ type: 'status', data });

  res.json({ ok: true });
  return;
});
