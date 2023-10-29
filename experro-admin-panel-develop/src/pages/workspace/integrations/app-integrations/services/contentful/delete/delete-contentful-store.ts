import { useMutation } from 'react-query';
import apiClient from '../../../../../../../apis/api-client';
import { IAPIError, IAxiosResponse } from '../../../../../../../types';
import { APIS_ROUTES, API_MUTATION_KEY } from '../../../../../../../utills';

const deleteContentfulStore = async (
  workspaceId: string,
  contentfulStoreId: string | undefined
) => {
  await apiClient.delete<null, IAxiosResponse<{ item: string }>>(
    `${APIS_ROUTES.CONTENTFUL_ROUTE}/${workspaceId}/contentful/${contentfulStoreId}`
  );
};

const useDeleteContentfulStore = (workspaceId: string) => {
  return useMutation<void, IAPIError, string | undefined>(
    [API_MUTATION_KEY.DELETE_CONTENTFUL_STORE],
    (contentfulStoreId) => deleteContentfulStore(workspaceId, contentfulStoreId)
  );
};
export default useDeleteContentfulStore;
