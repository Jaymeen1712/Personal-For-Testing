import { useMutation } from 'react-query';

import { API_MUTATION_KEY, APIS_ROUTES } from '../../../../utills';
import { IAPIError } from '../../../../types';
import apiClient from '../../../api-client';

const deleteComponentModel = async (
  workspaceId?: string,
  contentId?: string
) => {
  await apiClient.delete(
    `${APIS_ROUTES.CONTENT_SERVICE}/${workspaceId}/components/${contentId}`
  );
};

const useDeleteComponentModel = (workspaceId?: string) =>
  useMutation<void, IAPIError, string | undefined>(
    [API_MUTATION_KEY.DELETE_COMPONENT],
    (contentId) => deleteComponentModel(workspaceId, contentId)
  );

export default useDeleteComponentModel;
