import { useQuery } from 'react-query';

import apiClient from '../../api-client';
import { IAPIError, IAxiosResponse, IBigcommerceStore } from '../../../types';
import { API_QUERY_KEY, APIS_ROUTES } from '../../../utills';

const detailsBigcommerceStore = async (
  storeId?: string | null,
  workspaceId?: string
) => {
  if (!storeId) return;

  const result = await apiClient.get<
    null,
    IAxiosResponse<{ item: IBigcommerceStore }>
  >(`${APIS_ROUTES.BIGCOMMERCE}/${workspaceId}/bigcommerce-stores/${storeId}`);

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
