import { useQuery } from 'react-query';

import apiClient from '../../../../../../../apis/api-client';
import {
  IAPIError,
  IAxiosResponse,
  IBigcommerceStore,
} from '../../../../../../../types';
import {API_QUERY_KEY, APIS_ROUTES, ECOMMERCE_PROVIDERS} from '../../../../../../../utills';

const listBigcommerceStore = async (workspaceId?: string) => {
  const result = await apiClient.get<
    null,
    IAxiosResponse<{ items: IBigcommerceStore[] }>
  >(`${APIS_ROUTES.ECOMMERCE_SERVICE}/${workspaceId}/ecommerce-stores`, {
    params: {
      fieldsToQuery: 'store_name,environment_ids,modified_by,id',
      ecommerceProvider: ECOMMERCE_PROVIDERS.BIGCOMMERCE,
    },
  });

  return result.response.Data.items;
};

const useListBigcommerceStore = (workspaceId?: string) =>
  useQuery<IBigcommerceStore[], IAPIError>(
    [API_QUERY_KEY.LIST_BIGCOMMERCE_STORE, workspaceId],
    () => listBigcommerceStore(workspaceId),
    {
      cacheTime: 0,
    }
  );

export default useListBigcommerceStore;
