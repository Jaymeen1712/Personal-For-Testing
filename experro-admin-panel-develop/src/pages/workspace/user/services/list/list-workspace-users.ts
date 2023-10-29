import { useQuery } from 'react-query';

import { API_QUERY_KEY, APIS_ROUTES } from '../../../../../utills';
import apiClient from '../../../../../apis/api-client';
import {
  IAxiosResponse,
  IListWorkspaceUserResponse,
} from '../../../../../types';

const listWorkspaceUsers = async (
  workspaceId: string,
  filter?: string,
  status?: string,
  roles?: string
) => {
  const response = await apiClient.get<
    null,
    IAxiosResponse<{ items: IListWorkspaceUserResponse[]; totalCount: number }>
  >(`${APIS_ROUTES.WORKSPACE_ALL_USERS}/${workspaceId}/users`, {
    params: {
      fields: 'first_name,last_name,email,status,is_blocked',
      search: filter,
      roleId: roles !== 'any' ? roles : '',
      status: status !== 'any' ? status : '',
    },
  });

  return response.response.Data;
};

const useListWorkspaceUsers = (
  workspaceId: string,
  filter?: string,
  status?: string,
  roles?: string
) =>
  useQuery([API_QUERY_KEY.WORKSPACE_ALL_USERS, filter, status, roles], () =>
    listWorkspaceUsers(workspaceId, filter, status, roles)
  );

export default useListWorkspaceUsers;
