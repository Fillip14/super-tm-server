import { findAuth } from '../repositories/auth.repository';

export const findAuthService = async (field: string, value: string) => {
  return await findAuth(field, value);
};

// export const createAuthService = async (userID: string, userData: SignUp) => {
//   return await createNewAuth(userID, userData);
// };

// export const deleteAuthService = async (userID: string) => {
//   return await deleteAuth(userID);
// };
