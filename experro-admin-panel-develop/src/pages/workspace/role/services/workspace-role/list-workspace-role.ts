import { useQuery } from 'react-query';
import { API_QUERY_KEY, APIS_ROUTES } from '../../../../../utills';
import apiClient from '../../../../../apis/api-client';
import { IAxiosResponse, IListWorkspaceRole } from '../../../../../types';

const listWorkspaceRole = async (
  workspaceId: string,
  orderBy?: string,
  sortBy?: string
) => {
  if (!workspaceId) {
    return;
  } else {
    const response = await apiClient.get<
      string,
      IAxiosResponse<{ items: IListWorkspaceRole[] }>
    >(`${APIS_ROUTES.WORKSPACES}/${workspaceId}/roles`, {
      params: {
        fields: 'description,user_count,is_workspace_admin',
        order_by: orderBy,
        sort_by: sortBy,
      },
    });

    return response.response.Data.items;
  }
};

const useListWorkspaceRole = (
  workspaceId: string,
  orderBy?: string,
  sortBy?: string
) =>
  useQuery([API_QUERY_KEY.ROLE_LIST, workspaceId], () =>
    listWorkspaceRole(workspaceId, orderBy, sortBy)
  );

export default useListWorkspaceRole;
