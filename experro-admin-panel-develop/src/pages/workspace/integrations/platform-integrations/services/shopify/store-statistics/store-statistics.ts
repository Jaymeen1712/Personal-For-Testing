import { useQuery } from 'react-query';

import apiClient from '../../../../../../../apis/api-client';
import {
  IAPIError,
  IAxiosResponse,
  IBigcommerceStoreStatistics,
} from '../../../../../../../types';
import {
  API_QUERY_KEY,
  APIS_ROUTES,
  ECOMMERCE_PROVIDERS,
} from '../../../../../../../utills';

const storeStatistics = async (workspaceId?: string, storeId?: string) => {
  if (!storeId) return;

  const result = await apiClient.get<
    null,
    IAxiosResponse<IBigcommerceStoreStatistics>
  >(
    `${APIS_ROUTES.ECOMMERCE_SERVICE}/${workspaceId}/ecommerce-stores/${storeId}/statistics`,
    {
      params: {
        ecommerceProvider: ECOMMERCE_PROVIDERS.SHOPIFY,
      },
    }
  );

  return result.response.Data;
};

const useStoreStatistics = (workspaceId?: string, storeId?: string) =>
  useQuery<IBigcommerceStoreStatistics | undefined, IAPIError>(
    [API_QUERY_KEY.SHOPIFY_STORE_STATISTICS, workspaceId, storeId],
    () => storeStatistics(workspaceId, storeId),
    { cacheTime: 0 }
  );

export default useStoreStatistics;
