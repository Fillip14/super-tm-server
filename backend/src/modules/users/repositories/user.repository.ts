import { supabase } from '../../../database/supabaseClient';
import { Table, Column } from '../../../constants/database.constants';
import { AppError } from '../../../errors/AppError';
import { HttpStatus } from '../../../constants/api.constants';

export const findUser = async (userID: string) => {
  const { data: userData, error: userError } = await supabase
    .from(Table.USERS)
    .select('*')
    .eq(Column.UUID, userID)
    .maybeSingle();

  if (userError)
    throw new AppError('Erro ao pesquisar cadastro.', HttpStatus.INTERNAL_SERVER_ERROR);

  return userData;
};

export const createNewUser = async (): Promise<string> => {
  const { data: newUser, error: userInsertError } = await supabase
    .from(Table.USERS)
    .insert({
      online: false,
    })
    .select(Column.UUID)
    .single();

  if (userInsertError)
    throw new AppError('Erro ao cadastrar no users.', HttpStatus.INTERNAL_SERVER_ERROR);

  return newUser.uuid;
};

export const patchUser = async (field: string, value: string | boolean | null, userID: string) => {
  const { error: userError } = await supabase
    .from(Table.USERS)
    .update({ [field]: value })
    .eq(Column.UUID, userID)
    .single();

  if (userError) throw new AppError('Erro ao atualizar usuário.', HttpStatus.INTERNAL_SERVER_ERROR);

  return;
};

// export const deleteUser = async (userID: string) => {
//   const { error: userError } = await supabase
//     .from(Table.USERS)
//     .update({ status: AccountStatus.DELETED, document: null, email: null })
//     .eq(Column.UUID, userID);

//   if (userError)
//     throw new AppError('Erro ao excluir usuario.', HttpStatus.BAD_REQUEST, {
//       success: false,
//       suggestedAction: 'delete again',
//     });

//   return;
// };
