import { useMutation } from 'react-query';

import {
  IAPIError,
  IAxiosResponse,
  ICreateBigcommerceStoreResponse,
  IBigcommerceStore,
} from '../../../types';
import { APIS_ROUTES, API_MUTATION_KEY } from '../../../utills/enums';
import shapeCollection from '../../../utills/convert-request-response';
import apiClient from '../../api-client';

const createBigcommerceStore = async (
  store: IBigcommerceStore,
  workspaceId: string
) => {
  const response = await apiClient.post<
    IBigcommerceStore,
    IAxiosResponse<ICreateBigcommerceStoreResponse>
  >(
    `${APIS_ROUTES.BIGCOMMERCE}/${workspaceId}/bigcommerce-stores`,
    shapeCollection(store, false, 'camelToSnackCase')
  );

  return response.response.Data;
};

const useCreateBigcommerceStore = (workspaceId: string) =>
  useMutation<ICreateBigcommerceStoreResponse, IAPIError, IBigcommerceStore>(
    [API_MUTATION_KEY.CREATE_BIGCOMMERCE_STORE],
    (store) => createBigcommerceStore(store, workspaceId)
  );

export default useCreateBigcommerceStore;
