import { useQuery } from 'react-query';

import {
  IAPIError,
  IAxiosResponse,
  IRoleUser,
  IRoleUsersResponse,
} from '../../../../../types';
import { API_QUERY_KEY } from '../../../../../utills/enums';
import apiClient from '../../../../../apis/api-client';
import { APIS_ROUTES } from '../../../../../utills/enums';

const roleUsers = async (roleId?: string) => {
  if (!roleId) return;
  const response = await apiClient.get<
    string,
    IAxiosResponse<IRoleUsersResponse>
  >(`${APIS_ROUTES.ROLES}/${roleId}/users`, {
    params: { fields: 'first_name,last_name,email' },
  });

  return response.response.Data.items;
};

const useRoleUsers = (roleId?: string) =>
  useQuery<IRoleUser[] | undefined, IAPIError>(
    [API_QUERY_KEY.ROLE_USERS, roleId],
    () => roleUsers(roleId),
    { cacheTime: 0 }
  );

export default useRoleUsers;
