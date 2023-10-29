import { useMutation } from 'react-query';

import apiClient from '../../../../../apis/api-client';
import { IAPIError } from '../../../../../types';
import { API_MUTATION_KEY, APIS_ROUTES } from '../../../../../utills/enums';

const deleteWorkspaceUser = async (userId: string, workspaceId?: string) => {
  await apiClient.delete(
    `${APIS_ROUTES.WORKSPACES}/${workspaceId}/users/${userId}`
  );
};

const useDeleteWorkspaceUser = (workspaceId: string) =>
  useMutation<void, IAPIError, string>(
    [API_MUTATION_KEY.DELETE_USER],
    (userId) => deleteWorkspaceUser(userId, workspaceId)
  );

export default useDeleteWorkspaceUser;
