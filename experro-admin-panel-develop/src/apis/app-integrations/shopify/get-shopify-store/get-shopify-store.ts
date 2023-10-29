import { useQuery } from 'react-query';

import {
  IShopifyStoreResponse,
  IAPIError,
  IAxiosResponse,
} from '../../../../types';
import { API_QUERY_KEY, APIS_ROUTES } from '../../../../utills';
import apiClient from '../../../api-client';

const shopifyStoreList = async (workspaceId: string) => {
  const result = await apiClient.get<
    null,
    IAxiosResponse<{ items: IShopifyStoreResponse[] }>
  >(`${APIS_ROUTES.SHOPIFY_ROUTE}/${workspaceId}/stores`);
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
