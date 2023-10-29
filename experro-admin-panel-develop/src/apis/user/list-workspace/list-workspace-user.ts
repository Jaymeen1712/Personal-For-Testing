import { useQuery } from 'react-query';
import { API_QUERY_KEY, APIS_ROUTES } from '../../../utills';
import apiClient from '../../api-client';
import { IAxiosResponse } from '../../../types';

interface IRoleResponse {
  id: string;
  name: string;
}

interface IListWorkspaceUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  status: string;
  roles: IRoleResponse[];
}

const listWorkspaceUser = async (workspaceId?: string) => {
  const response = await apiClient.get<
    null,
    IAxiosResponse<{ items: IListWorkspaceUser[] }>
  >(`${APIS_ROUTES.WORKSPACES}/${workspaceId}/users`, {
    params: {
      fields: 'first_name,last_name,email,status',
    },
  });

  return response.response.Data.items;
};

const useListWorkspaceUser = (workspaceId?: string) =>
  useQuery(
    [API_QUERY_KEY.WORKSPACE_USERS, workspaceId],
    () => listWorkspaceUser(workspaceId),
    { cacheTime: 0 }
  );

export default useListWorkspaceUser;
