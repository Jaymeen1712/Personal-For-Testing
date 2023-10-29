import { useQuery } from 'react-query';

import {
  IAPIError,
  IAxiosResponse,
  IRoleUser,
  IRoleUsersResponse,
} from '../../../../../types';
import { API_QUERY_KEY } from '../../../../../utills/enums';
import apiClient from '../../../../../apis/api-client';
import { APIS_ROUTES } from '../../../../../utills/enums';

const workspaceRoleUsers = async (roleId?: string, workspaceId?: string) => {
  if (!roleId) return;
  const response = await apiClient.get<
    string,
    IAxiosResponse<IRoleUsersResponse>
  >(`${APIS_ROUTES.WORKSPACES}/${workspaceId}/roles/${roleId}/users`, {
    params: { fields: 'first_name,last_name,email' },
  });

  return response.response.Data.items;
};

const useWorkspaceRoleUsers = (roleId?: string, workspaceId?: string) =>
  useQuery<IRoleUser[] | undefined, IAPIError>(
    [API_QUERY_KEY.WORKSPACE_ROLE_USERS, roleId],
    () => workspaceRoleUsers(roleId, workspaceId),
    { cacheTime: 0 }
  );

export default useWorkspaceRoleUsers;
