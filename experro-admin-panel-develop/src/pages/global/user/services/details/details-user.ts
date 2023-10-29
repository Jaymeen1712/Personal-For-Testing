import { useQuery } from 'react-query';

import apiClient from '../../../../../apis/api-client';
import {
  IAPIError,
  IAxiosResponse,
  IUser,
  IUserResponse,
} from '../../../../../types';
import { API_QUERY_KEY, APIS_ROUTES } from '../../../../../utills';

const detailsUser = async (userId?: string) => {
  if (!userId) return;

  const result = await apiClient.get<
    null,
    IAxiosResponse<{ item: IUserResponse }>
  >(`${APIS_ROUTES.USERS}/${userId}`);

  return result.response.Data.item;
};

const useDetailsUser = (userId?: string) =>
  useQuery<IUser | undefined, IAPIError>(
    [API_QUERY_KEY.USER_DETAILS, userId],
    () => detailsUser(userId),
    { cacheTime: 0 }
  );

export default useDetailsUser;
