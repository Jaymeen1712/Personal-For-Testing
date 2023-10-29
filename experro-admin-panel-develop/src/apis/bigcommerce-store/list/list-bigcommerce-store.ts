import { useQuery } from 'react-query';

import apiClient from '../../api-client';
import { IAPIError, IAxiosResponse, IBigcommerceStore } from '../../../types';
import { API_QUERY_KEY, APIS_ROUTES } from '../../../utills';

const listBigcommerceStore = async (workspaceId?: string) => {
  const result = await apiClient.get<
    null,
    IAxiosResponse<{ items: IBigcommerceStore[] }>
  >(`${APIS_ROUTES.BIGCOMMERCE}/${workspaceId}/bigcommerce-stores`);

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
