// import { HttpStatus } from '../../../constants/api.constants';
// import { AppError } from '../../../errors/AppError';
// import { SignUp } from '../../auth/schemas/sign-up.schema';
import { Column } from '../../../constants/database.constants';
import { findUser, patchUser } from '../repositories/user.repository';

export const findUserService = async (uuid: string) => {
  const userData = await findUser(uuid);
  const dateNow = new Date().toISOString();

  if (userData.expires_at < dateNow) {
    patchUser(Column.ACTIVE, false, uuid);
    userData.active = false;
  } else {
    patchUser(Column.ACTIVE, true, uuid);
    userData.active = true;
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
