import { createAuthService, findAuthService } from './auth.service';
import { createUserService } from '../../users/services/user.service';
import { HttpStatus } from '../../../constants/api.constants';
import { AppError } from '../../../errors/AppError';
import { SignUp } from '../schemas/sign-up.schema';
import bcrypt from 'bcrypt';
import { Column } from '../../../constants/database.constants';

export const registerNewUserService = async (userData: SignUp) => {
  const userByEmail = await findAuthService(Column.EMAIL, userData.email);

  if (userByEmail)
    throw new AppError('Email ja cadastrado.', HttpStatus.CONFLICT, { field: 'email' });

  userData.password = await bcrypt.hash(userData.password, 10);

  try {
    const userID = await createUserService();
    await createAuthService(userID, userData);
    return userID;
  } catch (error) {
    throw new AppError('Erro ao cadastrar usuário.', HttpStatus.INTERNAL_SERVER_ERROR);
  }
};
