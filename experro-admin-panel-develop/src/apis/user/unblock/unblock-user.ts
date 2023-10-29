import { useMutation } from 'react-query';
import { API_MUTATION_KEY, APIS_ROUTES } from '../../../utills';
import { IAPIError } from '../../../types';
import apiClient from '../../api-client';

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
