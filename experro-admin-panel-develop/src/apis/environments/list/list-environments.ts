import { useQuery } from 'react-query';

import apiClient from '../../api-client';
import { IAPIError, IAxiosResponse, IListEnvironments } from '../../../types';
import { API_QUERY_KEY, APIS_ROUTES } from '../../../utills';

const listEnvironments = async (workspaceId: string) => {
  if (!workspaceId || workspaceId === 'global') return [];

  const response = await apiClient.get<
    null,
    IAxiosResponse<IListEnvironments[]>
  >(`${APIS_ROUTES.ENVIRONMENT_SERVICE}/${workspaceId}/environments`);

  return response.response.Data;
};

const useListEnvironments = (workspaceId: string) =>
  useQuery<IListEnvironments[], IAPIError>(
    [API_QUERY_KEY.ENVIRONMENTS_LIST, workspaceId],
    () => listEnvironments(workspaceId),
    {
      cacheTime: 0,
    }
  );

export default useListEnvironments;
