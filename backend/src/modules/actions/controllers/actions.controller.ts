import { Request, Response } from 'express';
import { asyncHandler } from '../../../utils/asyncHandler';

const pendingActions: string[] = [];

export const postActionController = asyncHandler(async (req: Request, res: Response) => {
  const { category, action } = req.params; // "hunt/start", "heal/stop", etc
  pendingActions.push(category, action);
  res.json({ ok: true });
});

export const pendingActionsController = asyncHandler(async (req: Request, res: Response) => {
  const actions = [...pendingActions];
  pendingActions.length = 0; // limpa depois de entregar
  res.json({ actions });
});
