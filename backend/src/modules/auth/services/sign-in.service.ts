import { HttpStatus } from '../../../constants/api.constants';
import { AppError } from '../../../errors/AppError';
import { validateUser } from '../../../utils/validateUser';
import { SignIn } from '../schemas/sign-in.schema';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { findAuthService } from './auth.service';
import { Column } from '../../../constants/database.constants';
import { findUserService } from '../../users/services/user.service';

export const signService = async (siginData: SignIn, clientType: string) => {
  const authData = await findAuthService(Column.EMAIL, siginData.email);
  if (!authData) throw new AppError('Usuário não encontrado.', HttpStatus.NOT_FOUND);

  if (!(await bcrypt.compare(siginData.password, authData.password_hash)))
    throw new AppError('Email ou senha inválidos.', HttpStatus.UNAUTHORIZED);

  const userData = await findUserService(authData.user_id);

  if (!userData) throw new AppError('Usuário não encontrado.', HttpStatus.NOT_FOUND);

  await validateUser(authData.user_id, clientType, false);

  return {
    authToken: jwt.sign(
      { userId: authData.user_id, userType: authData.role },
      process.env.JWT_SECRET as string,
      { expiresIn: '7d' },
    ),
    product: userData.product,
  };
};
