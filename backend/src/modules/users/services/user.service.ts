import { createNewUser, findUser, patchUser } from '../repositories/user.repository';

export const findUserService = async (userID: string) => {
  return await findUser(userID);
};

export const createUserService = async () => {
  return await createNewUser();
};

export const patchUserService = async (
  field: string,
  value: string | boolean | null,
  userId: string,
) => {
  const userData = await patchUser(field, value, userId);

  return userData;
};

// export const deleteUserService = async (userID: string) => {
//   return await deleteUser(userID);
// };
