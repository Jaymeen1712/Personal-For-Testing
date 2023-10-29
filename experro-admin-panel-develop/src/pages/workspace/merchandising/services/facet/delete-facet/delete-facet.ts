import { useMutation } from 'react-query';

import apiClient from '../../../../../../apis/api-client';
import { API_MUTATION_KEY, APIS_ROUTES } from '../../../../../../utills';
import { IAPIError } from '../../../../../../types';

const deleteFacet = async (workspaceId: string, facetId: string) => {
  await apiClient.delete(
    `${APIS_ROUTES.ECOMMERCE_SERVICE}/${workspaceId}/facets/category/${facetId}`
  );
};

const useDeleteFacet = (workspaceId: string) =>
  useMutation<void, IAPIError, string>(
    [API_MUTATION_KEY.DELETE_FACET],
    (facetId) => deleteFacet(workspaceId, facetId)
  );

export default useDeleteFacet;
