import { useMutation } from 'react-query';

import apiClient from '../../api-client';
import { IAPIError } from '../../../types';
import { API_MUTATION_KEY, APIS_ROUTES } from '../../../utills';

const deleteCmsToken = async (tokenId?: string, workspaceId?: string) => {
  await apiClient.delete(
    `${APIS_ROUTES.TOKENS}/${workspaceId}/cms-tokens/${tokenId}`
  );
};

const useDeleteCmsToken = (workspaceId?: string) =>
  useMutation<void, IAPIError, string>(
    [API_MUTATION_KEY.DELETE_TOKEN],
    (tokenId) => deleteCmsToken(tokenId, workspaceId)
  );

export default useDeleteCmsToken;
