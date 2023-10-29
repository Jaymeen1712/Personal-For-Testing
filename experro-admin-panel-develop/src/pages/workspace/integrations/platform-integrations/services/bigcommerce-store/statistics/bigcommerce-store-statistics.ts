import { useQuery } from 'react-query';

import apiClient from '../../../../../../../apis/api-client';
import {
  IAPIError,
  IAxiosResponse,
  IBigcommerceStoreStatistics,
} from '../../../../../../../types';
import { API_QUERY_KEY, APIS_ROUTES } from '../../../../../../../utills';

const detailsBigcommerceStoreStatistics = async (
  workspaceId?: string,
  storeId?: string
) => {
  if (!storeId) return;

  const result = await apiClient.get<
    null,
    IAxiosResponse<IBigcommerceStoreStatistics>
  >(
    `${APIS_ROUTES.ECOMMERCE_SERVICE}/${workspaceId}/ecommerce-stores/${storeId}/statistics`,
    {
      params: {
        ecommerceProvider: 'BIGCOMMERCE',
      },
    }
  );

  return result.response.Data;
};

const useDetailsBigcommerceStoreStatistics = (
  workspaceId?: string,
  storeId?: string
) =>
  useQuery<IBigcommerceStoreStatistics | undefined, IAPIError>(
    [API_QUERY_KEY.BIGCOMMERCE_STORE_STATISTICS, workspaceId, storeId],
    () => detailsBigcommerceStoreStatistics(workspaceId, storeId),
    { cacheTime: 0 }
  );

export default useDetailsBigcommerceStoreStatistics;
