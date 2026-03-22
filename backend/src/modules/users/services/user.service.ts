import { Column } from '../../../constants/database.constants';
import { createNewUser, findUser, patchUser } from '../repositories/user.repository';

export const findUserService = async (field: string, value: string) => {
  const userData = await findUser(field, value);
  const dateNow = new Date().toISOString();

  if (field == Column.UUID) {
    if (userData.expires_at < dateNow) {
      patchUser(Column.ACTIVE, false, value);
      userData.active = false;
    } else {
      patchUser(Column.ACTIVE, true, value);
      userData.active = true;
    }
  }

  return userData;
};

export const createUserService = async () => {
  return await createNewUser();
};

export const patchUserService = async (field: string, value: string | boolean, user_id: string) => {
  const userData = await patchUser(field, value, user_id);

  return userData;
};

// export const deleteUserService = async (userID: string) => {
//   return await deleteUser(userID);
// };
