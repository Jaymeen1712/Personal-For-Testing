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
}

const getAllWorkSpaces = async () => {
  if (!Cookies.get(USER_ACCESS_KEY.TOKEN)) return;

  const result = await apiClient.get<
    null,
    IAxiosResponse<{ items: IWorkspace[] }>
  >(APIS_ROUTES.USER_ALL_WORKSPACES);

  return result.response.Data.items;
};

const useAllWorkspaces = () =>
  useQuery<IWorkspace[] | undefined, IAPIError>(
    [API_QUERY_KEY.GET_ALL_WORKSPACES],
    getAllWorkSpaces,
    { cacheTime: 0 }
  );

export default useAllWorkspaces;
