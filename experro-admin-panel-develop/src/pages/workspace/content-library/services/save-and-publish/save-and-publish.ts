import { useMutation } from 'react-query';

import { IAPIError, FormFieldValues, IAxiosResponse } from '../../../../../types';
import apiClient from '../../../../../apis/api-client';
import { APIS_ROUTES, API_MUTATION_KEY } from '../../../../../utills';
import shapeCollection from '../../../../../utills/convert-request-response';

const saveAndPublish = async (workspaceId: string, values: FormFieldValues) => {
  const result = await apiClient.post<
    FormFieldValues,
    IAxiosResponse<{
      item: {
        contentModalDataId: string;
        contentModalFieldDataId: string;
        versionId: string;
      };
    }>
  >(
    `${APIS_ROUTES.CONTENT_LIBRARY_SERVICE}/${workspaceId}/contents/${values.contentModalId}/content-model-data/${values.contentModelDataId}/save-as-new-version-publish`,
    shapeCollection(values, false, 'camelToSnackCase'),
    {
      params: {
        old_version_id: values.versionId,
      },
    }
  );

  return result.response.Data.item;
};

const useSaveAndPublish = (workspaceId: string) =>
  useMutation<
    {
      contentModalDataId: string;
      contentModalFieldDataId: string;
      versionId: string;
    },
    IAPIError,
    FormFieldValues
  >(
    [API_MUTATION_KEY.SAVE_AND_PUBLISH, workspaceId],
    (values: FormFieldValues) => saveAndPublish(workspaceId, values)
  );

export default useSaveAndPublish;
