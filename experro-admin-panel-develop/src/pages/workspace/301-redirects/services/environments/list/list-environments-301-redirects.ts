import { useQuery } from 'react-query';

import {
  IAPIError,
  IAxiosResponse,
  IListEnvironments,
} from '../../../../../../types';
import { API_QUERY_KEY, APIS_ROUTES } from '../../../../../../utills';
import apiClient from '../../../../../../apis/api-client';

const listEnvironments301Redirects = async (workspaceId: string) => {
  if (!workspaceId || workspaceId === 'global') return [];

  const response = await apiClient.get<
    null,
    IAxiosResponse<IListEnvironments[]>
  >(`${APIS_ROUTES.ENVIRONMENT_SERVICE}/${workspaceId}/environments`);

  return response.response.Data;
};

const useListEnvironments301Redirects = (workspaceId: string) =>
  useQuery<IListEnvironments[], IAPIError>(
    [API_QUERY_KEY.ENVIRONMENTS_LIST, workspaceId],
    () => listEnvironments301Redirects(workspaceId),
    {
      cacheTime: 0,
    }
  );

export default useListEnvironments301Redirects;
