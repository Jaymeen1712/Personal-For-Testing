import { useQuery } from 'react-query';

import apiClient from '../../../api-client';
import {
  IAPIError,
  IAxiosResponse,
  IBigcommerceStoreStatistics,
} from '../../../../types';
import { API_QUERY_KEY, APIS_ROUTES } from '../../../../utills';

const storeStatistics = async (workspaceId?: string, storeId?: string) => {
  if (!storeId) return;

  const result = await apiClient.get<
    null,
    IAxiosResponse<IBigcommerceStoreStatistics>
  >(`${APIS_ROUTES.SHOPIFY_ROUTE}/${workspaceId}/stores/${storeId}/statistics`);

  return result.response.Data;
};

const useStoreStatistics = (workspaceId?: string, storeId?: string) =>
  useQuery<IBigcommerceStoreStatistics | undefined, IAPIError>(
    [API_QUERY_KEY.SHOPIFY_STORE_STATISTICS, workspaceId, storeId],
    () => storeStatistics(workspaceId, storeId),
    { cacheTime: 0 }
  );

export default useStoreStatistics;
