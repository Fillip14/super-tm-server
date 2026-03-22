import { supabase } from '../../../database/supabaseClient';
import { SignUp } from '../schemas/sign-up.schema';
import { Column, Table } from '../../../constants/database.constants';
import { AppError } from '../../../errors/AppError';
import { HttpStatus } from '../../../constants/api.constants';

export const findAuth = async (field: string, value: string) => {
  const { data: authData, error: authError } = await supabase
    .from(Table.AUTH)
    .select(`${Column.USER_ID}, ${Column.EMAIL}, ${Column.PASSWORD_HASH}, ${Column.ROLE}`)
    .eq(field, value)
    .maybeSingle();

  if (authError)
    throw new AppError('Erro ao pesquisar cadastro.', HttpStatus.INTERNAL_SERVER_ERROR);

  return authData;
};

export const createNewAuth = async (userID: string, userData: SignUp) => {
  const { error: authInsertError } = await supabase
    .from(Table.AUTH)
    .insert({
      user_id: userID,
      email: userData.email,
      password_hash: userData.password,
      role: 'user',
    })
    .select();

  if (authInsertError)
    throw new AppError('Erro ao cadastrar no auth.', HttpStatus.INTERNAL_SERVER_ERROR);
};

// export const deleteAuth = async (userID: string) => {
//   const { error: authError } = await supabase.from(Table.AUTH).delete().eq(Column.USER_ID, userID);

//   if (authError)
//     throw new AppError('Erro ao excluir auth.', HttpStatus.BAD_REQUEST, {
//       success: false,
//       suggestedAction: 'delete again',
//     });

//   return;
// };
