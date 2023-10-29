import { useQuery } from 'react-query';

import { API_QUERY_KEY, APIS_ROUTES } from '../../../../../../../utills';
import { IAPIError, IAxiosResponse, IReRankingStrategy } from '../../../../../../../types';
import apiClient from '../../../../../../../apis/api-client';

const getUserReRankingStrategy = async (
  workspaceId: string,
  environmentId: string | null
) => {
  const response = await apiClient.get<string, IAxiosResponse<IReRankingStrategy>>(
    `${APIS_ROUTES.SEARCH_SERVICE}/${workspaceId}/re-ranking/algorithm`,
    {
      params: {
        environment_id: environmentId,
        fields: 'id,environment_id,strategy,properties',
      },
    }
  );
  const data = response.response.Data;
  return { strategy: data.strategy, properties: data.properties };
};

const useUserReRankingStrategy = (workspaceId: string, environmentId: string | null) =>
  useQuery<IReRankingStrategy | undefined, IAPIError>(
    [API_QUERY_KEY.GET_USER_RE_RANKING_STRATEGY, workspaceId, environmentId],
    () => getUserReRankingStrategy(workspaceId, environmentId),
    {
      cacheTime: 0,
    }
  );

export default useUserReRankingStrategy;
