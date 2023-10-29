import { useMutation } from 'react-query';

import { API_MUTATION_KEY, APIS_ROUTES } from '../../../../utills';
import { IAPIError } from '../../../../types';
import apiClient from '../../../api-client';

const deleteStore = async (workspaceId: string, id: string) => {
  await apiClient.delete(
    `${APIS_ROUTES.SHOPIFY_ROUTE}/${workspaceId}/stores/${id}`
  );
};

const useDeleteStore = (workspaceId: string) =>
  useMutation<void, IAPIError, string>(
    [API_MUTATION_KEY.DELETE_SHOPIFY_STORE],
    (id) => deleteStore(workspaceId, id)
  );

export default useDeleteStore;
