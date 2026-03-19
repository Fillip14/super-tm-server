import express, { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { HttpStatus } from '../constants/api.constants';
import logger from '../utils/log/logger';

export const authMiddleware = (requiredType?: string, allowExpired = false) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.auth || req.headers['authorization']?.split(' ')[1];

    if (!token) {
      logger.warn(`Token ausente. Token: ${token}`);
      res.status(HttpStatus.UNAUTHORIZED).json({ error: 'Não autorizado.' });
      return;
    }

    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET as string,
        allowExpired ? { ignoreExpiration: true } : {},
      ) as JwtPayload;

      if (
        (typeof requiredType === 'string' &&
          decoded.type.toUpperCase() !== requiredType.toUpperCase()) ||
        !['USER', 'ADMIN'].includes(decoded.type.toUpperCase())
      ) {
        logger.warn(`Token inválido. Token: ${JSON.stringify(decoded)}. Required: ${requiredType}`);
        res.status(HttpStatus.UNAUTHORIZED).json({ error: 'Não autorizado.' });
        return;
      }
      res.locals.user = { user_id: decoded.user_id, type: decoded.type };
      next();
    } catch (error) {
      logger.warn(`Token inválido. Token: ${token}`);
      res.status(HttpStatus.UNAUTHORIZED).json({ error: 'Não autorizado.' });
      return;
    }
  };
};
