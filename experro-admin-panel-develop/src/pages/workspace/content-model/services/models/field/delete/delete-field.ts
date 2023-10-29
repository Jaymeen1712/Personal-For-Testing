import { useMutation } from 'react-query';

import apiClient from '../../../../../../../apis/api-client';
import { IAPIError } from '../../../../../../../types';
import { API_MUTATION_KEY, APIS_ROUTES } from '../../../../../../../utills';

const deleteField = async (
  workspaceId?: string,
  contentModalId?: string,
  fieldId?: string
) => {
  await apiClient.delete(
    `${APIS_ROUTES.CONTENT_SERVICE}/${workspaceId}/contents/${contentModalId}/content-fields/${fieldId}`
  );
};

const useDeleteField = (workspaceId?: string, contentModalId?: string) =>
  useMutation<void, IAPIError, string>(
    [API_MUTATION_KEY.DELETE_TOKEN],
    (fieldId) => deleteField(workspaceId, contentModalId, fieldId)
  );

export default useDeleteField;
