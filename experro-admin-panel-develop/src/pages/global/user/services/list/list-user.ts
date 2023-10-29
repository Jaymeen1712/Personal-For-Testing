import { useMutation } from 'react-query';

import { API_QUERY_KEY, APIS_ROUTES } from '../../../../../utills';
import apiClient from '../../../../../apis/api-client';
import { IAxiosResponse } from '../../../../../types';

interface IListWorkspaceRequest {
  page: number;
  pageSize: number;
  filter: string;
  status: string;
  workspaces: string[];
  roles: string[];
  sortBy?: string;
  orderBy?: string;
}

interface IWorkspaces {
  id: string;
  name: string;
  storeLink: string;
}

interface IGroups {
  globalCount: number;
  id: string;
  name: string;
  roleCount: number;
  workspaceCount: number;
}

interface IRoles {
  id: string;
  name: string;
  workspaceId: string;
  workspaceName: string;
}

interface IListUser {
  id: string;
  firstName: string;
  email: string;
  status: string;
  createdAt: string;
  isBlocked: boolean;
  lastName: string;
  workspaces: IWorkspaces[];
  groups?: IGroups[];
  roles?: IRoles[];
}

const listUser = async (data: IListWorkspaceRequest) => {
  const response = await apiClient.post<
    void,
    IAxiosResponse<{ totalCount: number; items: IListUser[] }>
  >(
    `${APIS_ROUTES.USERS}/list`,
    {
      workspace_ids: data.workspaces,
      role_ids: data.roles,
    },
    {
      params: {
        search: data.filter,
        status: data.status === 'all' ? '' : data.status,
        fields: 'first_name,last_name,email,status,created_at,is_blocked',
        skip: (data.page - 1) * data.pageSize,
        limit: data.pageSize,
      },
    }
  );

  return response.response.Data;
};

const useListUser = (columnSortOrder?: { sortBy: string; orderBy: string }) =>
  useMutation([API_QUERY_KEY.LIST_USER], (data: IListWorkspaceRequest) =>
    listUser(data)
  );

export default useListUser;
