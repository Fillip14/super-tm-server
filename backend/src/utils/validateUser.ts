import { findUserService, patchUserService } from '../modules/users/services/user.service';
import { Column } from '../constants/database.constants';
import { AppError } from '../errors/AppError';
import { HttpStatus } from '../constants/api.constants';

export const syncUserStatus = async (userID: string) => {
  const userData = await findUserService(userID);
  if (!userData) throw new AppError('Usuário não encontrado.', HttpStatus.NOT_FOUND);

  const dateNow = new Date().toISOString();

  if (userData.expires_at < dateNow || userData.expires_at == null) {
    await patchUserService({ [Column.ACTIVE]: false, [Column.PRODUCT]: null }, userData.uuid);
    userData.product = null;
    userData.active = false;
  } else {
    await patchUserService({ [Column.ACTIVE]: true }, userData.uuid);
    userData.active = true;
  }

  return userData;
};

export const assertUserCanConnect = (
  userData: { online?: boolean; active?: boolean },
  isLogged: boolean,
) => {
  if (isLogged && userData.online) {
    throw new AppError('Usuário já logado.', HttpStatus.CONFLICT);
  }
  if (!userData.active) throw new AppError('Plano expirado.', HttpStatus.UNAUTHORIZED);
};

export const validateUser = async (userID: string, clientType: string, isLogged = false) => {
  const userData = await syncUserStatus(userID);

  if (clientType === 'desktop') assertUserCanConnect(userData, isLogged);

  return;
};
