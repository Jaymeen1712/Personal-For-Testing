import { useQuery } from 'react-query';

import apiClient from '../../../../../../../apis/api-client';
import {
  IAPIError,
  IAxiosResponse,
  IBigcommerceStoreSyncLog,
} from '../../../../../../../types';
import { API_QUERY_KEY, APIS_ROUTES } from '../../../../../../../utills';

const limit = 250;

const listBigcommerceStoreSyncLog = async (
  workspaceId?: string,
  storeId?: string
) => {
  if (!workspaceId || !storeId) return [];

  const result = await apiClient.get<
    null,
    IAxiosResponse<{ items: IBigcommerceStoreSyncLog[] }>
  >(
    `${APIS_ROUTES.BIGCOMMERCE}/${workspaceId}/bigcommerce-stores/${storeId}/sync-logs`,
    {
      params: { fieldsToQuery: 'message,timestamp,type', limit: limit },
    }
  );

  return result.response.Data.items;
};

const useListBigcommerceStoreSyncLog = (
  workspaceId?: string,
  storeId?: string
) =>
  useQuery<IBigcommerceStoreSyncLog[], IAPIError>(
    [API_QUERY_KEY.BIGCOMMERCE_STORE_SYNC_LOG, workspaceId],
    () => listBigcommerceStoreSyncLog(workspaceId, storeId),
    {
      cacheTime: 0,
    }
  );

export default useListBigcommerceStoreSyncLog;
