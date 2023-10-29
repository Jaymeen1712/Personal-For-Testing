import { useQuery } from 'react-query';

import { IAxiosResponse, IRole, IRoleListResponse } from '../../../../../types';
import { APIS_ROUTES, API_QUERY_KEY } from '../../../../../utills/enums';
import apiClient from '../../../../../apis/api-client';

const getRoles = async () => {
  const result = await apiClient.get<IRole, IAxiosResponse<IRoleListResponse>>(
    APIS_ROUTES.ROLES,
    {
      params: {
        fields: 'description,user_count,is_global_admin,is_workspace_admin',
      },
    }
  );

  const workspaceIds = result.response.Data.items
    .filter(
      (role, index, self) =>
        self.findIndex(
          (selfRole) => selfRole.workspaceId === role.workspaceId
        ) === index
    )
    .map((workspace) => ({
      workspaceId: workspace.workspaceId,
      workspaceName: workspace.workspaceName,
    }));

  const workspaceRoleData = workspaceIds.map((workspace) => ({
    workspaceId: workspace.workspaceId,
    workspaceName: workspace.workspaceName,
    roles: result.response.Data.items
      .map((role) => ({
        ...role,
        key: role.roleId,
      }))
      .filter((ele) => workspace.workspaceId === ele.workspaceId),
  }));

  return workspaceRoleData;
};

const useListRole = () =>
  useQuery([API_QUERY_KEY.ROLE_LIST], getRoles, { cacheTime: 0 });

export default useListRole;
