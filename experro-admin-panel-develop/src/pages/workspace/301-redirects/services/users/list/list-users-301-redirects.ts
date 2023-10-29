import { useQuery } from 'react-query';

import { IAPIError, IAxiosResponse } from '../../../../../../types';
import { API_QUERY_KEY, APIS_ROUTES } from '../../../../../../utills';
import apiClient from '../../../../../../apis/api-client';

interface IUser {
  id: string;
  firstName: string;
  lastName: string;
}

const listUsers301Redirects = async () => {
  const response = await apiClient.get<
    null,
    IAxiosResponse<{ items: IUser[] }>
  >(`${APIS_ROUTES.USERS_ALL}`, {
    params: { fields: 'first_name,last_name' },
  });

  return response.response.Data.items;
};

const useListUsers301Redirects = () =>
  useQuery<IUser[], IAPIError>(API_QUERY_KEY.USERS_ALL, listUsers301Redirects, {
    cacheTime: 0,
  });

export default useListUsers301Redirects;
