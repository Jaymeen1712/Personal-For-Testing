import { useMutation } from 'react-query';

import apiClient from '../../api-client';
import { IAPIError } from '../../../types';
import { API_MUTATION_KEY, APIS_ROUTES } from '../../../utills/enums';

const deleteUser = async (userId: string) => {
  await apiClient.delete(`${APIS_ROUTES.USERS}/${userId}`);
};

const useDeleteUser = () =>
  useMutation<void, IAPIError, string>(
    [API_MUTATION_KEY.DELETE_USER],
    deleteUser
  );

export default useDeleteUser;
