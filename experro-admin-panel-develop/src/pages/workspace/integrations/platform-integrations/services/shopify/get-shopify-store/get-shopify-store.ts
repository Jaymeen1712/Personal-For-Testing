import { useQuery } from 'react-query';

import {
  IShopifyStoreResponse,
  IAPIError,
  IAxiosResponse,
} from '../../../../../../../types';
import {
  API_QUERY_KEY,
  APIS_ROUTES,
  ECOMMERCE_PROVIDERS,
} from '../../../../../../../utills';
import apiClient from '../../../../../../../apis/api-client';

const shopifyStoreList = async (workspaceId: string) => {
  const result = await apiClient.get<
    null,
    IAxiosResponse<{ items: IShopifyStoreResponse[] }>
  >(`${APIS_ROUTES.ECOMMERCE_SERVICE}/${workspaceId}/ecommerce-stores`, {
    params: {
      ecommerceProvider: ECOMMERCE_PROVIDERS.SHOPIFY,
      fieldsToQuery: 'id,name,modified_by,environment_ids',
    },
  });
  return result.response.Data.items;
};

const useShopifyStoreList = (workspaceId: string) =>
  useQuery<IShopifyStoreResponse[], IAPIError>(
    [API_QUERY_KEY.GET_SHOPIFY_STORE_LIST],
    () => shopifyStoreList(workspaceId),
    {
      cacheTime: 0,
    }
  );

export default useShopifyStoreList;
