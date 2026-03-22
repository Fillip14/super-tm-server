import { findUserService } from '../modules/users/services/user.service';
import { Column } from '../constants/database.constants';
import { AppError } from '../errors/AppError';
import { HttpStatus } from '../constants/api.constants';

export const validateUser = async (user_id: string, client_type: string) => {
  const userData = await findUserService(Column.UUID, user_id);

  if (!userData.active)
    throw new AppError('Plano expirado.', HttpStatus.UNAUTHORIZED, {
      suggestedAction: 'contact_support',
    });

  if (client_type === 'desktop' && userData.online)
    throw new AppError('Usuário já logado.', HttpStatus.CONFLICT);

  return userData;
};
