import { useMutation } from 'react-query';

import { IAPIError, IAxiosResponse } from '../../../../types';
import apiClient from '../../../api-client';
import { APIS_ROUTES, API_MUTATION_KEY } from '../../../../utills';
import shapeCollection from '../../../../utills/convert-request-response';

interface IAddUpdateStore {
  id: string;
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

const updateStore = async (values: IAddUpdateStore, workspaceId: string) => {
  const { id } = values;
  const result = await apiClient.put<
    IAddUpdateStore,
    IAxiosResponse<{ item: string }>
  >(
    `${APIS_ROUTES.SHOPIFY_ROUTE}/${workspaceId}/stores/${id}`,
    shapeCollection(values, false, 'camelToSnackCase')
  );

  return result.response.Data.item;
};
const useUpdateStore = (workspaceId: string) =>
  useMutation<string, IAPIError, IAddUpdateStore>(
    [API_MUTATION_KEY.UPDATE_SHOPIFY_STORE],
    (values) => updateStore(values, workspaceId)
  );

export default useUpdateStore;
