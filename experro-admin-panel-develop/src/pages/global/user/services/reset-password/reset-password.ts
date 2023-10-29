import { useMutation } from 'react-query';

import apiClient from '../../../../../apis/api-client';
import { API_MUTATION_KEY, APIS_ROUTES } from '../../../../../utills';
import { IAPIError } from '../../../../../types';

const resetPassword = async (userId: string) => {
  await apiClient.put(`${APIS_ROUTES.USERS}/${userId}/reset-password`);
};

const useResetPassword = () =>
  useMutation<void, IAPIError, string>(
    [API_MUTATION_KEY.RESET_PASSWORD],
    resetPassword
  );

export default useResetPassword;
