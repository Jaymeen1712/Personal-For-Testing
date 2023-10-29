import { useQuery } from 'react-query';

import apiClient from '../../../../../apis/api-client';
import { IAPIError, IAxiosResponse } from '../../../../../types';
import { API_QUERY_KEY, APIS_ROUTES } from '../../../../../utills';

interface IUser {
  id?: string;
  firstName?: string;
  lastName?: string;
  label: string;
  value?: string;
}

const listAllGroupUser = async () => {
  const response = await apiClient.get<
    null,
    IAxiosResponse<{ items: IUser[] }>
  >(APIS_ROUTES.USERS_ALL, {
    params: {
      fields: 'first_name,last_name,email,status,created_at,is_blocked',
      has_inactive_user: 'true',
    },
  });

  return response.response.Data.items.map((item: IUser) => ({
    label: `${item['firstName']} ${item['lastName']}`,
    value: item['id'],
  }));
};

const useListAllGroupUser = () =>
  useQuery<IUser[], IAPIError>(
    API_QUERY_KEY.GROUP_USER_LIST,
    listAllGroupUser,
    {
      cacheTime: 0,
    }
  );

export default useListAllGroupUser;
