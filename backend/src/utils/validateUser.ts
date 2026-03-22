import { findUserService, patchUserService } from '../modules/users/services/user.service';
import { Column } from '../constants/database.constants';
import { AppError } from '../errors/AppError';
import { HttpStatus } from '../constants/api.constants';

export const validateUser = async (
  userID: string,
  clientType: string,
  allowUserLogged: boolean = false,
) => {
  const userData = await findUserService(userID);
  const dateNow = new Date().toISOString();

  if (userData.expires_at < dateNow || userData.expires_at == null) {
    patchUserService(Column.ACTIVE, false, userID);
    patchUserService(Column.PRODUCT, null, userID);
    userData.product = null;
    userData.active = false;
  } else {
    patchUserService(Column.ACTIVE, true, userID);
    userData.active = true;
  }

  if (clientType === 'desktop') {
    if (!userData.active) throw new AppError('Plano expirado.', HttpStatus.UNAUTHORIZED);
    if (userData.online && !allowUserLogged)
      throw new AppError('Usuário já logado.', HttpStatus.CONFLICT);
  }

  return userData;
};
