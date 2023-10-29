import { useMutation } from 'react-query';

import { IAPIError, FormFieldValues, IAxiosResponse } from '../../../../../types';
import apiClient from '../../../../../apis/api-client';
import { APIS_ROUTES, API_MUTATION_KEY } from '../../../../../utills';
import shapeCollection from '../../../../../utills/convert-request-response';

const saveAsNewVersion = async (
  workspaceId: string,
  values: FormFieldValues
) => {
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
    `${APIS_ROUTES.CONTENT_LIBRARY_SERVICE}/${workspaceId}/contents/${values.contentModalId}/content-model-data/${values.contentModelDataId}/save-as-new-version`,
    shapeCollection(values, false, 'camelToSnackCase'),
    {
      params: {
        old_version_id: values.versionId,
      },
    }
  );

  return result.response.Data.item;
};

const useSaveAsNewVersion = (workspaceId: string) =>
  useMutation<
    {
      contentModalDataId: string;
      contentModalFieldDataId: string;
      versionId: string;
    },
    IAPIError,
    FormFieldValues
  >(
    [API_MUTATION_KEY.SAVE_AS_NEW_VERSION, workspaceId],
    (values: FormFieldValues) => saveAsNewVersion(workspaceId, values)
  );

export default useSaveAsNewVersion;
