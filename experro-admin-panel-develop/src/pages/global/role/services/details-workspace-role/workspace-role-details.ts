import { useQuery } from 'react-query';

import {
  IAPIError,
  IRole,
  IAxiosResponse,
  IRoleResponse,
} from '../../../../../types';
import { APIS_ROUTES, API_MUTATION_KEY } from '../../../../../utills/enums';
import apiClient from '../../../../../apis/api-client';

const getWorkspaceRoleDetails = async (
  roleId?: string | null,
  workspaceId?: string | null
) => {
  if (!roleId || !workspaceId) return;

  const response = await apiClient.get<IRole, IAxiosResponse<IRoleResponse>>(
    `${APIS_ROUTES.WORKSPACES}/${workspaceId}/roles/${roleId}`,
    {
      params: {
        fields: 'permissions,description,workspace_id',
      },
    }
  );
  return response.response.Data;
};

const useGetWorkspaceRoleDetails = (
  roleId?: string | null,
  workspaceId?: string | null
) =>
  useQuery<IRoleResponse | undefined, IAPIError, IRole>(
    [API_MUTATION_KEY.WORKSPACE_ROLE_DETAILS_GLOBAL, roleId, workspaceId],
    () => getWorkspaceRoleDetails(roleId, workspaceId),
    { cacheTime: 0 }
  );

export default useGetWorkspaceRoleDetails;
