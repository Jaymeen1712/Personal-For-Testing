import { useMutation } from 'react-query';

import apiClient from '../../../../../apis/api-client';
import { API_MUTATION_KEY, APIS_ROUTES } from '../../../../../utills';
import { IAPIError } from '../../../../../types';

const blockUser = async (userId?: string) => {
  if (!userId) return;
  await apiClient.put(`${APIS_ROUTES.USERS}/${userId}/block`);
};

const useBlockUser = () =>
  useMutation<void, IAPIError, string>(
    [API_MUTATION_KEY.BLOCK_USER],
    (userId) => blockUser(userId)
  );

export default useBlockUser;
