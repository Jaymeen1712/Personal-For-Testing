import { useMutation } from 'react-query';

import { API_MUTATION_KEY, APIS_ROUTES } from '../../../../../../utills';
import { IAPIError } from '../../../../../../types';
import apiClient from '../../../../../../apis/api-client';

const deleteModel = async (workspaceId?: string, contentId?: string) => {
  await apiClient.delete(
    `${APIS_ROUTES.CONTENT_SERVICE}/${workspaceId}${APIS_ROUTES.CONTENTS}/${contentId}`
  );
};

const useDeleteModel = (workspaceId?: string) =>
  useMutation<void, IAPIError, string | undefined>(
    [API_MUTATION_KEY.DELETE_CONTENT],
    (contentId) => deleteModel(workspaceId, contentId)
  );

export default useDeleteModel;
