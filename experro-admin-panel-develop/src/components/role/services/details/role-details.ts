import { useQuery } from 'react-query';

import {
  IAPIError,
  IRole,
  IAxiosResponse,
  IRoleResponse,
} from '../../../../types';
import { APIS_ROUTES, API_MUTATION_KEY } from '../../../../utills/enums';
import apiClient from '../../../../apis/api-client';

const getRoleData = async (
  roleId?: string | null,
  workspaceId?: string | null
) => {
  if (!roleId) return;

  let response;

  if (window.location.pathname.includes('/workspaces')) {
    response = await apiClient.get<IRole, IAxiosResponse<IRoleResponse>>(
      `${APIS_ROUTES.WORKSPACES}/${workspaceId}/roles/${roleId}`,
      {
        params: {
          fields: 'permissions,description,workspace_id',
        },
      }
    );
  } else {
    response = await apiClient.get<IRole, IAxiosResponse<IRoleResponse>>(
      `${APIS_ROUTES.ROLES}/${roleId}`,
      {
        params: {
          fields: 'permissions,description,workspace_id',
        },
      }
    );
  }

  return response.response.Data;
};

const useRoleDetails = (roleId?: string | null, workspaceId?: string | null) =>
  useQuery<IRoleResponse | undefined, IAPIError, IRole>(
    [API_MUTATION_KEY.GET_GLOBAL_ROLE, roleId],
    () => getRoleData(roleId, workspaceId),
    { cacheTime: 0 }
  );

export default useRoleDetails;
