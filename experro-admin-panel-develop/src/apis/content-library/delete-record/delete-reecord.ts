import { useMutation } from 'react-query';

import apiClient from '../../api-client';
import { IAPIError } from '../../../types';
import { API_MUTATION_KEY, APIS_ROUTES } from '../../../utills';
import shapeCollection from '../../../utills/convert-request-response';

const deleteRecord = async (
  workspaceId: string,
  contentModalId: string,
  values: { contentModelDataIds: string[] }
) => {
  await apiClient.post(
    `${APIS_ROUTES.CONTENT_LIBRARY_SERVICE}/${workspaceId}/contents/${contentModalId}/content-model-data/ids`,
    shapeCollection(values, false, 'camelToSnackCase')
  );
};

const useDeleteRecord = (workspaceId: string, contentModalId: string) =>
  useMutation<void, IAPIError, { contentModelDataIds: string[] }>(
    [API_MUTATION_KEY.CONTENT_MODEL_RECORD_DELETE, contentModalId],
    (values) => deleteRecord(workspaceId, contentModalId, values)
  );

export default useDeleteRecord;
