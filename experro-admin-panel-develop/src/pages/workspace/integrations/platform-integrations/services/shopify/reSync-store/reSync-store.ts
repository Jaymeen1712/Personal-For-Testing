import { useMutation } from 'react-query';

import { IAPIError, IAxiosResponse } from '../../../../../../../types';
import apiClient from '../../../../../../../apis/api-client';
import {
  APIS_ROUTES,
  API_MUTATION_KEY,
  ECOMMERCE_PROVIDERS,
} from '../../../../../../../utills';
import shapeCollection from '../../../../../../../utills/convert-request-response';

interface IAddUpdateStore {
  environmentIds: string[];
  name: string;
  storeName: string;
  storefrontAccessToken: string;
  storefrontApiKey: string;
  storefrontSecretKey: string;
  adminAccessToken: string;
  adminApiKey: string;
  adminSecretKey: string;
  storeDomain: string;
}

const reSyncStore = async (workspaceId: string, storeId: string) => {
  const result = await apiClient.post<
    IAddUpdateStore,
    IAxiosResponse<{ item: string }>
  >(
    `${APIS_ROUTES.ECOMMERCE_SERVICE}/${workspaceId}/ecommerce-stores/${storeId}/re-sync`,
    shapeCollection(
      {
        store_details: {},
        ecommerce_provider: ECOMMERCE_PROVIDERS.SHOPIFY,
      },
      false,
      'camelToSnackCase'
    )
  );

  return result.response.Data.item;
};
const useReSyncStore = (workspaceId: string) =>
  useMutation<string, IAPIError, string>(
    [API_MUTATION_KEY.SHOPIFY_RESYNC_STORE],
    (storeId) => reSyncStore(workspaceId, storeId)
  );

export default useReSyncStore;
