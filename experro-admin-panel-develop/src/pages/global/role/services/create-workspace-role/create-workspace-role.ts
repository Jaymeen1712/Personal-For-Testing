import { useMutation } from 'react-query';

import {
  IAPIError,
  IRole,
  ICreateRoleResponse,
  IAxiosResponse,
} from '../../../../../types';
import { APIS_ROUTES, API_MUTATION_KEY } from '../../../../../utills';
import shapeCollection from '../../../../../utills/convert-request-response';
import apiClient from '../../../../../apis/api-client';

const createWorkspaceRole = async (
  role: IRole,
  workspaceId?: string | null
) => {
  const response = await apiClient.post<
    IRole,
    IAxiosResponse<ICreateRoleResponse>
  >(`${APIS_ROUTES.ROLES}`, shapeCollection(role, false, 'camelToSnackCase'), {
    params: { workspace_id: workspaceId },
  });

  return response.response.Data;
};

const useCreateWorkspaceRole = () =>
  useMutation<ICreateRoleResponse, IAPIError, IRole, string>(
    [API_MUTATION_KEY.CREATE_WORKSPACE_ROLE_GLOBAL_CLONE],
    (role: IRole) => createWorkspaceRole(role, role.workspaceId)
  );

export default useCreateWorkspaceRole;
