import { HttpStatus } from '../../../constants/api.constants';
// import { AccountStatus, Column } from '../../../constants/database.constants';
// import { findAuthService } from './auth.service';
import { AppError } from '../../../errors/AppError';
import { validateUser } from '../../../utils/validateUser';
import { SignIn } from '../schemas/sign-in.schema';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { findAuth } from '../repositories/auth.repository';

export const signService = async (siginData: SignIn, client_type: string) => {
  const authData = await findAuth(siginData);
  if (!authData) throw new AppError('Usuário não encontrado.', HttpStatus.NOT_FOUND);

  if (!(await bcrypt.compare(siginData.password, authData.password_hash)))
    throw new AppError('Email ou senha inválidos.', HttpStatus.UNAUTHORIZED);

  const userData = await validateUser(authData.user_id, client_type);

  const expiresAt = new Date(userData.expires_at).getTime();
  const expiresIn = Math.floor((expiresAt - Date.now()) / 1000);

  return {
    authToken: jwt.sign(
      { user_id: authData.user_id, type: authData.role },
      process.env.JWT_SECRET as string,
      { expiresIn },
    ),
    product: userData.product,
  };
};
