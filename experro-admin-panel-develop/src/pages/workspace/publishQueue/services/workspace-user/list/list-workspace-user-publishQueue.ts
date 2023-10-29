import { useQuery } from 'react-query';

import { API_QUERY_KEY, APIS_ROUTES } from '../../../../../../utills';
import apiClient from '../../../../../../apis/api-client';
import {
  IAxiosResponse,
  IListWorkspaceUserResponse,
} from '../../../../../../types';

const listWorkspaceUserPublishQueue = async (workspaceId: string) => {
  const response = await apiClient.get<
    null,
    IAxiosResponse<{ items: IListWorkspaceUserResponse[] }>
  >(`${APIS_ROUTES.WORKSPACE_ALL_USERS}/${workspaceId}/users`, {
    params: { fields: 'first_name,last_name' },
  });

  return response.response.Data.items;
};

const useListWorkspaceUserPublishQueue = (workspaceId: string) =>
  useQuery(
    [API_QUERY_KEY.WORKSPACE_ALL_USERS, workspaceId],
    () => listWorkspaceUserPublishQueue(workspaceId),
    { cacheTime: 0 }
  );

export default useListWorkspaceUserPublishQueue;
