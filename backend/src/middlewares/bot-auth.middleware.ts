import { Request, Response, NextFunction } from 'express';
import { HttpStatus } from '../constants/api.constants';

export function botAuthMiddleware(req: Request, res: Response, next: NextFunction): void {
  const secret = req.headers['x-bot-secret'];

  if (!secret || secret !== process.env.BOT_SECRET) {
    res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Unauthorized' });
    return;
  }

  next();
}
