import { useMutation } from 'react-query';

import {
  DeleteStoreParameter,
  IAPIError,
  IAxiosResponse,
} from '../../../../../../../types';
import {
  APIS_ROUTES,
  API_MUTATION_KEY,
} from '../../../../../../../utills/enums';
import apiClient from '../../../../../../../apis/api-client';

const deleteBigcommerceStore = async (storeInfo: DeleteStoreParameter) => {
  await apiClient.delete<null, IAxiosResponse<{ item: string }>>(
    `${APIS_ROUTES.ECOMMERCE_SERVICE}/${storeInfo.workspaceId}/ecommerce-stores/${storeInfo.storeId}`,
    {
      params: {
        ecommerceProvider: 'BIGCOMMERCE',
      },
    }
  );
};

const useDeleteBigcommerceStore = () =>
  useMutation<void, IAPIError, DeleteStoreParameter, string>(
    [API_MUTATION_KEY.DELETE_BIGCOMMERCE_STORE],
    deleteBigcommerceStore
  );

export default useDeleteBigcommerceStore;
