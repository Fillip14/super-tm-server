import { HttpStatus } from '../../../constants/api.constants';
import { AppError } from '../../../errors/AppError';
import { validateUser } from '../../../utils/validateUser';
import { findUserService } from '../../users/services/user.service';

export const validateSessionService = async (userId: string, clientType: string) => {
  const userData = await findUserService(userId);
  if (!userData) throw new AppError('Usuário não encontrado.', HttpStatus.NOT_FOUND);

  await validateUser(userData, clientType);

  return userData.product;
};
