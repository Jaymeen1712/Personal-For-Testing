import { useMutation } from 'react-query';

import apiClient from '../../api-client';
import { IAPIError, IAxiosResponse, IUser } from '../../../types';
import shapeCollection from '../../../utills/convert-request-response';
import { API_MUTATION_KEY, APIS_ROUTES } from '../../../utills/enums';

const createUser = async (user: IUser) => {
  const result = await apiClient.post<IUser, IAxiosResponse<{ item: string }>>(
    APIS_ROUTES.USERS,
    shapeCollection(user, false, 'camelToSnackCase')
  );
  return result.response.Data.item;
};

const useCreateUser = () =>
  useMutation<string, IAPIError, IUser>(
    [API_MUTATION_KEY.CREATE_USER],
    createUser
  );

export default useCreateUser;
