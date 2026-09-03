import express, { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { HttpStatus } from '../constants/api.constants';
import logger from '../utils/log/logger';

export const authMiddleware = (requiredType?: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.auth || req.headers['authorization']?.split(' ')[1];

    if (!token) {
      logger.warn(`Token ausente. Token: ${token}`);
      res.status(HttpStatus.UNAUTHORIZED).json({ error: 'Não autorizado.' });
      return;
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

      if (
        (typeof requiredType === 'string' &&
          decoded.userType.toUpperCase() !== requiredType.toUpperCase()) ||
        !['USER', 'ADMIN'].includes(decoded.userType.toUpperCase())
      ) {
        logger.warn(`Token inválido. Token: ${JSON.stringify(decoded)}. Required: ${requiredType}`);
        res.status(HttpStatus.UNAUTHORIZED).json({ error: 'Não autorizado.' });
        return;
      }
      res.locals.user = { userId: decoded.userId, userType: decoded.userType };
      next();
    } catch (error) {
      logger.warn(`Token inválido. Token: ${token}`);
      res.status(HttpStatus.UNAUTHORIZED).json({ error: 'Não autorizado.' });
      return;
    }
  };
};
