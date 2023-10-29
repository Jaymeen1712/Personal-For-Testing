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

const addStore = async (values: IAddUpdateStore, workspaceId: string) => {
  const result = await apiClient.post<
    IAddUpdateStore,
    IAxiosResponse<{ item: string }>
  >(
    `${APIS_ROUTES.SHOPIFY_ROUTE}/${workspaceId}/stores`,
    shapeCollection(values, false, 'camelToSnackCase')
  );

  return result.response.Data.item;
};
const useAddStore = (workspaceId: string) =>
  useMutation<string, IAPIError, IAddUpdateStore>(
    [API_MUTATION_KEY.ADD_UPDATE_SHOPIFY_STORE],
    (values) => addStore(values, workspaceId)
  );

export default useAddStore;
