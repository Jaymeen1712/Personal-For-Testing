import { useQuery } from 'react-query';

import { API_QUERY_KEY, APIS_ROUTES } from '../../../../../../../utills';
import {
  IAPIError,
  IAxiosResponse,
  IReRankingStrategyCostPrice,
} from '../../../../../../../types';
import apiClient from '../../../../../../../apis/api-client';

const getCostPriceAvailability = async (
  workspaceId: string,
  environmentId: string | null
) => {
  const response = await apiClient.get<
    string,
    IAxiosResponse<{ items: IReRankingStrategyCostPrice }>
  >(`${APIS_ROUTES.SEARCH_SERVICE}/${workspaceId}/re-ranking/fields-flag`, {
    params: {
      environment_id: environmentId,
    },
  });
  return response.response.Data.items;
};

const useCostPriceAvailability = (
  workspaceId: string,
  environmentId: string | null
) =>
  useQuery<IReRankingStrategyCostPrice | undefined, IAPIError>(
    [
      API_QUERY_KEY.GET_RE_RANKING_COST_PRICE_STATUS,
      workspaceId,
      environmentId,
    ],
    () => getCostPriceAvailability(workspaceId, environmentId),
    {
      cacheTime: 0,
    }
  );

export default useCostPriceAvailability;
