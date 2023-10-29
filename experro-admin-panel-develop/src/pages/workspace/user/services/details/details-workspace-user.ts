import { useQuery } from 'react-query';

import apiClient from '../../../../../apis/api-client';
import {
  IAPIError,
  IAxiosResponse,
  IUser,
  IUserResponse,
} from '../../../../../types';
import { API_QUERY_KEY, APIS_ROUTES } from '../../../../../utills';

const detailsWorkspaceUser = async (workspaceId: string, userId?: string) => {
  if (!userId) return;

  const result = await apiClient.get<
    null,
    IAxiosResponse<{ item: IUserResponse }>
  >(`${APIS_ROUTES.WORKSPACES}/${workspaceId}/users/${userId}`, {
    params: {
      fields: 'first_name,last_name,email',
    },
  });

  return result.response.Data.item;
};

const useDetailsWorkspaceUser = (workspaceId: string, userId?: string) =>
  useQuery<IUser | undefined, IAPIError>(
    [API_QUERY_KEY.WORKSPACE_USER_DETAILS, userId],
    () => detailsWorkspaceUser(workspaceId, userId),
    { cacheTime: 0 }
  );

export default useDetailsWorkspaceUser;
