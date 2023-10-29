import { useMutation } from 'react-query';

import { IAPIError } from '../../../../../types';
import { API_MUTATION_KEY, APIS_ROUTES } from '../../../../../utills';
import apiClient from '../../../../../apis/api-client';

const workspaceResendInvitation = async (
  userId: string,
  workspaceId: string
) => {
  await apiClient.put(
    `${APIS_ROUTES.USERS}/${userId}/resend-invitation?workspaceId=${workspaceId}`
  );
};

const useWorkspaceResendInvitation = (workspaceId: string) =>
  useMutation<void, IAPIError, string>(
    [API_MUTATION_KEY.WORKSPACE_RESEND_INVITATION],
    (userId) => workspaceResendInvitation(userId, workspaceId)
  );

export default useWorkspaceResendInvitation;
