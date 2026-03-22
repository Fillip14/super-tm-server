import { HttpStatus } from '../../../constants/api.constants';
import { findUserService } from '../../users/services/user.service';
import { AppError } from '../../../errors/AppError';

export const meService = async (userID: string) => {
  const userData = await findUserService(userID);

  if (!userData) throw new AppError('Usuário não encontrado.', HttpStatus.UNAUTHORIZED);

  let daysLeft = 0;
  if (userData.expires_at) {
    const diffMs = new Date(userData.expires_at).getTime() - Date.now();
    daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  }

  return { userData, daysLeft };
};
