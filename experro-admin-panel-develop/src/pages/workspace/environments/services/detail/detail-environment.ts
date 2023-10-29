import { useQuery } from 'react-query';

import apiClient from '../../../../../apis/api-client';
import {
  IAPIError,
  IAxiosResponse,
  IGetEnvironment,
} from '../../../../../types';
import { API_QUERY_KEY, APIS_ROUTES } from '../../../../../utills';

const detailsEnvironment = async (
  environmentId?: string,
  workspaceId?: string
) => {
  if (!environmentId) return undefined;

  const response = await apiClient.get<string, IAxiosResponse<IGetEnvironment>>(
    `${APIS_ROUTES.ENVIRONMENT_SERVICE}/${workspaceId}/environments/${environmentId}`,
    {
      params: {
        fieldsToQuery:
          'title,workspace_domain,custom_domain,enable_password_protect,enable_maintenance,password_hash,http_robots,type,point_your_domain,site_map_url,cache_domain',
      },
    }
  );

  return {
    ...response.response.Data,
    domain: response.response.Data.customDomain
      ? response.response.Data.customDomain
      : response.response.Data.cacheDomain
      ? response.response.Data.cacheDomain
      : response.response.Data.workspaceDomain,
  };
};

const useDetailsEnvironment = (environmentId?: string, workspaceId?: string) =>
  useQuery<IGetEnvironment | undefined, IAPIError>(
    [API_QUERY_KEY.ENVIRONMENT_DETAILS, environmentId],
    () => detailsEnvironment(environmentId, workspaceId),
    { cacheTime: 0 }
  );

export default useDetailsEnvironment;
