import { findUserService, patchUserService } from '../../users/services/user.service';
import { AppError } from '../../../errors/AppError';
import { Column } from '../../../constants/database.constants';
import { HttpStatus } from '../../../constants/api.constants';

export const validateConnection = async (userID: any, isLogged: boolean) => {
  const userData = await findUserService(userID);
  const dateNow = new Date().toISOString();

  if (userData.expires_at < dateNow || userData.expires_at == null) {
    patchUserService(Column.ACTIVE, false, userData.uuid);
    patchUserService(Column.PRODUCT, null, userData.uuid);
    userData.product = null;
    userData.active = false;
    throw new AppError('Plano expirado.', HttpStatus.UNAUTHORIZED);
  } else {
    patchUserService(Column.ACTIVE, true, userData.uuid);
    userData.active = true;
  }
  if (isLogged && userData.online) {
    throw new AppError('Usuário já logado.', HttpStatus.CONFLICT);
  }

  return;
};
