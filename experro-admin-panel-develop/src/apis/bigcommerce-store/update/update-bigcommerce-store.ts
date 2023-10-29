import { useMutation } from 'react-query';

import apiClient from '../../api-client';
import { IAPIError, IAxiosResponse, IBigcommerceStore } from '../../../types';
import { API_MUTATION_KEY, APIS_ROUTES } from '../../../utills/enums';
import shapeCollection from '../../../utills/convert-request-response';

type UpdateBigcommerceStoreParameter = {
  workspaceId: string;
  storeId?: string;
  store?: IBigcommerceStore;
};

const updateBigcommerceStore = async (
  storeInfo: UpdateBigcommerceStoreParameter
) => {
  if (!storeInfo.workspaceId) return;

  const result = await apiClient.patch<
    IBigcommerceStore,
    IAxiosResponse<{ item: string }>
  >(
    `${APIS_ROUTES.BIGCOMMERCE}/${storeInfo.workspaceId}/bigcommerce-stores/${storeInfo.storeId}`,
    shapeCollection(storeInfo, false, 'camelToSnackCase')
  );

  return result.response.Data.item;
};

const useUpdateBigcommerceStore = () =>
  useMutation<string | undefined, IAPIError, IBigcommerceStore>(
    [API_MUTATION_KEY.UPDATE_BIGCOMMERCE_STORE],
    updateBigcommerceStore
  );

export default useUpdateBigcommerceStore;
