import { useMutation } from 'react-query';

import { IAPIError } from '../../../../../types';
import { API_MUTATION_KEY, APIS_ROUTES } from '../../../../../utills';
import apiClient from '../../../../../apis/api-client';

const workspaceUserResetPassword = async (
  userId: string,
  workspaceId: string
) => {
  await apiClient.put(
    `${APIS_ROUTES.USERS}/${userId}/reset-password?workspaceId=${workspaceId}`
  );
};

const useWorkspaceUserResetPassword = (workspaceId: string) =>
  useMutation<void, IAPIError, string>(
    [API_MUTATION_KEY.USER_RESET_PASSWORD],
    (userId) => workspaceUserResetPassword(userId, workspaceId)
  );

export default useWorkspaceUserResetPassword;
