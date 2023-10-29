import { useQuery } from 'react-query';

import apiClient from '../../../../../apis/api-client';
import { IAPIError, IAxiosResponse, IUserDetails } from '../../../../../types';
import { API_QUERY_KEY, APIS_ROUTES } from '../../../../../utills';

const userWorkspaces = async (userId?: string) => {
  if (!userId) return;

  const result = await apiClient.get<
    null,
    IAxiosResponse<{ item: IUserDetails }>
  >(`${APIS_ROUTES.USERS}/${userId}/workspaces`);

  return result.response.Data.item;
};

const useUserWorkspaces = (userId?: string) =>
  useQuery<IUserDetails | undefined, IAPIError>(
    [API_QUERY_KEY.USER_WORKSPACES, userId],
    () => userWorkspaces(userId),
    { cacheTime: 0 }
  );

export default useUserWorkspaces;
