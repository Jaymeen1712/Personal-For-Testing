import { useQuery } from 'react-query';
import { API_QUERY_KEY, APIS_ROUTES } from '../../../../../utills';
import apiClient from '../../../../../apis/api-client';
import { IAxiosResponse, IListWorkspaceRole } from '../../../../../types';

interface ISearchRoleResponse {
  id: string;
  name: string;
}

const listWorkspaceRole = async (workspaceId: string) => {
  if (!workspaceId) {
    return;
  } else {
    const response = await apiClient.get<
      string,
      IAxiosResponse<{ items: IListWorkspaceRole[] }>
    >(`${APIS_ROUTES.WORKSPACES}/${workspaceId}/roles`, {
      params: {
        fields: 'description,user_count,is_workspace_admin',
      },
    });

    return response.response.Data.items?.map((item: ISearchRoleResponse) => ({
      label: item['name'],
      value: item['id'],
    }));
  }
};

const useListWorkspaceRole = (workspaceId: string) =>
  useQuery(
    [API_QUERY_KEY.WORKSPACE_ROLE_LIST, workspaceId],
    () => listWorkspaceRole(workspaceId),
    { cacheTime: 0 }
  );

export default useListWorkspaceRole;
