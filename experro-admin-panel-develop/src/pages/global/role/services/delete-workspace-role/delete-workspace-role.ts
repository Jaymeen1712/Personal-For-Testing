import { useMutation } from 'react-query';

import { IAPIError } from '../../../../../types';
import { APIS_ROUTES, API_MUTATION_KEY } from '../../../../../utills/enums';
import apiClient from '../../../../../apis/api-client';

type DeleteRoleParameter = {
  workspaceId: string;
  roleId: string;
};

const deleteGlobalRole = async (roleInfo: DeleteRoleParameter) => {
  if (window.location.pathname.includes('/workspaces')) {
    await apiClient.delete<null, boolean>(
      `${APIS_ROUTES.WORKSPACES}/${roleInfo.workspaceId}/roles/${roleInfo.roleId}`
    );
  } else {
    await apiClient.delete<null, boolean>(
      `${APIS_ROUTES.ROLES}/${roleInfo.roleId}`
    );
  }
};

const useDeleteWorkspaceRole = () =>
  useMutation<void, IAPIError, DeleteRoleParameter, string>(
    [API_MUTATION_KEY.DELETE_WORKSPACE_ROLE],
    deleteGlobalRole
  );

export default useDeleteWorkspaceRole;
