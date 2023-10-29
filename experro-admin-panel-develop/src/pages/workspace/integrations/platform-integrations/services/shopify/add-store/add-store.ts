import { useMutation } from 'react-query';

import {
  IAPIError,
  IAddUpdateStore,
  IAxiosResponse,
} from '../../../../../../../types';
import apiClient from '../../../../../../../apis/api-client';
import {
  APIS_ROUTES,
  API_MUTATION_KEY,
  ECOMMERCE_PROVIDERS,
} from '../../../../../../../utills';
import shapeCollection from '../../../../../../../utills/convert-request-response';

const addStore = async (values: IAddUpdateStore, workspaceId: string) => {
  const bodyObj = {
    storeDetails: values,
    ecommerceProvider: ECOMMERCE_PROVIDERS.SHOPIFY,
  };
  const result = await apiClient.post<
    { storeDetails: IAddUpdateStore; ecommerceProvider: string },
    IAxiosResponse<{ item: string }>
  >(
    `${APIS_ROUTES.ECOMMERCE_SERVICE}/${workspaceId}/ecommerce-stores`,
    shapeCollection(bodyObj, false, 'camelToSnackCase')
  );

  return result.response.Data.item;
};

const useAddStore = (workspaceId: string) =>
  useMutation<string, IAPIError, IAddUpdateStore>(
    [API_MUTATION_KEY.ADD_UPDATE_SHOPIFY_STORE],
    (values) => addStore(values, workspaceId)
  );

export default useAddStore;
