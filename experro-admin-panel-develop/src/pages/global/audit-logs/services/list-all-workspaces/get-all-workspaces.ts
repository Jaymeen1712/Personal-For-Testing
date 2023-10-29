import { useQuery } from 'react-query';
import Cookies from 'js-cookie';
import apiClient from '../../../../../apis/api-client';
import { IAPIError, IAxiosResponse } from '../../../../../types';
import {
  API_QUERY_KEY,
  USER_ACCESS_KEY,
} from '../../../../../utills';

interface IWorkspace {
  id: string;
  name: string;
}

const getAllWorkspaces = async () => {
  if (!Cookies.get(USER_ACCESS_KEY.TOKEN)) return;

  const result = await apiClient.get<
    null,
    IAxiosResponse<{ items: IWorkspace[] }>
  >('/setting-service/v1/all-workspaces', {
    params: { fields: 'id,name' },
  });
  return result.response.Data.items;
};

const useGetAllWorkspaces = () =>
  useQuery<IWorkspace[] | undefined, IAPIError>(
    [API_QUERY_KEY.ALL_WORKSPACES],
    getAllWorkspaces,
    { cacheTime: 0 }
  );

export default useGetAllWorkspaces;
