import { useQuery } from 'react-query';

import apiClient from '../../../../../../apis/api-client';
import { IAxiosResponse, IListAlgorithm } from '../../../../../../types';
import { API_QUERY_KEY, APIS_ROUTES } from '../../../../../../utills';

const listAlgorithm = async (
  workspaceId?: string,
  environmentId?: string | null
) => {
  const response = await apiClient.get<
    string,
    IAxiosResponse<{ items: IListAlgorithm[] }>
  >(`${APIS_ROUTES.PERSONALIZATION_SERVICE}/${workspaceId}/algorithms`, {
    params: {
      fieldsToQuery:
        'id,name,internal_name,algorithm_api_url,is_system_generated,created_by,modified_by,created_at,modified_at,environments_id',
      environments_id: environmentId,
    },
  });
  return response.response.Data.items;
};

const useListAlgorithm = (
  workspaceId?: string,
  environmentId?: string | null
) =>
  useQuery(
    [API_QUERY_KEY.ALGORITHM_LIST],
    () => listAlgorithm(workspaceId, environmentId),
    {
      cacheTime: 0,
    }
  );

export default useListAlgorithm;
