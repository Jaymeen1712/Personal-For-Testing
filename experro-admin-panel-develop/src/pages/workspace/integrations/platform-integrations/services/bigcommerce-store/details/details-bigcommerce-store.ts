import { useQuery } from 'react-query';

import apiClient from '../../../../../../../apis/api-client';
import {
  IAPIError,
  IAxiosResponse,
  IBigcommerceStore,
} from '../../../../../../../types';
import { API_QUERY_KEY, APIS_ROUTES } from '../../../../../../../utills';

const detailsBigcommerceStore = async (
  storeId?: string | null,
  workspaceId?: string
) => {
  if (!storeId) return;

  const result = await apiClient.get<
    null,
    IAxiosResponse<{ item: IBigcommerceStore }>
  >(
    `${APIS_ROUTES.ECOMMERCE_SERVICE}/${workspaceId}/ecommerce-stores/${storeId}`,
    {
      params: {
        fieldsToQuery:
          'store_name,environment_ids,created_by,store_hash,id,status,modified_by,modified_at',
        ecommerceProvider: 'BIGCOMMERCE',
      },
    }
  );

  return result.response.Data.item;
};

const useDetailsBigcommerceStore = (
  storeId?: string | null,
  workspaceId?: string
) =>
  useQuery<IBigcommerceStore | undefined, IAPIError>(
    [API_QUERY_KEY.BIGCOMMERCE_STORE_DETAILS, workspaceId],
    () => detailsBigcommerceStore(storeId, workspaceId),
    { cacheTime: 0 }
  );

export default useDetailsBigcommerceStore;
