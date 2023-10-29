import { useMutation } from 'react-query';

import apiClient from '../../../../api-client';
import { IAPIError } from '../../../../../types';
import { API_MUTATION_KEY, APIS_ROUTES } from '../../../../../utills';

const deleteComponentsField = async (
  workspaceId?: string,
  contentModalId?: string,
  fieldId?: string
) => {
  await apiClient.delete(
    `${APIS_ROUTES.CONTENT_SERVICE}/${workspaceId}/components/${contentModalId}/component-fields/${fieldId}`
  );
};

const useDeleteComponentField = (
  workspaceId?: string,
  contentModalId?: string
) =>
  useMutation<void, IAPIError, string>(
    [API_MUTATION_KEY.DELETE_TOKEN],
    (fieldId) => deleteComponentsField(workspaceId, contentModalId, fieldId)
  );

export default useDeleteComponentField;
