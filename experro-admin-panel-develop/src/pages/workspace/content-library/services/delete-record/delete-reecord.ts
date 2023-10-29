import { useMutation } from 'react-query';

import apiClient from '../../../../../apis/api-client';
import { IAPIError } from '../../../../../types';
import { API_MUTATION_KEY, APIS_ROUTES } from '../../../../../utills';
import shapeCollection from '../../../../../utills/convert-request-response';

const deleteRecord = async (
  workspaceId: string,
  contentModalId: string,
  values: { contentModelDataIds: string[]; environmentId: string }
) => {
  await apiClient.post(
    `${APIS_ROUTES.CONTENT_LIBRARY_SERVICE}/${workspaceId}/contents/${contentModalId}/content-model-data/ids`,
    shapeCollection(
      { content_model_data_ids: values.contentModelDataIds },
      false,
      'camelToSnackCase'
    ),
    {
      params: {
        environment_id: values.environmentId,
      },
    }
  );
};

const useDeleteRecord = (workspaceId: string, contentModalId: string) =>
  useMutation<
    void,
    IAPIError,
    { contentModelDataIds: string[]; environmentId: string }
  >([API_MUTATION_KEY.CONTENT_MODEL_RECORD_DELETE, contentModalId], (values) =>
    deleteRecord(workspaceId, contentModalId, values)
  );

export default useDeleteRecord;
