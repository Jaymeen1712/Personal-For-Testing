import { useMutation } from 'react-query';

import { IAPIError, IAxiosResponse } from '../../../types';
import { APIS_ROUTES, API_MUTATION_KEY } from '../../../utills/enums';
import apiClient from '../../api-client';

type DeleteStoreParameter = {
  workspaceId: string;
  storeId?: string;
};

const deleteBigcommerceStore = async (storeInfo: DeleteStoreParameter) => {
  await apiClient.delete<null, IAxiosResponse<{ item: string }>>(
    `${APIS_ROUTES.BIGCOMMERCE}/${storeInfo.workspaceId}/bigcommerce-stores/${storeInfo.storeId}`
  );
};

const useDeleteBigcommerceStore = () =>
  useMutation<void, IAPIError, DeleteStoreParameter, string>(
    [API_MUTATION_KEY.DELETE_BIGCOMMERCE_STORE],
    deleteBigcommerceStore
  );

export default useDeleteBigcommerceStore;
