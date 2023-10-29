import { useMutation } from 'react-query';

import { IAPIError, IAxiosResponse } from '../../../../types';
import apiClient from '../../../api-client';
import { APIS_ROUTES, API_MUTATION_KEY } from '../../../../utills';
import shapeCollection from '../../../../utills/convert-request-response';

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
    `${APIS_ROUTES.SHOPIFY_ROUTE}/${workspaceId}/stores/${storeId}/re-sync`,
    shapeCollection(
      {
        itemsToSync: [],
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
