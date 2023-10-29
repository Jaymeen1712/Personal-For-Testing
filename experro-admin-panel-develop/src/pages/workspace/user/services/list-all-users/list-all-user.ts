import { useQuery } from 'react-query';

import apiClient from '../../../../../apis/api-client';
import { APIS_ROUTES, API_QUERY_KEY } from '../../../../../utills';
import { IAPIError, IAxiosResponse } from '../../../../../types';

interface IUser {
  id?: string;
  firstName?: string;
  lastName?: string;
  label?: string;
  value?: string;
}

const listAllUser = async () => {
  const response = await apiClient.get<
    null,
    IAxiosResponse<{ items: IUser[] }>
  >(`${APIS_ROUTES.USERS_ALL}`, {
    params: { fields: 'first_name,last_name', has_inactive_user: true },
  });

  return response.response.Data.items?.map((item: IUser) => ({
    label: `${item['firstName']} ${item['lastName']}`,
    value: item['id'],
  }));
};

const useListAllUser = () =>
  useQuery<IUser[], IAPIError>(
    [API_QUERY_KEY.WORKSPACE_USER_ALL],
    () => listAllUser(),
    {
      cacheTime: 0,
    }
  );

export default useListAllUser;
