import { useMutation } from 'react-query';

import apiClient from '../../api-client';
import { IAPIError, IAxiosResponse, IUser } from '../../../types';
import { API_MUTATION_KEY, APIS_ROUTES } from '../../../utills/enums';
import shapeCollection from '../../../utills/convert-request-response';

const updateUser = async (user: IUser, userId?: string) => {
  if (!userId) return '';

  const result = await apiClient.put<IUser, IAxiosResponse<{ item: string }>>(
    `${APIS_ROUTES.USERS}/${userId}`,
    shapeCollection(user, false, 'camelToSnackCase')
  );

  return result.response.Data.item;
};

const useUpdateUser = (userId?: string) =>
  useMutation<string | undefined, IAPIError, IUser>(
    [API_MUTATION_KEY.UPDATE_USER],
    (user) => updateUser(user, userId)
  );

export default useUpdateUser;
