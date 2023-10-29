import { useQuery } from 'react-query';

import {
  IShopifyStoreResponse,
  IAPIError,
  IAxiosResponse,
} from '../../../../types';
import { API_QUERY_KEY, APIS_ROUTES } from '../../../../utills';
import apiClient from '../../../api-client';

const getStoreById = async (workspaceId: string, storeId: string | null) => {
  if (!storeId) return {} as IShopifyStoreResponse;
  const result = await apiClient.get<
    null,
    IAxiosResponse<{ item: IShopifyStoreResponse }>
  >(`${APIS_ROUTES.SHOPIFY_ROUTE}/${workspaceId}/stores/${storeId}`);
  return result.response.Data.item;
};

const useGetStoreById = (workspaceId: string, storeId: string | null) =>
  useQuery<IShopifyStoreResponse, IAPIError>(
    [API_QUERY_KEY.GET_SHOPIFY_STORE_BY_ID],
    () => getStoreById(workspaceId, storeId),
    {
      cacheTime: 0,
    }
  );

export default useGetStoreById;
