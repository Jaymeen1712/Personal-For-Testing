import { useQuery } from 'react-query';
import Cookies from 'js-cookie';

import apiClient from '../../api-client';
import { IAPIError, IAxiosResponse } from '../../../types';
import { API_QUERY_KEY, APIS_ROUTES, USER_ACCESS_KEY } from '../../../utills';

interface IWorkspace {
  id: string;
  name: string;
  storeLink?: string;
  description?: string;
  timezone?: string;
  currency?: string;
}

const getWorkspaces = async () => {
  if (!Cookies.get(USER_ACCESS_KEY.TOKEN)) return;

  const result = await apiClient.get<
    null,
    IAxiosResponse<{ items: IWorkspace[] }>
  >(APIS_ROUTES.USER_WORKSPACES, {
    params: { fields: 'store_link,description,timezone,currency' },
  });
  return result.response.Data.items;
};

const useWorkspaces = () =>
  useQuery<IWorkspace[] | undefined, IAPIError>(
    [API_QUERY_KEY.USER_WORKSPACES],
    getWorkspaces,
    { cacheTime: 0 }
  );

export default useWorkspaces;
