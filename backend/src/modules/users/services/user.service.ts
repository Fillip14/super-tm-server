import {
  createNewUser,
  findUser,
  patchUser,
  resetAllOnline,
} from '../repositories/user.repository';

export const findUserService = async (userID: string) => {
  return await findUser(userID);
};

export const createUserService = async () => {
  return await createNewUser();
};

export const patchUserService = async (fields: Record<string, unknown>, userId: string) => {
  const userData = await patchUser(fields, userId);

  return userData;
};

export const resetAllOnlineService = async () => {
  return await resetAllOnline();
};

// export const deleteUserService = async (userID: string) => {
//   return await deleteUser(userID);
// };
