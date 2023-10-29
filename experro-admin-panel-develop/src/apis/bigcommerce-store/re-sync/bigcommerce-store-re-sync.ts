import { useMutation } from 'react-query';

import { IAPIError, IAxiosResponse } from '../../../types';
import { APIS_ROUTES, API_MUTATION_KEY } from '../../../utills/enums';
import apiClient from '../../api-client';

type ReSyncStoreParameter = {
  workspaceId: string;
  storeId?: string;
};

const reSyncBigcommerceStore = async (storeInfo: ReSyncStoreParameter) => {
  const response = await apiClient.post<
    ReSyncStoreParameter,
    IAxiosResponse<string>
  >(
    `${APIS_ROUTES.BIGCOMMERCE}/${storeInfo.workspaceId}/bigcommerce-stores/${storeInfo.storeId}/re-sync`,
    {}
  );

  return response.response.Data;
};

const useReSyncBigcommerceStore = () =>
  useMutation<string, IAPIError, ReSyncStoreParameter>(
    [API_MUTATION_KEY.RESYNC_BIGCOMMERCE_STORE],
    reSyncBigcommerceStore
  );

export default useReSyncBigcommerceStore;
