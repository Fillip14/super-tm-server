import { HttpStatus } from '../../../constants/api.constants';
import { Column } from '../../../constants/database.constants';
import { AppError } from '../../../errors/AppError';
import { findUserService } from '../../users/services/user.service';

export const verifySessionService = async (user_id: string, type: string) => {
  const userData = await findUserService(Column.UUID, user_id);

  if (!userData.active)
    throw new AppError('Plano expirado.', HttpStatus.UNAUTHORIZED, {
      suggestedAction: 'contact_support',
    });

  return { active: userData.active, product: userData.product };
};
