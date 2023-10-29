import { useMutation } from 'react-query';

import {
  API_MUTATION_KEY,
  APIS_ROUTES,
  ECOMMERCE_PROVIDERS,
} from '../../../../../../../utills';
import { IAPIError } from '../../../../../../../types';
import apiClient from '../../../../../../../apis/api-client';

const deleteStore = async (workspaceId: string, id: string) => {
  await apiClient.delete(
    `${APIS_ROUTES.ECOMMERCE_SERVICE}/${workspaceId}/ecommerce-stores/${id}`,
    {
      params: {
        ecommerceProvider: ECOMMERCE_PROVIDERS.SHOPIFY,
      },
    }
  );
};

const useDeleteStore = (workspaceId: string) =>
  useMutation<void, IAPIError, string>(
    [API_MUTATION_KEY.DELETE_SHOPIFY_STORE],
    (id) => deleteStore(workspaceId, id)
  );

export default useDeleteStore;
