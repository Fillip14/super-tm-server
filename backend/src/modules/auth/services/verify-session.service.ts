import { validateUser } from '../../../utils/validateUser';

export const verifySessionService = async (user_id: string, client_type: string) => {
  const userData = await validateUser(user_id, client_type);

  return { active: userData.active, product: userData.product };
};
