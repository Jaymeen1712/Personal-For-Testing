import { useMutation } from 'react-query';

import apiClient from '../../../../../apis/api-client';
import { API_MUTATION_KEY, APIS_ROUTES } from '../../../../../utills';
import { IAPIError } from '../../../../../types';

const unblockUser = async (userId?: string) => {
  if (!userId) return;

  await apiClient.put(`${APIS_ROUTES.USERS}/${userId}/unblock`);
};

const useUnblockUser = () =>
  useMutation<void, IAPIError, string>(
    [API_MUTATION_KEY.UNBLOCK_USER],
    (userId) => unblockUser(userId)
  );

export default useUnblockUser;
