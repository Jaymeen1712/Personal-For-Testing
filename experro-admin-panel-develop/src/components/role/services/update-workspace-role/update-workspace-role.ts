import { useMutation } from 'react-query';

import {
  IAxiosResponse,
  ICreateRoleResponse,
  IRole,
  IAPIError,
} from '../../../../types';
import shapeCollection from '../../../../utills/convert-request-response';
import { APIS_ROUTES, API_MUTATION_KEY } from '../../../../utills/enums';
import apiClient from '../../../../apis/api-client';

const updateWorkspaceRole = async (
  roleId: string | undefined,
  workspaceId?: string | null,
  role?: IRole
) => {
  let response;

  if (window.location.pathname.includes('/workspaces')) {
    response = await apiClient.put<IRole, IAxiosResponse<ICreateRoleResponse>>(
      `${APIS_ROUTES.WORKSPACES}/${workspaceId}/roles/${roleId}`,
      shapeCollection(role, false, 'camelToSnackCase')
    );
  } else {
    response = await apiClient.put<IRole, IAxiosResponse<ICreateRoleResponse>>(
      `${APIS_ROUTES.ROLES}/${roleId}`,
      shapeCollection(role, false, 'camelToSnackCase')
    );
  }

  return response.response.Data;
};

const useUpdateWorkspaceRole = (
  roleId: string | undefined,
  workspaceId?: string
) =>
  useMutation<ICreateRoleResponse, IAPIError, IRole, string>(
    [API_MUTATION_KEY.UPDATE_WORKSPACE_ROLE, roleId],
    (role: IRole) => updateWorkspaceRole(roleId, workspaceId, role)
  );

export default useUpdateWorkspaceRole;
