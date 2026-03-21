import { Column } from '../../../constants/database.constants';
import { findUser, patchUser } from '../repositories/user.repository';

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

// export const createUserService = async (userData: SignUp) => {
//   return await createNewUser(userData);
// };

// export const patchUserService = async (email: string, userID: string) => {
//   const userData = await patchUser(email, userID);

//   return userData;
// };

// export const deleteUserService = async (userID: string) => {
//   return await deleteUser(userID);
// };
