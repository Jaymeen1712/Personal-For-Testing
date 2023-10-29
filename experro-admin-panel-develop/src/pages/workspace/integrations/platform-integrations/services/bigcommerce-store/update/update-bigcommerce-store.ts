import { useMutation } from 'react-query';

import apiClient from '../../../../../../../apis/api-client';
import {
  IAPIError,
  IAxiosResponse,
  IBigcommerceStore,
} from '../../../../../../../types';
import {
  API_MUTATION_KEY,
  APIS_ROUTES,
} from '../../../../../../../utills/enums';
import shapeCollection from '../../../../../../../utills/convert-request-response';

type UpdateBigcommerceStoreParameter = {
  workspaceId: string;
  storeId?: string;
  store?: IBigcommerceStore;
};

const updateBigcommerceStore = async (
  storeInfo: UpdateBigcommerceStoreParameter
) => {
  // @ts-ignore
  if (!storeInfo.workspaceId) return;
  const result = await apiClient.put<
    IBigcommerceStore,
    IAxiosResponse<{ item: string }>
  >(
    // @ts-ignore
    `${APIS_ROUTES.ECOMMERCE_SERVICE}/${storeInfo.workspaceId}/ecommerce-stores/${storeInfo.storeId}`,
    // @ts-ignore
    shapeCollection(storeInfo.store, false, 'camelToSnackCase')
  );

  return result.response.Data.item;
};

const useUpdateBigcommerceStore = () =>
  useMutation<string | undefined, IAPIError, IBigcommerceStore>(
    [API_MUTATION_KEY.UPDATE_BIGCOMMERCE_STORE],
    updateBigcommerceStore
  );

export default useUpdateBigcommerceStore;
