import { useMutation } from 'react-query';

import { IAPIError, IAxiosResponse } from '../../../../../../../types';
import apiClient from '../../../../../../../apis/api-client';
import {
  APIS_ROUTES,
  API_MUTATION_KEY,
  ECOMMERCE_PROVIDERS,
} from '../../../../../../../utills';
import shapeCollection from '../../../../../../../utills/convert-request-response';

interface IUpdateStore {
  id?: string;
  storefrontAccessToken: string;
  adminAccessToken: string;
  apiKey: string;
  secretKey: string;
}

const updateStore = async (values: IUpdateStore, workspaceId: string) => {
  const { id } = values;
  delete values.id;
  const bodyObj = {
    storeDetails: values,
    ecommerceProvider: ECOMMERCE_PROVIDERS.SHOPIFY,
  };
  const result = await apiClient.put<
    { storeDetails: IUpdateStore; ecommerceProvider: string },
    IAxiosResponse<{ item: string }>
  >(
    `${APIS_ROUTES.ECOMMERCE_SERVICE}/${workspaceId}/ecommerce-stores/${id}`,
    shapeCollection(bodyObj, false, 'camelToSnackCase')
  );

  return result.response.Data.item;
};
const useUpdateStore = (workspaceId: string) =>
  useMutation<string, IAPIError, IUpdateStore>(
    [API_MUTATION_KEY.UPDATE_SHOPIFY_STORE],
    (values) => updateStore(values, workspaceId)
  );

export default useUpdateStore;
