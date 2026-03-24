import { patchUserService } from '../modules/users/services/user.service';
import { Column } from '../constants/database.constants';
import { AppError } from '../errors/AppError';
import { HttpStatus } from '../constants/api.constants';

export const validateUser = async (userData: any, clientType: string) => {
  const dateNow = new Date().toISOString();

  if (userData.expires_at < dateNow || userData.expires_at == null) {
    patchUserService(Column.ACTIVE, false, userData.uuid);
    patchUserService(Column.PRODUCT, null, userData.uuid);
    userData.product = null;
    userData.active = false;
  } else {
    patchUserService(Column.ACTIVE, true, userData.uuid);
    userData.active = true;
  }

  if (clientType === 'desktop') {
    if (!userData.active) throw new AppError('Plano expirado.', HttpStatus.UNAUTHORIZED);
    if (userData.online) throw new AppError('Usuário já logado.', HttpStatus.CONFLICT);
  }

  return;
};
